import { combineReducers } from "redux";
import generalSlice from "./slices/generalSlice";
import geoGuessSlice from "./slices/geoGuessSlice";
import hintSlice from "./slices/hintSlice";
import mapMasterSlice from './slices/mapMasterSlice';

const rootReducer = combineReducers({
    general: generalSlice,
    geoGuess: geoGuessSlice,
    mapMaster: mapMasterSlice,
    hint: hintSlice,
});

export default rootReducer;