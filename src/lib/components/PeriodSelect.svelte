<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { periodOptions, readPeriod, withParams } from '#lib/query.ts';

	const selected = $derived(readPeriod(page.url).period);

	function select(event: Event & { currentTarget: HTMLSelectElement }) {
		goto(withParams(page.url, { period: event.currentTarget.value, page: null }), {
			replace: true,
			reset: false
		});
	}
</script>

<label class="period">
	Période
	<select value={selected} onchange={select}>
		{#each periodOptions as option (option.value)}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</label>

<style>
	.period {
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
	}
</style>
