import type { ReadonlyURL } from '$app/state';
import type { ResolvedPathname } from '$app/types';

export type Period = '7d' | '30d' | '90d' | 'all';

export interface PeriodOption {
	value: Period;
	label: string;
	days: number | null;
}

export const periodOptions: PeriodOption[] = [
	{ value: '7d', label: '7 derniers jours', days: 7 },
	{ value: '30d', label: '30 derniers jours', days: 30 },
	{ value: '90d', label: '90 derniers jours', days: 90 },
	{ value: 'all', label: 'Depuis le début', days: null }
];

export const DEFAULT_PERIOD: Period = '30d';

export const ALL_PERIOD_CHART_DAYS = 90;

export type ParamUpdate = Record<string, string | number | null | undefined>;

const DAY_MS = 24 * 60 * 60 * 1000;

export function parseId(raw: string | null): number | undefined {
	if (raw === null || !/^\d+$/.test(raw)) return undefined;
	const value = Number(raw);
	return value > 0 && Number.isSafeInteger(value) ? value : undefined;
}

function readPositiveInt(url: ReadonlyURL, key: string): number | undefined {
	return parseId(url.searchParams.get(key));
}

export function readSimulate(url: ReadonlyURL): number | undefined {
	return readPositiveInt(url, 'simulate');
}

export function readPage(url: ReadonlyURL): number {
	return readPositiveInt(url, 'page') ?? 1;
}

export function readPeriod(url: ReadonlyURL, now = new Date()): { period: Period; from?: string } {
	const raw = url.searchParams.get('period');
	const option =
		periodOptions.find((candidate) => candidate.value === raw) ??
		periodOptions.find((candidate) => candidate.value === DEFAULT_PERIOD)!;

	if (option.days === null) return { period: option.value };

	const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
	return {
		period: option.value,
		from: new Date(today - (option.days - 1) * DAY_MS).toISOString()
	};
}

export function readChartDays(url: ReadonlyURL): number {
	const { period } = readPeriod(url);
	return periodOptions.find((option) => option.value === period)?.days ?? ALL_PERIOD_CHART_DAYS;
}

export function withParams(url: ReadonlyURL, params: ParamUpdate): ResolvedPathname {
	const search = new URLSearchParams(url.search);
	for (const [key, value] of Object.entries(params)) {
		if (value === null || value === undefined || value === '') {
			search.delete(key);
		} else {
			search.set(key, String(value));
		}
	}
	const query = search.toString();
	return `${url.pathname}${query ? `?${query}` : ''}${url.hash}` as ResolvedPathname;
}
