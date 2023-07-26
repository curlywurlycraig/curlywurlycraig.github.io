(() => {
  // src/rand.js
  function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
      k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
    h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
    h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
    h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
    return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
  }

  // src/vdom.ts
  var HicType = class extends Array {
  };
  var FUNC_TOKEN = "function";
  function isHic(a) {
    return a instanceof HicType;
  }
  var hic = (name, options, ...children) => {
    const flatChildren = children.reduce((acc, child) => {
      if (Array.isArray(child) && !isHic(child)) {
        acc.push(...child);
      } else {
        acc.push(child);
      }
      return acc;
    }, []);
    return new HicType(name, options || {}, flatChildren);
  };
  var render = (hic2, key = "__r") => {
    if (!isHic(hic2)) {
      return hic2;
    }
    const [tag, attrs, children] = hic2;
    attrs.key = attrs.key || key;
    const renderedChildren = children.map((child, idx) => {
      return render(child, key + "c" + (child?.[1]?.key || idx));
    });
    if (typeof tag === FUNC_TOKEN) {
      const renderResult = tag({ ...attrs, children: renderedChildren });
      return render(renderResult, key + "e" + (renderResult?.key || ""));
    }
    return new HicType(tag, attrs, renderedChildren);
  };
  var updateAttrs = (el, attrs) => {
    const [, prevAttrs] = el._hic || [];
    Object.entries(attrs).forEach(([k, v]) => {
      if (prevAttrs && typeof prevAttrs[k] === FUNC_TOKEN) {
        el.removeEventListener(k, prevAttrs[k]);
      }
      if (typeof v === FUNC_TOKEN) {
        el.addEventListener(k.toLowerCase(), v);
      } else {
        if (k === "value" || k === "disabled") {
          el[k] = v;
          return;
        }
        const asElement = el;
        if (asElement.getAttribute(k) !== v) {
          asElement.setAttribute(k, v);
        }
      }
    });
    if (!prevAttrs) {
      return el;
    }
    Object.entries(prevAttrs).forEach(([k, v]) => {
      if (!attrs || !attrs[k]) {
        if (typeof v === FUNC_TOKEN) {
          el.removeEventListener(k, prevAttrs[k]);
        } else {
          el.removeAttribute(k);
        }
      }
    });
    return el;
  };
  var updateChildren = (el, newChildren) => {
    for (let i = newChildren.length - 1; i >= 0; i--) {
      const currChild = newChildren[i];
      const desiredNextSibling = newChildren[i + 1] || null;
      const existingNextSibling = currChild.nextSibling;
      if (desiredNextSibling !== existingNextSibling || !el.contains(currChild)) {
        el?.insertBefore(currChild, desiredNextSibling);
      }
    }
    while (el.childNodes.length > newChildren.length) {
      el?.removeChild(el.childNodes[0]);
    }
    return el;
  };
  var apply = (hic2, el) => {
    let result = el;
    if (!hic2 && hic2 !== "") {
      return null;
    }
    if (!isHic(hic2)) {
      if (el?.nodeType !== 3) {
        return document.createTextNode(hic2);
      }
      if (el.textContent !== hic2) {
        el.textContent = hic2;
      }
      return el;
    }
    const [prevTag, prevAttrs] = el?._hic || [];
    const [tag, attrs] = hic2;
    if (prevTag !== tag || !result) {
      const currentNS = attrs.xmlns || (tag === "svg" ? "http://www.w3.org/2000/svg" : "http://www.w3.org/1999/xhtml");
      result = document.createElementNS(currentNS, tag);
    }
    updateAttrs(result, attrs);
    result._hic = hic2;
    const children = isHic(hic2) ? hic2[2] : [];
    const newChildren = children.filter((c) => c).map((child, idx) => {
      const existingNode = el?.childNodes[idx];
      return apply(child, existingNode);
    });
    updateChildren(result, newChildren);
    if (el !== result) {
      el?.parentNode?.replaceChild(result, el);
    }
    if (typeof attrs.ref === FUNC_TOKEN && attrs.ref !== prevAttrs?.ref) {
      attrs.ref(result, attrs.key);
    }
    return result;
  };

  // src/index.tsx
  var operators = [1 /* ADD */, 3 /* SUB */, 2 /* MUL */, 0 /* DIV */];
  var operatorFunctions = {
    [0 /* DIV */]: (a, b) => a / b,
    [1 /* ADD */]: (a, b) => a + b,
    [2 /* MUL */]: (a, b) => a * b,
    [3 /* SUB */]: (a, b) => a - b
  };
  var operatorValidators = {
    [0 /* DIV */]: (a, b) => a % b === 0,
    [3 /* SUB */]: (a, b) => a - b > 0,
    [1 /* ADD */]: (a, b) => true,
    [2 /* MUL */]: (a, b) => true
  };
  var gameCreationOperatorValidators = {
    [0 /* DIV */]: (a, b) => a % b === 0,
    [3 /* SUB */]: (a, b) => a - b > 0,
    [1 /* ADD */]: (a, b) => true,
    [2 /* MUL */]: (a, b) => a * b < 100
  };
  var operatorString = {
    [0 /* DIV */]: "\xF7",
    [3 /* SUB */]: "\u2013",
    [1 /* ADD */]: "+",
    [2 /* MUL */]: "\u2022"
  };
  var easyNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 20];
  var hardNumbers = new Array(50).fill(null).map((_, i) => i + 1);
  var gameState = {
    history: [],
    originalNumberOptions: [],
    target: 0,
    selectedOperandIdx: null,
    selectedOperator: null
  };
  var Game = () => {
    const numberOptions = gameState.history[gameState.history.length - 1];
    const onClickOption = (optIdx) => {
      if (gameState.selectedOperandIdx === optIdx) {
        gameState.selectedOperandIdx = null;
      } else if (gameState.selectedOperator !== null && gameState.selectedOperandIdx !== null) {
        const operandA = numberOptions[gameState.selectedOperandIdx];
        const operandB = numberOptions[optIdx];
        if (!operatorValidators[gameState.selectedOperator](operandA, operandB)) {
          ;
          console.error("cannot perform requested operation.");
          return;
        }
        const operatorFunc = operatorFunctions[gameState.selectedOperator];
        let newOptions = [
          ...numberOptions
        ];
        newOptions[gameState.selectedOperandIdx] = operatorFunc(operandA, operandB);
        newOptions = [
          ...newOptions.slice(0, optIdx),
          ...newOptions.slice(optIdx + 1)
        ];
        gameState.history.push(newOptions);
        gameState.selectedOperator = null;
        if (optIdx < gameState.selectedOperandIdx) {
          gameState.selectedOperandIdx--;
        }
      } else {
        gameState.selectedOperandIdx = optIdx;
      }
      renderGame();
    };
    const onClickOperator = (op) => {
      if (gameState.selectedOperator === op) {
        gameState.selectedOperator = null;
      } else {
        gameState.selectedOperator = op;
      }
      renderGame();
    };
    const onClickReset = () => {
      gameState.history = [gameState.originalNumberOptions];
      gameState.selectedOperandIdx = null;
      gameState.selectedOperator = null;
      renderGame();
    };
    const onClickUndo = () => {
      gameState.history.pop();
      gameState.selectedOperandIdx = null;
      gameState.selectedOperator = null;
      renderGame();
    };
    const numberButtons = numberOptions.map((opt, optIdx) => {
      let className = "option-button";
      if (optIdx === gameState.selectedOperandIdx) {
        className += " selected";
      }
      return /* @__PURE__ */ hic("button", { class: className, click: () => onClickOption(optIdx) }, opt);
    });
    const operatorButtons = operators.map((op) => {
      let className = "option-button";
      if (op === gameState.selectedOperator) {
        className += " selected";
      }
      return /* @__PURE__ */ hic("button", { disabled: gameState.selectedOperandIdx === null, class: className, click: () => onClickOperator(op) }, operatorString[op]);
    });
    let winMessage = null;
    if (numberOptions.includes(gameState.target)) {
      winMessage = " \u{1F389}";
    }
    return /* @__PURE__ */ hic("div", { id: "game-container" }, /* @__PURE__ */ hic("div", { class: "target-container" }, /* @__PURE__ */ hic("h1", { class: "target" }, `${gameState.target + winMessage}`)), /* @__PURE__ */ hic("div", { class: "option-buttons-outer-container" }, /* @__PURE__ */ hic("div", { class: "option-buttons-container" }, numberButtons)), /* @__PURE__ */ hic("div", { class: "operator-buttons-container" }, operatorButtons), /* @__PURE__ */ hic("button", { class: "secondary", click: onClickReset }, "Reset"), /* @__PURE__ */ hic("button", { class: "secondary", click: onClickUndo, disabled: gameState.history.length <= 1 }, "Undo"));
  };
  var produceTarget = (numberOptions, iterations, rng) => {
    let selectedIndex = rng % numberOptions.length;
    let result = numberOptions[selectedIndex];
    numberOptions = [
      ...numberOptions.slice(0, selectedIndex),
      ...numberOptions.slice(selectedIndex + 1)
    ];
    console.log("start with:", result);
    for (let i = 0; i < iterations; i++) {
      let selectedIndex2 = (rng + rng * (i + 1)) % numberOptions.length;
      const operand = numberOptions[selectedIndex2];
      for (let op = 0; op < 4; op++) {
        const opType = operators[(rng + rng * op) % 4];
        if (gameCreationOperatorValidators[opType](result, operand)) {
          console.log("perform:", operatorString[opType], operand);
          result = operatorFunctions[opType](result, operand);
          numberOptions = [
            ...numberOptions.slice(0, selectedIndex2),
            ...numberOptions.slice(selectedIndex2 + 1)
          ];
          break;
        }
      }
    }
    console.log("result:", result);
    return result;
  };
  var produceNumberOptions = (rng) => {
    const result = [];
    for (let i = 0; i < 6; i++) {
      result.push(easyNumbers[(rng + rng * i) % easyNumbers.length]);
    }
    return result;
  };
  var renderGame = () => {
    const gameContent = document.getElementById("game-container");
    apply(render(/* @__PURE__ */ hic(Game, null)), gameContent);
  };
  var loadGame = () => {
    const currentDate = (/* @__PURE__ */ new Date()).toDateString();
    const rng = cyrb128(currentDate)[0];
    console.log("Current date: ", currentDate);
    console.log("PRNG: ", rng);
    gameState.originalNumberOptions = produceNumberOptions(rng);
    gameState.history = [gameState.originalNumberOptions];
    console.log("use:", gameState.originalNumberOptions);
    gameState.target = produceTarget(gameState.originalNumberOptions, 3, rng);
    console.log(gameState.target);
    renderGame();
  };
  window.onload = loadGame;
})();
