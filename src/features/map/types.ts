import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import type { GameSlug } from "@/shared/types/game";
export interface GeoJsonRendererProps {
    geoData: FeatureCollection<Geometry, GeoJsonProperties> | null;
    game: GameSlug;
}
export interface WorldMapProps {
    game: GameSlug;
}
