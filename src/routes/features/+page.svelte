<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { ApiError, apiSend } from '#lib/api.ts';
	import { featureLabels, modelLabel } from '#lib/labels.ts';
	import type { AiFeature, FeatureModelDto } from '#lib/types.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let savingFeature = $state<AiFeature | null>(null);
	let saveError = $state<string | null>(null);

	async function assign(feature: AiFeature, event: Event & { currentTarget: HTMLSelectElement }) {
		const value = event.currentTarget.value;
		savingFeature = feature;
		saveError = null;
		try {
			await apiSend<FeatureModelDto>(fetch, 'PATCH', `/admin/features/${feature}`, {
				modelId: value === '' ? null : Number(value)
			});
			await invalidateAll();
		} catch (e) {
			saveError = e instanceof ApiError ? e.message : 'Une erreur inattendue est survenue';
			await invalidateAll();
		} finally {
			savingFeature = null;
		}
	}
</script>

<svelte:head>
	<title>Fonctionnalités · Dashboard IA</title>
</svelte:head>

<h1>Fonctionnalités</h1>

<p class="muted">
	Le modèle choisi est utilisé dès le prochain appel. Pour un modèle de raisonnement, préciser
	l'effort : la température n'est envoyée que sans effort ou avec l'effort Aucun.
</p>

{#if saveError}
	<p class="alert error" role="alert">{saveError}</p>
{/if}

<div class="table-wrap">
	<table>
		<thead>
			<tr>
				<th>Fonctionnalité</th>
				<th>Modèle utilisé</th>
			</tr>
		</thead>
		<tbody>
			{#each data.features as { feature, model } (feature)}
				<tr>
					<td>{featureLabels[feature]}</td>
					<td>
						<select
							value={model?.id ?? ''}
							disabled={savingFeature === feature}
							onchange={(event) => assign(feature, event)}
						>
							<option value="">Par défaut (défini dans le code)</option>
							{#each data.models as option (option.id)}
								<option value={option.id}>{modelLabel(option)}</option>
							{/each}
						</select>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
