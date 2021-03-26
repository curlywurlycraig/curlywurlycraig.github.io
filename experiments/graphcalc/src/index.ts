async function main() {
    const graphInfo = {
        centerX: 0,
        centerY: 0,
        zoom: 0.5
    };
    const interactionInfo = {
        lastDragXPos: 0,
        lastDragYPos: 0,
        isDragging: false
    }
    let formula = "";

    const graph = document.querySelector("#graph") as HTMLCanvasElement;
    const graphContext = graph.getContext("2d")!;

    // TODO Execute this on resize, and also set the graph's width and height attributes based on the
    // element width and height attributes (multiplied by 2)
    const initGraphContext = () => {
        graphContext.strokeStyle = '#e4a85c';
        graphContext.fillStyle = '#09152b';
        graphContext.lineWidth = 1;
    }

    initGraphContext();

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
        graphContext.moveTo(0, (graphInfo.centerY - doubleView[startIndex]) * graphInfo.zoom * (graph.height / 2.0) + (graph.height / 2.0));
        for (let i = startIndex + 1; i < graph.width + startIndex; i++) {
            const yPos = (graphInfo.centerY - doubleView[i]) * graphInfo.zoom * (graph.height / 2.0) + (graph.height / 2.0)
            graphContext.lineTo(i - startIndex, yPos);
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
            draw: (resultsPtr: number) => renderYSamples(resultsPtr),
            sin: Math.sin,
            cos: Math.cos,
            tan: Math.tan
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

    const submitFormulaToWasm = () => {
        const ptr = getInputPtr();
        const offsetByteView = new Uint8Array(memory.buffer, ptr, formula.length + 1);
        const encodedText = new TextEncoder().encode(formula);
        offsetByteView.set([...encodedText, 0]);
        executeFormula(
            formula.length,
            graphInfo.centerX - (1 / graphInfo.zoom),
            graphInfo.centerX + (1/ graphInfo.zoom),
            graph.width
        );
    }

    const textArea = document.querySelector("textarea");
    if (textArea) {
        textArea.oninput = (e) => {
            const element = e?.target as HTMLTextAreaElement;
            formula = element?.value;
            submitFormulaToWasm();
        }
    }

    graph.onmousedown = (e) => {
        interactionInfo.isDragging = true;
        interactionInfo.lastDragXPos = e.x;
        interactionInfo.lastDragYPos = e.y;
    }

    graph.onmouseup = (e) => {
        interactionInfo.isDragging = false;
    }

    graph.onmousemove = (e) => {
        if (!interactionInfo.isDragging) return;

        graphInfo.centerX -= 4 * (e.x - interactionInfo.lastDragXPos) / (graph.width * graphInfo.zoom);
        graphInfo.centerY += 4 * (e.y - interactionInfo.lastDragYPos) / (graph.height * graphInfo.zoom);
        submitFormulaToWasm();

        interactionInfo.lastDragXPos = e.x;
        interactionInfo.lastDragYPos = e.y;
    }

    graph.onpointerdown = (e) => {
        console.log(e);
    }

    window.onresize = () => {
        graph.width = window.innerWidth * 2;
        graph.height = window.innerHeight * 2;
        initGraphContext();
        submitFormulaToWasm();
    }
}

window.onload = async function() {
    await main();
};