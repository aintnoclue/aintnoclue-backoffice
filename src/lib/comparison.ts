import type { ModelComparison } from './types';

export function actualCost(comparison: ModelComparison[]): number | null {
	const actual = comparison.filter((model) => model.isActual);
	return actual.length === 1 ? actual[0].costUsd : null;
}

export function costDelta(costUsd: number, reference: number | null): number | null {
	if (reference === null || reference === 0) return null;
	return (costUsd - reference) / reference;
}
