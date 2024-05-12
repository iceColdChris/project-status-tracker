<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { userSchema } from '$lib/config/zod-schemas';
	import { ConicGradient } from '@skeletonlabs/skeleton';
	import type { ConicStop } from '@skeletonlabs/skeleton';
	import { zod } from 'sveltekit-superforms/adapters';
	export let data;

	const signUpSchema = userSchema.pick({
		firstName: true,
		lastName: true,
		email: true,
		password: true
	});

	const { form, errors, enhance, delayed } = superForm(data.form, {
		taintedMessage: null,
		validators: zod(signUpSchema),
		delayMs: 0
	});

	const conicStops: ConicStop[] = [
		{ color: 'transparent', start: 0, end: 25 },
		{ color: 'rgb(var(--color-primary-900))', start: 75, end: 100 }
	];
</script>

<form method="POST" action="/auth/sign-up" use:enhance>
	<!--<SuperDebug data={$form} />-->
	<div class="mt-6">
		<label class="label">
			<span class="sr-only">First Name</span>
			<input
				id="firstName"
				name="firstName"
				type="text"
				placeholder="First Name"
				autocomplete="given-name"
				data-invalid={$errors.firstName}
				bind:value={$form.firstName}
				class="input"
				class:input-error={$errors.firstName}
			/>
			{#if $errors.firstName}
				<small>{$errors.firstName}</small>
			{/if}
		</label>
	</div>
	<div class="mt-6">
		<label class="label">
			<span class="sr-only">Last Name</span>
			<input
				id="lastName"
				name="lastName"
				type="text"
				placeholder="Last Name"
				autocomplete="family-name"
				data-invalid={$errors.lastName}
				bind:value={$form.lastName}
				class="input"
				class:input-error={$errors.lastName}
			/>
			{#if $errors.lastName}
				<small>{$errors.lastName}</small>
			{/if}
		</label>
	</div>
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
			>{#if $delayed}<ConicGradient stops={conicStops} spin width="w-6" />{:else}Sign Up{/if}</button
		>
	</div>
</form>
