// Helpful article:
// https://developers.google.com/web/updates/2018/06/audio-worklet-design-pattern
async function start() {
    const canvas = document.querySelector("#canvas");
    const canvasCtx = canvas.getContext('2d');
    const errorText = document.querySelector("#errors");
    canvasCtx.strokeStyle = '#dee3f0';

    function logError(error) {
	errorText.innerHTML = error;
    }

    const memory = new WebAssembly.Memory({
	initial: 200,
	maximum: 200,
	shared: true
    });

    // Each HEAP is simply a different "view" into the memory.
    let HEAP8 = new Int8Array(memory.buffer);
    let HEAPU8 = new Uint8Array(memory.buffer);
    let HEAP16 = new Int16Array(memory.buffer);
    let HEAPU16 = new Uint16Array(memory.buffer);
    let HEAP32 = new Uint32Array(memory.buffer);
    let HEAPU32 = new Uint32Array(memory.buffer);
    let HEAPF32 = new Float32Array(memory.buffer);
    let HEAPF64 = new Float64Array(memory.buffer);

    let toUtf8Decoder = new TextDecoder( "utf-8" );
    function toUTF8(ptr) {
	// Remember, in C strings are null terminated strings.
	// Argument is a pointer to the first character.
	// Iterate and find null.
	// This is almost directly copied from rawdraw.
	let len = 0;
	for(let i = ptr; HEAPU8[i] != 0; i++) len++;
	return toUtf8Decoder.decode(HEAPU8.subarray(ptr, ptr+len));
    }

    const imports = {
	env: {
	    memory,
	    random: Math.random,
	    cos: Math.cos,
	    sin: Math.sin,
	    tan: Math.tan,
	    prints: (ptr) => console.log(ptr, toUTF8(ptr)),
	    printfl: (f) => console.log(f),
	    clear: () => canvasCtx.clearRect(0, 0, 800, 600),
	    moveTo: (x, y) => canvasCtx.moveTo(x, y),
	    lineTo: (x, y) => canvasCtx.lineTo(x, y),
	    beginPath: () => canvasCtx.beginPath(),
	    stroke: () => canvasCtx.stroke()
	}
    };

    // instantiateStreaming is not supported by mobile safari
    const wasmResponse = await fetch('main.wasm');
    const wasmArray = await wasmResponse.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(
	wasmArray,
	imports
    );
    instance.exports.init();

    let initialisedAudioContext = false;
    let workletNode;
    async function maybeInitialiseContext() {
	if (!initialisedAudioContext) {
	    const audioContext = new AudioContext()
	    await audioContext.audioWorklet.addModule('worklet.js')
	    workletNode = new AudioWorkletNode(audioContext, 'wasm-processor', {
		processorOptions: {
		    buf: HEAPF32
		}
	    })
	    workletNode.connect(audioContext.destination)

	    initialisedAudioContext = true;
	}
    }

    canvas.onmousedown = async function(e) {
	await maybeInitialiseContext();
	instance.exports.onMouseDown();
    }

    canvas.onmousemove = function(e) {
	instance.exports.setCursorPosition(e.offsetX, e.offsetY);
    }
    
    canvas.ontouchstart = canvas.onmousedown;

    canvas.ontouchmove = function(e) {
	const touch = e.touches[0];
	instance.exports.setCursorPosition(touch.clientX - e.target.offsetLeft, touch.clientY - e.target.offsetTop);
	e.preventDefault();
	e.stopPropagation();
    }

    canvas.onmouseup = function(e) {
	instance.exports.onMouseUp();
    }

    document.mute = async function() {
	await maybeInitialiseContext();
	instance.exports.toggle();
    }
}

window.onload = function() {
    start();
};
