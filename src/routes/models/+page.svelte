<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { ApiError, apiSend } from '#lib/api.ts';
	import ModelForm from '#lib/components/ModelForm.svelte';
	import { formatPrice, formatTokens } from '#lib/format.ts';
	import type { AiModelDto, CreateAiModelInput } from '#lib/types.ts';
	import type { PageProps } from './$types';

	type Editing = { mode: 'create' } | { mode: 'edit'; model: AiModelDto };

	let { data }: PageProps = $props();

	let editing = $state<Editing | null>(null);
	let deletingId = $state<number | null>(null);
	let deleteError = $state<string | null>(null);

	async function create(input: CreateAiModelInput) {
		await apiSend(fetch, 'POST', '/admin/models', input);
		await invalidateAll();
		editing = null;
	}

	async function update(model: AiModelDto, input: CreateAiModelInput) {
		const body = model.requestCount > 0 ? { ...input, apiName: undefined } : input;
		await apiSend(fetch, 'PATCH', `/admin/models/${model.id}`, body);
		await invalidateAll();
		editing = null;
	}

	async function remove(model: AiModelDto) {
		if (!confirm(`Supprimer le modèle « ${model.name} » ?`)) return;
		deletingId = model.id;
		deleteError = null;
		try {
			await apiSend(fetch, 'DELETE', `/admin/models/${model.id}`);
			if (editing?.mode === 'edit' && editing.model.id === model.id) editing = null;
			await invalidateAll();
		} catch (e) {
			deleteError = e instanceof ApiError ? e.message : 'Une erreur inattendue est survenue';
		} finally {
			deletingId = null;
		}
	}
</script>

<svelte:head>
	<title>Modèles · Dashboard IA</title>
</svelte:head>

<header>
	<h1>Modèles</h1>
	{#if editing === null}
		<button class="primary" onclick={() => (editing = { mode: 'create' })}>
			Ajouter un modèle
		</button>
	{/if}
</header>

<p class="muted">
	Prix en dollars par million de tokens. Les coûts sont rattachés aux requêtes par l'identifiant
	API.
</p>

{#if editing?.mode === 'create'}
	<ModelForm onsubmit={create} oncancel={() => (editing = null)} />
{:else if editing?.mode === 'edit'}
	{@const model = editing.model}
	{#key model.id}
		<ModelForm
			{model}
			onsubmit={(input) => update(model, input)}
			oncancel={() => (editing = null)}
		/>
	{/key}
{/if}

{#if deleteError}
	<p class="alert error" role="alert">{deleteError}</p>
{/if}

<div class="table-wrap">
	<table>
		<thead>
			<tr>
				<th>Nom</th>
				<th>Identifiant API</th>
				<th class="num">Entrée</th>
				<th class="num">Entrée en cache</th>
				<th class="num">Écriture en cache</th>
				<th class="num">Sortie</th>
				<th class="num">Requêtes</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each data.models as model (model.id)}
				<tr>
					<td>{model.name}</td>
					<td><code>{model.apiName}</code></td>
					<td class="num">{formatPrice(model.inputPrice)}</td>
					<td class="num">
						{#if model.cachedInputPrice === null}
							<span class="muted" title="Même prix que l'entrée">—</span>
						{:else}
							{formatPrice(model.cachedInputPrice)}
						{/if}
					</td>
					<td class="num">
						{#if model.cacheWritePrice === 0}
							<span class="muted" title="Même prix que l'entrée">—</span>
						{:else}
							{formatPrice(model.cacheWritePrice)}
						{/if}
					</td>
					<td class="num">{formatPrice(model.outputPrice)}</td>
					<td class="num">{formatTokens(model.requestCount)}</td>
					<td class="row-actions">
						<button onclick={() => (editing = { mode: 'edit', model })}>Modifier</button>
						<span
							title={model.requestCount > 0
								? 'Suppression impossible : ce modèle a des requêtes enregistrées'
								: undefined}
						>
							<button
								class="danger"
								disabled={model.requestCount > 0 || deletingId === model.id}
								onclick={() => remove(model)}>Supprimer</button
							>
						</span>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="8" class="muted">Aucun modèle enregistré.</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	header h1 {
		margin: 0;
	}

	.row-actions {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
	}
</style>
