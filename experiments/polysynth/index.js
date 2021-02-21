async function start() {
    let wasmNode;
    window.onmousedown = async () => {
	if (wasmNode) {
	    wasmNode.port.postMessage({
		type: "ATTACK_NOTE"
	    });

	    return;
	}
	
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
}

window.onload = function() {
    start();
};
