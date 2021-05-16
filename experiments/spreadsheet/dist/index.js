var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let selectedRow = 0;
        let selectedCol = 0;
        let selectedElement = null;
        const cellSource = [
            [null, null],
            [null, null]
        ];
        const cellComputed = [
            [null, null],
            [null, null]
        ];
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
                sin: Math.sin
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
        init();
        const evalLisp = (formula) => {
            const ptr = getInputPtr();
            const offsetByteView = new Uint8Array(memory.buffer, ptr, formula.length + 1);
            const encodedText = new TextEncoder().encode(formula);
            offsetByteView.set([...encodedText, 0]);
            const res = executeFormula(formula.length);
            return res;
        };
        window.doLisp = evalLisp;
        const functionInput = document.querySelector("#functionarea");
        functionInput.addEventListener('change', (e) => {
            console.log(cellSource, cellComputed);
            console.log(e);
            const element = e === null || e === void 0 ? void 0 : e.target;
            const formula = element === null || element === void 0 ? void 0 : element.value;
            cellSource[selectedRow][selectedCol] = formula;
            if (formula && formula.startsWith("(")) {
                const result = evalLisp(formula);
                cellComputed[selectedRow][selectedCol] = result;
                console.log("setting ", selectedRow, selectedCol, result);
                envSetCell(selectedRow, selectedCol, result);
            }
            else {
                cellComputed[selectedRow][selectedCol] = formula;
                console.log("setting ", selectedRow, selectedCol, formula);
                envSetCell(selectedRow, selectedCol, formula);
            }
            renderCellContents();
        });
        const allEditCells = document.querySelectorAll(".editcell");
        const renderCellContents = () => {
            if (allEditCells.length) {
                allEditCells.forEach((editCell, index) => {
                    const col = index % 2;
                    const row = Math.floor(index / 2);
                    editCell.innerHTML = cellComputed[row][col];
                });
            }
        };
        if (allEditCells.length) {
            allEditCells.forEach((editCell, index) => {
                editCell.addEventListener('click', (e) => {
                    selectedCol = index % 2;
                    selectedRow = Math.floor(index / 2);
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