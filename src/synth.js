export default class Synth {
	constructor(context, index) {
		this.context = context;
		this.index = index;

		this.patch = {
			oscillatorType: "sine",
			pitch: 261.6,
		};

		this.oscillator = {};
		this.filter = {};
		this.lfo = {};
		this.envelope = {
			attack: 0.1,
			release: 0.1,
		};
		this.master = {};
	}

	play(time) {
		const duration = 4 / 16; // 4 beats in sixteenth notes

		const oscillator = this.context.createOscillator();
		oscillator.type = this.patch.oscillatorType || "sine";
		oscillator.frequency.value = this.patch.pitch || 261.6;

		const gain = this.context.createGain();
		gain.gain.cancelScheduledValues(time);
		gain.gain.setValueAtTime(0, time);
		gain.gain.linearRampToValueAtTime(1, time + this.envelope.attack);
		gain.gain.linearRampToValueAtTime(0, time + duration - this.envelope.release);

		oscillator.connect(gain);
		gain.connect(this.context.destination);

		oscillator.start(time);
		oscillator.stop(time + duration);
	}
}
