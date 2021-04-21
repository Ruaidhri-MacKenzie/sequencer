export default class Sequence {
	constructor($element) {
		this.$element = $element;
		this.$stepTemplate = document.querySelector("#step-template");

		this.steps = [];

		this.addSteps(16);
	}

	toggleStep(index) {
		this.steps[index] = !this.steps[index];
	}

	addSteps(quantity = 1) {
		for (let i = 0; i < quantity; i++) {
			this.steps.push(false);
			const $step = this.$stepTemplate.content.cloneNode(true);
			this.$element.appendChild($step);
		}
	}

	removeSteps(startIndex, quantity = 1) {
		this.steps.splice(startIndex, quantity);
	}
}
