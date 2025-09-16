'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer } from 'react-leaflet';
import { getGeoJson } from '@/games/country/utils';
import { GameProps } from './types.shared';
import { useLoadMapData } from '@/lib/contexts/hooks';

export const Map = (props: GameProps) => {
    const geoData = useLoadMapData();
    const geoJSON = getGeoJson(geoData, props);

    return (
        <MapContainer
            center={[20, 0]}
            zoom={3}
            minZoom={2}
            maxZoom={10}
            dragging={true}
            zoomControl={false}
            scrollWheelZoom={true}
            doubleClickZoom={true}
            maxBounds={[
                [-90, -180],
                [90, 180]
            ]}
            maxBoundsViscosity={1.0}
            className="h-full w-full"
        >
            {geoJSON}
        </MapContainer>
    );
};