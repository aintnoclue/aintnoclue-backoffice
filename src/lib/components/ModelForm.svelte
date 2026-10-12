<script lang="ts">
	import { untrack } from 'svelte';
	import { ApiError } from '#lib/api.ts';
	import type { AiModelDto, CreateAiModelInput } from '#lib/types.ts';

	interface Props {
		model?: AiModelDto;
		onsubmit: (input: CreateAiModelInput) => Promise<void>;
		oncancel: () => void;
	}

	let { model, onsubmit, oncancel }: Props = $props();

	const initial = untrack(() => model);
	const apiNameLocked = (initial?.requestCount ?? 0) > 0;

	let name = $state(initial?.name ?? '');
	let apiName = $state(initial?.apiName ?? '');
	let inputPrice = $state<number | null | undefined>(initial?.inputPrice);
	let cachedInputPrice = $state<number | null | undefined>(initial?.cachedInputPrice);
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
				inputPrice: inputPrice ?? 0,
				cachedInputPrice: cachedInputPrice ?? null,
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
				readonly={apiNameLocked}
				title={apiNameLocked
					? 'Non modifiable : ce modèle a déjà des requêtes enregistrées'
					: 'Sans espaces'}
			/>
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

	input[readonly] {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
