<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
	import SignUp from '$lib/components/sign-up.svelte';
	import SignIn from '$lib/components/sign-in.svelte';
	export let data;

	let tabSet: string = 'signUp';
</script>

<TabGroup justify="justify-center">
	<Tab bind:group={tabSet} name="signInTab" value={'signIn'}>Sign In</Tab>
	<Tab bind:group={tabSet} name="signUpTab" value={'signUp'}>Sign Up</Tab>
	<svelte:fragment slot="panel">
		{#if tabSet === 'signIn'}
			<SignIn {data} />
		{:else if tabSet === 'signUp'}
			<SignUp {data} />
		{/if}
	</svelte:fragment>
</TabGroup>
