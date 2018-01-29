'use strict';

import App from './model/App';

const app = new App({ width: 256, height: 160 });

window.addEventListener('load', () => {
	console.log('ready');
	app.setup()
		.then(() => app.game());
});