import { h } from "preact";
import { Difficulty } from "../game";

interface StarProps {
    id: string,
    isWin: boolean
};

const Star = (props: StarProps) => {
    const {id, isWin} = props;
    const winClass = isWin ? "win-marker win" : "win-marker not-win";
    return <span id={id} class={winClass}>★</span>;
}

interface DayProps {
    date: Date,
    wins: [boolean, boolean],
    onSelectDifficulty: Function
}

export const Day = (props: DayProps) => {
    const { date, wins, onSelectDifficulty } = props;
    return <div class="day-container">
        <p class="day-date">
            { date.toDateString() }
            <Star id="day-win-0" isWin={wins[0]}>★</Star>
            <Star id="day-win-1" isWin={wins[1]}>★</Star>
        </p>
        <div class="day-container-difficulty-selector-container">
            <button class="difficulty-selector" onClick={() => onSelectDifficulty(Difficulty.EASY)}>
                Easy
                <Star id="day-win-0" isWin={wins[0]}>★</Star>
            </button>
            <button class="difficulty-selector" onClick={() => onSelectDifficulty(Difficulty.HARD)}>
                Hard
                <Star id="day-win-1" isWin={wins[1]}>★</Star>
            </button>
        </div>
    </div>
}