import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GameDifficulty, GameStatus } from "@/shared/types/game";

interface SessionState {
    counter: number;
    difficulty: GameDifficulty;
    gameStarted: boolean;
    result: boolean;
    status: GameStatus;
}
export const initialSessionState: SessionState = {
    counter: 0,
    difficulty: "Beginner",
    gameStarted: false,
    result: false,
    status: "idle",
};
const sessionSlice = createSlice({
    name: "general",
    initialState: initialSessionState,
    reducers: {
        setCounter: (state, action: PayloadAction<number>) => {
            state.counter = action.payload;
        },
        updateCounter: (state, action: PayloadAction<number>) => {
            state.counter += action.payload;
        },
        setDifficulty: (state, action: PayloadAction<GameDifficulty>) => {
            state.difficulty = action.payload;
        },
        setGameStarted: (state, action: PayloadAction<boolean>) => {
            state.gameStarted = action.payload;
            state.status = action.payload ? "playing" : "idle";
        },
        setResult: (state, action: PayloadAction<boolean>) => {
            state.result = action.payload;
            state.status = action.payload ? "won" : "lost";
        },
        clearGeneral: () => initialSessionState,
    },
});
export const {
    setCounter,
    updateCounter,
    setDifficulty,
    setGameStarted,
    setResult,
    clearGeneral,
} = sessionSlice.actions;
export const selectDifficulty = (state: { general: SessionState }) =>
    state.general.difficulty;
export const selectGameStatus = (state: { general: SessionState }) =>
    state.general.status;
export default sessionSlice.reducer;
