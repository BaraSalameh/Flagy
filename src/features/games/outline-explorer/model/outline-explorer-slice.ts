import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
interface OutlineExplorerState {
    currentCountry: string;
    randomCountry: string;
    counter: number;
    randomCountries: string[];
}
const initialOutlineExplorerState: OutlineExplorerState = {
    currentCountry: "",
    randomCountry: "",
    counter: 0,
    randomCountries: [],
};
const slice = createSlice({
    name: "outlineExplore",
    initialState: initialOutlineExplorerState,
    reducers: {
        setCurrentCountry: (state, action: PayloadAction<string>) => {
            state.currentCountry = action.payload;
        },
        setRandomCountry: (state, action: PayloadAction<string>) => {
            state.randomCountry = action.payload;
        },
        setRandomCountries: (state, action: PayloadAction<string[]>) => {
            state.randomCountries = action.payload;
        },
        setCounter: (state, action: PayloadAction<number>) => {
            state.counter = action.payload;
        },
        updateCounter: (state, action: PayloadAction<number>) => {
            state.counter += action.payload;
        },
        clearOutlineExplorer: () => initialOutlineExplorerState,
    },
});
export const {
    setCurrentCountry,
    setRandomCountries,
    setRandomCountry,
    setCounter,
    updateCounter,
    clearOutlineExplorer,
} = slice.actions;
export default slice.reducer;
