<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { readSimulate, withParams } from '#lib/query.ts';
	import type { AiModelDto } from '#lib/types.ts';

	interface Props {
		models: Pick<AiModelDto, 'id' | 'name'>[];
	}

	let { models }: Props = $props();

	const selected = $derived(readSimulate(page.url) ?? '');

	function select(event: Event & { currentTarget: HTMLSelectElement }) {
		goto(withParams(page.url, { simulate: event.currentTarget.value }), {
			replace: true,
			reset: false
		});
	}
</script>

<label class="simulate">
	Simuler avec
	<select value={selected} onchange={select}>
		<option value="">Tarifs réels</option>
		{#each models as model (model.id)}
			<option value={model.id}>{model.name}</option>
		{/each}
	</select>
</label>

<style>
	.simulate {
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
	}
</style>
