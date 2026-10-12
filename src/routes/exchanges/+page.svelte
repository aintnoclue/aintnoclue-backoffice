<script lang="ts">
	import FiltersHeader from '#lib/components/FiltersHeader.svelte';
	import OperationsTable from '#lib/components/OperationsTable.svelte';
	import Pagination from '#lib/components/Pagination.svelte';
	import SimulationBanner from '#lib/components/SimulationBanner.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Échanges · Dashboard IA</title>
</svelte:head>

<FiltersHeader title="Échanges" models={data.models} />

<SimulationBanner pricedWith={data.operations.pricedWith} />

<p class="muted">Un échange = une question posée à un suspect et sa réponse : 1 appel.</p>

<OperationsTable
	items={data.operations.items}
	showCharacter
	emptyLabel="Aucun échange sur la période."
/>

<Pagination
	page={data.operations.page}
	pageSize={data.operations.pageSize}
	total={data.operations.total}
/>
