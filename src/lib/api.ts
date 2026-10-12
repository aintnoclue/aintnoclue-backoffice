import { PUBLIC_API_URL } from '$app/env/public';

type Fetch = typeof fetch;

export type QueryParams = Record<string, string | number | null | undefined>;

export type SendMethod = 'POST' | 'PATCH' | 'DELETE';

const statusLabels: Record<number, string> = {
	0: "Impossible de joindre l'API",
	400: 'Requête invalide',
	404: 'Introuvable',
	409: 'Conflit'
};

export class ApiError extends Error {
	constructor(
		readonly status: number,
		message: string
	) {
		super(message);
		this.name = 'ApiError';
	}
}

export function buildUrl(path: string, params: QueryParams = {}): string {
	const url = new URL(`${PUBLIC_API_URL.replace(/\/+$/, '')}${path}`);
	for (const [key, value] of Object.entries(params)) {
		if (value !== null && value !== undefined && value !== '') {
			url.searchParams.set(key, String(value));
		}
	}
	return url.toString();
}

export function apiGet<T>(fetch: Fetch, path: string, params?: QueryParams): Promise<T> {
	return request<T>(fetch, buildUrl(path, params), { method: 'GET' });
}

export function apiSend<T>(
	fetch: Fetch,
	method: SendMethod,
	path: string,
	body?: unknown
): Promise<T> {
	return request<T>(fetch, buildUrl(path), {
		method,
		headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
		body: body === undefined ? undefined : JSON.stringify(body)
	});
}

async function request<T>(fetch: Fetch, url: string, init: RequestInit): Promise<T> {
	let response: Response;
	try {
		response = await fetch(url, init);
	} catch {
		throw new ApiError(0, statusLabels[0]);
	}

	if (!response.ok) {
		throw new ApiError(response.status, await errorMessage(response));
	}

	if (response.status === 204) {
		return undefined as T;
	}
	return (await response.json()) as T;
}

async function errorMessage(response: Response): Promise<string> {
	const label = statusLabels[response.status] ?? `Erreur ${response.status}`;
	const detail = await readServerMessage(response);
	return detail ? `${label} : ${detail}` : label;
}

async function readServerMessage(response: Response): Promise<string | null> {
	try {
		const body: unknown = await response.json();
		if (body && typeof body === 'object' && 'message' in body) {
			const { message } = body;
			if (typeof message === 'string') return message;
			if (Array.isArray(message)) return message.join(', ');
		}
	} catch {
		return null;
	}
	return null;
}
