import Sequence from "./sequence.js";
import Synth from "./synth.js";

export default class Channel {
	constructor(context, index, setSolo) {
		this.context = context;
		this.index = index;

		this.level = 75;
		this.pan = 0;
		this.patch = "";
		this.isMute = false;

		this.$element = document.getElementById(`channel${this.index}`);
		this.$level = this.$element.querySelector(".channel__level");
		this.$pan = this.$element.querySelector(".channel__pan");
		this.$patch = this.$element.querySelector(".channel__patch");
		this.$mute = this.$element.querySelector(".channel__mute");
		this.$solo = this.$element.querySelector(".channel__solo");

		this.sequence = new Sequence(this.context, this.index);
		this.synth = new Synth(this.context, this.index);

		this.$level.onchange = this.setLevel.bind(this);
		this.$pan.onchange = this.setPan.bind(this);
		this.$patch.onchange = this.setPatch.bind(this);
		this.$mute.onclick = this.toggleMute.bind(this);
		this.$solo.onclick = () => setSolo(index);
	}

	setLevel() {
		this.level = parseInt(this.$level.value, 10);
	}

	setPan() {
		this.pan = parseInt(this.$pan.value, 10);
		console.log(this.pan);
	}

	setPatch() {
		this.patch = this.$patch.value;
	}

	toggleMute() {
		this.isMute = !this.isMute;
		this.$mute.classList.toggle("channel__mute--active");
	}

	play(step, time) {
		if (this.isMute) return;

		if (this.sequence.steps[step]) {
			this.synth.play(time);
		}
	}
}
