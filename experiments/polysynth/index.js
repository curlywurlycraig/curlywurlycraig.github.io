const notes = [
    "z",
    "s",
    "x",
    "d",
    "c",
    "v",
    "g",
    "b",
    "h",
    "n",
    "j",
    "m",
    ",",
];

async function start() {
    let wasmNode;

    window.onmousedown = async () => {
	if (wasmNode) return;

	const wasmResponse = await fetch('sound.wasm');
	const wasmArray = await wasmResponse.arrayBuffer();

	const audioContext = new AudioContext();
	await audioContext.audioWorklet.addModule('worklet.js');
	wasmNode = new AudioWorkletNode(audioContext, 'wasm-processor');
	wasmNode.connect(audioContext.destination);

	wasmNode.port.postMessage({ type: "INIT_WASM", data: wasmArray });
    };

    window.onmouseup = async () => {
	if (wasmNode) {
	    wasmNode.port.postMessage({
		type: "RELEASE_NOTE"
	    });
	}
    };

    window.ontouchstart = window.onmousedown;
    window.ontouchend = window.onmouseup;

    document.addEventListener("keydown", (e) => {
	if (!wasmNode) {
	    return;
	}

	const note_index = notes.indexOf(e.key);
	if (note_index === -1) return;

	wasmNode.port.postMessage({
	    type: "ATTACK_NOTE",
	    note_index
	});
    });

    document.addEventListener("keyup", (e) => {
	if (!wasmNode) {
	    return;
	}

	const note_index = notes.indexOf(e.key);
	if (note_index === -1) return;

	wasmNode.port.postMessage({
	    type: "RELEASE_NOTE",
	    note_index
	});
    });
}

window.onload = function() {
    start();
};
