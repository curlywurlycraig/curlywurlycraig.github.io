async function main() {
    let selectedRow = 0;
    let selectedCol = 0;

    const cellSource: string[][] = [
        [null, null],
        [null, null]
    ]

    const cellComputed: string[][] = [
        [null, null],
        [null, null]
    ]

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
            printd: console.log,
            sin: Math.sin
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

    const evalLisp = (formula: string) => {
        const ptr = getInputPtr();
        const offsetByteView = new Uint8Array(memory.buffer, ptr, formula.length + 1);
        const encodedText = new TextEncoder().encode(formula);
        offsetByteView.set([...encodedText, 0]);
        const res = executeFormula(
            formula.length
        );
        return res;
    }

    const functionInput: HTMLTextAreaElement = document.querySelector("#functionarea");

    functionInput.addEventListener('change', (e) => {
        console.log(cellSource, cellComputed);
        console.log(e);
        const element = e?.target as HTMLTextAreaElement;
        const formula = element?.value;

        cellSource[selectedRow][selectedCol] = formula;
        if (formula && formula.startsWith("(")) {
            cellComputed[selectedRow][selectedCol] = evalLisp(formula);
        } else {
            cellComputed[selectedRow][selectedCol] = formula;
        }

        renderCellContents();
    });

    const allEditCells: NodeListOf<Element> = document.querySelectorAll(".editcell");

    // Iterate through cells and calculate what should be displayed in them
    const renderCellContents = () => {
        if (allEditCells.length) {
            allEditCells.forEach((editCell, index) => {
                selectedCol = index % 2;
                selectedRow = Math.floor(index / 2);

                editCell.innerHTML = cellComputed[selectedRow][selectedCol];
            });
        }
    }

    if (allEditCells.length) {
        allEditCells.forEach((editCell, index) => {
            editCell.addEventListener('click', (e) => {
                selectedCol = index % 2;
                selectedRow = Math.floor(index / 2);

                functionInput.value = cellSource[selectedRow][selectedCol];
                functionInput.focus();
            });

            // when enter is clicked, or on blur, and so on
            const onApplyChanges = (e: Event) => {
                const element = e?.target as HTMLTextAreaElement;
                const formula = element?.innerText;

                if (!formula || !formula.startsWith("(")) return;
                evalLisp(formula);
            }

            editCell.addEventListener('onblur', onApplyChanges);
        });
    }
}

window.onload = async function() {
    await main();
};