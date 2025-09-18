import { createSlice } from '@reduxjs/toolkit';
import { GeneralState } from './types.slices';

const initialState = {} as GeneralState;

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
        clearGeneral: () => ({} as GeneralState)
    }
});

export const { setCounter, decrementCounter, setDifficulty, clearGeneral } = generalSlice.actions;
export default generalSlice.reducer;
