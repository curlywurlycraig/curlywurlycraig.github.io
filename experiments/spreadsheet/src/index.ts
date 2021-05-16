declare var doLisp: Function;

const MAX_ROWS = 20;
const MAX_COLS = 20;

async function main() {
    let selectedRow = 0;
    let selectedCol = 0;
    let selectedElement: Element = null;

    const cellSource: string[][] = [...Array(MAX_ROWS)].map(() => Array(MAX_COLS).fill(null));
    const cellComputed: string[][] = [...Array(MAX_ROWS)].map(() => Array(MAX_COLS).fill(null));

    const createTableElement = () => {
        const tableElement: HTMLTableElement = document.querySelector('table');

        const headRowEl = document.createElement('tr');
        cellSource[0].forEach((_, i) => {
            const headCellEl = document.createElement('th');
            headCellEl.className = "celllabel";

            headCellEl.innerHTML = i > 0 ? String.fromCharCode('A'.charCodeAt(0) + i - 1) : '';
            headRowEl.appendChild(headCellEl);
        })
        tableElement.appendChild(headRowEl);

        cellSource.forEach(((row, rowIndex) => {
            const rowEl = document.createElement('tr');

            const rowLabelEl = document.createElement('td');
            rowLabelEl.className = "celllabel";
            rowLabelEl.innerHTML = String(rowIndex);
            rowEl.appendChild(rowLabelEl);

            row.forEach((column) => {
                const divEl = document.createElement('div');
                const cellEl = document.createElement('td');
                cellEl.appendChild(divEl);
                divEl.className = "editcell";
                rowEl.appendChild(cellEl);
            });
            tableElement.appendChild(rowEl)
        }));
    }

    createTableElement();

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
    const envSetCell = result.instance.exports.envSetCell as CallableFunction;

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

    window.doLisp = evalLisp;

    const functionInput: HTMLTextAreaElement = document.querySelector("#functionarea");

    const computeCell = (row: number, col: number) => {
        const source = cellSource[row][col];
        if (source && source.startsWith("(")) {
            const result = evalLisp(source);
            cellComputed[row][col] = result;
            envSetCell(row, col, result);
        } else {
            cellComputed[row][col] = source;
            envSetCell(row, col, source);
        }
    }

    functionInput.addEventListener('change', (e) => {
        const element = e?.target as HTMLTextAreaElement;
        const formula = element?.value;

        cellSource[selectedRow][selectedCol] = formula;
        computeCells();
        renderCellContents();
    });

    const allEditCells: NodeListOf<Element> = document.querySelectorAll(".editcell");

    // Iterate through cells and calculate what should be displayed in them
    const renderCellContents = () => {
        if (allEditCells.length) {
            allEditCells.forEach((editCell, index) => {
                const col = index % MAX_COLS;
                const row = Math.floor(index / MAX_COLS);

                editCell.innerHTML = cellComputed[row][col];
            });
        }
    }

    // TODO Encode dependencies. Right now, cells which depend on ones "after" them
    // (as read from left to right and top to bottom) will see the old computed value
    const computeCells = () => {
        if (allEditCells.length) {
            allEditCells.forEach((editCell, index) => {
                const col = index % MAX_COLS;
                const row = Math.floor(index / MAX_COLS);

                computeCell(row, col);
            });
        }
    }

    if (allEditCells.length) {
        allEditCells.forEach((editCell, index) => {
            editCell.addEventListener('click', (e) => {
                selectedCol = index % MAX_COLS;
                selectedRow = Math.floor(index / MAX_COLS);

                functionInput.value = cellSource[selectedRow][selectedCol];
                functionInput.focus();
                if (selectedElement) {
                    selectedElement.classList.remove("selected");
                }

                editCell.classList.add("selected");
                selectedElement = editCell;
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