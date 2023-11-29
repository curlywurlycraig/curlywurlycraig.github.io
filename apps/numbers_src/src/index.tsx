import { render } from 'preact';
import { getWins, winDate } from "./storage";
import { Day } from "./components/day";
import './style.css';
import { useState } from 'preact/hooks';
import { Difficulty, GameState, newGame, operatorFunctions, operatorString, operatorValidators, operators } from './game';

const initialDifficulty = Difficulty.EASY;
const initialGame = newGame(initialDifficulty, new Date());

const Game = () => {
	const [gameState, setGameState] = useState<GameState>(initialGame);
	const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

	const numberOptions = gameState.history[gameState.history.length - 1];

	const onSelectDifficulty = (newDifficulty: Difficulty) => {
		if (newDifficulty === difficulty) {
			return;
		}

		setDifficulty(newDifficulty);
		setGameState(newGame(newDifficulty, currentDate));
	};

	const onClickOption = (optIdx) => {
		if (gameState.selectedOperandIdx === optIdx) {
			setGameState({
				...gameState,
				selectedOperandIdx: null
			});
		} else if (gameState.selectedOperator !== null && gameState.selectedOperandIdx !== null) {
			const operandA = numberOptions[gameState.selectedOperandIdx];
			const operandB = numberOptions[optIdx];
			try {
				operatorValidators[gameState.selectedOperator](operandA, operandB);
				
				const operatorFunc = operatorFunctions[gameState.selectedOperator];
				let newOptions = [
					...numberOptions,
				];
				newOptions[optIdx] = operatorFunc(operandA, operandB);
				newOptions[gameState.selectedOperandIdx] = null;

				let wins = gameState.wins;
				if (newOptions.includes(gameState.target)) {
					winDate(gameState.currentDate, difficulty);
					wins = getWins(gameState.currentDate);
				}

				setGameState({
					...gameState,
					error: null,
					history: [...gameState.history, newOptions],
					selectedOperator: null,
					selectedOperandIdx: optIdx,
					wins
				});
			} catch (e) {
				const error = e.toString().slice("Error: ".length);
				setGameState({
					...gameState,
					error
				});
			}
		} else {
			setGameState({
				...gameState,
				selectedOperandIdx: optIdx,
			});
		}
	};

	const onClickOperator = (op) => {
		if (gameState.selectedOperator === op) {
			setGameState({
				...gameState,
				selectedOperator: null
			});
		} else {
			setGameState({
				...gameState,
				selectedOperator: op
			});
		}
	};

	const onClickReset = () => {
		setGameState({
			...gameState,
			history: [gameState.originalNumberOptions],
			selectedOperandIdx: null,
			selectedOperator: null
		});
	}

	const onClickUndo = () => {
		setGameState({
			...gameState,
			history: gameState.history.slice(0, gameState.history.length-1),
			selectedOperandIdx: null,
			selectedOperator: null
		});
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
			onClick={() => onClickOption(optIdx)}>
				{opt || "0"}
		</button>
	});

	const operatorButtons = operators.map(op => {
		let className = "option-button";
		if (op === gameState.selectedOperator) {
			className += " selected";
		}

		return <button
			disabled={gameState.selectedOperandIdx === null}
			class={className}
			onClick={() => onClickOperator(op)}>
				{operatorString[op]}
		</button>;
	});

	let winMessage: string | null = null;
	if (numberOptions.includes(gameState.target)) {
		winMessage = ' 🎉';
	}

	return <div id="game-container">
		<Day
			date={gameState.currentDate}
			wins={gameState.wins}
			onSelectDifficulty={onSelectDifficulty}
		/>
		<div class="target-container">
			<h1 class="target">{`${gameState.target + (winMessage || "")}`}</h1>
		</div>
		<div class="option-buttons-outer-container">
			<div class="option-buttons-container">
				{numberButtons}
			</div>
		</div>
		<div class="operator-buttons-container">
			{operatorButtons}
		</div>
		<div class="errors-container">
			{gameState.error ? <p>{gameState.error}</p> : null}
		</div>
		<div class="extra-buttons-container">
			<button class="secondary" onClick={onClickReset}>Reset</button>
			<button class="secondary" onClick={onClickUndo} disabled={gameState.history.length <= 1}>Undo</button>
		</div>
	</div>;
}

addEventListener("DOMContentLoaded", (event) => {
	render(<Game />, document.getElementById("game-container"));
});

// TODO Difficulty selector
// TODO Show current date and button to switch between yesterday and today
// TODO Calendar view?
// TODO Show move history
// TODO Fix 0 flicker
