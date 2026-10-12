<script lang="ts">
	import { resolve } from '$app/paths';
	import DailyChart from '#lib/components/DailyChart.svelte';
	import PeriodSelect from '#lib/components/PeriodSelect.svelte';
	import SimulateSelect from '#lib/components/SimulateSelect.svelte';
	import SimulationBanner from '#lib/components/SimulationBanner.svelte';
	import { formatNumber, formatTokens, formatUsd } from '#lib/format.ts';
	import { featureLabels } from '#lib/labels.ts';
	import type { ExchangesUsageAverage, TokenUsage, UsageAverage, UsageTotals } from '#lib/types.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const overview = $derived(data.overview);
	const averages = $derived([
		{ title: 'Génération', unit: 'génération', average: overview.averages.generation },
		{ title: 'Échange', unit: 'échange', average: overview.averages.exchange },
		{ title: 'Conversation', unit: 'conversation', average: overview.averages.conversation },
		{ title: 'Partie', unit: 'partie', average: overview.averages.game }
	]);

	function hasExchanges(average: UsageAverage): average is ExchangesUsageAverage {
		return 'avgExchanges' in average;
	}
</script>

<svelte:head>
	<title>Vue d'ensemble · Dashboard IA</title>
</svelte:head>

{#snippet tokenLines(tokens: TokenUsage)}
	<dl class="tokens">
		<dt>Entrée</dt>
		<dd>{formatTokens(tokens.inputTokens)}</dd>
		<dt>dont cache</dt>
		<dd>{formatTokens(tokens.cachedInputTokens)}</dd>
		<dt>Sortie</dt>
		<dd>{formatTokens(tokens.outputTokens)}</dd>
	</dl>
{/snippet}

{#snippet usageRow(label: string, usage: UsageTotals)}
	<tr>
		<td>{label}</td>
		<td class="num">{formatTokens(usage.requestCount)}</td>
		<td class="num">{formatTokens(usage.tokens.inputTokens)}</td>
		<td class="num">{formatTokens(usage.tokens.cachedInputTokens)}</td>
		<td class="num">{formatTokens(usage.tokens.outputTokens)}</td>
		<td class="num">{formatUsd(usage.costUsd)}</td>
	</tr>
{/snippet}

{#snippet usageHead(label: string)}
	<thead>
		<tr>
			<th>{label}</th>
			<th class="num">Appels</th>
			<th class="num">Entrée</th>
			<th class="num">dont cache</th>
			<th class="num">Sortie</th>
			<th class="num">Coût</th>
		</tr>
	</thead>
{/snippet}

<header class="toolbar">
	<h1>Vue d'ensemble</h1>
	<div class="filters">
		<PeriodSelect />
		<SimulateSelect models={data.models} />
	</div>
</header>

<SimulationBanner pricedWith={overview.pricedWith} />

{#if overview.unpricedModels.length > 0}
	<div class="alert warning" role="alert">
		Modèles sans tarif : <strong>{overview.unpricedModels.join(', ')}</strong>. Les coûts qui en
		dépendent ne sont pas calculés.
		<a href={resolve('/models')}>Ajouter leurs tarifs</a>
	</div>
{/if}

<h2>Consommation totale</h2>
<div class="cards">
	<div class="card">
		<p class="label">Coût</p>
		<p class="value">{formatUsd(overview.totals.costUsd)}</p>
		<p class="muted">{formatTokens(overview.totals.requestCount)} appels</p>
	</div>
	<div class="card">
		<p class="label">Tokens</p>
		{@render tokenLines(overview.totals.tokens)}
	</div>
</div>

<h2>Par jour</h2>
{#if data.period === 'all'}
	<p class="muted">Le graphique couvre les 90 derniers jours.</p>
{/if}
<DailyChart days={data.daily.days} />

<h2>Moyennes</h2>
<div class="cards">
	{#each averages as { title, unit, average } (title)}
		<div class="card">
			<p class="label">{title}</p>
			<p class="value">{formatUsd(average.avgCostUsd)}</p>
			<p class="muted">
				par {unit} · {formatTokens(average.count)}
				{unit}{average.count > 1 ? 's' : ''}
				{#if hasExchanges(average)}
					· {formatNumber(average.avgExchanges)} échanges en moyenne
				{/if}
			</p>
			{@render tokenLines(average.avgTokens)}
		</div>
	{/each}
</div>

<h2>Par fonctionnalité</h2>
<div class="table-wrap">
	<table>
		{@render usageHead('Fonctionnalité')}
		<tbody>
			{#each overview.byFeature as usage (usage.feature)}
				{@render usageRow(featureLabels[usage.feature], usage)}
			{:else}
				<tr><td colspan="6" class="muted">Aucun appel sur la période.</td></tr>
			{/each}
		</tbody>
	</table>
</div>

<h2>Par modèle</h2>
<div class="table-wrap">
	<table>
		{@render usageHead('Modèle')}
		<tbody>
			{#each overview.byModel as usage (usage.model)}
				{@render usageRow(usage.model, usage)}
			{:else}
				<tr><td colspan="6" class="muted">Aucun appel sur la période.</td></tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.toolbar h1 {
		margin: 0;
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.label {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		color: var(--text-muted);
	}

	.value {
		margin: 0.25rem 0;
		font-size: 1.6rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	.card .muted {
		margin: 0 0 0.75rem;
		font-size: 0.85rem;
	}

	.tokens {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.15rem 1rem;
		margin: 0;
		font-size: 0.9rem;
	}

	.tokens dt {
		color: var(--text-muted);
	}

	.tokens dd {
		margin: 0;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
</style>
