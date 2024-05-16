import prisma from '$lib/config/prisma';
import { userSchema } from '$lib/config/zod-schemas';
import { lucia } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { message, setError, superValidate } from 'sveltekit-superforms/server';

const profileSchema = userSchema.pick({
	firstName: true,
	lastName: true,
	email: true
});

export const load = async (event) => {
	const form = await superValidate(event, zod(profileSchema));
	const sessionId = event.cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		return redirect(302, '/auth/sign-in');
	}

	const session = await lucia.validateSession(sessionId);

	if (!session?.user) {
		return redirect(302, '/auth/sign-in');
	}

	form.data = {
		firstName: session.user.firstName,
		lastName: session.user.lastName,
		email: session.user.email
	};

	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(profileSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			console.log('updating profile');
			console.log('updating profile');
			const sessionId = event.cookies.get(lucia.sessionCookieName);

			if (!sessionId) {
				return redirect(302, '/auth/sign-in');
			}

			const session = await lucia.validateSession(sessionId);
			const user = session.user;

			if (!user) {
				return redirect(302, '/auth/sign-in');
			}

			const newValues = {
				firstName: form.data.firstName,
				lastName: form.data.lastName,
				email: form.data.email
			};

			if (
				newValues.firstName !== user.firstName ||
				newValues.lastName !== user.lastName ||
				newValues.email !== user.email
			) {
				await prisma.user.update({
					where: { id: user.id },
					data: newValues
				});

				// TODO: User is updated, but the session is not updated with the new user data
				// Form is still populated with the old user data
			} else {
				console.log('No changes detected');
				return message(form, 'No changed detected.');
			}
		} catch (e) {
			console.error(e);
			return setError(form, '', 'There was a problem updating your profile.');
		}
		console.log('profile updated successfully');
		return message(form, 'Profile updated successfully.');
	}
};
