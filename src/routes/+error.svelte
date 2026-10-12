<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Erreur {page.status} · Dashboard IA</title>
</svelte:head>

<h1>Erreur {page.status}</h1>

<p class="alert error" role="alert">
	{page.error?.message ?? 'Une erreur inattendue est survenue'}
</p>
