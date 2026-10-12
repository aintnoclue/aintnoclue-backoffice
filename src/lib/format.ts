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

export function formatDate(value: string | Date | null | undefined): string {
	if (value === null || value === undefined) return EMPTY;
	const date = typeof value === 'string' ? new Date(value) : value;
	if (Number.isNaN(date.getTime())) return EMPTY;
	return dateTime.format(date);
}
