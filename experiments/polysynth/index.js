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

    const noteElements = [
	document.getElementById('c'),
	document.getElementById('cs'),
	document.getElementById('d'),
	document.getElementById('ds'),
	document.getElementById('e'),
	document.getElementById('f'),
	document.getElementById('fs'),
	document.getElementById('g'),
	document.getElementById('gs'),
	document.getElementById('a'),
	document.getElementById('as'),
	document.getElementById('b'),
	document.getElementById('uc'),
    ];
    const attackSlider = document.getElementById('attack');
    const decaySlider = document.getElementById('decay');
    const sustainSlider = document.getElementById('sustain');
    const releaseSlider = document.getElementById('release');

    attackSlider.oninput = function() {
	if (!wasmNode) return;

	wasmNode.port.postMessage({
	    type: "ADJUST_ATTACK",
	    value: this.value
	});
    }

    decaySlider.oninput = function() {
	if (!wasmNode) return;

	wasmNode.port.postMessage({
	    type: "ADJUST_DECAY",
	    value: this.value
	});
    }

    sustainSlider.oninput = function() {
	if (!wasmNode) return;

	wasmNode.port.postMessage({
	    type: "ADJUST_SUSTAIN",
	    value: this.value
	});
    }

    releaseSlider.oninput = function() {
	if (!wasmNode) return;

	wasmNode.port.postMessage({
	    type: "ADJUST_RELEASE",
	    value: this.value
	});
    }

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

    window.ontouchstart = window.onmousedown;

    document.addEventListener("keydown", (e) => {
	if (!wasmNode || e.repeat) {
	    return;
	}

	const note_index = notes.indexOf(e.key);
	if (note_index === -1) return;

	noteElements[note_index].classList.add("active");

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

	noteElements[note_index].classList.remove("active");

	wasmNode.port.postMessage({
	    type: "RELEASE_NOTE",
	    note_index
	});
    });
}

window.onload = function() {
    start();
};
