// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsonServer = require('json-server');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const server = jsonServer.create();

// eslint-disable-next-line no-undef
const router = jsonServer.router(path.resolve(__dirname, 'db.json'));

server.use(jsonServer.defaults({}));
server.use(jsonServer.bodyParser);

server.post('/login', (req, res) => {
	try {
		const { username, password } = req.body;
		// eslint-disable-next-line no-undef
		const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
		const { users = [] } = db;

		const userFromBd = users.find(
			(user) => user.username === username && user.password === password,
		);

		if (userFromBd) {
			return res.json(userFromBd);
		}

		return res.status(403).json({ message: 'User not found' });
	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: e.message });
	}
});

// проверяем, авторизован ли пользователь
// eslint-disable-next-line
server.use((req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(403).json({ message: 'AUTH ERROR' });
	}

	next();
});

server.use(router);

// запуск сервера
server.listen(process.env.PORT || 8000, () => {
	console.log('server is running on 8000 port');
});
