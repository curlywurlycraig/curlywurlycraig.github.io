import { RNG, cyrb128, mulberry32 } from "./rand";
import { getWins } from "./storage";

export enum Difficulty {
    EASY,
    HARD
}

export enum Operator {
    DIV,
    ADD,
    MUL,
    SUB
}

export const operators = [Operator.ADD, Operator.SUB, Operator.MUL, Operator.DIV];
export const operatorFunctions = {
    [Operator.DIV]: (a, b) => a / b,
    [Operator.ADD]: (a, b) => a + b,
    [Operator.MUL]: (a, b) => a * b,
    [Operator.SUB]: (a, b) => a - b,
};

// What users are allowed to do.
export const operatorValidators = {
    [Operator.DIV]: (a, b) => {
        if (a % b !== 0) {
            throw new Error("Division must have no remainder.")
        }
    },
    [Operator.SUB]: (a, b) => {
        if (a - b <= 0) {
            throw new Error("Subtraction must not result in a negative number.")
        }
    },
    [Operator.ADD]: (a, b) => { },
    [Operator.MUL]: (a, b) => { },
};

// Guide what sorts of targets can be generated
export const gameCreationOperatorValidators = {
    [Operator.DIV]: (a, b) => a % b === 0,
    [Operator.SUB]: (a, b) => a - b > 0,
    [Operator.ADD]: (a, b) => true,
    [Operator.MUL]: (a, b) => a * b < 100,
};

export const hardGameCreationOperatorValidators = {
    [Operator.DIV]: (a, b) => a % b === 0,
    [Operator.SUB]: (a, b) => a - b > 0,
    [Operator.ADD]: (a, b) => true,
    [Operator.MUL]: (a, b) => a * b < 500,
};

export const operatorString = {
    [Operator.DIV]: "÷",
    [Operator.SUB]: "−",
    [Operator.ADD]: "+",
    [Operator.MUL]: "×"
}

const easyNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 20];
const mediumNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 20, 25, 30, 35, 40, 45, 50];
const hardNumbers = new Array(50).fill(null).map((_, i) => i + 1);


export interface GameState {
    error: string | null,
    history: (number | null)[][],
    originalNumberOptions: (number | null)[],
    target: number,
    selectedOperandIdx: number | null,
    selectedOperator: Operator | null,
    currentDate: Date | null,
    wins: [boolean, boolean]
}

const produceTarget = (numberOptions: (number | null)[], rng: RNG, difficulty: Difficulty): number => {
	// Pick one of the number options and set it as result R.
	let selectedIndex = Math.floor(rng() * numberOptions.length);
	let result = numberOptions[selectedIndex];
	numberOptions = [
		...numberOptions.slice(0, selectedIndex),
		...numberOptions.slice(selectedIndex + 1)
	];

    const iterations = difficulty === Difficulty.EASY ? 3 : 5;
    const difficultyAdjustedValidators = difficulty === Difficulty.EASY ? gameCreationOperatorValidators : hardGameCreationOperatorValidators;

	console.log('start with:', result);

	// Iterate N times:
	for (let i = 0; i < iterations; i++) {
		let selectedIndex = Math.floor(rng() * numberOptions.length);
		const operand = numberOptions[selectedIndex];
		// try each operation in turn
		for (let op = 0; op < 4; op++) {
            const chosenIdx = Math.floor(rng() * 4);
			const opType = operators[chosenIdx];
			if (difficultyAdjustedValidators[opType](result, operand)) {
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

const produceNumberOptions = (rng: RNG, difficulty: Difficulty): number[] => {
	const result: number[] = [];
    const numbers = difficulty === Difficulty.EASY ? easyNumbers : mediumNumbers;
	for (let i = 0; i < 6; i++) {
        const chosenIdx = Math.floor(rng() * numbers.length);
		result.push(numbers[chosenIdx]);
	}
	return result;
};

export const newGame = (difficulty: Difficulty, currentDate: Date): GameState => {
	// TODO make it possible to navigate to past days
	// currentDate.setDate(currentDate.getDate()+1);

	const currentDateStr = currentDate.toDateString();
    const rngSeed = cyrb128(currentDateStr)[0];
    const rng = mulberry32(rngSeed);
	console.log("Current date: ", currentDateStr);
	console.log("PRNG: ", rngSeed);

    const numberOptions = produceNumberOptions(rng, difficulty);
	console.log('use:', numberOptions);
	const target = produceTarget(numberOptions, rng, difficulty);
	const wins = getWins(currentDate);

    return {
        error: null,
        history: [numberOptions],
        originalNumberOptions: numberOptions,
        target: target,
        selectedOperandIdx: null,
        selectedOperator: null,
        currentDate: currentDate,
        wins,
    };
}
