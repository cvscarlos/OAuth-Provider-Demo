import OAuth2Server from '@node-oauth/oauth2-server';

const demoClientId = 'demo-client-id-4aGl';
const demoClient = {
	id: demoClientId,
	clientSecret: 'demo-client-secret-FR5v',
	grants: ['authorization_code'],
	redirectUris: ['https://example.com/'],
};

const authorizationCodes = {};
const userDataByToken = {};

const oauth = new OAuth2Server({
	model: {
		async getClient(clientId) {
			if (clientId === demoClientId) return demoClient;
			else return false;
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

		async validateRedirectUri() {
			// this method is implemented only because it is a fake server
			// on production, you should rmeove it to use the default implementation
			return true;
		},
	},
});

export default oauth;
