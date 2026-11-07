<script lang="ts">
	import { actualCost, costDelta } from '#lib/comparison.ts';
	import { formatPercent, formatUsd } from '#lib/format.ts';
	import { modelSettingsLabel } from '#lib/labels.ts';
	import type { ModelComparison } from '#lib/types.ts';

	interface Props {
		comparison: ModelComparison[];
	}

	let { comparison }: Props = $props();

	const reference = $derived(actualCost(comparison));
</script>

<div class="table-wrap">
	<table>
		<thead>
			<tr>
				<th>Modèle</th>
				<th class="num">Coût</th>
				<th class="num">Écart vs réel</th>
			</tr>
		</thead>
		<tbody>
			{#each comparison as model (model.modelId)}
				{@const delta = costDelta(model.costUsd, reference)}
				{@const settings = modelSettingsLabel(model)}
				<tr class:highlight={model.isActual}>
					<td>
						{model.name}
						<span class="muted">{model.apiName}{settings ? ` · ${settings}` : ''}</span>
						{#if model.isActual}
							<span class="tag">réel</span>
						{/if}
					</td>
					<td class="num">{formatUsd(model.costUsd)}</td>
					<td
						class="num"
						class:cheaper={delta !== null && delta < 0}
						class:pricier={delta !== null && delta > 0}
					>
						{formatPercent(delta)}
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="3" class="muted">Aucun modèle enregistré.</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

{#if comparison.length > 0 && reference === null}
	<p class="muted">
		Écart non calculé : les appels n'ont pas tous été faits avec un même modèle tarifé.
	</p>
{/if}

<style>
	.tag {
		margin-left: 0.4rem;
		padding: 0.05rem 0.4rem;
		border-radius: var(--radius);
		background: var(--accent);
		color: var(--accent-contrast);
		font-size: 0.75rem;
		font-weight: 600;
	}

	.cheaper {
		color: var(--success);
	}

	.pricier {
		color: var(--danger);
	}
</style>
