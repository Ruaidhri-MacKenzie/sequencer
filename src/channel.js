import Sequence from "./sequence.js";

export default class Channel {
	constructor(elements, resetSoloAll) {
		this.level = 75;
		this.pan = 0;
		this.patch = "";
		this.isMute = false;
		this.isSolo = false;

		this.$sequence = elements.$sequence;
		this.$level = elements.$level;
		this.$pan = elements.$pan;
		this.$patch = elements.$patch;
		this.$mute = elements.$mute;
		this.$solo = elements.$solo;

		this.sequence = new Sequence(this.$sequence);
		this.synth = {};

		this.resetSoloAll = resetSoloAll;

		this.$level.onchange = this.setLevel.bind(this);
		this.$pan.onchange = this.setPan.bind(this);
		this.$patch.onchange = this.setPatch.bind(this);

		this.$mute.onclick = this.toggleMute.bind(this);
		this.$solo.onclick = this.toggleSolo.bind(this);
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

	toggleSolo() {
		if (!this.isSolo) this.resetSoloAll();
		this.isSolo = !this.isSolo;
		this.$solo.classList.toggle("channel__solo--active");
	}

	resetSolo() {
		this.isSolo = false;
		this.$solo.classList.remove("channel__solo--active");
	}
}
