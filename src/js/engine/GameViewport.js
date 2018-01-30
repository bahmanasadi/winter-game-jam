import utils from '../utils';
import Viewport from './Viewport';
import Entity from './Entity';
import Layer from './Layer';
import ImageSprite from './ImageSprite';
import TextSprite from './TextSprite';
import RectangleSprite from './RectangleSprite';
import StarSprite from './StarSprite';
import Generator from './Generator';
import BuildingGenerator from './BuildingGenerator';
import CloudGenerator from './CloudGenerator';
import sound from './sound';

const labels = ['Merry', 'Tipsy', 'Woozy', 'Sloshed', 'Sozzled'];
const baseSpeed = 120;
const baseAcceleration = 1.1;

export default class GameViewport extends Viewport {
	constructor(...args) {
		super(...args);
		window.game = this;

		this.cherry = 0;
		this.level = 1;
		this.drunkenness = 0;

		this.sprites = {
			sky: new RectangleSprite({
				fill: '#0B4B97'
			}),
			star1: new StarSprite({
				fill: '#FFFFFF'
			}),
			star2: new StarSprite({
				fill: '#1F61B0'
			}),
			star3: new StarSprite({
				fill: '#CCCCCC'
			}),
			star4: new StarSprite({
				fill: '#EEEEEE'
			}),
			idle: new ImageSprite({
				url: 'img/sprites/s_idle.png'
			}),
			moon: new ImageSprite({
				url: 'img/sprites/moon.png',
				rotation: 0.3
			}),
			run: new ImageSprite({
				url: 'img/sprites/s_run.png',
				animate: {
					speed: 10, // fps
					slice: { x: 23, y: 32 }
				}
			}),
			jump: new ImageSprite({
				url: 'img/sprites/s_jump.png',
				animate: {
					speed: 10, // fps
					slice: { x: 23, y: 32 },
					repeat: false
				}
			}),
			house1: new ImageSprite({
				url: 'img/sprites/house1.png'
			}),
			cloud: {
				large: [
					new ImageSprite({ url: 'img/sprites/cloud-large1.png' }),
					new ImageSprite({ url: 'img/sprites/cloud-large2.png' })
				],
				small: [
					new ImageSprite({ url: 'img/sprites/cloud-small1.png' }),
					new ImageSprite({ url: 'img/sprites/cloud-small2.png' }),
					new ImageSprite({ url: 'img/sprites/cloud-small3.png' })
				]
			},
			cloudFace: {
				large: {
					happyPleased: new ImageSprite({ url: 'img/sprites/cloud-large-face-happy-pleased.png' }),
					happySmiley: new ImageSprite({ url: 'img/sprites/cloud-large-face-happy-smiley.png' }),
					ouchOoo: new ImageSprite({ url: 'img/sprites/cloud-large-face-ouch-ooo.png' }),
					ouchSad: new ImageSprite({ url: 'img/sprites/cloud-large-face-ouch-sad.png' }),
					ouchShock: new ImageSprite({ url: 'img/sprites/cloud-large-face-ouch-shock.png' })
				},
				small: {
					happyPleased: new ImageSprite({ url: 'img/sprites/cloud-large-face-happy-pleased.png' }),
					happySmiley: new ImageSprite({ url: 'img/sprites/cloud-large-face-happy-smiley.png' }),
					ouchOoo: new ImageSprite({ url: 'img/sprites/cloud-large-face-ouch-ooo.png' }),
					ouchSad: new ImageSprite({ url: 'img/sprites/cloud-large-face-ouch-sad.png' }),
					ouchShock: new ImageSprite({ url: 'img/sprites/cloud-large-face-ouch-shock.png' })
				},
			},
			
			start: new TextSprite({
				text: 'Press space to start',
				fill: 'white',
				shadow: true
			}),

			timeLeft: new TextSprite({
				text: '01:00',
				fill: 'white',
				shadow: true
			}),
			gameover: new TextSprite({
				text: 'Game Over',
				fill: 'white',
				shadow: true
			}),
			f5: new TextSprite({
				text: 'F5 to restart',
				fill: 'white',
				shadow: true
			}),
			levelNotice: new TextSprite({
				text: '',
				fill: 'white',
				shadow: true
			}),
			score: new TextSprite({
				text: 'Score',
				fill: 'white',
				shadow: true
			}),
			paused: new TextSprite({
				text: 'Paused',
				fill: 'white',
				shadow: true
			}),
			pauseButton: new TextSprite({
				text: 'Pause',
				fill: 'white',
				shadow: true
			}),
			present: [
				new ImageSprite({ url: 'img/sprites/gift1.png' }),
				new ImageSprite({ url: 'img/sprites/gift2.png' }),
				new ImageSprite({ url: 'img/sprites/gift3.png' }),
				new ImageSprite({ url: 'img/sprites/gift4.png' })
			],
			chimneyFace: {
				happyPleased: new ImageSprite({ url: 'img/sprites/chimney-face-happy-pleased.png' }),
				happySmiley: new ImageSprite({ url: 'img/sprites/chimney-face-happy-smiley.png' }),
				ouchOoo: new ImageSprite({ url: 'img/sprites/chimney-face-ouch-ooo.png' }),
				ouchSad: new ImageSprite({ url: 'img/sprites/chimney-face-ouch-sad.png' }),
				ouchShock: new ImageSprite({ url: 'img/sprites/chimney-face-ouch-shock.png' }),
				sleep: new ImageSprite({ url: 'img/sprites/chimney-face-sleep.png' }),
				surprised: new ImageSprite({ url: 'img/sprites/chimney-face-surprised.png' })
			},
			bottle: [
				new ImageSprite({ url: 'img/sprites/bottle-fill0.png' }),
				new ImageSprite({ url: 'img/sprites/bottle-fill1.png' }),
				new ImageSprite({ url: 'img/sprites/bottle-fill2.png' }),
				new ImageSprite({ url: 'img/sprites/bottle-fill3.png' }),
				new ImageSprite({ url: 'img/sprites/bottle-fill4.png' }),
				new ImageSprite({ url: 'img/sprites/bottle-fill5.png' }),
				new ImageSprite({ url: 'img/sprites/bottle-fill6.png' })
			]
			
			//jump: new Sprite({}),
			//tumble: new Sprite({})
		};

		this.layers.sky = new Layer({
			position: { x: 0, y: 0 }
		}); // sky
		this.layers.bgFar = new Layer({
			position: { x: 0, y: 0 },
			velocity: { x: -baseSpeed / 8 },
			acceleration: { x: -baseAcceleration / 8 }
		}); // clouds
		this.layers.bgClose = new Layer({
			position: { x: 0, y: 0 },
			velocity: { x: -baseSpeed / 4 },
			acceleration: { x: -baseAcceleration / 4 }
		}); // background -- landmarks
		this.layers.fg2 = new Layer({
			position: { x: 0, y: 0 },
			velocity: { x: -baseSpeed },
			acceleration: { x: -baseAcceleration }
		}); // presents
		this.layers.fg = new Layer({
			position: { x: 0, y: 0 },
			velocity: { x: -baseSpeed },
			acceleration: { x: -baseAcceleration }
		}); // foreground -- player + obstacles
		this.layers.ui = new Layer({
			position: { x: 0, y: 0 }
		}); // ui

		this.entities = {
			sky: new Entity({
				sprite: this.sprites.sky,
				position: { x: 128, y: 80 },
				size: { x: 256, y: 160 }
			}),
			moon: new Entity({
				sprite: this.sprites.moon,
				position: { x: 220, y: 140 },
				size: { x: 79, y: 78 }
			}),
			timeLeft: new Entity({
				sprite: this.sprites.timeLeft,
				position: { x: 128, y: 140 },
				size: { x: 0, y: 0 }
			}),
			start: new Entity({
				sprite: this.sprites.start,
				position: { x: 128, y: 30 },
				size: { x: 0, y: 0 }
			}),
			gameover: new Entity({
				sprite: this.sprites.gameover,
				position: { x: 128, y: 120 },
				size: { x: 0, y: 0 }
			}),
			f5: new Entity({
				sprite: this.sprites.f5,
				position: { x: 128, y: 100 },
				size: { x: 0, y: 0 }
			}),
			levelNotice: new Entity({
				sprite: this.sprites.levelNotice,
				position: { x: 128, y: 120 },
				size: { x: 0, y: 0 }
			}),
			score: new Entity({
				sprite: this.sprites.score,
				position: { x: 128, y: 60 },
				size: { x: 0, y: 0 }
			}),
			paused: new Entity({
				sprite: this.sprites.paused,
				position: { x: 128, y: 80 },
				size: { x: 0, y: 0 }
			}),
			pauseButton: new Entity({
				sprite: this.sprites.pauseButton,
				position: { x: 40, y: 140 },
				size: { x: 0, y: 0 }
			}),
			bottle: new Entity({
				sprite: this.sprites.bottle[0],
				position: { x: 20, y: 80 }
			}),
			bottleLabel: new Entity({
				sprite: new TextSprite({ text: 'Merry', fontSize: 3, fill: '#000000' }),
				position: { x: 22, y: 66 },
				size: { x: 5, y: 3 }
			}),
			bottleLabel1: new Entity({
				sprite: new TextSprite({ text: 'on', fontSize: 3, fill: '#000000' }),
				position: { x: 22, y: 62 },
				size: { x: 5, y: 3 }
			}),
			bottleLabel2: new Entity({
				sprite: new TextSprite({ text: 'Sherry', fontSize: 2.6, fill: '#000000' }),
				position: { x: 22, y: 58 },
				size: { x: 5, y: 3 }
			})
		};
		
		this.layers.sky.add(this.entities.sky);
		this.layers.sky.add(this.entities.moon);

		this.buildingGenerator = new BuildingGenerator({
			size: { x: 256, y: 160 },
			chimneyFaceSprites: this.sprites.chimneyFace
		});
		this.layers.fg.add(this.buildingGenerator);

		this.starGenerator = new Generator({
			size: { x: 256, y: 160 },
			position: { x: 128, y: 80 },
			sprites: [this.sprites.star1, this.sprites.star2, this.sprites.star3, this.sprites.star4],
			entitySize: { x: 1, y: 1 },
			blockSize: { x: 64 },
			entityCount: { min: 1, max: 6 }
		});
		this.layers.sky.add(this.starGenerator);

		this.cloudGenerator1 = new CloudGenerator({
			size: { x: 256, y: 100 },
			position: { x: 128, y: 130 },
			sprites: this.sprites.cloud.large,
			faceSprites: this.sprites.cloudFace.large,
			blockSize: { x: 128 },
			entityCount: { min: 0, max: 2 }
		});
		this.layers.bgFar.add(this.cloudGenerator1);

		this.cloudGenerator2 = new CloudGenerator({
			size: { x: 256, y: 100 },
			position: { x: 128, y: 130 },
			sprites: this.sprites.cloud.small,
			faceSprites: this.sprites.cloudFace.small,
			blockSize: { x: 128 },
			entityCount: { min: 0, max: 2 }
		});
		this.layers.bgClose.add(this.cloudGenerator2);

		this.entities.player = new Entity({
			sprite: this.sprites.run,
			position: { x: 100, y: -10 },
			size: { x: 18, y: 32 },
			acceleration: { x: baseAcceleration, y: -400 },
			velocity: { x: baseSpeed, y: 0 }
		});
		this.layers.fg.add(this.entities.player);

		let on;
		setInterval(() => {
			if (!this.started) {
				on = !on;
				if (on) {
					this.layers.ui.add(this.entities.start);
				} else {
					this.layers.ui.remove(this.entities.start);
				}
			}
			if (this.gameover) {
				on = !on;
				if (on) {
					this.layers.ui.add(this.entities.f5);
				} else {
					this.layers.ui.remove(this.entities.f5);
				}
			}
		}, 500);

		this.menu();
	}
	menu() {
		sound.music('menu');
	}
	start() {
		var startTime = Date.now();
		var timeIntervalID = setInterval(() => {
			if (this.pause || this.gameover) {
				clearInterval(timeIntervalID);
			}
			let milliseconds = Date.now() - startTime,
				seconds = Math.floor(milliseconds / 1000),
				minutes = Math.floor(seconds / 60);

			milliseconds -= seconds * 1000;
			seconds -= minutes * 60;

			this.sprites.timeLeft.text = String(minutes).padStart(2, '0') + ':' +
									String(seconds).padStart(2, '0') + '.' +
									String(Math.floor(milliseconds / 100));

			if (this.drunkenness < this.level - 1) {
				this.drunkenness += 0.01;
			}
		}, 100);

		this.entities.player.position.y = 120;
		this.entities.player.velocity.y = 0;
		
		this.layers.ui.add(this.entities.timeLeft);
		this.layers.ui.add(this.entities.bottle);
		this.layers.ui.add(this.entities.bottleLabel);
		this.layers.ui.add(this.entities.bottleLabel1);
		this.layers.ui.add(this.entities.bottleLabel2);
		this.layers.ui.add(this.entities.levelNotice);
		this.layers.ui.remove(this.entities.start);
		sound.music('game');
		this.started = true;
	}
	jump() {
		// Jump only if velocity is less than 10 (ie. not already in a jump motion).
		// Volecity is changing constantly but is less than 10
		if (Math.abs(this.entities.player.velocity.y) > 10) { return; }
		this.entities.player.velocity.y = 150;
		this.entities.player.sprite = this.sprites.jump;
		sound.play('jump');
	}
	click() {
		if (!this.started) {
			this.start();
		} else {
			this.jump();
		}
	}
	render(...args) {
		super.render(...args);
		if (this.gameover || !this.started) { return; }

		var collidedEntity = utils.detectCollision(this.entities.player, this.layers.fg.entities);
		if (collidedEntity) {
			var playerY = Math.ceil(this.entities.player.position.y);
			var collidedEntityY = collidedEntity.position.y + collidedEntity.size.y / 2.0 + this.entities.player.size.y / 2.0 ;
			if (Math.abs(collidedEntityY - playerY)  > 5 ) {
				this.entities.player.sprite = this.sprites.idle;
				this.entities.player.velocity.y = -100;
				this.entities.player.velocity.x = 0;
				this.gameover = true;
				sound.music('gameover');
				this.layers.ui.add(this.entities.gameover);
				//this.layers.ui.add(this.entities.f5);
				this.buildingGenerator.chimneys.forEach(chimney => {
					chimney.face.sprite = utils.randEl([
						this.sprites.chimneyFace.ouchOoo,
						this.sprites.chimneyFace.ouchSad,
						this.sprites.chimneyFace.ouchShock
					]);
				});
				this.cloudGenerator1.faces.forEach(face => {
					face.sprite = utils.randEl([
						this.sprites.cloudFace.large.ouchOoo, 
						this.sprites.cloudFace.large.ouchSad,
						this.sprites.cloudFace.large.ouchShock
					]);
				});
				this.cloudGenerator2.faces.forEach(face => {
					face.sprite = utils.randEl([
						this.sprites.cloudFace.small.ouchOoo, 
						this.sprites.cloudFace.small.ouchSad,
						this.sprites.cloudFace.small.ouchShock
					]);
				});
				//this.entities.score.sprite.text = 'Score: ' + (this.game.player.score-1);
				//this.layers[4].add(this.entities.score);
			} else {
				this.entities.player.sprite = this.sprites.run;
				this.entities.player.velocity.y = 0;
				this.entities.player.position.y = collidedEntity.position.y + collidedEntity.size.y / 2 + this.entities.player.size.y / 2;				
			}
		} else if (this.entities.player.position.y-this.entities.player.size.y/2 < 5) {
			// Floor collision
			this.entities.player.sprite = this.sprites.run;
			this.entities.player.velocity.y = 0;
			//this.entities.player.position.y = collidedEntity.position.y + collidedEntity.size.y / 2 + this.entities.player.size.y / 2;
			console.log('Collision with ground');
		}

		var chimneyJumped = utils.detectJumpingOver(this.entities.player, this.buildingGenerator.chimneys);
		if (chimneyJumped && !chimneyJumped.jumped) {
			chimneyJumped.jumped = true;
			console.log('Chimney jumped!');
			sound.play('point');
			var present = new Entity({
				sprite: utils.randEl(this.sprites.present),
				position: { x: chimneyJumped.position.x, y: this.entities.player.position.y - 15 },
				acceleration: { x: 0, y: -300 } 
			});
			this.layers.fg2.add(present);
			chimneyJumped.face.sprite = this.sprites.chimneyFace.surprised;
			setTimeout(() => {
				chimneyJumped.face.sprite = utils.randEl([ this.sprites.chimneyFace.happyPleased, this.sprites.chimneyFace.happySmiley ]);
			}, 400);
			
			if (this.level === 1) {
				this.cherry += 3;
			} else if (this.level === 2) {
				this.cherry += 2;
			} else if (this.level > 2) {
				this.cherry += 1;
			}
			if (this.cherry > 5) {
				this.cherry = 6;
				this.level++;
				this.entities.bottleLabel.sprite.text = labels[Math.min(this.level, 4) - 1];
				this.entities.levelNotice.sprite.text = labels[Math.min(this.level, 4) - 1] + new Array(this.level).join('!');
				this.entities.levelNotice.sprite.fill = '#FFFFFF';
				var glug = () => {
					this.cherry--;
					this.entities.bottle.sprite = this.sprites.bottle[this.cherry];
					if (this.cherry > 0) {
						setTimeout(glug, 100);
					}
				};
				setTimeout(glug, 100);
				var skyColor = this.entities.sky.sprite.fill;
				this.entities.sky.sprite.fill = '#ccc';
				setTimeout(() => {
					this.entities.sky.sprite.fill = skyColor;
				}, 100);
				setTimeout(() => {
					this.entities.levelNotice.sprite.fill = '#4277B7';
				}, 2500);
				setTimeout(() => {
					this.entities.levelNotice.sprite.fill = '#1F61B0';
				}, 2750);
				setTimeout(() => {
					this.entities.levelNotice.sprite.text = '';
				}, 3000);
			}
			this.entities.bottle.sprite = this.sprites.bottle[this.cherry];
		}

	}
}
