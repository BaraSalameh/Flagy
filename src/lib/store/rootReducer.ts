import { combineReducers } from "redux";
import generalSlice from "./slices/generalSlice";
import countrySlice from "./slices/countrySlice";
import hintSlice from "./slices/hintSlice";

const rootReducer = combineReducers({
    general: generalSlice,
    country: countrySlice,
    hint: hintSlice,
});

export default rootReducer;