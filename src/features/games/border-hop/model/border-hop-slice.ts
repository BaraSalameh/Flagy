import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GameDifficulty, GameStatus } from "@/shared/types/game";
import {
    BORDER_HOP_RULES,
    findShortestPath,
    type BorderHopPuzzle,
} from "./rules";

interface BorderHopState {
    status: GameStatus;
    difficulty: GameDifficulty;
    puzzle: BorderHopPuzzle | null;
    path: string[];
    invalidCode: string | null;
    hintsUsed: number;
    feedback: string;
}

const initialState: BorderHopState = {
    status: "idle",
    difficulty: "Beginner",
    puzzle: null,
    path: [],
    invalidCode: null,
    hintsUsed: 0,
    feedback: "",
};

const appendCountry = (state: BorderHopState, countryCode: string) => {
    const puzzle = state.puzzle;
    const currentCode = state.path.at(-1);
    if (!puzzle || !currentCode || countryCode === currentCode) return;

    const visitedIndex = state.path.indexOf(countryCode);
    if (visitedIndex >= 0) {
        state.path = state.path.slice(0, visitedIndex + 1);
        state.invalidCode = null;
        state.feedback = `Backtracked to ${puzzle.start.countryCode === countryCode ? puzzle.start.countryName : "an earlier stop"}.`;
        return;
    }
    if (!puzzle.neighbors[currentCode]?.includes(countryCode)) {
        state.invalidCode = countryCode;
        state.feedback = "Those countries do not share a land border.";
        return;
    }
    if (state.path.length - 1 >= puzzle.maxMoves) {
        state.invalidCode = null;
        state.feedback =
            "Your route is at its move limit. Undo a stop to try another way.";
        return;
    }

    state.path.push(countryCode);
    state.invalidCode = null;
    if (countryCode === puzzle.destination.countryCode) {
        state.status = "won";
        state.feedback = "Route complete!";
    } else {
        state.feedback = "Border crossed. Choose the next neighboring country.";
    }
};

const slice = createSlice({
    name: "borderHop",
    initialState,
    reducers: {
        startRound: (
            _state,
            {
                payload,
            }: PayloadAction<{
                puzzle: BorderHopPuzzle;
                difficulty: GameDifficulty;
            }>,
        ): BorderHopState => ({
            ...initialState,
            status: "playing",
            difficulty: payload.difficulty,
            puzzle: payload.puzzle,
            path: [payload.puzzle.start.countryCode],
            feedback:
                "Select a country that shares a border with your current stop.",
        }),
        selectCountry: (state, { payload }: PayloadAction<string>) => {
            if (state.status !== "playing") return;
            appendCountry(state, payload);
        },
        undoStop: (state) => {
            if (state.status !== "playing" || state.path.length <= 1) return;
            state.path.pop();
            state.invalidCode = null;
            state.feedback =
                "Last stop removed. Choose another neighboring country.";
        },
        resetPath: (state) => {
            if (state.status !== "playing" || !state.puzzle) return;
            state.path = [state.puzzle.start.countryCode];
            state.invalidCode = null;
            state.feedback =
                "Route reset. Choose a country bordering the start.";
        },
        useHint: (state) => {
            if (state.status !== "playing" || !state.puzzle) return;
            const rules = BORDER_HOP_RULES[state.difficulty];
            if (state.hintsUsed >= rules.hints) return;
            const current = state.path.at(-1)!;
            const path = findShortestPath(
                state.puzzle.neighbors,
                current,
                state.puzzle.destination.countryCode,
            );
            const next = path[1];
            if (!next) return;
            state.hintsUsed += 1;
            appendCountry(state, next);
            if (state.status === "playing")
                state.feedback =
                    "Hint added the next stop on a shortest route.";
        },
        giveUp: (state) => {
            if (state.status !== "playing") return;
            state.status = "lost";
            state.invalidCode = null;
            state.feedback = "The shortest route is now highlighted.";
        },
        prepareRound: (state) => {
            state.status = "idle";
        },
        clearBorderHop: () => initialState,
    },
});

export const {
    startRound,
    selectCountry,
    undoStop,
    resetPath,
    useHint,
    giveUp,
    prepareRound,
    clearBorderHop,
} = slice.actions;
export default slice.reducer;
