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
	if (event.locals.session) throw redirect(302, '/dashboard');
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

		try {
			const existingUser = await prisma.authUser.findUnique({
				where: {
					email: form.data.email
				}
			});

			if (!existingUser) {
				return fail(400, {
					message: 'Incorrect username or password'
				});
			}

			const validPassword = await verify(existingUser.hashed_password, form.data.password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});

			if (!validPassword) {
				return fail(400, {
					message: 'Incorrect username or password'
				});
			}

			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			return redirect(302, '/');
		} catch (e) {
			console.error(e);
			return setError(form, 'The email or password is incorrect.');
		}
	}
};
