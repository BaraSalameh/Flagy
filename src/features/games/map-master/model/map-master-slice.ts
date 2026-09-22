import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GameDifficulty, GameStatus } from "@/shared/types/game";
import {
    MAP_MASTER_RULES,
    MAX_GUESSES,
    STARTING_SCORE,
    WINNING_SCORE,
    type MapCountry,
} from "./rules";

interface Guess {
    countryCode: string;
    countryName: string;
    targetName: string;
    correct: boolean;
    points: number;
}

interface MapMasterState {
    status: GameStatus;
    difficulty: GameDifficulty;
    deck: MapCountry[];
    targetIndex: number;
    score: number;
    history: Guess[];
    incorrectCodes: string[];
}

const initialState: MapMasterState = {
    status: "idle",
    difficulty: "Beginner",
    deck: [],
    targetIndex: 0,
    score: STARTING_SCORE,
    history: [],
    incorrectCodes: [],
};

export const getTarget = (state: MapMasterState) =>
    state.deck[state.targetIndex];

const slice = createSlice({
    name: "mapMaster",
    initialState,
    reducers: {
        startRound: (
            _state,
            {
                payload,
            }: PayloadAction<{
                deck: MapCountry[];
                difficulty: GameDifficulty;
            }>,
        ): MapMasterState => ({
            ...initialState,
            status: payload.deck.length ? "playing" : "idle",
            difficulty: payload.difficulty,
            deck: payload.deck,
        }),
        submitGuess: (
            state,
            {
                payload,
            }: PayloadAction<Pick<MapCountry, "countryCode" | "countryName">>,
        ) => {
            const target = getTarget(state);
            if (
                state.status !== "playing" ||
                !target ||
                !payload.countryCode ||
                state.incorrectCodes.includes(payload.countryCode)
            )
                return;
            const lastGuess = state.history.at(-1);
            // A double click on the previous answer must not penalize the next question.
            if (
                lastGuess?.correct &&
                lastGuess.countryCode === payload.countryCode &&
                target.countryCode !== payload.countryCode &&
                state.incorrectCodes.length === 0
            )
                return;
            const correct = target.countryCode === payload.countryCode;
            const rules = MAP_MASTER_RULES[state.difficulty];
            const nextScore = Math.max(
                0,
                Math.min(
                    WINNING_SCORE,
                    state.score + (correct ? rules.reward : -rules.penalty),
                ),
            );
            state.history.push({
                ...payload,
                targetName: target.countryName,
                correct,
                points: nextScore - state.score,
            });
            state.score = nextScore;
            if (!correct) state.incorrectCodes.push(payload.countryCode);
            // A winning final guess takes precedence over exhausting the attempt budget.
            if (state.score === WINNING_SCORE) state.status = "won";
            else if (state.score === 0 || state.history.length >= MAX_GUESSES)
                state.status = "lost";
            else if (correct) {
                state.targetIndex = (state.targetIndex + 1) % state.deck.length;
                state.incorrectCodes = [];
            }
        },
        // Preserve the last target until startRound can avoid it as the next opener.
        prepareRound: (state) => {
            state.status = "idle";
        },
        clearMapMaster: () => initialState,
    },
});

export const { startRound, submitGuess, prepareRound, clearMapMaster } =
    slice.actions;
export default slice.reducer;
