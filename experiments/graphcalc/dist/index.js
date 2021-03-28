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
        const graphInfo = {
            centerX: 0,
            centerY: 0,
            pixelsPerUnit: 400
        };
        const interactionInfo = {
            lastDragXPos: 0,
            lastDragYPos: 0,
            isDragging: false,
            pointers: {}
        };
        let formula = "";
        const graph = document.querySelector("#graph");
        const graphContext = graph.getContext("2d");
        graphContext.lineWidth = 1;
        const setSampleBrush = () => {
            graphContext.strokeStyle = '#e4a85c';
        };
        const setAxisBrush = () => {
            graphContext.strokeStyle = '#aaaadd';
        };
        const setGridLineBrush = () => {
            graphContext.strokeStyle = '#333366';
        };
        const setMajorGridLineBrush = () => {
            graphContext.strokeStyle = '#7777aa';
        };
        const memory = new WebAssembly.Memory({
            initial: 200,
            maximum: 200
        });
        const byteView = new Uint8Array(memory.buffer);
        const doubleView = new Float64Array(memory.buffer);
        function getScreenXPosFromUnit(unit) {
            return unit * graphInfo.pixelsPerUnit + graph.width / 2.0 - graphInfo.centerX * graphInfo.pixelsPerUnit;
        }
        function getScreenYPosFromUnit(unit) {
            return -1 * unit * graphInfo.pixelsPerUnit + graphInfo.centerY * graphInfo.pixelsPerUnit + graph.height / 2.0;
        }
        function isMultiple(big, small) {
            if (Math.abs(Math.round(big / small) - (big / small)) < 0.0001) {
                return true;
            }
            return false;
        }
        function findZeros(a) {
            let numeralCounter = a;
            let numeralCount = 0;
            if (numeralCounter > 1) {
                while (numeralCounter > 1) {
                    numeralCounter = numeralCounter / 10;
                    numeralCount++;
                }
            }
            else {
                numeralCount += 1;
                while (numeralCounter < 1) {
                    numeralCounter = numeralCounter * 10;
                    numeralCount--;
                }
            }
            return numeralCount;
        }
        function renderYSamples(resultsPtr) {
            graphContext.clearRect(0, 0, graph.width, graph.height);
            setGridLineBrush();
            const numeralCount = findZeros(graphInfo.pixelsPerUnit / 2);
            const sep = 1 / Math.pow(10, numeralCount - 2);
            const alignedXCenter = Math.ceil(graphInfo.centerX / sep) * sep;
            const verticalGridLineCount = Math.floor((1 / sep) * graph.width / graphInfo.pixelsPerUnit) + 1;
            const leftmostGridLine = alignedXCenter - sep * Math.ceil(verticalGridLineCount / 2);
            for (let i = 0; i < verticalGridLineCount; i++) {
                graphContext.beginPath();
                const xPosUnit = leftmostGridLine + i * sep;
                const gridXPos = getScreenXPosFromUnit(xPosUnit);
                if (isMultiple(xPosUnit, sep * 10)) {
                    setMajorGridLineBrush();
                }
                else {
                    setGridLineBrush();
                }
                graphContext.moveTo(gridXPos, 0);
                graphContext.lineTo(gridXPos, graph.height);
                graphContext.stroke();
                graphContext.closePath();
            }
            setGridLineBrush();
            const alignedYCenter = Math.ceil(graphInfo.centerY / sep) * sep;
            const horizontalGridLineCount = Math.floor((1 / sep) * graph.height / graphInfo.pixelsPerUnit) + 1;
            const topMostGridLine = alignedYCenter + sep * Math.ceil(horizontalGridLineCount / 2);
            for (let i = horizontalGridLineCount; i > 0; i--) {
                graphContext.beginPath();
                const yPosUnit = topMostGridLine - i * sep;
                const gridYPos = getScreenYPosFromUnit(yPosUnit);
                if (isMultiple(yPosUnit, sep * 10)) {
                    setMajorGridLineBrush();
                }
                else {
                    setGridLineBrush();
                }
                graphContext.moveTo(0, gridYPos);
                graphContext.lineTo(graph.width, gridYPos);
                graphContext.stroke();
                graphContext.closePath();
            }
            setAxisBrush();
            graphContext.beginPath();
            const yAxisYPos = graphInfo.centerY * graphInfo.pixelsPerUnit + graph.height / 2.0;
            const xAxisXPos = graph.width / 2.0 - graphInfo.centerX * graphInfo.pixelsPerUnit;
            graphContext.moveTo(0, yAxisYPos);
            graphContext.lineTo(graph.width, yAxisYPos);
            graphContext.moveTo(xAxisXPos, 0);
            graphContext.lineTo(xAxisXPos, graph.height);
            graphContext.stroke();
            graphContext.closePath();
            setSampleBrush();
            graphContext.beginPath();
            const startIndex = resultsPtr >> 3;
            const firstYPos = graph.height / 2.0 + (graphInfo.centerY - doubleView[startIndex]) * graphInfo.pixelsPerUnit;
            graphContext.moveTo(0, firstYPos);
            for (let i = startIndex + 1; i < graph.width + startIndex; i++) {
                const yPos = graph.height / 2.0 + (graphInfo.centerY - doubleView[i]) * graphInfo.pixelsPerUnit;
                const clampedYPos = Math.max(Math.min(yPos, Number.MAX_VALUE), -1);
                graphContext.lineTo(i - startIndex, clampedYPos);
            }
            graphContext.stroke();
            graphContext.closePath();
        }
        const imports = {
            env: {
                memory,
                prints: (strPtr) => console.log(fromAscii(strPtr)),
                printf: console.log,
                printd: console.log,
                draw: (resultsPtr) => renderYSamples(resultsPtr),
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
        init();
        const submitFormulaToWasm = () => {
            const ptr = getInputPtr();
            const offsetByteView = new Uint8Array(memory.buffer, ptr, formula.length + 1);
            const encodedText = new TextEncoder().encode(formula);
            offsetByteView.set([...encodedText, 0]);
            executeFormula(formula.length, graphInfo.centerX - (graph.width / (2 * graphInfo.pixelsPerUnit)), graphInfo.centerX + (graph.width / (2 * graphInfo.pixelsPerUnit)), graph.width);
        };
        const textArea = document.querySelector("textarea");
        if (textArea) {
            textArea.oninput = (e) => {
                const element = e === null || e === void 0 ? void 0 : e.target;
                formula = element === null || element === void 0 ? void 0 : element.value;
                submitFormulaToWasm();
            };
        }
        graph.onmousedown = (e) => {
            interactionInfo.isDragging = true;
            interactionInfo.lastDragXPos = e.x;
            interactionInfo.lastDragYPos = e.y;
        };
        graph.onmouseup = (e) => {
            interactionInfo.isDragging = false;
        };
        graph.onmousemove = (e) => {
            if (!interactionInfo.isDragging)
                return;
            graphInfo.centerX -= 2 * (e.x - interactionInfo.lastDragXPos) / graphInfo.pixelsPerUnit;
            graphInfo.centerY += 2 * (e.y - interactionInfo.lastDragYPos) / graphInfo.pixelsPerUnit;
            submitFormulaToWasm();
            interactionInfo.lastDragXPos = e.x;
            interactionInfo.lastDragYPos = e.y;
        };
        graph.onwheel = (e) => {
            graphInfo.pixelsPerUnit -= e.deltaY * graphInfo.pixelsPerUnit * 0.01;
            submitFormulaToWasm();
            e.preventDefault();
        };
        graph.onpointerdown = (e) => {
            interactionInfo.pointers[e.pointerId] = e;
            if (Object.keys(interactionInfo.pointers).length === 1) {
                interactionInfo.isDragging = true;
                interactionInfo.lastDragXPos = e.x;
                interactionInfo.lastDragYPos = e.y;
            }
        };
        graph.onpointermove = (e) => {
            const allKeys = Object.keys(interactionInfo.pointers);
            if (allKeys.length === 2) {
                let firstPointer = interactionInfo.pointers[Number(allKeys[0])];
                let secondPointer = interactionInfo.pointers[Number(allKeys[1])];
                const oldDistance = Math.sqrt(Math.pow((secondPointer.x - firstPointer.x), 2) + Math.pow((secondPointer.y - firstPointer.y), 2));
                interactionInfo.pointers[e.pointerId] = e;
                firstPointer = interactionInfo.pointers[Number(allKeys[0])];
                secondPointer = interactionInfo.pointers[Number(allKeys[1])];
                const newDistance = Math.sqrt(Math.pow((secondPointer.x - firstPointer.x), 2) + Math.pow((secondPointer.y - firstPointer.y), 2));
                console.log('it actually is haha');
            }
            else if (allKeys.length === 1) {
                graphInfo.centerX -= 2 * (e.x - interactionInfo.lastDragXPos) / graphInfo.pixelsPerUnit;
                graphInfo.centerY += 2 * (e.y - interactionInfo.lastDragYPos) / graphInfo.pixelsPerUnit;
                submitFormulaToWasm();
                interactionInfo.lastDragXPos = e.x;
                interactionInfo.lastDragYPos = e.y;
            }
        };
        graph.onpointerup = (e) => {
            delete interactionInfo.pointers[e.pointerId];
            if (Object.keys(interactionInfo.pointers).length === 0) {
                interactionInfo.isDragging = false;
            }
        };
        graph.onpointercancel = graph.onpointerup;
        graph.onpointerout = graph.onpointerup;
        graph.onpointerleave = graph.onpointerup;
        const resizeGraph = () => {
            graph.width = window.innerWidth * 2;
            graph.height = window.innerHeight * 2;
            submitFormulaToWasm();
        };
        window.onresize = () => {
            resizeGraph();
        };
        resizeGraph();
    });
}
window.onload = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield main();
    });
};
//# sourceMappingURL=index.js.map