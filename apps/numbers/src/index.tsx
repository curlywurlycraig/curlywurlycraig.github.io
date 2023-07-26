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

const operatorValidators = {
  [Operator.DIV]: (a, b) => a % b === 0,
  [Operator.SUB]: (a, b) => a - b > 0,
  [Operator.ADD]: (a, b) => true,
  [Operator.MUL]: (a, b) => true,
};

const operatorString = {
  [Operator.DIV]: "÷",
  [Operator.SUB]: "–",
  [Operator.ADD]: "+",
  [Operator.MUL]: "•"
}

const easyNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 20];
const mediumNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 20, 25, 30, 35, 40, 45, 50];
const hardNumbers = new Array(50).fill(null).map((_, i) => i+1);

interface GameState {
  numberOptions: number[],
  target: number,
  selectedOperandIdx: number,
  selectedOperator: Operator
}

const gameState: GameState = {
  numberOptions: [],
  target: 0,
  selectedOperandIdx: null,
  selectedOperator: null
};

const Game = () => {
  const onClickOption = (optIdx) => {
    if (gameState.selectedOperandIdx === optIdx) {
      gameState.selectedOperandIdx = null;
    } else if (gameState.selectedOperator !== null && gameState.selectedOperandIdx !== null) {
      const operandA = gameState.numberOptions[gameState.selectedOperandIdx];
      const operandB = gameState.numberOptions[optIdx];;
      if (!operatorValidators[gameState.selectedOperator](operandA, operandB)) {;
        // TODO Show an error to the user
        console.error("cannot perform requested operation.");
        return;
      }

      const operatorFunc = operatorFunctions[gameState.selectedOperator];
      gameState.numberOptions[gameState.selectedOperandIdx] = operatorFunc(operandA, operandB);
      gameState.numberOptions = [
        ...gameState.numberOptions.slice(0, optIdx),
        ...gameState.numberOptions.slice(optIdx+1)
      ];
      gameState.selectedOperandIdx = null;
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

  const numberButtons = gameState.numberOptions.map((opt, optIdx) => {
    let className = "option-button";
    if (optIdx === gameState.selectedOperandIdx) {
      className += " selected";
    }

    return <button class={className} click={() => onClickOption(optIdx)}>{ opt }</button>
  });

  const operatorButtons = operators.map(op => {
    let className = "option-button";
    if (op === gameState.selectedOperator) {
      className += " selected";
    }

    return <button class={className} click={() => onClickOperator(op)}>{ operatorString[op] }</button>
  });

  return <div id="game-container">
    <div class="target-container">
      <h1 class="target">{ gameState.target }</h1>
    </div>
    <div class="option-buttons-container">
      { numberButtons }
    </div>
    <div class="operator-buttons-container">
      { operatorButtons }
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
      if (operatorValidators[opType](result, operand)) {
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
  //    pick an operator at random, and pick a number option (O) at random. Apply the
  //    operator to R with O.
  //    note that the random operator and operand must be valid. A subtraction must produce a positive number
  //    and a division must divide with no remainder
  // Return R
  return result;
}

// TODO Remove this. It's just for debugging
window.produceTarget = produceTarget;

const produceNumberOptions = (rng: number): number[] => {
  const result = [];
  for (let i = 0; i < 6; i++) {
    result.push(easyNumbers[(rng + rng * i) % easyNumbers.length]);
  }
  return result;
};

// TODO Remove this. It's just for debugging
window.produceNumberOptions = produceNumberOptions;

const renderGame = () => {
  const gameContent = document.getElementById("game-container");
  apply(render(<Game />), gameContent);
};

const loadGame = () => {
  const currentDate = new Date().toDateString();
  const rng = cyrb128(currentDate)[0];
  console.log("Current date: ", currentDate);
  console.log("PRNG: ", rng);

  gameState.numberOptions = produceNumberOptions(rng);
  console.log('use:', gameState.numberOptions);
  gameState.target = produceTarget(gameState.numberOptions, 3, rng);
  console.log(gameState.target);
  renderGame();
}

window.onload = loadGame;