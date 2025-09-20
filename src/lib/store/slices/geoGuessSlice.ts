import { createSlice } from '@reduxjs/toolkit';
import { CountryState } from './types.slices';

const initialState = {} as CountryState;

const geoGuessSlice = createSlice({
    name: 'geoGuess',
    initialState,
    reducers: {
        setCurrentCountry: (state, action: {payload: CountryState['currentCountry']}) => ({
            ...state,
            currentCountry: action.payload
        }),
        setRandomCountry: (state, action: {payload: CountryState['randomCountry']}) => ({
            ...state,
            randomCountry: action.payload
        }),
        setResult: (state, action: {payload: CountryState['result']}) => ({
            ...state,
            result: action.payload
        }),
        clearCountry: () => ({} as CountryState)
    }
});

export const { setCurrentCountry, setRandomCountry, setResult, clearCountry } = geoGuessSlice.actions;
export default geoGuessSlice.reducer;
