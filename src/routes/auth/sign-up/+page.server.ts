import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { lucia } from '$lib/server/lucia';
import { userSchema } from '$lib/config/zod-schemas';
import { zod } from 'sveltekit-superforms/adapters';
import prisma from '$lib/config/prisma.js';
import { hash } from '@node-rs/argon2';
import { generateIdFromEntropySize } from 'lucia';

const signUpSchema = userSchema.pick({
	firstName: true,
	lastName: true,
	email: true,
	password: true
});

export const load = async (event) => {
	if (event.locals.session) throw redirect(302, '/');
	const form = await superValidate(event, zod(signUpSchema));
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(signUpSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		let success = false;

		//add user to db
		try {
			const token = generateIdFromEntropySize(16);

			const hashedPassword = await hash(form.data.password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});

			// create user
			const user = await prisma.user.create({
				data: {
					firstName: form.data.firstName,
					lastName: form.data.lastName,
					email: form.data.email,
					token: token,
					hashed_password: hashedPassword
				}
			});

			// create session
			const session = await lucia.createSession(user.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			success = true;
		} catch (e) {
			console.error(e);
			// email already in use
			//might be other type of error but this is most common and this is how lucia docs sets the error to duplicate user
			return setError(form, 'email', 'A user with that email already exists.');
		}

		if (success) {
			redirect(302, '/');
		}
	}
};
