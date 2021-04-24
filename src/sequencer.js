import Channel from "./channel.js";
import { TEMPO } from "./constants.js";

export default class Sequencer {
	constructor() {
		this.context = new AudioContext();

		// Channels
		this.$channelTemplate = document.querySelector("#channel-template");
		this.$channelList = document.querySelector(".channel-list__controls");
		this.$sequenceList = document.querySelector(".channel-list__sequences");
		this.channelList = [];
		for (let i = 0; i < 8; i++) {
			this.addChannel(i);
		}

		// Playback
		this.$play = document.querySelector(".playback__play");
		this.$tempo = document.querySelector(".playback__tempo");

		this.$play.onclick = this.play.bind(this);
		this.$tempo.onchange = this.setTempo.bind(this);

		this.lookahead = 25; // in ms
		this.scheduleAheadTime = 0.1; // in sec
		this.tempo = TEMPO.default;
		this.currentStep = 0;
		this.nextStepTime = 0;
		this.stepQueue = [];
		this.isPlaying = false;
		this.lastStepDrawn = 1;
	}

	addChannel(index) {
		const $channel = this.$channelTemplate.content.cloneNode(true).firstElementChild;
		$channel.setAttribute("id", `channel${index}`);
		this.$channelList.appendChild($channel);

		const $sequence = document.createElement("div");
		$sequence.classList.add("channel__sequence");
		$sequence.setAttribute("id", `sequence${index}`);
		this.$sequenceList.appendChild($sequence);

		const channel = new Channel(this.context, index, this.resetSoloAll.bind(this));
		this.channelList.push(channel);
	}

	resetSoloAll() {
		this.channelList.forEach((channel) => {
			channel.resetSolo();
		});
	}

	setTempo() {
		const tempo = Number(this.$tempo.value);
		if (tempo >= TEMPO.min && tempo <= TEMPO.max) {
			this.tempo = tempo;
		} else {
			this.tempo = TEMPO.default;
			this.$tempo.value = TEMPO.default;
		}
	}

	nextStep() {
		const secondsPerBeat = 60 / this.tempo;
		this.nextStepTime += secondsPerBeat;
		this.currentStep += 1;
		this.currentStep %= 16;
	}

	scheduleStep(step, time) {
		this.stepQueue.push({ step, time });

		this.channelList.forEach((channel) => {
			if (channel.sequence.steps[step]) {
				channel.synth.play(time);
			}
		});
	}

	draw() {
		let drawStep = this.lastStepDrawn;
		let currentTime = this.context.currentTime;

		while (this.stepQueue.length && this.stepQueue[0].time < currentTime) {
			drawStep = this.stepQueue[0].step;
			this.stepQueue.splice(0, 1);
		}

		if (this.lastStepDrawn != drawStep) {
			const $sequences = document.querySelectorAll(".channel__sequence");
			$sequences.forEach(($sequence) => {
				$sequence.children[this.lastStepDrawn].classList.remove("step--playing");
				$sequence.children[drawStep].classList.add("step--playing");
			});

			this.lastStepDrawn = drawStep;
		}
		requestAnimationFrame(this.draw.bind(this));
	}

	scheduler() {
		while (this.nextStepTime < this.context.currentTime + this.scheduleAheadTime) {
			this.scheduleStep(this.currentStep, this.nextStepTime);
			this.nextStep();
		}
		this.timerID = setTimeout(this.scheduler.bind(this), this.lookahead);
	}

	play() {
		if (this.isPlaying) {
			this.isPlaying = false;
			this.stop();
			return;
		}

		this.isPlaying = true;
		if (this.context.state === "suspended") {
			this.context.resume();
		}

		this.currentStep = 0;
		this.nextStepTime = this.context.currentTime;
		this.scheduler();
		requestAnimationFrame(this.draw.bind(this));
	}

	stop() {
		clearTimeout(this.timerID);
		const $sequences = document.querySelectorAll(".channel__sequence");
		$sequences.forEach(($sequence) => {
			$sequence.children[this.lastStepDrawn].classList.remove("step--playing");
		});
	}
}
