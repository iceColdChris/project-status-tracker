import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { lucia } from '$lib/server/lucia';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/config/zod-schemas';
import prisma from '$lib/config/prisma';
import { verify } from '@node-rs/argon2';

const signInSchema = userSchema.pick({
	email: true,
	password: true
});

export const load = async (event) => {
	if (event.locals.session) redirect(302, '/');
	const form = await superValidate(event, zod(signInSchema));
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(signInSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		let success = false;

		try {
			const existingUser = await prisma.user.findUnique({
				where: {
					email: form.data.email
				}
			});

			if (!existingUser) {
				return setError(form, 'email', 'User not found');
			}

			const validPassword = await verify(existingUser.hashed_password, form.data.password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});

			if (!validPassword) {
				return setError(form, 'password', 'Incorrect username or password');
			}

			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			success = true;
		} catch (e) {
			console.error(e);
			return setError(form, 'The email or password is incorrect.');
		}

		if (success) {
			redirect(302, '/');
		}
	}
};
