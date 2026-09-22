import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { InfoData } from "@/shared/types/country";
import type { GameDifficulty, GameStatus } from "@/shared/types/game";
import { GEO_GUESS_RULES } from "./rules";

interface GeoGuessState {
    status: GameStatus;
    difficulty: GameDifficulty;
    target: InfoData | null;
    guesses: string[];
    remainingGuesses: number;
}

const initialState: GeoGuessState = {
    status: "idle",
    difficulty: "Beginner",
    target: null,
    guesses: [],
    remainingGuesses: 0,
};

const slice = createSlice({
    name: "geoGuess",
    initialState,
    reducers: {
        startRound: (
            _state,
            {
                payload,
            }: PayloadAction<{ country: InfoData; difficulty: GameDifficulty }>,
        ): GeoGuessState => ({
            status: "playing",
            difficulty: payload.difficulty,
            target: payload.country,
            guesses: [],
            remainingGuesses: GEO_GUESS_RULES[payload.difficulty].guesses,
        }),
        submitGuess: (state, { payload: code }: PayloadAction<string>) => {
            if (
                state.status !== "playing" ||
                !state.target ||
                !code ||
                state.guesses.includes(code)
            )
                return;
            state.guesses.push(code);
            state.remainingGuesses -= 1;
            if (code === state.target.countryCode) state.status = "won";
            else if (state.remainingGuesses === 0) state.status = "lost";
        },
        // Keep the previous target only to avoid an immediate repeat on replay.
        prepareRound: (state) => {
            state.status = "idle";
            state.guesses = [];
            state.remainingGuesses = 0;
        },
        clearGeoGuess: () => initialState,
    },
});

export const { startRound, submitGuess, prepareRound, clearGeoGuess } =
    slice.actions;
export default slice.reducer;
