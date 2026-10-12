const NICE_STEPS = [1, 2, 2.5, 5, 10];

function round(value: number): number {
	return Number(value.toPrecision(12));
}

export function niceTicks(max: number, target = 4): number[] {
	if (!Number.isFinite(max) || max <= 0) return [0, 1];

	const rough = max / target;
	const magnitude = 10 ** Math.floor(Math.log10(rough));
	const step = NICE_STEPS.map((factor) => factor * magnitude).find(
		(candidate) => candidate >= rough
	)!;
	const count = Math.ceil(round(max / step));

	return Array.from({ length: count + 1 }, (_, index) => round(index * step));
}

export function labelStep(count: number, maxLabels = 8): number {
	return Math.max(1, Math.ceil(count / maxLabels));
}
