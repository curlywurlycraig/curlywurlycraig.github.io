async function main() {
    const memory = new WebAssembly.Memory({
        initial: 200,
        maximum: 200
    });

    const byteView = new Uint8Array(memory.buffer);
    const doubleView = new Float64Array(memory.buffer);

    const imports = {
        env: {
            memory,
            prints: (strPtr: number) => console.log(fromAscii(strPtr)),
            printf: console.log,
            printd: console.log
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

    let formula = "";
    init();

    const submitFormulaToWasm = () => {
        const ptr = getInputPtr();
        const offsetByteView = new Uint8Array(memory.buffer, ptr, formula.length + 1);
        const encodedText = new TextEncoder().encode(formula);
        offsetByteView.set([...encodedText, 0]);
        const res = executeFormula(
            formula.length
        );
        console.log('got ', res);
    }

    const textArea = document.querySelector("textarea");
    if (textArea) {
        textArea.oninput = (e) => {
            const element = e?.target as HTMLTextAreaElement;
            formula = element?.value;
            submitFormulaToWasm();
        }
    }
}

window.onload = async function() {
    await main();
};