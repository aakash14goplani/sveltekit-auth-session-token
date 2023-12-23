import type { HandleClientError } from '@sveltejs/kit';

// client side hooks can only export handleError. Exporting other methods will be silently ignored!
export const handleError: HandleClientError = ({ error }) => {
	const message =
		'Error caught in [client-hooks]: ' +
		(error as any)?.message +
		', possible origin is some +page or +layout file';
	console.error(message, error);
	return { message };
};
