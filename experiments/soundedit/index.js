async function start() {
    let wasmNode;
    const wasmResponse = await fetch('sound.wasm');
    const wasmArray = await wasmResponse.arrayBuffer();

    let audioContext;

    // init context
    const initContextButton = document.getElementById('initContextButton');
    initContextButton.addEventListener('click', async function() {
	if (wasmNode) return;

	audioContext = new AudioContext();
	await audioContext.audioWorklet.addModule('worklet.js');
	wasmNode = new AudioWorkletNode(audioContext, 'wasm-processor');
	wasmNode.connect(audioContext.destination);

	wasmNode.port.postMessage({ type: "INIT_WASM", data: wasmArray });
    });

    // file upload
    const fileInput = document.querySelector('input');
    fileInput.addEventListener('change', function() {
	const theFile = this.files[0];

	if (!audioContext) {
	    // TODO Don't make it possible to even reach this point
	    console.error("Tried to parse sound file, but there is no audio context!");
	    return;
	}

	const fileReader = new FileReader();
	fileReader.onload = function() {
	    audioContext.decodeAudioData(this.result, function(buffer) {
		wasmNode.port.postMessage({
		    type: "ADD_AUDIO",
		    data: buffer.getChannelData(0) // TODO Support stereo
		});
	    });
	}
	fileReader.readAsArrayBuffer(theFile);
    });

    const waveFormCanvas = document.getElementById('waveform');
}

window.onload = function() {
    start();
};
