export default class Player {
	constructor(attributes) {
		this.score = 0;
		Object.assign(this, attributes);
	}
}
