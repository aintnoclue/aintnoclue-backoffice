<script lang="ts">
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const links = [
		{ path: resolve('/'), label: "Vue d'ensemble" },
		{ path: resolve('/generations'), label: 'Générations' },
		{ path: resolve('/exchanges'), label: 'Échanges' },
		{ path: resolve('/games'), label: 'Parties' },
		{ path: resolve('/models'), label: 'Modèles' }
	];

	const home = resolve('/');

	function isActive(path: string): boolean {
		const current = page.url.pathname;
		return path === home ? current === home : current === path || current.startsWith(`${path}/`);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="shell">
	<aside class="sidebar">
		<a class="brand" href={home}>Dashboard IA</a>
		<nav>
			{#each links as link (link.path)}
				<a
					href={link.path}
					class:active={isActive(link.path)}
					aria-current={isActive(link.path) ? 'page' : undefined}>{link.label}</a
				>
			{/each}
		</nav>
	</aside>

	<main class="content">
		{@render children()}
	</main>
</div>

<style>
	.shell {
		display: grid;
		grid-template-columns: 220px minmax(0, 1fr);
		min-height: 100vh;
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1.5rem 1rem;
		background: var(--surface);
		border-right: 1px solid var(--border);
	}

	.brand {
		font-weight: 700;
		font-size: 1.1rem;
		color: var(--text);
		text-decoration: none;
		padding: 0 0.75rem;
	}

	nav {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	nav a {
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius);
		color: var(--text-muted);
		text-decoration: none;
	}

	nav a:hover {
		background: var(--surface-hover);
		color: var(--text);
	}

	nav a.active {
		background: var(--accent-soft);
		color: var(--accent);
		font-weight: 600;
	}

	.content {
		padding: 2rem;
		min-width: 0;
	}

	@media (max-width: 720px) {
		.shell {
			grid-template-columns: 1fr;
		}

		.sidebar {
			border-right: none;
			border-bottom: 1px solid var(--border);
			padding: 1rem;
			gap: 0.75rem;
		}

		nav {
			flex-direction: row;
			flex-wrap: wrap;
		}

		.content {
			padding: 1rem;
		}
	}
</style>
