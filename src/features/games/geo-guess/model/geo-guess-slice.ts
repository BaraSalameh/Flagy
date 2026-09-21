import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { InfoData } from "@/shared/types/country";
interface Hint {
    information: InfoData | null;
    message: string | string[] | undefined;
}
interface GeoGuessState {
    currentCountry: string;
    randomCountry: string;
    hint: Hint;
}
const initialGeoGuessState: GeoGuessState = {
    currentCountry: "",
    randomCountry: "",
    hint: { information: null, message: undefined },
};
const slice = createSlice({
    name: "geoGuess",
    initialState: initialGeoGuessState,
    reducers: {
        setCurrentCountry: (state, action: PayloadAction<string>) => {
            state.currentCountry = action.payload;
        },
        setRandomCountry: (state, action: PayloadAction<string>) => {
            state.randomCountry = action.payload;
        },
        setHintInformations: (state, action: PayloadAction<InfoData>) => {
            state.hint.information = action.payload;
        },
        setHintMessage: (
            state,
            action: PayloadAction<string | string[] | undefined>,
        ) => {
            state.hint.message = action.payload;
        },
        clearGeoGuess: () => initialGeoGuessState,
    },
});
export const {
    setCurrentCountry,
    setRandomCountry,
    setHintInformations,
    setHintMessage,
    clearGeoGuess,
} = slice.actions;
export default slice.reducer;
