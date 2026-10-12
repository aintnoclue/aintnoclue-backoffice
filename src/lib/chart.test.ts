import { describe, expect, it } from 'vitest';
import { labelStep, niceTicks } from './chart';

describe('niceTicks', () => {
	it('picks a round step covering the max', () => {
		expect(niceTicks(0.0023)).toEqual([0, 0.001, 0.002, 0.003]);
		expect(niceTicks(87)).toEqual([0, 25, 50, 75, 100]);
		expect(niceTicks(1_200_000)).toEqual([0, 500_000, 1_000_000, 1_500_000]);
	});

	it('does not add a tick when the max is already round', () => {
		expect(niceTicks(100)).toEqual([0, 25, 50, 75, 100]);
		expect(niceTicks(0.3)).toEqual([0, 0.1, 0.2, 0.3]);
	});

	it('falls back to a unit axis without data', () => {
		expect(niceTicks(0)).toEqual([0, 1]);
		expect(niceTicks(Number.NaN)).toEqual([0, 1]);
	});
});

describe('labelStep', () => {
	it('keeps at most 8 date labels', () => {
		expect(labelStep(7)).toBe(1);
		expect(labelStep(30)).toBe(4);
		expect(labelStep(90)).toBe(12);
	});
});
