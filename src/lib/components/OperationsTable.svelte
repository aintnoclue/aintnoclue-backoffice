<script lang="ts">
	import { formatDate, formatTokens, formatUsd } from '#lib/format.ts';
	import type { OperationSummaryDto } from '#lib/types.ts';

	interface Props {
		items: OperationSummaryDto[];
		showCharacter?: boolean;
		emptyLabel: string;
	}

	let { items, showCharacter = false, emptyLabel }: Props = $props();

	const columnCount = $derived(showCharacter ? 8 : 7);
</script>

<div class="table-wrap">
	<table>
		<thead>
			<tr>
				<th>Date</th>
				<th>Enquête</th>
				{#if showCharacter}
					<th>Suspect</th>
				{/if}
				<th class="num">Appels</th>
				<th class="num">Entrée</th>
				<th class="num">dont cache</th>
				<th class="num">Sortie</th>
				<th class="num">Coût</th>
			</tr>
		</thead>
		<tbody>
			{#each items as operation (operation.id)}
				<tr>
					<td>{formatDate(operation.createdAt)}</td>
					<td>
						{#if operation.investigationId === null}
							<span class="muted" title="L'enquête n'a pas été créée">—</span>
						{:else}
							Enquête #{operation.investigationId}
						{/if}
					</td>
					{#if showCharacter}
						<td>
							{operation.characterId === null ? '—' : `Suspect #${operation.characterId}`}
						</td>
					{/if}
					<td class="num">{formatTokens(operation.requestCount)}</td>
					<td class="num">{formatTokens(operation.tokens.inputTokens)}</td>
					<td class="num">{formatTokens(operation.tokens.cachedInputTokens)}</td>
					<td class="num">{formatTokens(operation.tokens.outputTokens)}</td>
					<td class="num">{formatUsd(operation.costUsd)}</td>
				</tr>
			{:else}
				<tr>
					<td colspan={columnCount} class="muted">{emptyLabel}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
