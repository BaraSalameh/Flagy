import { createSlice } from '@reduxjs/toolkit';
import { CountryState } from './types.slices';

const initialState = { gameStarted: false } as CountryState;

const countrySlice = createSlice({
    name: 'country',
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
        setGameStarted: (state, action: {payload: CountryState['gameStarted']}) => ({
            ...state,
            gameStarted: action.payload
        }),
        clearCountry: () => ({gameStarted: false} as CountryState)
    }
});

export const { setCurrentCountry, setRandomCountry, setResult, clearCountry, setGameStarted } = countrySlice.actions;
export default countrySlice.reducer;
