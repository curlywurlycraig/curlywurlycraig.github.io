var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const MAX_ROWS = 20;
const MAX_COLS = 20;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let selectedRow = 0;
        let selectedCol = 0;
        let selectedElement = null;
        const cellSource = [...Array(MAX_ROWS)].map(() => Array(MAX_COLS).fill(null));
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
        const imports = {
            env: {
                memory,
                prints: (strPtr) => console.log(fromAscii(strPtr)),
                printf: console.log,
                printd: console.log,
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
        const executeFormula = result.instance.exports.executeFormula;
        const envSetCell = result.instance.exports.envSetCell;
        const envGetCell = result.instance.exports.envGetCell;
        init();
        const evalLisp = (formula) => {
            const ptr = getInputPtr();
            const offsetByteView = new Uint8Array(memory.buffer, ptr, formula.length + 1);
            const encodedText = new TextEncoder().encode(formula);
            offsetByteView.set([...encodedText, 0]);
            const res = executeFormula(formula.length);
            return res;
        };
        const getComputedCell = (row, col) => envGetCell(row, col);
        window.doLisp = evalLisp;
        const functionInput = document.querySelector("#functionarea");
        const computeCell = (row, col) => {
            const source = cellSource[row][col];
            if (source && source.startsWith("(")) {
                const result = evalLisp(source);
                envSetCell(row, col, result);
            }
            else {
                envSetCell(row, col, source);
            }
        };
        functionInput.addEventListener('change', (e) => {
            const element = e === null || e === void 0 ? void 0 : e.target;
            const formula = element === null || element === void 0 ? void 0 : element.value;
            cellSource[selectedRow][selectedCol] = formula;
            computeCells();
            renderCellContents();
        });
        const allEditCells = document.querySelectorAll(".editcell");
        const renderCellContents = () => {
            if (allEditCells.length) {
                allEditCells.forEach((editCell, index) => {
                    const col = index % MAX_COLS;
                    const row = Math.floor(index / MAX_COLS);
                    if (cellSource[row][col] !== null) {
                        editCell.innerHTML = getComputedCell(row, col);
                    }
                });
            }
        };
        const computeCells = () => {
            if (allEditCells.length) {
                allEditCells.forEach((editCell, index) => {
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
                    functionInput.value = cellSource[selectedRow][selectedCol];
                    functionInput.focus();
                    if (selectedElement) {
                        selectedElement.classList.remove("selected");
                    }
                    editCell.classList.add("selected");
                    selectedElement = editCell;
                });
                const onApplyChanges = (e) => {
                    const element = e === null || e === void 0 ? void 0 : e.target;
                    const formula = element === null || element === void 0 ? void 0 : element.innerText;
                    if (!formula || !formula.startsWith("("))
                        return;
                    evalLisp(formula);
                };
                editCell.addEventListener('onblur', onApplyChanges);
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