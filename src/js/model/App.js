import GameViewport from '../engine/GameViewport';
import Game from './Game';
import resources from '../engine/resources';
import sound from '../engine/sound';

const resourcelist = [
	'img/sprites/s_idle.png',
	'img/sprites/s_run.png',
	'img/sprites/s_jump.png',
	'img/sprites/moon.png',
	'img/sprites/house1.png',
	'img/sprites/cloud1.png',
	'img/sprites/building-blue-roof-plaster-left.png',
	'img/sprites/building-blue-roof-plaster-mid.png',
	'img/sprites/building-blue-roof-plaster-mid-dormer.png',
	'img/sprites/building-blue-roof-plaster-mid-window.png',
	'img/sprites/building-blue-roof-plaster-right.png',
	'img/sprites/building-thatch-left.png',
	'img/sprites/building-thatch-mid.png',
	'img/sprites/building-thatch-mid-window.png',
	'img/sprites/building-thatch-right.png',
	'img/sprites/building-thatch-tudor-left.png',
	'img/sprites/building-thatch-tudor-mid.png',
	'img/sprites/building-thatch-tudor-mid-window.png',
	'img/sprites/building-thatch-tudor-mid-crossdown.png',
	'img/sprites/building-thatch-tudor-mid-crossup.png',
	'img/sprites/building-thatch-tudor-right.png',
	'img/sprites/building-blue-roof-brick-left.png',
	'img/sprites/building-blue-roof-brick-mid.png',
	'img/sprites/building-blue-roof-brick-mid-window.png',
	'img/sprites/building-blue-roof-brick-right.png',
	'img/sprites/building-red-roof-brick-left.png',
	'img/sprites/building-red-roof-brick-mid.png',
	'img/sprites/building-red-roof-brick-mid-window.png',
	'img/sprites/building-red-roof-brick-right.png',
	'img/sprites/chimney-paint1.png',
	'img/sprites/chimney-brick1.png',
	'img/sprites/chimney-brick2.png',
	'img/sprites/gift1.png',
	'img/sprites/gift2.png',
	'img/sprites/gift3.png',
	'img/sprites/gift4.png',
	'img/sprites/chimney-face-happy-pleased.png',
	'img/sprites/chimney-face-happy-smiley.png',
	'img/sprites/chimney-face-ouch-ooo.png',
	'img/sprites/chimney-face-ouch-sad.png',
	'img/sprites/chimney-face-ouch-shock.png',
	'img/sprites/chimney-face-sleep.png',
	'img/sprites/chimney-face-surprised.png',
	'img/sprites/cloud-large1.png',
	'img/sprites/cloud-large2.png',
	'img/sprites/cloud-small1.png',
	'img/sprites/cloud-small2.png',
	'img/sprites/cloud-small3.png',
	'img/sprites/cloud-large-face-happy-pleased.png',
	'img/sprites/cloud-large-face-happy-smiley.png',
	'img/sprites/cloud-large-face-ouch-ooo.png',
	'img/sprites/cloud-large-face-ouch-sad.png',
	'img/sprites/cloud-large-face-ouch-shock.png',
	'img/sprites/cloud-small-face-happy-pleased.png',
	'img/sprites/cloud-small-face-happy-smiley.png',
	'img/sprites/cloud-small-face-ouch-ooo.png',
	'img/sprites/cloud-small-face-ouch-sad.png',
	'img/sprites/cloud-small-face-ouch-shock.png',
	'img/sprites/bottle-fill0.png',
	'img/sprites/bottle-fill1.png',
	'img/sprites/bottle-fill2.png',
	'img/sprites/bottle-fill3.png',
	'img/sprites/bottle-fill4.png',
	'img/sprites/bottle-fill5.png',
	'img/sprites/bottle-fill6.png'
];

export default class App {
	constructor(attributes) {
		Object.assign(this, attributes);
		this._lastTime = Date.now();
	}
	setup() {
		console.log('setup');
		var canvas = this.canvas = document.createElement('canvas');
		document.body.appendChild(canvas);

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		this.context = canvas.getContext('2d');
		this.context.imageSmoothingEnabled = false;

		var scaleFactor = canvas.width / this.width;
		this.context.scaleFactor = scaleFactor;
		this.context.marginTop = (canvas.height - scaleFactor * this.height) / 2;
		
		let f = () => {
			if (this.viewport) { this.viewport.click(); }
		};
		canvas.addEventListener('click', f);
		canvas.addEventListener('touchdown', f);
		window.addEventListener('keydown', f);

		return Promise.all([
			...resourcelist.map(url => resources.load(url)),
			sound.load('jump', 'sound/jump.wav'),
			sound.load('point', 'sound/point.wav'),
			sound.load('menu', 'sound/music/menu.mp3', true),
			sound.load('game', 'sound/music/game.mp3', true),
			sound.load('gameover', 'sound/music/gameover.mp3', true)
		]).then(() => {
			console.log('loaded resources');
			this.render();
		});	
	}
	pause() {
		//var pauseVp = new Viewport();
	}
	menu() {
		//var menuVp = new Viewport();
	}
	game() {
		var game = new Game(),
			viewport = new GameViewport({ game: game });
		this.setViewport(viewport);
	}
	setViewport(viewport) {
		if (this.viewport) { this.viewport.destroy(); }
		this.viewport = viewport;
	}
	render() {
		var time = Date.now(),
			timeDiff = (time - this._lastTime) / 1000;
		if (timeDiff > 0.01) { // framerate limiter
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			if (this.viewport) { this.viewport.render(timeDiff, this.context); }
			this.context.fillStyle = 'black';
			this.context.fillRect(0, 0, this.canvas.width, this.context.marginTop + 1);
			this.context.fillRect(0, this.canvas.height - this.context.marginTop - 1, this.canvas.width, this.context.marginTop + 2);
			this._lastTime = time;
		}
		window.requestAnimationFrame(() => this.render());
	}
}
