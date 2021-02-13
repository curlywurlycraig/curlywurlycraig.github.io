/**
   Given some shared memory buffer, outputs it.
*/
class WasmProcessor extends AudioWorkletProcessor {
    constructor (options) {
	super();
	console.log('opts are ', options);
	this.buf = options.processorOptions.buf;
    }

    process (inputs, outputs, parameters) {
	const memoryIndex = 0;
	const output = outputs[0];
	output.forEach(channel => {
	    for (let i = 0; i < channel.length; i++) {
		channel[i] = this.buf[memoryIndex + i];
	    }
	});
	return true
    }
}

registerProcessor('wasm-processor', WasmProcessor)
