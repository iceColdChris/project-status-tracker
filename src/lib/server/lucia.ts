import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { adapter } from '$lib/config/prisma';

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (data) => {
		return {
			userId: data.id,
			email: data.email,
			firstName: data.firstName,
			lastName: data.lastName,
			role: data.role,
			token: data.token
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
	token: string;
}
