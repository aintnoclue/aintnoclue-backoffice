<script lang="ts">
	import { page } from '$app/state';
	import { withParams } from '#lib/query.ts';
	import type { PricedWith } from '#lib/types.ts';

	interface Props {
		pricedWith: PricedWith | null;
	}

	let { pricedWith }: Props = $props();
</script>

{#if pricedWith}
	<div class="alert warning" role="status">
		Coûts simulés avec <strong>{pricedWith.name}</strong> — estimation à volume de tokens égal.
		<span class="hint">
			Les tokens viennent du tokenizer du modèle réellement utilisé ; un autre modèle découperait le
			même texte un peu différemment.
		</span>
		<a href={withParams(page.url, { simulate: null })}>Revenir aux tarifs réels</a>
	</div>
{/if}

<style>
	.alert {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.25rem 0.75rem;
	}

	.hint {
		font-size: 0.85rem;
		opacity: 0.85;
	}

	a {
		color: inherit;
		font-weight: 600;
	}
</style>
