/**
   Given some shared memory buffer, outputs it.
*/
class WasmProcessor extends AudioWorkletProcessor {
    constructor (options) {
	super();

	const memory = new WebAssembly.Memory({
	    initial: 200,
	    maximum: 200
	});

	this.f32buf = new Float32Array(memory.buffer);

	const imports = {
	    env: {
		memory,
		sin: Math.sin,
		printf: f => console.log(f),
	    }
	};

	const self = this;

	this.port.onmessage = async (e) => {
	    if (e.data.type === "INIT_WASM") {
		const { instance } = await WebAssembly.instantiate(
		    e.data.data,
		    imports
		);
		this.instance = instance;
		this.instance.exports.init();
	    } else if (e.data.type === "ATTACK_NOTE") {
		this.instance.exports.trigger_attack();
	    } else if (e.data.type === "RELEASE_NOTE") {
		this.instance.exports.trigger_release();
	    }
	};
    }

    process (inputs, outputs, parameters) {
	this.instance.exports.dispatch();

	const memoryIndex = 0;
	const output = outputs[0];
	output.forEach(channel => {
	    for (let i = 0; i < channel.length; i++) {
		channel[i] = this.f32buf[memoryIndex + i];
	    }
	});
	return true;
    }
}

registerProcessor('wasm-processor', WasmProcessor)
