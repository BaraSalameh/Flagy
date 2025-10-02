import { useLoadMapData } from "@/lib/contexts/hooks";
import { GameName } from "@/lib/types.lib";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";

export interface GeoJsonRendererProps {
    geoData: ReturnType<typeof useLoadMapData>;
    game: GameName
}

export interface GameStarterModalProps {
    title?: string;
    description: string;
}

export interface GameOverModalProps {
    thresholds: GameOverThresholds[];
    onClear: ActionCreatorWithoutPayload;
}
type GameOverThresholds = {
    condition: boolean;
    result: boolean;
    message: string;
}