<script lang="ts">
	export let data;

	$: console.log(data);
</script>

{#if data.user}
	<h1>Welcome to {data.user.firstName} {data.user.lastName} {data.user.email}</h1>
{:else}
	<h1>Welcome to SvelteKit</h1>
{/if}
