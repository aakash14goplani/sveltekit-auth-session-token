import { browser, dev } from '$app/environment';
import { base } from '$app/paths';
import type { LayoutLoad } from './$types';
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

injectSpeedInsights();
inject({ mode: dev ? 'development' : 'production' });

export const load = (async ({ url, fetch, data }) => {
	let session;

	try {
		if (browser) {
			const currentURL = url.href;
			if (currentURL.includes('xxx')) console.log('');
			const sessionObject = await fetch(url.origin + base + '/api/get-user-data');
			session = await sessionObject.json();
		} else {
			session = data.session;
		}
	} catch (ex: any) {
		console.log('Error fetching session data, defaulting to parent data');
		session = data.session;
	}

	return { session };
}) satisfies LayoutLoad;
