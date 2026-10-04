import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GameDifficulty, GameStatus } from "@/shared/types/game";
import { FLAG_FINDER_RULES, type FlagCountry } from "./rules";

interface FlagSelection {
    countryCode: string;
    countryName: string;
    correct: boolean;
}

export interface FlagFinderState {
    status: GameStatus;
    difficulty: GameDifficulty;
    deck: FlagCountry[];
    targetIndex: number;
    streak: number;
    attemptsRemaining: number;
    incorrectCodes: string[];
    lastSelection: FlagSelection | null;
    revealedAnswer: boolean;
}

const initialState: FlagFinderState = {
    status: "idle",
    difficulty: "Beginner",
    deck: [],
    targetIndex: 0,
    streak: 0,
    attemptsRemaining: FLAG_FINDER_RULES.Beginner.attempts,
    incorrectCodes: [],
    lastSelection: null,
    revealedAnswer: false,
};

export const getFlagTarget = (state: FlagFinderState) =>
    state.deck[state.targetIndex];

const slice = createSlice({
    name: "flagFinder",
    initialState,
    reducers: {
        startFlagFinder: (
            _state,
            action: PayloadAction<{
                deck: FlagCountry[];
                difficulty: GameDifficulty;
            }>,
        ): FlagFinderState => ({
            ...initialState,
            status: action.payload.deck.length ? "playing" : "idle",
            difficulty: action.payload.difficulty,
            deck: action.payload.deck,
            attemptsRemaining:
                FLAG_FINDER_RULES[action.payload.difficulty].attempts,
        }),
        submitFlagGuess: (
            state,
            action: PayloadAction<
                Pick<FlagCountry, "countryCode" | "countryName">
            >,
        ) => {
            const target = getFlagTarget(state);
            if (
                state.status !== "playing" ||
                !target ||
                state.lastSelection?.correct ||
                state.incorrectCodes.includes(action.payload.countryCode)
            )
                return;

            const correct = target.countryCode === action.payload.countryCode;
            state.lastSelection = { ...action.payload, correct };
            if (correct) {
                state.streak += 1;
                return;
            }

            state.incorrectCodes.push(action.payload.countryCode);
            state.attemptsRemaining -= 1;
            if (state.attemptsRemaining === 0) {
                state.status = "lost";
                state.revealedAnswer = true;
                return;
            }

            // Keep the game moving after a miss. The final miss stays on the
            // current target so its answer can still be revealed.
            state.targetIndex = (state.targetIndex + 1) % state.deck.length;
            state.incorrectCodes = [];
        },
        advanceFlag: (
            state,
            action: PayloadAction<{ replacementDeck?: FlagCountry[] }>,
        ) => {
            if (state.status !== "playing" || !state.lastSelection?.correct)
                return;
            if (state.targetIndex + 1 < state.deck.length) {
                state.targetIndex += 1;
            } else if (action.payload.replacementDeck?.length) {
                state.deck = action.payload.replacementDeck;
                state.targetIndex = 0;
            } else {
                return;
            }
            state.attemptsRemaining =
                FLAG_FINDER_RULES[state.difficulty].attempts;
            state.incorrectCodes = [];
            state.lastSelection = null;
            state.revealedAnswer = false;
        },
        prepareFlagFinder: (state) => {
            state.status = "idle";
        },
        clearFlagFinder: () => initialState,
    },
});

export const {
    startFlagFinder,
    submitFlagGuess,
    advanceFlag,
    prepareFlagFinder,
    clearFlagFinder,
} = slice.actions;
export default slice.reducer;
