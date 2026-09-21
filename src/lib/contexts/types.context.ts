import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import type { InfoData } from "@/shared/types/country";
export type MapDataStatus = "loading" | "ready" | "error";
export interface MapContextType {
    map: FeatureCollection<Geometry, GeoJsonProperties> | null;
    info: Record<string, InfoData> | null;
    status: MapDataStatus;
    error: string | null;
    retry: () => void;
}
