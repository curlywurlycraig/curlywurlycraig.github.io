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
	    const { instance } = await WebAssembly.instantiate(
		e.data.wasmArray,
		imports
	    );
	    self.instance = instance;
	    self.instance.exports.init();
	};
    }

    process (inputs, outputs, parameters) {
	this.instance.exports.gen(parameters);

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
