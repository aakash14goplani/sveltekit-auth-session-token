import { dev } from '$app/environment';
import { SvelteKitAuth } from '@auth/sveltekit';

import { isEmpty } from 'lodash-es';

export async function getAuthConfig(args: any): Promise<Response> {
	const useSecureCookies = !dev;
	return SvelteKitAuth({
		providers: [
			{
				id: 'auth0',
				name: 'Auth0',
				type: 'oidc',
				clientId: import.meta.env.VITE_CLIENT_ID,
				clientSecret: import.meta.env.VITE_CLIENT_SECRET,
				issuer: import.meta.env.VITE_ISSUER,
				wellKnown: import.meta.env.VITE_WELL_KNOWN
			}
		],
		debug: true,
		secret: import.meta.env.VITE_VERCEL_SECRET,
		session: {
			maxAge: 3600
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

				// ToDo: Logic to update session-token-cookie

				return token;
			},
			async session({ session, token }) {
				if (session.user) {
					if (token?.access_token) {
						session.user = { ...session.user, ...token };
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
		},
		events: {
			async signOut(message: any) {}
		}
	})(args);
}
