<script lang="ts">
	import PeriodSelect from '#lib/components/PeriodSelect.svelte';
	import SimulateSelect from '#lib/components/SimulateSelect.svelte';
	import type { AiModelDto } from '#lib/types.ts';

	interface Props {
		title: string;
		models: Pick<AiModelDto, 'id' | 'name' | 'reasoningEffort' | 'serviceTier'>[];
		period?: boolean;
	}

	let { title, models, period = true }: Props = $props();
</script>

<header class="toolbar">
	<h1>{title}</h1>
	<div class="filters">
		{#if period}
			<PeriodSelect />
		{/if}
		<SimulateSelect {models} />
	</div>
</header>

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
</style>
