import bodyParser from 'body-parser';
import express from 'express';

import config from './common/config';
import logger from './common/logger';
import routes from './routes';

class App {
	constructor () {
		this._app = express();
		logger.info(`Using config: "${ config.common.ENV }"`);

		this._app.use(bodyParser.urlencoded({ extended: true }));
		this._app.use(bodyParser.json());

		this._app.use('/assets', [
			express.static('assets'),
			express.static('build/assets'),
		]);

		for (const route of routes) {
			this._app.use(route(express.Router()));
		}
	}

	async start () {
		const server = this._app.listen(config.common.PORT, () => {
			const { address, port } = server.address();
			logger.info(`API Server started: ${ address + port }`);
			return server;
		});
	}
}

const app = new App();
export default app;