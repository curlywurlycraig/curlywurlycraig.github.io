async function main() {
    const graph = document.querySelector("#graph") as HTMLCanvasElement;
    const graphContext = graph.getContext("2d")!;
    graphContext.strokeStyle = '#e4a85c';
    graphContext.fillStyle = '#09152b';
    graphContext.lineWidth = 1;

    const memory = new WebAssembly.Memory({
        initial: 200,
        maximum: 200
    });

    const byteView = new Uint8Array(memory.buffer);
    const doubleView = new Float64Array(memory.buffer);

    function renderYSamples(resultsPtr: number) {
        const startIndex = resultsPtr >> 3;
        graphContext.clearRect(0, 0, graph.width, graph.height);
        graphContext.beginPath();
        graphContext.moveTo(0, (graph.height / 2.0) - doubleView[startIndex]);
        for (let i = startIndex + 1; i < 800 + startIndex; i++) {
            graphContext.lineTo(i - startIndex, (graph.height / 2.0) - doubleView[i] * (graph.height / 2.0));
        }
        graphContext.stroke();
        graphContext.closePath();
    }

    const imports = {
        env: {
            memory,
            prints: (strPtr: number) => console.log(fromAscii(strPtr)),
            printf: console.log,
            printd: console.log,
            draw: (resultsPtr: number) => renderYSamples(resultsPtr)
        },
    };

    // Given a pointer to a string, return the full string
    function fromAscii(strPtr: number): string {
        let currPtr = strPtr;
        let currentChar = byteView[currPtr];
        let result = "";
        while (currentChar != 0) {
            result += String.fromCharCode(currentChar);
            currPtr++;
            currentChar = byteView[currPtr];
        }

        return result;
    }

    const result = await WebAssembly.instantiateStreaming(
        fetch('./dist/main.wasm'),
        imports
    );

    const init = result.instance.exports.init as CallableFunction;
    const getInputPtr = result.instance.exports.getInputPointer as CallableFunction;
    const executeFormula = result.instance.exports.executeFormula as CallableFunction;

    init();

    const submitFormulaToWasm = (value: string) => {
        const ptr = getInputPtr();
        const offsetByteView = new Uint8Array(memory.buffer, ptr, value.length + 1);
        const encodedText = new TextEncoder().encode(value);
        offsetByteView.set([...encodedText, 0]);
        executeFormula(value.length);
    }

    const textArea = document.querySelector("textarea");
    if (textArea) {
        textArea.oninput = (e) => {
            const element = e?.target as HTMLTextAreaElement;
            submitFormulaToWasm(element?.value);
        }
    }
}

window.onload = async function() {
    await main();
};