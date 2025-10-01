import { createSlice } from '@reduxjs/toolkit';
import { OutlineExplorerState } from './types.slices';

const initialState = { counter: 10 } as OutlineExplorerState;

const outlineExplorerSlice = createSlice({
    name: 'outlineExplore',
    initialState,
    reducers: {
        setCurrentCountry: (state, action: {payload: OutlineExplorerState['currentCountry']}) => ({
            ...state,
            currentCountry: action.payload
        }),
        setRandomCountry: (state, action: {payload: OutlineExplorerState['randomCountry']}) => ({
            ...state,
            randomCountry: action.payload
        }),
        setRandomCountries: (state, action: {payload: OutlineExplorerState['randomCountries']}) => ({
            ...state,
            randomCountries: action.payload
        }),
        updateCounter: (state, action: {payload: OutlineExplorerState["counter"]}) => ({
            ...state,
            counter: state.counter + action.payload
        }),
        setResult: (state, action: {payload: OutlineExplorerState['result']}) => ({
            ...state,
            result: action.payload
        }),
        clearOutlineExplorer: () => ({ counter: 10 } as OutlineExplorerState)
    }
});

export const { setCurrentCountry, setRandomCountries, setRandomCountry, updateCounter, setResult, clearOutlineExplorer } = outlineExplorerSlice.actions;
export default outlineExplorerSlice.reducer;
