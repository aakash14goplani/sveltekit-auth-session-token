import { isEmpty } from 'lodash-es';
import { dev } from '$app/environment';
import { SvelteKitAuth } from '@auth/sveltekit';

export const { handle: getAuthConfig } = SvelteKitAuth(async (event) => {
	const useSecureCookies = !dev;
	return {
		providers: [
			{
				id: 'auth0',
				name: 'Auth0',
				type: 'oidc',
				clientId: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET,
				issuer: process.env.ISSUER,
				wellKnown: process.env.WELL_KNOWN
			}
		],
		debug: true,
		secret: process.env.VERCEL_SECRET,
		basePath: '/hello/auth',
		session: {
			maxAge: 3600,
			strategy: 'jwt'
		},
		trustHost: true,
		cookies: {
			pkceCodeVerifier: {
				name: 'next-auth.pkce.code_verifier',
				options: {
					httpOnly: true,
					sameSite: 'lax',
					path: '/',
					secure: useSecureCookies
				}
			},
			sessionToken: {
				name: `${useSecureCookies ? '__Secure-' : ''}next-auth.session-token`,
				options: {
					httpOnly: true,
					sameSite: 'lax',
					path: '/',
					secure: useSecureCookies
				}
			}
		},
		callbacks: {
			async jwt({ token, account, profile }) {
				if (!isEmpty(account)) {
					token = { ...token, ...account };
				}
				if (!isEmpty(profile)) {
					token = { ...token, ...(profile as any) };
				}

				const shouldUpdateToken = event.url.searchParams.get('query') === 'update-user-data';
				if (shouldUpdateToken) {
					console.log('token before update [library]: ', token?.library);
					token = {
						...token,
						library: 'SvelteKitAuth: v0.11.1'
					};
					console.log('token after update [library]: ', token?.library);
				}

				return token;
			},
			async session({ session, token }) {
				if (session.user) {
					if (token?.access_token) {
						session.user = { ...session.user, ...token } as any;
					}
				}
				return session;
			}
		},
		logger: {
			error: (error: any) => {
				try {
					const _error = JSON.stringify(error);
					console.log('ERROR via HOOKS: ', _error);
				} catch (e: any) {
					console.log('ERROR via HOOKS: ', e?.message);
				}
			}
		}
	}
});
