export default class Sequence {
	constructor(context, index) {
		this.context = context;
		this.index = index;
		this.steps = [];

		this.$element = document.getElementById(`sequence${this.index}`);

		for (let i = 0; i < 16; i++) {
			this.steps.push(false);

			const $step = document.createElement("div");
			$step.classList.add("step");
			$step.setAttribute("data-index", i);
			$step.onclick = this.toggleStep.bind(this);

			this.$element.appendChild($step);
		}
	}

	toggleStep(event) {
		const $step = event.target;
		$step.classList.toggle("step--active");

		const index = $step.dataset.index;
		this.steps[index] = !this.steps[index];
	}
}
