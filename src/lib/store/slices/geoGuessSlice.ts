import { createSlice } from '@reduxjs/toolkit';
import { GeoGuessState } from './types.slices';

const initialState = {} as GeoGuessState;

const geoGuessSlice = createSlice({
    name: 'geoGuess',
    initialState,
    reducers: {
        setCurrentCountry: (state, action: {payload: GeoGuessState['currentCountry']}) => ({
            ...state,
            currentCountry: action.payload
        }),
        setRandomCountry: (state, action: {payload: GeoGuessState['randomCountry']}) => ({
            ...state,
            randomCountry: action.payload
        }),
        setHintInformations: (state, action: {payload: GeoGuessState['hint']['information']}) => ({
            ...state,
            hint: {
                ...state.hint,
                information: action.payload
            }
        }),
        setHintMessage: (state, action: {payload: GeoGuessState['hint']['message']}) => ({
            ...state,
            hint: {
                ...state.hint,
                message: action.payload
            }
        }),
        clearGeoGuess: () => ({} as GeoGuessState)
    }
});

export const { setCurrentCountry, setRandomCountry, setHintInformations, setHintMessage, clearGeoGuess } = geoGuessSlice.actions;
export default geoGuessSlice.reducer;
