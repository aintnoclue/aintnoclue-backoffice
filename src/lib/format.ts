const EMPTY = '—';

const usdSmall = new Intl.NumberFormat('fr-FR', {
	style: 'currency',
	currency: 'USD',
	currencyDisplay: 'narrowSymbol',
	minimumFractionDigits: 6,
	maximumFractionDigits: 6
});

const usd = new Intl.NumberFormat('fr-FR', {
	style: 'currency',
	currency: 'USD',
	currencyDisplay: 'narrowSymbol'
});

const price = new Intl.NumberFormat('fr-FR', {
	style: 'currency',
	currency: 'USD',
	currencyDisplay: 'narrowSymbol',
	minimumFractionDigits: 2,
	maximumFractionDigits: 4
});

const integer = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

const decimal = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });

const usdAxis = new Intl.NumberFormat('fr-FR', {
	style: 'currency',
	currency: 'USD',
	currencyDisplay: 'narrowSymbol',
	maximumSignificantDigits: 3
});

const compact = new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 1 });

const dayShort = new Intl.DateTimeFormat('fr-FR', {
	day: '2-digit',
	month: '2-digit',
	timeZone: 'UTC'
});

const dayLong = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeZone: 'UTC' });

const dateTime = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' });

export function formatUsd(value: number | null | undefined): string {
	if (value === null || value === undefined) return EMPTY;
	if (value !== 0 && Math.abs(value) < 0.01) return usdSmall.format(value);
	return usd.format(value);
}

export function formatPrice(value: number | null | undefined): string {
	if (value === null || value === undefined) return EMPTY;
	return price.format(value);
}

export function formatTokens(value: number | null | undefined): string {
	if (value === null || value === undefined) return EMPTY;
	return integer.format(value);
}

export function formatNumber(value: number | null | undefined): string {
	if (value === null || value === undefined) return EMPTY;
	return decimal.format(value);
}

export function formatDate(value: string | Date | null | undefined): string {
	if (value === null || value === undefined) return EMPTY;
	const date = typeof value === 'string' ? new Date(value) : value;
	if (Number.isNaN(date.getTime())) return EMPTY;
	return dateTime.format(date);
}

export function formatUsdAxis(value: number): string {
	return usdAxis.format(value);
}

export function formatCompact(value: number): string {
	return compact.format(value);
}

export function formatDay(day: string, style: 'short' | 'long' = 'short'): string {
	const date = new Date(`${day}T00:00:00.000Z`);
	if (Number.isNaN(date.getTime())) return EMPTY;
	return (style === 'short' ? dayShort : dayLong).format(date);
}
