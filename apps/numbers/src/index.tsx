import { cyrb128 } from "./rand";
import { hic, render, apply } from "./vdom";

enum Operator {
  DIV,
  ADD,
  MUL,
  SUB
}

const operators = [Operator.ADD, Operator.SUB, Operator.MUL, Operator.DIV];
const operatorFunctions = {
  [Operator.DIV]: (a, b) => a / b,
  [Operator.ADD]: (a, b) => a + b,
  [Operator.MUL]: (a, b) => a * b,
  [Operator.SUB]: (a, b) => a - b,
};

// What users are allowed to do.
const operatorValidators = {
  [Operator.DIV]: (a, b) => a % b === 0,
  [Operator.SUB]: (a, b) => a - b > 0,
  [Operator.ADD]: (a, b) => true,
  [Operator.MUL]: (a, b) => true,
};

// Guide what sorts of targets can be generated
const gameCreationOperatorValidators = {
  [Operator.DIV]: (a, b) => a % b === 0,
  [Operator.SUB]: (a, b) => a - b > 0,
  [Operator.ADD]: (a, b) => true,
  [Operator.MUL]: (a, b) => a * b < 100,
};


const operatorString = {
  [Operator.DIV]: "÷",
  [Operator.SUB]: "–",
  [Operator.ADD]: "+",
  [Operator.MUL]: "×"
}

const easyNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 20];
const mediumNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 20, 25, 30, 35, 40, 45, 50];
const hardNumbers = new Array(50).fill(null).map((_, i) => i+1);

interface GameState {
  history: number[][],
  originalNumberOptions: number[],
  target: number,
  selectedOperandIdx: number,
  selectedOperator: Operator
}

const gameState: GameState = {
  history: [],
  originalNumberOptions: [],
  target: 0,
  selectedOperandIdx: null,
  selectedOperator: null
};

const Game = () => {
  const numberOptions = gameState.history[gameState.history.length - 1];

  const onClickOption = (optIdx) => {
    if (gameState.selectedOperandIdx === optIdx) {
      gameState.selectedOperandIdx = null;
    } else if (gameState.selectedOperator !== null && gameState.selectedOperandIdx !== null) {
      const operandA = numberOptions[gameState.selectedOperandIdx];
      const operandB = numberOptions[optIdx];
      if (!operatorValidators[gameState.selectedOperator](operandA, operandB)) {;
        // TODO Show an error to the user
        console.error("cannot perform requested operation.");
        return;
      }

      const operatorFunc = operatorFunctions[gameState.selectedOperator];
      let newOptions = [
        ...numberOptions,
      ];
      newOptions[optIdx] = operatorFunc(operandA, operandB);
      newOptions[gameState.selectedOperandIdx] = null;
      gameState.history.push(newOptions);

      gameState.selectedOperator = null;
      gameState.selectedOperandIdx = optIdx;
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
  }

  const onClickUndo = () => {
    gameState.history.pop();
    gameState.selectedOperandIdx = null;
    gameState.selectedOperator = null;
    renderGame();
  }

  const numberButtons = numberOptions.map((opt, optIdx) => {
    let className = "option-button";
    if (optIdx === gameState.selectedOperandIdx) {
      className += " selected";
    }
    if (opt === null) {
      className += " placeholder";
    }

    return <button
      disabled={opt === null}
      class={className}
      click={() => onClickOption(optIdx)}>{ opt || "0" }</button>
  });

  const operatorButtons = operators.map(op => {
    let className = "option-button";
    if (op === gameState.selectedOperator) {
      className += " selected";
    }

    return <button disabled={gameState.selectedOperandIdx === null} class={className} click={() => onClickOperator(op)}>{ operatorString[op] }</button>
  });

  let winMessage = null;
  if (numberOptions.includes(gameState.target)) {
    winMessage = ' 🎉';
  }

  return <div id="game-container">
    <div class="target-container">
      <h1 class="target">{ `${gameState.target + winMessage}` }</h1>
    </div>
    <div class="option-buttons-outer-container">
      <div class="option-buttons-container">
        { numberButtons }
      </div>
    </div>
    <div class="operator-buttons-container">
      { operatorButtons }
    </div>
    <div class="extra-buttons-container">
      <button class="secondary" click={onClickReset}>Reset</button>
      <button class="secondary" click={onClickUndo} disabled={gameState.history.length <= 1}>Undo</button>
    </div>
  </div>;
}

const produceTarget = (numberOptions: number[], iterations: number, rng: number): number => {
  // Pick one of the number options and set it as result R.
  let selectedIndex = rng % numberOptions.length;
  let result = numberOptions[selectedIndex];
  numberOptions = [
    ...numberOptions.slice(0, selectedIndex),
    ...numberOptions.slice(selectedIndex + 1)
  ];

  console.log('start with:', result);

  // Iterate N times:
  for (let i = 0; i < iterations; i++) {
    let selectedIndex = (rng + rng * (i+1)) % numberOptions.length;
    const operand = numberOptions[selectedIndex];
    // try each operation in turn
    for (let op = 0; op < 4; op++) {
      const opType = operators[(rng + rng * op) % 4];
      if (gameCreationOperatorValidators[opType](result, operand)) {
        console.log('perform:', operatorString[opType], operand);
        result = operatorFunctions[opType](result, operand);
        numberOptions = [
          ...numberOptions.slice(0, selectedIndex),
          ...numberOptions.slice(selectedIndex + 1)
        ];
        break;
      }
    }
  }

  console.log('result:', result);
  return result;
}

const produceNumberOptions = (rng: number): number[] => {
  const result = [];
  for (let i = 0; i < 6; i++) {
    result.push(easyNumbers[(rng + rng * i) % easyNumbers.length]);
  }
  return result;
};

const renderGame = () => {
  const gameContent = document.getElementById("game-container");
  apply(render(<Game />), gameContent);
};

const loadGame = () => {
  const currentDate = new Date();

  // TODO make it possible to navigate to past days
  // currentDate.setDate(currentDate.getDate()+1);

  const currentDateStr = currentDate.toDateString();
  const rng = cyrb128(currentDateStr)[0];
  console.log("Current date: ", currentDateStr);
  console.log("PRNG: ", rng);

  gameState.originalNumberOptions = produceNumberOptions(rng);
  gameState.history = [gameState.originalNumberOptions];
  console.log('use:', gameState.originalNumberOptions);
  gameState.target = produceTarget(gameState.originalNumberOptions, 3, rng);
  console.log(gameState.target);
  renderGame();
}

window.onload = loadGame;

// TODO Difficulty selector
// TODO Store progress in localstorage
// TODO Explain invalid moves to player
// TODO Show current date and button to switch between yesterday and today
// TODO Calendar view?
// TODO Fix 0 flicker