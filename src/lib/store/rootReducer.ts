import { combineReducers } from "redux";
import generalSlice from "./slices/generalSlice";
import geoGuessSlice from "./slices/geoGuessSlice";
import hintSlice from "./slices/hintSlice";

const rootReducer = combineReducers({
    general: generalSlice,
    geoGuess: geoGuessSlice,
    hint: hintSlice,
});

export default rootReducer;