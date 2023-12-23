import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { getAuthConfig } from './lib/server/svelte-kit-auth-config';

const userSessionInterceptor = (async ({ event, resolve }) => {
	const session = await event.locals.getSession();
	const isSessionTimedOut = new Date(session?.expires || '') <= new Date();
	const isUserSessionUndefined = !session?.user;
	const isUrlExempted = event.url.pathname.includes('/logout') || event.url.pathname === '/';

	if (isSessionTimedOut || isUserSessionUndefined) {
		if (!isUrlExempted) {
			console.log('[server-hooks] Redirecting to home page against URL: ', event.url.href);
			redirect(302, '/');
		}
	}

	return await resolve(event);
}) satisfies Handle;

export const handleError: HandleServerError = ({ error }) => {
	const message = 'Error caught in [server-hooks]: ' + (error as any)?.message;
	console.log(message, error);
	return { message };
};

export const handle = sequence(getAuthConfig, userSessionInterceptor);
