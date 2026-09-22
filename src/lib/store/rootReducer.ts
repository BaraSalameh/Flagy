import { combineReducers } from "redux";
import geoGuessSlice from "@/features/games/geo-guess/model/geo-guess-slice";
import mapMasterSlice from "@/features/games/map-master/model/map-master-slice";
import outlineExplorerSlice from "@/features/games/outline-explorer/model/outline-explorer-slice";

const rootReducer = combineReducers({
    geoGuess: geoGuessSlice,
    mapMaster: mapMasterSlice,
    outlineExplorer: outlineExplorerSlice,
});

export default rootReducer;
