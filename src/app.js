import express from 'express';
import { authMiddleware, authorization, token } from './routes-oauth.js';
import { htmlTemplate } from './utils.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static('public'));

app.get(
	'/',
	routeHandler((req, res) => {
		res.send(htmlTemplate({ host: 'https://oauth-provider-demo.onrender.com' }, '/home.hbs'));
	}),
);

app.get(
	'/authorization',
	routeHandler((req, res) => {
		res.send(htmlTemplate({ queryEntries: Object.entries(req.query) }, '/login.hbs'));
	}),
);

app.get(
	'/oauth/authorization',
	routeHandler(async (req, res) => {
		const user = {
			id: 987,
			name: 'Sample Name',
			email: 'sample.email@example.com',
		};
		await authorization(req, res, user);
	}),
);

app.post('/oauth/token', routeHandler(token));

app.get('/user-info', authMiddleware, async (req, res) => {
	res.json(req.oauth2.user);
});

const port = process.env.PORT || 4321;
app.listen(port, () => {
	console.info(`Server started on http://localhost:${port}`);
});

function routeHandler(handler) {
	return async (req, res) => {
		try {
			await handler(req, res);
		} catch (error) {
			console.error(String(error), error.response?.data, error.stack);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	};
}
