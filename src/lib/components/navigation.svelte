<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';

	const drawerStore = getDrawerStore();

	function drawerClose(): void {
		drawerStore.close();
	}
	import { LogIn, LogOut, Contact2, UserCircle2, HomeIcon } from 'lucide-svelte';
	export let user: unknown;
</script>

<nav class="list-nav p-4">
	<ul class="list mt-8">
		<li>
			<a href="/" on:click={drawerClose}>
				<span><HomeIcon /></span><span class="flex-auto">home</span>
			</a>
		</li>
		{#if user}
			<li>
				<a href="/profile" on:click={drawerClose}>
					<span><Contact2 /></span><span class="flex-auto">profile</span></a
				>
			</li>
			<li>
				<form use:enhance action="/auth/sign-out" method="post">
					<button type="submit" class="btn" on:click={drawerClose} on:keydown={drawerClose}>
						<span><LogOut /></span><span>signout</span>
					</button>
				</form>
			</li>
		{/if}
		{#if !user}
			<li>
				<a href="/auth/sign-in" on:click={drawerClose}>
					<span><LogIn /></span><span class="flex-auto">signin</span></a
				>
			</li>
			<li>
				<a href="/auth/sign-up" on:click={drawerClose}>
					<span><UserCircle2 /></span><span class="flex-auto">signup</span></a
				>
			</li>
		{/if}
	</ul>
</nav>
