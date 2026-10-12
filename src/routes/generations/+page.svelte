<script lang="ts">
	import FiltersHeader from '#lib/components/FiltersHeader.svelte';
	import OperationsTable from '#lib/components/OperationsTable.svelte';
	import Pagination from '#lib/components/Pagination.svelte';
	import SimulationBanner from '#lib/components/SimulationBanner.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Générations · Dashboard IA</title>
</svelte:head>

<FiltersHeader title="Générations" models={data.models} />

<SimulationBanner pricedWith={data.operations.pricedWith} />

<p class="muted">
	Une génération = la création d'une enquête : 2 appels (détails de l'enquête, puis suspects).
</p>

<OperationsTable items={data.operations.items} emptyLabel="Aucune génération sur la période." />

<Pagination
	page={data.operations.page}
	pageSize={data.operations.pageSize}
	total={data.operations.total}
/>
