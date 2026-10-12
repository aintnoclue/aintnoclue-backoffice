import { describe, expect, it } from 'vitest';
import {
	formatCompact,
	formatDate,
	formatDay,
	formatDuration,
	formatNumber,
	formatPercent,
	formatPrice,
	formatTokens,
	formatUsd,
	formatUsdAxis
} from './format';

const nbsp = ' ';
const nnbsp = ' ';

describe('formatUsd', () => {
	it('shows 6 decimals below one cent', () => {
		expect(formatUsd(0.000234)).toBe(`0,000234${nbsp}$`);
		expect(formatUsd(0.0099999)).toBe(`0,010000${nbsp}$`);
	});

	it('shows 2 decimals from one cent', () => {
		expect(formatUsd(0.01)).toBe(`0,01${nbsp}$`);
		expect(formatUsd(1234.5)).toBe(`1${nnbsp}234,50${nbsp}$`);
	});

	it('shows zero with 2 decimals', () => {
		expect(formatUsd(0)).toBe(`0,00${nbsp}$`);
	});

	it('shows a dash for a missing cost', () => {
		expect(formatUsd(null)).toBe('—');
		expect(formatUsd(undefined)).toBe('—');
	});
});

describe('formatPrice', () => {
	it('keeps up to 4 decimals with at least 2', () => {
		expect(formatPrice(0.075)).toBe(`0,075${nbsp}$`);
		expect(formatPrice(0.6)).toBe(`0,60${nbsp}$`);
		expect(formatPrice(0.00375)).toBe(`0,0038${nbsp}$`);
	});

	it('shows a dash for a missing price', () => {
		expect(formatPrice(null)).toBe('—');
	});
});

describe('formatTokens', () => {
	it('groups thousands', () => {
		expect(formatTokens(1234567)).toBe(`1${nnbsp}234${nnbsp}567`);
		expect(formatTokens(0)).toBe('0');
	});

	it('shows a dash for a missing value', () => {
		expect(formatTokens(null)).toBe('—');
	});
});

describe('formatNumber', () => {
	it('keeps one decimal', () => {
		expect(formatNumber(2.5)).toBe('2,5');
		expect(formatNumber(2.46)).toBe('2,5');
		expect(formatNumber(3)).toBe('3');
	});

	it('shows a dash for a missing value', () => {
		expect(formatNumber(undefined)).toBe('—');
	});
});

describe('formatPercent', () => {
	it('signs non-zero ratios', () => {
		expect(formatPercent(15.6667)).toBe(`+1${nnbsp}566,7${nbsp}%`);
		expect(formatPercent(-0.5)).toBe(`-50${nbsp}%`);
	});

	it('shows zero without a sign', () => {
		expect(formatPercent(0)).toBe(`0${nbsp}%`);
		expect(formatPercent(-0.0004)).toBe(`0${nbsp}%`);
	});

	it('shows a dash for a missing ratio', () => {
		expect(formatPercent(null)).toBe('—');
	});
});

describe('formatDuration', () => {
	it('shows milliseconds below one second', () => {
		expect(formatDuration(850)).toBe(`850${nnbsp}ms`);
	});

	it('shows seconds with one decimal from one second', () => {
		expect(formatDuration(1000)).toBe(`1${nnbsp}s`);
		expect(formatDuration(12_345)).toBe(`12,3${nnbsp}s`);
	});

	it('shows a dash for a missing duration', () => {
		expect(formatDuration(undefined)).toBe('—');
	});
});

describe('formatDate', () => {
	it('formats an ISO string', () => {
		expect(formatDate('2026-10-12T15:30:00.000Z')).toMatch(/^12\/10\/2026 \d{2}:30$/);
	});

	it('shows a dash for a missing or invalid date', () => {
		expect(formatDate(null)).toBe('—');
		expect(formatDate('not a date')).toBe('—');
	});
});

describe('formatUsdAxis', () => {
	it('keeps 3 significant digits', () => {
		expect(formatUsdAxis(0.0025)).toBe(`0,0025${nbsp}$`);
		expect(formatUsdAxis(12.5)).toBe(`12,5${nbsp}$`);
		expect(formatUsdAxis(0)).toBe(`0${nbsp}$`);
	});
});

describe('formatCompact', () => {
	it('shortens large numbers', () => {
		expect(formatCompact(1_500_000)).toBe(`1,5${nbsp}M`);
		expect(formatCompact(250)).toBe('250');
	});
});

describe('formatDay', () => {
	it('formats a UTC day without shifting it', () => {
		expect(formatDay('2026-10-01')).toBe('01/10');
		expect(formatDay('2026-10-01', 'long')).toBe('1 oct. 2026');
	});

	it('shows a dash for an invalid day', () => {
		expect(formatDay('nope')).toBe('—');
	});
});
