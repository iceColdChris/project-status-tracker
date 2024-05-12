<script lang="ts">
	import { ConicGradient } from '@skeletonlabs/skeleton';
	import type { ConicStop } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';
	import { userSchema } from '$lib/config/zod-schemas';
	import { zod } from 'sveltekit-superforms/adapters';
	import { AlertTriangle } from 'lucide-svelte';
	export let data;
	const signInSchema = userSchema.pick({ email: true, password: true });
	const { form, errors, enhance, delayed } = superForm(data.form, {
		taintedMessage: null,
		validators: zod(signInSchema),
		delayMs: 0
	});
	const conicStops: ConicStop[] = [
		{ color: 'transparent', start: 0, end: 25 },
		{ color: 'rgb(var(--color-primary-900))', start: 75, end: 100 }
	];
</script>

<form method="POST" action="/auth/sign-in" use:enhance>
	{#if $errors._errors}
		<aside class="alert variant-filled-error mt-6">
			<div><AlertTriangle size="42" /></div>
			<div class="alert-message">
				<h3 class="h3">Sign In Problem</h3>
				<p>{$errors._errors}</p>
			</div>
		</aside>
	{/if}
	<div class="mt-6">
		<label class="label">
			<span class="sr-only">Email Address</span>
			<input
				id="email"
				name="email"
				type="email"
				placeholder="Email Address"
				autocomplete="email"
				data-invalid={$errors.email}
				bind:value={$form.email}
				class="input"
				class:input-error={$errors.email}
			/>
			{#if $errors.email}
				<small>{$errors.email}</small>
			{/if}
		</label>
	</div>

	<div class="mt-6">
		<label class="label">
			<span class="sr-only">Password</span>
			<input
				id="password"
				name="password"
				type="password"
				placeholder="Password"
				data-invalid={$errors.password}
				bind:value={$form.password}
				class="input"
				class:input-error={$errors.password}
			/>
			{#if $errors.password}
				<small>{$errors.password}</small>
			{/if}
		</label>
	</div>

	<div class="mt-6">
		<button type="submit" class="btn variant-filled-primary w-full"
			>{#if $delayed}<ConicGradient stops={conicStops} spin width="w-6" />{:else}Sign In{/if}</button
		>
	</div>
	<div class="flex flex-row justify-center items-center mt-10">
		<a href="/auth/password/reset" class="font-semibold">Forgot Password?</a>
	</div>
</form>
