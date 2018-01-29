export default class Viewport {
	constructor(attributes) {
		Object.assign(this, attributes);
		this.layers = {};
		this.pause = false;
		this.gameover = false;
	}
	render(time, context) {
		Object.values(this.layers).forEach(layer => { 
			layer.pause = this.pause;
			layer.gameover = this.gameover;
			layer.render(time, context); 
		});
	}
	click() {}
}
