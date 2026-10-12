<script lang="ts">
	import { resolve } from '$app/paths';
	import FiltersHeader from '#lib/components/FiltersHeader.svelte';
	import Pagination from '#lib/components/Pagination.svelte';
	import SimulationBanner from '#lib/components/SimulationBanner.svelte';
	import { formatDate, formatTokens, formatUsd } from '#lib/format.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Parties · Dashboard IA</title>
</svelte:head>

<FiltersHeader title="Parties" models={data.models} />

<SimulationBanner pricedWith={data.games.pricedWith} />

<p class="muted">
	Une partie = la génération d'une enquête et tous les échanges avec ses suspects. Elle est datée
	par sa génération : ses échanges sont comptés même s'ils sortent de la période.
</p>

<div class="table-wrap">
	<table>
		<thead>
			<tr>
				<th>Date</th>
				<th>Enquête</th>
				<th class="num">Génération</th>
				<th class="num">Échanges</th>
				<th class="num">Coût des échanges</th>
				<th class="num">Total</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each data.games.items as game (game.investigationId)}
				<tr>
					<td>{formatDate(game.createdAt)}</td>
					<td>Enquête #{game.investigationId}</td>
					<td class="num">{formatUsd(game.generation.costUsd)}</td>
					<td class="num">{formatTokens(game.exchanges.count)}</td>
					<td class="num">{formatUsd(game.exchanges.costUsd)}</td>
					<td class="num">{formatUsd(game.total.costUsd)}</td>
					<td>
						<a
							href={resolve('/games/[investigationId]', {
								investigationId: String(game.investigationId)
							})}>Détail</a
						>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="7" class="muted">Aucune partie sur la période.</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<Pagination page={data.games.page} pageSize={data.games.pageSize} total={data.games.total} />
