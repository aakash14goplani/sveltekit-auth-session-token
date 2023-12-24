import { getAuthConfig } from '$lib/server/svelte-kit-auth-config';
import { getSession, type SvelteKitAuthConfig } from '@auth/sveltekit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST = (async (event) => {
	try {
		const session = await event.locals?.getSession();
		const user = session?.user;

		if (user) {
			const tokenCall = await event.fetch('/auth/csrf');
			const csrfTokenResponse = await new Response(tokenCall.body).json();
			const csrfToken: string = csrfTokenResponse.csrfToken;

			const requestObject = new Request(event.url.origin + '/auth/session', {
				method: 'POST',
				body: JSON.stringify({
					csrfToken,
					data: { ...user, library: 'SvelteKitAuth' }
				})
			});
			const config = (await getAuthConfig({ event, render: 'config' })) as SvelteKitAuthConfig;
			await getSession(requestObject, config);

			return new Response('User data updated', { status: 200 });
		}

		return new Response('User not eligible to perform data updates', { status: 200 });
	} catch (error: any) {
		console.log('Error while updating user data: ', error?.message, error);
		return new Response('Error while updating user data: ' + error?.message, { status: 200 });
	}
}) satisfies RequestHandler;
