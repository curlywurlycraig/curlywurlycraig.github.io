declare var doLisp: Function;
declare var doColLisp: Function;

// Must match the same enum from C
enum CellValueType {
    CELL_UNSET,
    CELL_NUM,
    CELL_STR
}

type CellValue = {
    type: CellValueType,
    val: (number | string)
}

const MAX_ROWS = 20;
const MAX_COLS = 20;

async function main() {
    let selectedRow: number = null;
    let selectedCol: number = null;
    let selectedColHead: number = null;

    let selectedElement: Element = null;

    const cellSource: string[][] = [...Array(MAX_ROWS)].map(() => Array(MAX_COLS).fill(null));
    const colHeadSource: string[] = Array(MAX_COLS).fill(null);

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
    const intView = new Uint32Array(memory.buffer);

    const imports = {
        env: {
            memory,
            prints: (strPtr: number) => console.log(fromAscii(strPtr)),
            printf: console.log,
            printd: console.log,
            printi: console.log,
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
    const executeFormulaForCell = result.instance.exports.executeFormulaForCell as CallableFunction;
    const executeFormulaForCol = result.instance.exports.executeFormulaForCol as CallableFunction;
    const envSetDoubleCell = result.instance.exports.envSetDoubleCell as CallableFunction;
    const envGetCell = result.instance.exports.envGetCell as CallableFunction;

    init();

    const evalLisp = (formula: string, row: number, col: number) => {
        const ptr = getInputPtr();
        const offsetByteView = new Uint8Array(memory.buffer, ptr, formula.length + 1);
        const encodedText = new TextEncoder().encode(formula);
        offsetByteView.set([...encodedText, 0]);
        executeFormulaForCell(
            row,
            col
        );
    }

    const evalLispForCol = (formula: string, col: number) => {
        const ptr = getInputPtr();
        const offsetByteView = new Uint8Array(memory.buffer, ptr, formula.length + 1);
        const encodedText = new TextEncoder().encode(formula);
        offsetByteView.set([...encodedText, 0]);
        executeFormulaForCol(
            col
        );
        renderCellContents();
    }

    function readCell(cellPtr: number): CellValue {
        const type = intView[cellPtr >> 2];

        if (type === CellValueType.CELL_NUM) {
            const valPtr = (cellPtr >> 3) + 1;
            return {
                type,
                val: doubleView[valPtr]
            };
        }

        return null;
    }

    // Read the computed cell from WASM.
    // This involves understanding the memory layout of the
    // struct and unmarshalling it.
    const getComputedCell = (row: number, col: number) => {
        const cellPtr = envGetCell(row, col);
        const cellValue = readCell(cellPtr);

        if (cellValue) {
            return String(cellValue.val);
        }

        return "";
    }

    window.doLisp = evalLisp;
    window.doColLisp = evalLispForCol;

    const functionInput: HTMLTextAreaElement = document.querySelector("#functionarea");

    const computeCell = (row: number, col: number) => {
        const source = cellSource[row][col];
        if (source?.startsWith("(")) {
            evalLisp(source, row, col);
        } else if (source !== null && source !== "") {
            envSetDoubleCell(row, col, source);
        }
    }

    functionInput.addEventListener('change', (e) => {
        const element = e?.target as HTMLTextAreaElement;
        const formula = element?.value;

        if (selectedColHead !== null) {
            colHeadSource[selectedColHead] = formula;
        } else {
            cellSource[selectedRow][selectedCol] = formula;
        }

        computeCells();
        renderCellContents();
    });

    const allEditCells: NodeListOf<Element> = document.querySelectorAll(".editcell");
    const allColumnLabelCells: NodeListOf<Element> = document.querySelectorAll("th");

    // Iterate through cells and calculate what should be displayed in them
    const renderCellContents = () => {
        if (allEditCells.length) {
            allEditCells.forEach((editCell, index) => {
                const col = index % MAX_COLS;
                const row = Math.floor(index / MAX_COLS);

                editCell.innerHTML = getComputedCell(row, col);
            });
        }
    }

    // TODO Encode dependencies. Right now, cells which depend on ones "after" them
    // (as read from left to right and top to bottom) will see the old computed value
    const computeCells = () => {
        if (allColumnLabelCells.length) {
            allColumnLabelCells.forEach((_, index) => {
                let indexNotIncludingTopLeft = index - 1;
                const source = colHeadSource[indexNotIncludingTopLeft];

                if (source?.startsWith("(")) {
                    evalLispForCol(source, indexNotIncludingTopLeft);
                }
            });
        }

        if (allEditCells.length) {
            allEditCells.forEach((_, index) => {
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
                selectedColHead = null;

                functionInput.value = cellSource[selectedRow][selectedCol];
                functionInput.focus();
                if (selectedElement) {
                    selectedElement.classList.remove("selected");
                }

                editCell.classList.add("selected");
                selectedElement = editCell;
            });
        });
    }


    if (allColumnLabelCells.length) {
        allColumnLabelCells.forEach((labelCell, index) => {
            // this is that top left one. In the future, could
            // do formulas that return matrices
            if (index === 0) return;

            labelCell.addEventListener('click', (e) => {
                selectedColHead = index - 1;
                selectedCol = null;
                selectedRow = null;

                functionInput.value = colHeadSource[selectedColHead];
                functionInput.focus();
                if (selectedElement) {
                    selectedElement.classList.remove("selected");
                }

                labelCell.classList.add("selected");
                selectedElement = labelCell;
            });
        });
    }
}

window.onload = async function() {
    await main();
};