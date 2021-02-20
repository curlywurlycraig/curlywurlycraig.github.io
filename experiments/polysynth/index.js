async function start() {
    const theremin = document.querySelector(".theremin");

    let wasmNode;
    window.onclick = async () => {
	if (wasmNode) {
	    wasmNode.port.postMessage({
		type: "MOUSE_CLICK"
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

    window.onmousemove = (e) => {
	if (!wasmNode) return;
	
	wasmNode.port.postMessage({
	    type: "MOUSE_MOVE",
	    data: { mouseX: e.screenX, mouseY: e.screenY }
	});
    }
}

window.onload = function() {
    start();
};
