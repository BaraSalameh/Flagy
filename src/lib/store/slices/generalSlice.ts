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
        updateCounter: (state, action: {payload: GeneralState["counter"]}) => ({
            ...state,
            counter: state.counter + action.payload
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

export const { setCounter, updateCounter, setDifficulty, clearGeneral, setGameStarted } = generalSlice.actions;
export default generalSlice.reducer;
