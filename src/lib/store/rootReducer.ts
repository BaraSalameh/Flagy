import { combineReducers } from "redux";
import generalSlice from "./slices/generalSlice";
import geoGuessSlice from "./slices/geoGuessSlice";
import mapMasterSlice from './slices/mapMasterSlice';
import outlineExplorerSlice from './slices/outlineExplorerSlice';

const rootReducer = combineReducers({
    general: generalSlice,
    geoGuess: geoGuessSlice,
    mapMaster: mapMasterSlice,
    outlineExplorer: outlineExplorerSlice
});

export default rootReducer;