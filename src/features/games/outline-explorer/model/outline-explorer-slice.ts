import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GameStatus } from "@/shared/types/game";
import {
    getOutlineAnswer,
    OUTLINE_RULES,
    STARTING_SCORE,
    WINNING_SCORE,
    type OutlineChallenge,
    type OutlineDifficulty,
} from "./rules";

interface OutlineExplorerState {
    status: GameStatus;
    difficulty: OutlineDifficulty;
    challenges: OutlineChallenge[];
    challengeIndex: number;
    score: number;
    solved: boolean;
    incorrectCodes: string[];
    history: {
        countryName: string;
        targetName: string;
        correct: boolean;
        points: number;
    }[];
}
const initialState: OutlineExplorerState = {
    status: "idle",
    difficulty: "Beginner",
    challenges: [],
    challengeIndex: 0,
    score: STARTING_SCORE,
    solved: false,
    incorrectCodes: [],
    history: [],
};
export const getChallenge = (state: OutlineExplorerState) =>
    state.challenges[state.challengeIndex];

const slice = createSlice({
    name: "outlineExplorer",
    initialState,
    reducers: {
        startRound: (
            _state,
            {
                payload,
            }: PayloadAction<{
                challenges: OutlineChallenge[];
                difficulty: OutlineDifficulty;
            }>,
        ): OutlineExplorerState => ({
            ...initialState,
            status: payload.challenges.length ? "playing" : "idle",
            difficulty: payload.difficulty,
            challenges: payload.challenges,
        }),
        submitGuess: (state, { payload: code }: PayloadAction<string>) => {
            const challenge = getChallenge(state);
            const choice = challenge?.choices.find(
                (country) => country.countryCode === code,
            );
            if (
                state.status !== "playing" ||
                state.solved ||
                !challenge ||
                !choice ||
                state.incorrectCodes.includes(code)
            )
                return;
            const correct = code === challenge.target.countryCode;
            const rules = OUTLINE_RULES[state.difficulty];
            const nextScore = Math.max(
                0,
                Math.min(
                    WINNING_SCORE,
                    state.score + (correct ? rules.reward : -rules.penalty),
                ),
            );
            state.history.push({
                countryName: getOutlineAnswer(choice, state.difficulty),
                targetName: getOutlineAnswer(
                    challenge.target,
                    state.difficulty,
                ),
                correct,
                points: nextScore - state.score,
            });
            state.score = nextScore;
            state.solved = correct;
            if (!correct) state.incorrectCodes.push(code);
            if (nextScore === WINNING_SCORE) state.status = "won";
            else if (nextScore === 0) state.status = "lost";
        },
        nextChallenge: (state) => {
            if (state.status !== "playing" || !state.solved) return;
            state.challengeIndex =
                (state.challengeIndex + 1) % state.challenges.length;
            state.incorrectCodes = [];
            state.solved = false;
        },
        prepareRound: (state) => {
            state.status = "idle";
        },
        clearOutlineExplorer: () => initialState,
    },
});
export const {
    startRound,
    submitGuess,
    nextChallenge,
    prepareRound,
    clearOutlineExplorer,
} = slice.actions;
export default slice.reducer;
