
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { InfoData } from '../store/slices/types.slices';

export type MapContextType = {
    map: FeatureCollection<Geometry, GeoJsonProperties> | null;
    info: Record<string, InfoData> | null;
};