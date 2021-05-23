var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var CellValueType;
(function (CellValueType) {
    CellValueType[CellValueType["CELL_UNSET"] = 0] = "CELL_UNSET";
    CellValueType[CellValueType["CELL_NUM"] = 1] = "CELL_NUM";
    CellValueType[CellValueType["CELL_STR"] = 2] = "CELL_STR";
})(CellValueType || (CellValueType = {}));
const MAX_ROWS = 20;
const MAX_COLS = 20;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let selectedRow = null;
        let selectedCol = null;
        let selectedColHead = null;
        let selectedElement = null;
        const cellSource = [...Array(MAX_ROWS)].map(() => Array(MAX_COLS).fill(null));
        const colHeadSource = Array(MAX_COLS).fill(null);
        const createTableElement = () => {
            const tableElement = document.querySelector('table');
            const headRowEl = document.createElement('tr');
            cellSource[0].forEach((_, i) => {
                const headCellEl = document.createElement('th');
                headCellEl.className = "celllabel";
                headCellEl.innerHTML = i > 0 ? String.fromCharCode('A'.charCodeAt(0) + i - 1) : '';
                headRowEl.appendChild(headCellEl);
            });
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
                tableElement.appendChild(rowEl);
            }));
        };
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
                prints: (strPtr) => console.log(fromAscii(strPtr)),
                printf: console.log,
                printd: console.log,
                printi: console.log,
                sin: Math.sin,
                cos: Math.cos,
                tan: Math.tan
            },
        };
        function fromAscii(strPtr) {
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
        const result = yield WebAssembly.instantiateStreaming(fetch('./dist/main.wasm'), imports);
        const init = result.instance.exports.init;
        const getInputPtr = result.instance.exports.getInputPointer;
        const executeFormulaForCell = result.instance.exports.executeFormulaForCell;
        const executeFormulaForCol = result.instance.exports.executeFormulaForCol;
        const envSetDoubleCell = result.instance.exports.envSetDoubleCell;
        const envGetCell = result.instance.exports.envGetCell;
        init();
        const evalLisp = (formula, row, col) => {
            const ptr = getInputPtr();
            const offsetByteView = new Uint8Array(memory.buffer, ptr, formula.length + 1);
            const encodedText = new TextEncoder().encode(formula);
            offsetByteView.set([...encodedText, 0]);
            executeFormulaForCell(row, col);
        };
        const evalLispForCol = (formula, col) => {
            const ptr = getInputPtr();
            const offsetByteView = new Uint8Array(memory.buffer, ptr, formula.length + 1);
            const encodedText = new TextEncoder().encode(formula);
            offsetByteView.set([...encodedText, 0]);
            executeFormulaForCol(col);
            renderCellContents();
        };
        function readCell(cellPtr) {
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
        const getComputedCell = (row, col) => {
            const cellPtr = envGetCell(row, col);
            const cellValue = readCell(cellPtr);
            if (cellValue) {
                return String(cellValue.val);
            }
            return "";
        };
        window.doLisp = evalLisp;
        window.doColLisp = evalLispForCol;
        const functionInput = document.querySelector("#functionarea");
        const computeCell = (row, col) => {
            const source = cellSource[row][col];
            if (source === null || source === void 0 ? void 0 : source.startsWith("(")) {
                evalLisp(source, row, col);
            }
            else if (source !== null && source !== "") {
                envSetDoubleCell(row, col, source);
            }
        };
        functionInput.addEventListener('change', (e) => {
            const element = e === null || e === void 0 ? void 0 : e.target;
            const formula = element === null || element === void 0 ? void 0 : element.value;
            if (selectedColHead !== null) {
                colHeadSource[selectedColHead] = formula;
            }
            else {
                cellSource[selectedRow][selectedCol] = formula;
            }
            computeCells();
            renderCellContents();
        });
        const allEditCells = document.querySelectorAll(".editcell");
        const allColumnLabelCells = document.querySelectorAll("th");
        const renderCellContents = () => {
            if (allEditCells.length) {
                allEditCells.forEach((editCell, index) => {
                    const col = index % MAX_COLS;
                    const row = Math.floor(index / MAX_COLS);
                    editCell.innerHTML = getComputedCell(row, col);
                });
            }
        };
        const computeCells = () => {
            if (allColumnLabelCells.length) {
                allColumnLabelCells.forEach((_, index) => {
                    let indexNotIncludingTopLeft = index - 1;
                    const source = colHeadSource[indexNotIncludingTopLeft];
                    if (source === null || source === void 0 ? void 0 : source.startsWith("(")) {
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
        };
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
                if (index === 0)
                    return;
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
    });
}
window.onload = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield main();
    });
};
//# sourceMappingURL=index.js.map