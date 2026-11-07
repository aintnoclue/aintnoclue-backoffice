<script lang="ts">
	import { untrack } from 'svelte';
	import { ApiError } from '#lib/api.ts';
	import { reasoningEffortLabels, serviceTierLabels } from '#lib/labels.ts';
	import type {
		AiModelDto,
		AiReasoningEffort,
		AiServiceTier,
		CreateAiModelInput
	} from '#lib/types.ts';

	interface Props {
		model?: AiModelDto;
		onsubmit: (input: CreateAiModelInput) => Promise<void>;
		oncancel: () => void;
	}

	let { model, onsubmit, oncancel }: Props = $props();

	const initial = untrack(() => model);
	const variantLocked = (initial?.requestCount ?? 0) > 0;
	const lockedTitle = 'Non modifiable : ce modèle a déjà des requêtes enregistrées';

	let name = $state(initial?.name ?? '');
	let apiName = $state(initial?.apiName ?? '');
	let reasoningEffort = $state<AiReasoningEffort | null>(initial?.reasoningEffort ?? null);
	let serviceTier = $state<AiServiceTier | null>(initial?.serviceTier ?? null);
	let inputPrice = $state<number | null | undefined>(initial?.inputPrice);
	let cachedInputPrice = $state<number | null | undefined>(initial?.cachedInputPrice);
	let cacheWritePrice = $state<number | null | undefined>(initial?.cacheWritePrice || undefined);
	let outputPrice = $state<number | null | undefined>(initial?.outputPrice);

	let submitting = $state(false);
	let errorMessage = $state<string | null>(null);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		submitting = true;
		errorMessage = null;
		try {
			await onsubmit({
				name: name.trim(),
				apiName: apiName.trim(),
				reasoningEffort,
				serviceTier,
				inputPrice: inputPrice ?? 0,
				cachedInputPrice: cachedInputPrice ?? null,
				cacheWritePrice: cacheWritePrice ?? 0,
				outputPrice: outputPrice ?? 0
			});
		} catch (e) {
			errorMessage = e instanceof ApiError ? e.message : 'Une erreur inattendue est survenue';
		} finally {
			submitting = false;
		}
	}
</script>

<form class="card" onsubmit={handleSubmit}>
	<h2>{initial ? `Modifier « ${initial.name} »` : 'Nouveau modèle'}</h2>

	<div class="fields">
		<label>
			Nom
			<input bind:value={name} required placeholder="GPT-4o mini" />
		</label>
		<label>
			Identifiant API
			<input
				bind:value={apiName}
				required
				pattern="\S+"
				placeholder="gpt-4o-mini"
				readonly={variantLocked}
				title={variantLocked ? lockedTitle : 'Sans espaces'}
			/>
		</label>
		<label>
			Effort de raisonnement
			<select
				bind:value={reasoningEffort}
				disabled={variantLocked}
				title={variantLocked ? lockedTitle : undefined}
			>
				<option value={null}>Non précisé</option>
				{#each Object.entries(reasoningEffortLabels) as [value, label] (value)}
					<option {value}>{label}</option>
				{/each}
			</select>
		</label>
		<label>
			Vitesse
			<select
				bind:value={serviceTier}
				disabled={variantLocked}
				title={variantLocked ? lockedTitle : undefined}
			>
				<option value={null}>Non précisé</option>
				{#each Object.entries(serviceTierLabels) as [value, label] (value)}
					<option {value}>{label}</option>
				{/each}
			</select>
		</label>
		<label>
			Entrée ($ / 1M tokens)
			<input type="number" bind:value={inputPrice} required min="0" step="any" />
		</label>
		<label>
			Entrée en cache ($ / 1M tokens)
			<input
				type="number"
				bind:value={cachedInputPrice}
				min="0"
				step="any"
				placeholder="Même prix que l'entrée"
			/>
		</label>
		<label>
			Écriture en cache ($ / 1M tokens)
			<input
				type="number"
				bind:value={cacheWritePrice}
				min="0"
				step="any"
				placeholder="Même prix que l'entrée"
			/>
		</label>
		<label>
			Sortie ($ / 1M tokens)
			<input type="number" bind:value={outputPrice} required min="0" step="any" />
		</label>
	</div>

	<div class="actions">
		<button type="submit" class="primary" disabled={submitting}>
			{initial ? 'Enregistrer' : 'Créer'}
		</button>
		<button type="button" onclick={oncancel} disabled={submitting}>Annuler</button>
	</div>

	{#if errorMessage}
		<p class="alert error" role="alert">{errorMessage}</p>
	{/if}
</form>

<style>
	form {
		margin-bottom: 1.5rem;
	}

	.fields {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.alert {
		margin: 1rem 0 0;
	}

	input[readonly],
	select:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
