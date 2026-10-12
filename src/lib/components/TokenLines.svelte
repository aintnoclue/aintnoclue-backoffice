<script lang="ts">
	import { formatTokens } from '#lib/format.ts';
	import type { TokenUsage } from '#lib/types.ts';

	interface Props {
		tokens: TokenUsage;
	}

	let { tokens }: Props = $props();
</script>

<dl class="tokens">
	<dt>Entrée</dt>
	<dd>{formatTokens(tokens.inputTokens)}</dd>
	<dt>dont cache</dt>
	<dd>{formatTokens(tokens.cachedInputTokens)}</dd>
	<dt>Sortie</dt>
	<dd>{formatTokens(tokens.outputTokens)}</dd>
</dl>

<style>
	.tokens {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.15rem 1rem;
		margin: 0;
		font-size: 0.9rem;
	}

	dt {
		color: var(--text-muted);
	}

	dd {
		margin: 0;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
</style>
