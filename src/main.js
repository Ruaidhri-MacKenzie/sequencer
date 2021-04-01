const channel = {
	solo: false,
	mute: false,
	pan: 50, // 0 - 100
	level: 100, // 0 - 100
	patch: "",
	sequence: [1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0], // 0 = rest, 1-12 = C-B
};

const template = document.querySelector("#channel");
const channelList = document.querySelector(".channel-list");

const addChannel = () => {
	const channel = template.content.cloneNode(true);
	channelList.appendChild(channel);
};

addChannel();
addChannel();
addChannel();
addChannel();
addChannel();
addChannel();
addChannel();
addChannel();
