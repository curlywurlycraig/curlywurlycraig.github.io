async function start() {
    const canvas_1 = document.querySelector(".example_1");
    const canvas_1_ctx = canvas_1.getContext('2d');
    canvas_1_ctx.strokeStyle = '#dee3f0';

    const canvas_2 = document.querySelector(".example_2");
    const canvas_2_ctx = canvas_2.getContext('2d');
    canvas_2_ctx.strokeStyle = '#dee3f0';

    let workingCanvas = { cur: 0 };
    const canvasContexts = [
	canvas_1_ctx,
	canvas_2_ctx
    ];

    const memory = new WebAssembly.Memory({
	initial: 200,
	maximum: 200,
	shared: true
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
}

window.onload = function() {
    start();
};
