<script lang="ts">
	import { labelStep, niceTicks } from '#lib/chart.ts';
	import { formatCompact, formatDay, formatTokens, formatUsd, formatUsdAxis } from '#lib/format.ts';
	import type { DailyUsagePoint } from '#lib/types.ts';

	type Metric = 'cost' | 'tokens';

	interface Props {
		days: DailyUsagePoint[];
	}

	let { days }: Props = $props();

	const WIDTH = 800;
	const HEIGHT = 260;
	const LEFT = 64;
	const RIGHT = 12;
	const TOP = 12;
	const BOTTOM = 28;
	const PLOT_WIDTH = WIDTH - LEFT - RIGHT;
	const PLOT_HEIGHT = HEIGHT - TOP - BOTTOM;

	let metric = $state<Metric>('cost');
	let hovered = $state<number | null>(null);

	function valueOf(point: DailyUsagePoint): number {
		return metric === 'cost'
			? (point.costUsd ?? 0)
			: point.tokens.inputTokens + point.tokens.outputTokens;
	}

	const values = $derived(days.map(valueOf));
	const ticks = $derived(niceTicks(Math.max(0, ...values)));
	const top = $derived(ticks[ticks.length - 1]);
	const band = $derived(PLOT_WIDTH / Math.max(days.length, 1));
	const step = $derived(labelStep(days.length));
	const isEmpty = $derived(values.every((value) => value === 0));
	const hoveredPoint = $derived(hovered === null ? null : days[hovered]);
	const tooltipPercent = $derived(
		hovered === null ? 0 : ((LEFT + (hovered + 0.5) * band) / WIDTH) * 100
	);

	function y(value: number): number {
		return TOP + PLOT_HEIGHT - (value / top) * PLOT_HEIGHT;
	}

	function barHeight(value: number): number {
		const height = (value / top) * PLOT_HEIGHT;
		return value > 0 ? Math.max(height, 1) : 0;
	}

	function formatTick(value: number): string {
		return metric === 'cost' ? formatUsdAxis(value) : formatCompact(value);
	}
</script>

<div class="chart card">
	<div class="head">
		<div class="toggle" role="group" aria-label="Mesure affichée">
			<button
				type="button"
				class:active={metric === 'cost'}
				aria-pressed={metric === 'cost'}
				onclick={() => (metric = 'cost')}>Coût</button
			>
			<button
				type="button"
				class:active={metric === 'tokens'}
				aria-pressed={metric === 'tokens'}
				onclick={() => (metric = 'tokens')}>Tokens</button
			>
		</div>
		{#if isEmpty}
			<p class="muted">Aucun appel sur la période.</p>
		{/if}
	</div>

	<div class="plot">
		<svg
			viewBox="0 0 {WIDTH} {HEIGHT}"
			role="group"
			aria-label={metric === 'cost' ? 'Coût par jour' : 'Tokens par jour'}
		>
			{#each ticks as tick (tick)}
				<line class="grid" x1={LEFT} x2={WIDTH - RIGHT} y1={y(tick)} y2={y(tick)} />
				<text class="tick" x={LEFT - 8} y={y(tick)} text-anchor="end" dominant-baseline="middle">
					{formatTick(tick)}
				</text>
			{/each}

			{#each days as point, index (point.day)}
				{@const value = values[index]}
				{@const x = LEFT + index * band}
				<rect
					class="bar"
					class:dim={hovered !== null && hovered !== index}
					x={x + band * 0.15}
					y={TOP + PLOT_HEIGHT - barHeight(value)}
					width={band * 0.7}
					height={barHeight(value)}
					rx="2"
				/>
				{#if index % step === 0}
					<text class="tick" x={x + band / 2} y={HEIGHT - 8} text-anchor="middle">
						{formatDay(point.day)}
					</text>
				{/if}
				<rect
					class="hit"
					{x}
					y={TOP}
					width={band}
					height={PLOT_HEIGHT}
					role="img"
					aria-label="{formatDay(point.day, 'long')} : {metric === 'cost'
						? formatUsd(point.costUsd)
						: `${formatTokens(value)} tokens`}"
					onpointerenter={() => (hovered = index)}
					onpointerleave={() => (hovered = null)}
				/>
			{/each}
		</svg>

		{#if hoveredPoint}
			<div
				class="tooltip"
				style:left="{tooltipPercent}%"
				style:transform="translateX(-{tooltipPercent}%)"
			>
				<strong>{formatDay(hoveredPoint.day, 'long')}</strong>
				<dl>
					<dt>Coût</dt>
					<dd>{formatUsd(hoveredPoint.costUsd)}</dd>
					<dt>Appels</dt>
					<dd>{formatTokens(hoveredPoint.requestCount)}</dd>
					<dt>Entrée</dt>
					<dd>{formatTokens(hoveredPoint.tokens.inputTokens)}</dd>
					<dt>dont cache</dt>
					<dd>{formatTokens(hoveredPoint.tokens.cachedInputTokens)}</dd>
					{#if hoveredPoint.tokens.cacheWriteTokens > 0}
						<dt>dont écriture cache</dt>
						<dd>{formatTokens(hoveredPoint.tokens.cacheWriteTokens)}</dd>
					{/if}
					<dt>Sortie</dt>
					<dd>{formatTokens(hoveredPoint.tokens.outputTokens)}</dd>
				</dl>
			</div>
		{/if}
	</div>
</div>

<style>
	.chart {
		margin-bottom: 1.5rem;
	}

	.head {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.75rem;
	}

	.head p {
		margin: 0;
	}

	.toggle {
		display: inline-flex;
	}

	.toggle button {
		border-radius: 0;
	}

	.toggle button:first-child {
		border-radius: var(--radius) 0 0 var(--radius);
	}

	.toggle button:last-child {
		border-radius: 0 var(--radius) var(--radius) 0;
		margin-left: -1px;
	}

	.toggle button.active {
		background: var(--accent-soft);
		color: var(--accent);
		font-weight: 600;
	}

	.plot {
		position: relative;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
	}

	.grid {
		stroke: var(--border);
		stroke-width: 1;
	}

	.tick {
		fill: var(--text-muted);
		font-size: 11px;
		font-variant-numeric: tabular-nums;
	}

	.bar {
		fill: var(--accent);
		transition: opacity 0.1s;
	}

	.bar.dim {
		opacity: 0.4;
	}

	.hit {
		fill: transparent;
	}

	.tooltip {
		position: absolute;
		top: 0;
		pointer-events: none;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
		padding: 0.5rem 0.75rem;
		font-size: 0.85rem;
		white-space: nowrap;
	}

	.tooltip dl {
		display: grid;
		grid-template-columns: auto auto;
		gap: 0.1rem 1rem;
		margin: 0.35rem 0 0;
	}

	.tooltip dt {
		color: var(--text-muted);
	}

	.tooltip dd {
		margin: 0;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
</style>
