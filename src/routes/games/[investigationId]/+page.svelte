<script lang="ts">
	import { resolve } from '$app/paths';
	import FiltersHeader from '#lib/components/FiltersHeader.svelte';
	import ModelComparison from '#lib/components/ModelComparison.svelte';
	import SimulationBanner from '#lib/components/SimulationBanner.svelte';
	import TokenLines from '#lib/components/TokenLines.svelte';
	import { formatDate, formatTokens, formatUsd } from '#lib/format.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const game = $derived(data.game);
	const title = $derived(`Partie · Enquête #${game.investigationId}`);
	const conversationCount = $derived(game.conversations.length);

	function operationHref(id: number) {
		return resolve('/operations/[id]', { id: String(id) });
	}
</script>

<svelte:head>
	<title>{title} · Dashboard IA</title>
</svelte:head>

<a class="back" href={resolve('/games')}>← Parties</a>

<FiltersHeader {title} models={data.models} period={false} />

<SimulationBanner pricedWith={game.pricedWith} />

<div class="cards">
	<div class="card">
		<p class="label">Génération</p>
		<p class="value">{formatUsd(game.generation.costUsd)}</p>
		<p class="muted">
			{formatDate(game.generation.createdAt)} ·
			<a href={operationHref(game.generation.operationId)}>Voir l'opération</a>
		</p>
		<TokenLines tokens={game.generation.tokens} />
	</div>
	<div class="card">
		<p class="label">Échanges</p>
		<p class="value">{formatUsd(game.exchanges.costUsd)}</p>
		<p class="muted">
			{formatTokens(game.exchanges.count)} échange{game.exchanges.count > 1 ? 's' : ''} ·
			{formatTokens(conversationCount)} conversation{conversationCount > 1 ? 's' : ''}
		</p>
		<TokenLines tokens={game.exchanges.tokens} />
	</div>
	<div class="card">
		<p class="label">Total de la partie</p>
		<p class="value">{formatUsd(game.total.costUsd)}</p>
		<p class="muted">Génération + échanges</p>
		<TokenLines tokens={game.total.tokens} />
	</div>
</div>

<h2>Conversations par suspect</h2>
<div class="table-wrap">
	<table>
		<thead>
			<tr>
				<th>Suspect</th>
				<th class="num">Échanges</th>
				<th class="num">Entrée</th>
				<th class="num">dont cache</th>
				<th class="num">Sortie</th>
				<th class="num">Coût</th>
				<th>Opérations</th>
			</tr>
		</thead>
		<tbody>
			{#each game.conversations as conversation (conversation.characterId)}
				<tr>
					<td>
						{conversation.characterId === null ? '—' : `Suspect #${conversation.characterId}`}
					</td>
					<td class="num">{formatTokens(conversation.exchangeCount)}</td>
					<td class="num">{formatTokens(conversation.tokens.inputTokens)}</td>
					<td class="num">{formatTokens(conversation.tokens.cachedInputTokens)}</td>
					<td class="num">{formatTokens(conversation.tokens.outputTokens)}</td>
					<td class="num">{formatUsd(conversation.costUsd)}</td>
					<td>
						<span class="operations">
							{#each conversation.operationIds as operationId (operationId)}
								<a href={operationHref(operationId)}>#{operationId}</a>
							{/each}
						</span>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="7" class="muted">Aucun échange pour cette partie.</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<h2>Comparaison des modèles</h2>
<p class="muted">
	Les tokens de toute la partie tarifés avec chaque modèle de la table, à volume de tokens égal.
</p>
<ModelComparison comparison={game.comparison} />

<style>
	.back {
		display: inline-block;
		margin-bottom: 0.75rem;
		text-decoration: none;
	}

	.operations {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 0.5rem;
	}
</style>
