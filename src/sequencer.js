import Channel from "./channel.js";
import { TEMPO, CHANNEL_COUNT, STEP_COUNT, LOOKAHEAD, SCHEDULE_AHEAD_TIME } from "./constants.js";
import StepQueue from "./queue.js";

export default class Sequencer {
	constructor() {
		this.context = new AudioContext();

		// Channels
		this.$channelTemplate = document.querySelector("#channel-template");
		this.$channelList = document.querySelector(".channel-list__controls");
		this.$sequenceList = document.querySelector(".channel-list__sequences");
		this.channelList = [];
		for (let i = 0; i < CHANNEL_COUNT; i++) {
			this.addChannel(i);
		}

		// Playback
		this.$play = document.querySelector(".playback__play");
		this.$tempo = document.querySelector(".playback__tempo");

		this.$play.onclick = this.play.bind(this);
		this.$tempo.onchange = this.setTempo.bind(this);

		this.tempo = TEMPO.default; // in bpm
		this.currentStep = 0;
		this.nextStepTime = 0;
		this.lastStepDrawn = 1;
		this.stepQueue = new StepQueue();
		this.isPlaying = false;
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
		const secondsPerStep = secondsPerBeat / 4;
		this.nextStepTime += secondsPerStep;
		this.currentStep += 1;
		this.currentStep %= STEP_COUNT;
	}

	scheduleStep(step, time) {
		this.stepQueue.enqueue(step, time);

		this.channelList.forEach((channel) => {
			if (channel.sequence.steps[step]) {
				channel.synth.play(time);
			}
		});
	}

	draw() {
		let drawStep = this.lastStepDrawn;
		let currentTime = this.context.currentTime;

		while (this.stepQueue.length && this.stepQueue.getHead().time < currentTime) {
			drawStep = this.stepQueue.getHead().step;
			this.stepQueue.dequeue();
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
		while (this.nextStepTime < this.context.currentTime + SCHEDULE_AHEAD_TIME) {
			this.scheduleStep(this.currentStep, this.nextStepTime);
			this.nextStep();
		}
		this.timerID = setTimeout(this.scheduler.bind(this), LOOKAHEAD);
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
