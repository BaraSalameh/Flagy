import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
interface MapMasterState {
    currentCountry: string;
    randomCountry: string;
    counter: number;
    isTrueSelection: boolean;
}
const initialMapMasterState: MapMasterState = {
    currentCountry: "",
    randomCountry: "",
    counter: 10,
    isTrueSelection: false,
};
const slice = createSlice({
    name: "mapMaster",
    initialState: initialMapMasterState,
    reducers: {
        setCurrentCountry: (state, action: PayloadAction<string>) => {
            state.currentCountry = action.payload;
        },
        setRandomCountry: (state, action: PayloadAction<string>) => {
            state.randomCountry = action.payload;
        },
        setCounter: (state, action: PayloadAction<number>) => {
            state.counter = action.payload;
        },
        updateCounter: (state, action: PayloadAction<number>) => {
            state.counter += action.payload;
        },
        setIsTrueSelection: (state, action: PayloadAction<boolean>) => {
            state.isTrueSelection = action.payload;
        },
        clearMapMaster: () => initialMapMasterState,
    },
});
export const {
    setCurrentCountry,
    setRandomCountry,
    setCounter,
    updateCounter,
    setIsTrueSelection,
    clearMapMaster,
} = slice.actions;
export default slice.reducer;
