<script lang="ts">
	import { page as currentPage } from '$app/state';
	import { formatTokens } from '#lib/format.ts';
	import { withParams } from '#lib/query.ts';

	interface Props {
		page: number;
		pageSize: number;
		total: number;
	}

	let { page, pageSize, total }: Props = $props();

	const pageCount = $derived(Math.max(1, Math.ceil(total / pageSize)));

	function hrefFor(target: number) {
		return withParams(currentPage.url, { page: target > 1 ? target : null });
	}
</script>

<nav class="pagination" aria-label="Pagination">
	{#if page > 1}
		<a class="button" href={hrefFor(Math.min(page - 1, pageCount))}>← Précédent</a>
	{:else}
		<span class="button disabled" aria-disabled="true">← Précédent</span>
	{/if}

	<span class="muted">
		Page {page} sur {pageCount} · {formatTokens(total)} résultat{total > 1 ? 's' : ''}
	</span>

	{#if page < pageCount}
		<a class="button" href={hrefFor(page + 1)}>Suivant →</a>
	{:else}
		<span class="button disabled" aria-disabled="true">Suivant →</span>
	{/if}
</nav>

<style>
	.pagination {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
	}

	.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
