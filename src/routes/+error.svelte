<script lang="ts">
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';

	let timeoutId: any;

	onMount(() => {
		timeoutId = setTimeout(() => goto('/'), 1000);
	});

	onDestroy(() => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
	});
</script>

<svelte:head>
	<title>Error Page</title>
	<meta name="description" content="Error Page" />
</svelte:head>

<div class="flex-1">
	<h3>Generic Error Page</h3>
	<p>We have encoutered an error. Please try again later</p>
	<p>Redirecting you to home page...</p>
</div>

<style lang="scss">
	.flex-1 {
		display: flex;
		justify-content: center;
		margin: 2rem;
		padding: 2rem;
	}
</style>
