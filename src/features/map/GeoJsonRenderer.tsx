import { GeoGuessMap } from "@/features/games/geo-guess/GeoGuessMap";
import { MapMasterMap } from "@/features/games/map-master/MapMasterMap";
import { OutlineMap } from "@/features/games/outline-explorer/OutlineMap";
import type { GeoJsonRendererProps } from "./types";

export const GeoJsonRenderer = ({ geoData, game }: GeoJsonRendererProps) => {
    switch (game) {
        case "geo-guess":
            return <GeoGuessMap geoData={geoData} />;
        case "map-master":
            return <MapMasterMap geoData={geoData} />;
        case "outline-explorer":
            return <OutlineMap geoData={geoData} />;
    }
};
