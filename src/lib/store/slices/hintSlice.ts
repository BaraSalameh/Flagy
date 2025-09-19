import { createSlice } from '@reduxjs/toolkit';
import { HintState } from './types.slices';

const initialState = {} as HintState;

const hintSlice = createSlice({
    name: 'hint',
    initialState,
    reducers: {
        setInformations: (state, action: {payload: HintState['information']}) => ({
            ...state,
            information: action.payload
        }),
        setHint: (state, action: {payload: HintState['hint']}) => ({
            ...state,
            hint: action.payload
        }),
        clearHint: () => ({} as HintState)
    }
});

export const { setInformations, setHint, clearHint } = hintSlice.actions;
export default hintSlice.reducer;
