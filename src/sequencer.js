import Channel from "./channel.js";

export default class Sequencer {
	constructor() {
		this.$channelTemplate = document.querySelector("#channel-template");
		this.$channelList = document.querySelector(".channel-list");
		this.channelList = [];
		this.context = new AudioContext();
	}

	addChannel() {
		const $channel = this.$channelTemplate.content.cloneNode(true);
		const elements = {
			$sequence: $channel.querySelector(".channel__sequence"),
			$level: $channel.querySelector(".channel__level"),
			$pan: $channel.querySelector(".channel__pan"),
			$patch: $channel.querySelector(".channel__patch"),
			$mute: $channel.querySelector(".channel__mute"),
			$solo: $channel.querySelector(".channel__solo"),
		};

		const channel = new Channel(elements, this.resetSoloAll.bind(this));
		this.channelList.push(channel);

		this.$channelList.appendChild($channel);
	}

	resetSoloAll() {
		this.channelList.forEach((channel) => {
			channel.resetSolo();
		});
	}
}
