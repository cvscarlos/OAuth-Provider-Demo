import OAuth2Server from '@node-oauth/oauth2-server';
import oauth from './oauth.js';

export async function authorization(req, res, user) {
	const request = new OAuth2Server.Request(req);
	const response = new OAuth2Server.Response(res);
	const auth = await oauth.authorize(request, response, {
		authenticateHandler: { handle: () => user },
	});

	const url = new URL(auth.redirectUri);
	url.searchParams.append('code', auth.authorizationCode);
	url.searchParams.append('state', req.query.state);
	res.redirect(url);
}

export async function token(req, res) {
	const request = new OAuth2Server.Request(req);
	const response = new OAuth2Server.Response(res);
	const token = await oauth.token(request, response);
	res.json({ access_token: token.accessToken });
}

export async function authMiddleware(req, res, next) {
	try {
		const request = new OAuth2Server.Request(req);
		const response = new OAuth2Server.Response(res);
		const token = await oauth.authenticate(request, response);
		req.oauth2 = token;
		next();
	} catch (error) {
		next(error);
	}
}
