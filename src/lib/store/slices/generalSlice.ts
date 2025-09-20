import { createSlice } from '@reduxjs/toolkit';
import { GeneralState } from './types.slices';

const initialState = { gameStarted: false } as GeneralState;

const generalSlice = createSlice({
    name: 'general',
    initialState,
    reducers: {
        setCounter: (state, action: {payload: GeneralState["counter"]}) => ({
            ...state,
            counter: action.payload
        }),
        decrementCounter: (state) => ({
            ...state,
            counter: state.counter - 1
        }),
        setDifficulty: (state, action: {payload: GeneralState["difficulty"]}) => ({
            ...state,
            difficulty: action.payload
        }),
        setGameStarted: (state, action: {payload: GeneralState['gameStarted']}) => ({
            ...state,
            gameStarted: action.payload
        }),
        clearGeneral: () => ({gameStarted: false} as GeneralState)
    }
});

export const { setCounter, decrementCounter, setDifficulty, clearGeneral, setGameStarted } = generalSlice.actions;
export default generalSlice.reducer;
