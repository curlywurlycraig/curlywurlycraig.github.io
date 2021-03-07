/**
   Given some shared memory buffer, outputs it.
*/
class WasmProcessor extends AudioWorkletProcessor {
    constructor (options) {
	super();

	const memory = new WebAssembly.Memory({
	    initial: 1000,
	    maximum: 1000
	});

	this.f32buf = new Float32Array(memory.buffer);

	const imports = {
	    env: {
		memory,
		sin: Math.sin,
		printf: f => console.log(f),
		printp: console.log,
		random: Math.random
	    }
	};

	this.port.onmessage = async (e) => {
	    if (e.data.type === "INIT_WASM") {
		const { instance } = await WebAssembly.instantiate(
		    e.data.data,
		    imports
		);
		this.instance = instance;
		this.instance.exports.init();
	    } else if (e.data.type === "ADD_AUDIO") {
		const destPtr = this.instance.exports.provideEditorBuffer();
		const ptrFloat = destPtr >> 2;
		e.data.data.forEach((samp, i) => {
		    this.f32buf[ptrFloat + i] = samp;
		});
		this.instance.exports.playLen(e.data.data.length);
	    }
	};
    }

    process (inputs, outputs, parameters) {
	if (!this.instance) {
	    return true;
	}

	const memoryIndexBytes = this.instance.exports.dispatch();
	const memoryIndexFloat = memoryIndexBytes >> 2;

	const output = outputs[0];
	// TODO Will need to get the view into the right buffer
	output.forEach(channel => {
	    for (let i = 0; i < channel.length; i++) {
		channel[i] = this.f32buf[memoryIndexFloat + i];
	    }
	});
	return true;
    }
}

registerProcessor('wasm-processor', WasmProcessor)
