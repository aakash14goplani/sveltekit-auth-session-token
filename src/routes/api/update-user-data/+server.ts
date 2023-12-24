import type { RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ fetch, locals }) => {
	try {
		const session = await locals?.getSession();
		const user = session?.user;

		if (user) {
      await fetch('/auth/session');
			return new Response('User data updated', { status: 200 });
		}

		return new Response('User not eligible to perform data updates', { status: 200 });
	} catch (error: any) {
		console.log('Error while updating user data: ', error?.message);
		return new Response('Error while updating user data: ' + error?.message, { status: 200 });
	}
}) satisfies RequestHandler;
