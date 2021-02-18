async function start() {
    const canvas_1 = document.querySelector(".example_1");
    const canvas_1_ctx = canvas_1.getContext('2d');
    canvas_1_ctx.strokeStyle = '#dee3f0';

    const canvas_2 = document.querySelector(".example_2");
    const canvas_2_ctx = canvas_2.getContext('2d');
    canvas_2_ctx.strokeStyle = '#dee3f0';

    const canvas_3 = document.querySelector(".example_3");
    const canvas_3_ctx = canvas_3.getContext('2d');
    canvas_3_ctx.strokeStyle = '#dee3f0';

    let workingCanvas = { cur: 0 };
    const canvasContexts = [
	canvas_1_ctx,
	canvas_2_ctx,
	canvas_3_ctx
    ];

    const memory = new WebAssembly.Memory({
	initial: 200,
	maximum: 200
    });

    const imports = {
	env: {
	    memory,
	    random: Math.random,
	    cos: Math.cos,
	    sin: Math.sin,
	    tan: Math.tan,
	    prints: (ptr) => console.log(ptr, toUTF8(ptr)),
	    printfl: (f) => console.log(f),
	    clear: () => canvasContexts[workingCanvas.cur].clearRect(0, 0, 800, 600),
	    moveTo: (x, y) => canvasContexts[workingCanvas.cur].moveTo(x, y),
	    lineTo: (x, y) => canvasContexts[workingCanvas.cur].lineTo(x, y),
	    beginPath: () => canvasContexts[workingCanvas.cur].beginPath(),
	    stroke: () => canvasContexts[workingCanvas.cur].stroke()
	}
    };

    // instantiateStreaming is not supported by mobile safari
    const wasmResponse = await fetch('draw.wasm');
    const wasmArray = await wasmResponse.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(
	wasmArray,
	imports
    );

    workingCanvas.cur = 0;
    instance.exports.example_1(canvas_1.width, canvas_1.height);
    workingCanvas.cur = 1;
    instance.exports.example_2(canvas_2.width, canvas_2.height);
    workingCanvas.cur = 2;
    instance.exports.example_3(canvas_3.width, canvas_3.height, 0.0);

    let canvas_3_animation_percentage = 0.0;
    let hovering_canvas_3 = false;
    function animateExample3() {
	workingCanvas.cur = 2;
	instance.exports.example_3(canvas_3.width, canvas_3.height, canvas_3_animation_percentage);
	canvas_3_animation_percentage += 0.01;
	if (canvas_3_animation_percentage > 1) {
	    canvas_3_animation_percentage = 0;
	}

	if (hovering_canvas_3) {
	    window.requestAnimationFrame(animateExample3);
	}
    }

    canvas_3.onmouseover = () => {
	hovering_canvas_3 = true;
	window.requestAnimationFrame(animateExample3);
    }
    canvas_3.onmouseout = () => {
	hovering_canvas_3 = false;
	instance.exports.example_3(canvas_3.width, canvas_3.height, canvas_3_animation_percentage);
    }
    canvas_3.ontouchend = canvas_3.onmouseout;
    canvas_3.ontouchstart = canvas_3.onmouseover;

    // The below is overridden immediately after, I'm just leaving
    // this here because it will come in handy later when I want to
    // remember how I passed the wasm array buffer into the worklet
    canvas_3.onclick = async () => {
	const wasmResponse = await fetch('sound.wasm');
	const wasmArray = await wasmResponse.arrayBuffer();

	const audioContext = new AudioContext();
	await audioContext.audioWorklet.addModule('worklet.js');
	const wasmNode = new AudioWorkletNode(audioContext, 'wasm-processor');
	wasmNode.connect(audioContext.destination);

	wasmNode.port.postMessage({ wasmArray });
    };

    canvas_3.onclick = () => {};
}

window.onload = function() {
    start();
};
