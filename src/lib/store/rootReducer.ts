import { combineReducers } from "redux";
import generalSlice from "@/features/game-shell/model/session-slice";
import geoGuessSlice from "@/features/games/geo-guess/model/geo-guess-slice";
import mapMasterSlice from "@/features/games/map-master/model/map-master-slice";
import outlineExplorerSlice from "@/features/games/outline-explorer/model/outline-explorer-slice";

const rootReducer = combineReducers({
    general: generalSlice,
    geoGuess: geoGuessSlice,
    mapMaster: mapMasterSlice,
    outlineExplorer: outlineExplorerSlice,
});

export default rootReducer;
