<script lang="ts">
	import { resolve } from '$app/paths';
	import FiltersHeader from '#lib/components/FiltersHeader.svelte';
	import ModelComparison from '#lib/components/ModelComparison.svelte';
	import SimulationBanner from '#lib/components/SimulationBanner.svelte';
	import TokenLines from '#lib/components/TokenLines.svelte';
	import { formatDate, formatDuration, formatTokens, formatUsd } from '#lib/format.ts';
	import { featureLabels, operationKindLabels } from '#lib/labels.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const operation = $derived(data.operation);
	const title = $derived(`${operationKindLabels[operation.kind]} #${operation.id}`);
	const isGeneration = $derived(operation.kind === 'INVESTIGATION_GENERATION');
	const durationMs = $derived(
		operation.requests.reduce((sum, request) => sum + request.durationMs, 0)
	);
</script>

<svelte:head>
	<title>{title} · Dashboard IA</title>
</svelte:head>

<a class="back" href={isGeneration ? resolve('/generations') : resolve('/exchanges')}>
	← {isGeneration ? 'Générations' : 'Échanges'}
</a>

<FiltersHeader {title} models={data.models} period={false} />

<SimulationBanner pricedWith={operation.pricedWith} />

<div class="cards">
	<div class="card">
		<p class="label">Opération</p>
		<dl class="facts">
			<dt>Date</dt>
			<dd>{formatDate(operation.createdAt)}</dd>
			<dt>Enquête</dt>
			<dd>
				{#if operation.investigationId === null}
					<span class="muted" title="L'enquête n'a pas été créée">—</span>
				{:else}
					Enquête #{operation.investigationId}
				{/if}
			</dd>
			{#if !isGeneration}
				<dt>Suspect</dt>
				<dd>{operation.characterId === null ? '—' : `Suspect #${operation.characterId}`}</dd>
			{/if}
		</dl>
	</div>
	<div class="card">
		<p class="label">Coût</p>
		<p class="value">{formatUsd(operation.costUsd)}</p>
		<p class="muted">
			{formatTokens(operation.requestCount)} appel{operation.requestCount > 1 ? 's' : ''} ·
			{formatDuration(durationMs)}
		</p>
	</div>
	<div class="card">
		<p class="label">Tokens</p>
		<TokenLines tokens={operation.tokens} />
	</div>
</div>

<h2>Appels</h2>
<div class="table-wrap">
	<table>
		<thead>
			<tr>
				<th>Fonctionnalité</th>
				<th>Modèle</th>
				<th class="num">Entrée</th>
				<th class="num">dont cache</th>
				<th class="num">Sortie</th>
				<th class="num">Durée</th>
				<th class="num">Coût</th>
			</tr>
		</thead>
		<tbody>
			{#each operation.requests as request (request.id)}
				<tr>
					<td>{featureLabels[request.feature]}</td>
					<td>{request.model}</td>
					<td class="num">{formatTokens(request.tokens.inputTokens)}</td>
					<td class="num">{formatTokens(request.tokens.cachedInputTokens)}</td>
					<td class="num">{formatTokens(request.tokens.outputTokens)}</td>
					<td class="num">{formatDuration(request.durationMs)}</td>
					<td class="num">{formatUsd(request.costUsd)}</td>
				</tr>
			{:else}
				<tr>
					<td colspan="7" class="muted">Aucun appel enregistré.</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<h2>Comparaison des modèles</h2>
<p class="muted">
	Les tokens de l'opération tarifés avec chaque modèle de la table, à volume de tokens égal.
</p>
<ModelComparison comparison={operation.comparison} />

<style>
	.back {
		display: inline-block;
		margin-bottom: 0.75rem;
		text-decoration: none;
	}

	.facts {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.15rem 1rem;
		margin: 0.5rem 0 0;
		font-size: 0.9rem;
	}

	.facts dt {
		color: var(--text-muted);
	}

	.facts dd {
		margin: 0;
		text-align: right;
	}
</style>
