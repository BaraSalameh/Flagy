import { combineReducers } from "redux";
import generalSlice from "./slices/generalSlice";
import geoGuessSlice from "./slices/geoGuessSlice";
import hintSlice from "./slices/hintSlice";
import mapMasterSlice from './slices/mapMasterSlice';
import outlineExplorerSlice from './slices/outlineExplorerSlice';

const rootReducer = combineReducers({
    general: generalSlice,
    geoGuess: geoGuessSlice,
    hint: hintSlice,
    mapMaster: mapMasterSlice,
    outlineExplorer: outlineExplorerSlice
});

export default rootReducer;