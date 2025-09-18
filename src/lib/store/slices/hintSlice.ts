import { createSlice } from '@reduxjs/toolkit';
import { InfoData } from './types.slices';

const initialState = {} as InfoData;

const hintSlice = createSlice({
    name: 'hint',
    initialState,
    reducers: {
        setHint: (state, action: {payload: InfoData}) => (state = {...action.payload}),
        clearHint: () => ({} as InfoData)
    }
});

export const { setHint, clearHint } = hintSlice.actions;
export default hintSlice.reducer;
