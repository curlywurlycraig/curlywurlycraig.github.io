export interface GameSave {
    stars: Record<string, [boolean, boolean]>
};

function saveProgress(save: GameSave) {
    localStorage.setItem("progress", JSON.stringify(save));
}

function loadProgress(): GameSave | null {
    const loadedProgress = localStorage.getItem("progress");
    if (!loadedProgress) {
        return {
            stars: {}
        };
    }

    return JSON.parse(loadedProgress) as GameSave;
}

export function winDate(date: Date, difficultyIndex: number) {
    const save = loadProgress()!!;
    const dateString = date.toDateString();
    if (!save.stars[dateString]) {
        save.stars[dateString] = [false, false];
    }

    save.stars[dateString][difficultyIndex] = true;
    saveProgress(save);
}

export function getWins(date: Date): [boolean, boolean] {
    const save = loadProgress();
    if (save === null) {
        return [false, false];
    }

    const dateString = date.toDateString();
    return save.stars[dateString] || [false, false];
}