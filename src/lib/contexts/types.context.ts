import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

export type MapContextType = {
    map: FeatureCollection<Geometry, GeoJsonProperties> | null;
};