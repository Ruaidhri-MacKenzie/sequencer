export default class Synth {
	constructor(context, index) {
		this.context = context;
		this.index = index;

		this.oscillator = {
			type: "sine",
			pitch: 261.6,
		};

		this.filter = {
			type: "low-pass",
			cutoff: 500,
			resonance: 0,
		};

		this.lfo = {
			depth: 0,
			speed: 1,
		};

		this.envelope = {
			attack: 0,
			decay: 0,
			sustain: 1,
			release: 0,
		};
	}

	loadPatch(patch) {}

	play(time) {
		const duration = 4 / 16; // 4 beats in sixteenth notes

		// Create Oscillator
		const oscillator = this.context.createOscillator();
		oscillator.type = this.oscillator.type;
		oscillator.frequency.value = this.oscillator.pitch;

		// Create Frequency Filter
		const filter = this.context.createBiquadFilter();
		filter.type = "lowpass";
		filter.frequency.value = 500;
		filter.Q.value = 1;

		// Create Amplitude Envelope
		const envelope = this.context.createGain();
		envelope.gain.cancelScheduledValues(time);
		envelope.gain.setValueAtTime(0, time);
		envelope.gain.linearRampToValueAtTime(1, time + this.envelope.attack);
		envelope.gain.linearRampToValueAtTime(this.envelope.sustain, time + this.envelope.attack + this.envelope.decay);
		envelope.gain.linearRampToValueAtTime(0, time + duration + this.envelope.release);

		// Connect nodes in context graph
		oscillator.connect(filter).connect(envelope).connect(this.context.destination);

		// Playback
		oscillator.start(time);
		oscillator.stop(time + duration + this.envelope.release);
	}
}
