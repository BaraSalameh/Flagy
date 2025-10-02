import { createSlice } from '@reduxjs/toolkit';
import { MapMasterState } from './types.slices';

const initialState = { counter: 10 } as MapMasterState;

const mapMasterSlice = createSlice({
    name: 'mapMaster',
    initialState,
    reducers: {
        setCurrentCountry: (state, action: {payload: MapMasterState['currentCountry']}) => ({
            ...state,
            currentCountry: action.payload
        }),
        setRandomCountry: (state, action: {payload: MapMasterState['randomCountry']}) => ({
            ...state,
            randomCountry: action.payload
        }),
        setCounter: (state, action: {payload: MapMasterState["counter"]}) => ({
            ...state,
            counter: action.payload
        }),
        updateCounter: (state, action: {payload: MapMasterState["counter"]}) => ({
            ...state,
            counter: state.counter + action.payload
        }),
        setResult: (state, action: {payload: MapMasterState['result']}) => ({
            ...state,
            result: action.payload
        }),
        setIsTrueSelection: (state, action: {payload: MapMasterState['isTrueSelection']}) => ({
            ...state,
            isTrueSelection: action.payload
        }),
        clearMapMaster: () => ({ counter: 10 } as MapMasterState)
    }
});

export const { setCurrentCountry, setRandomCountry, setCounter, updateCounter, setResult, clearMapMaster, setIsTrueSelection } = mapMasterSlice.actions;
export default mapMasterSlice.reducer;
