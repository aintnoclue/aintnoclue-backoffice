import { describe, expect, it, vi } from 'vitest';
import { ApiError, apiGet, apiSend, buildUrl } from './api';

vi.mock('$app/env/public', () => ({ PUBLIC_API_URL: 'http://api.test/' }));

function jsonResponse(status: number, body: unknown): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
}

describe('buildUrl', () => {
	it('drops empty params', () => {
		expect(buildUrl('/admin/stats/overview', { from: '2026-10-01', to: undefined, page: 2 })).toBe(
			'http://api.test/admin/stats/overview?from=2026-10-01&page=2'
		);
	});
});

describe('apiGet', () => {
	it('returns the parsed body', async () => {
		const fetch = vi.fn().mockResolvedValue(jsonResponse(200, [{ id: 1 }]));

		await expect(apiGet(fetch, '/admin/models')).resolves.toEqual([{ id: 1 }]);
		expect(fetch).toHaveBeenCalledWith('http://api.test/admin/models', { method: 'GET' });
	});

	it('throws a french ApiError on 404', async () => {
		const fetch = vi.fn().mockResolvedValue(jsonResponse(404, { message: 'AI model not found' }));

		await expect(apiGet(fetch, '/admin/models/9')).rejects.toEqual(
			new ApiError(404, 'Introuvable : AI model not found')
		);
	});

	it('throws when the API cannot be reached', async () => {
		const fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

		await expect(apiGet(fetch, '/admin/models')).rejects.toMatchObject({ status: 0 });
	});
});

describe('apiSend', () => {
	it('sends a json body', async () => {
		const fetch = vi.fn().mockResolvedValue(jsonResponse(201, { id: 2 }));

		await expect(apiSend(fetch, 'POST', '/admin/models', { name: 'GPT-4o' })).resolves.toEqual({
			id: 2
		});
		expect(fetch).toHaveBeenCalledWith('http://api.test/admin/models', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: '{"name":"GPT-4o"}'
		});
	});

	it('throws an ApiError on 409', async () => {
		const fetch = vi
			.fn()
			.mockResolvedValue(
				jsonResponse(409, { message: 'An AI model with this apiName already exists' })
			);

		const error = await apiSend(fetch, 'POST', '/admin/models', {}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({
			status: 409,
			message: 'Conflit : An AI model with this apiName already exists'
		});
	});

	it('resolves undefined on 204', async () => {
		const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));

		await expect(apiSend(fetch, 'DELETE', '/admin/models/3')).resolves.toBeUndefined();
	});

	it('falls back to the status label without a server message', async () => {
		const fetch = vi.fn().mockResolvedValue(new Response('oops', { status: 500 }));

		await expect(apiSend(fetch, 'DELETE', '/admin/models/3')).rejects.toMatchObject({
			status: 500,
			message: 'Erreur 500'
		});
	});
});
