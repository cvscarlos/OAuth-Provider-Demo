import OAuth2Server from '@node-oauth/oauth2-server';

const demoClientId = 'demo-client-id-4aGl';
const client = {
	id: demoClientId,
	clientSecret: 'demo-client-secret-FR5v',
	grants: ['authorization_code'],
	redirectUris: ['any'],
};

const authorizationCodes = {};
const userDataByToken = {};

const oauth = new OAuth2Server({
	model: {
		async getClient(clientId) {
			if (clientId === demoClientId) return client;
			return false;
		},

		async saveAuthorizationCode(code, client, user) {
			authorizationCodes[code.authorizationCode] = { ...code, client, user };
			return code;
		},

		async getAuthorizationCode(authorizationCode) {
			const auth = authorizationCodes[authorizationCode];
			if (!auth) return false;
			return auth;
		},

		async revokeAuthorizationCode(code) {
			const auth = authorizationCodes[code.authorizationCode];
			if (!auth) return false;

			authorizationCodes[code.authorizationCode] = null;
			return true;
		},

		async saveToken(token, client, user) {
			userDataByToken[token.accessToken] = { ...token, client, user };
			return userDataByToken[token.accessToken];
		},

		async getAccessToken(accessToken) {
			const token = userDataByToken[accessToken];
			if (!token) return false;
			return token;
		},

		validateRedirectUri() {
			return true;
		},
	},
});

export default oauth;
