import { describe, expect, it } from 'vitest';
import { actualCost, costDelta } from './comparison';
import type { ModelComparison } from './types';

const model = (modelId: number, costUsd: number, isActual = false): ModelComparison => ({
	modelId,
	name: `Model ${modelId}`,
	apiName: `model-${modelId}`,
	costUsd,
	isActual
});

describe('actualCost', () => {
	it('uses the cost of the single actual model', () => {
		expect(actualCost([model(1, 0.0002, true), model(2, 0.0032)])).toBe(0.0002);
	});

	it('has no reference when several or no models were used', () => {
		expect(actualCost([model(1, 0.0002, true), model(2, 0.0032, true)])).toBeNull();
		expect(actualCost([model(1, 0.0002), model(2, 0.0032)])).toBeNull();
		expect(actualCost([])).toBeNull();
	});
});

describe('costDelta', () => {
	it('gives the ratio to the reference', () => {
		expect(costDelta(0.0032, 0.0002)).toBeCloseTo(15);
		expect(costDelta(0.0001, 0.0002)).toBeCloseTo(-0.5);
		expect(costDelta(0.0002, 0.0002)).toBe(0);
	});

	it('has no ratio without a usable reference', () => {
		expect(costDelta(0.0032, null)).toBeNull();
		expect(costDelta(0.0032, 0)).toBeNull();
	});
});
