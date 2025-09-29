'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer } from 'react-leaflet';
import { GeoJsonRenderer } from '@/games/map/shared';
import { useLoadMapData } from '@/lib/contexts/hooks';
import { MapProps } from './types.shared';

export const Map = (props: MapProps) => {
    const geoData = useLoadMapData();

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
            className="h-full w-full z-0"
        >
            <GeoJsonRenderer geoData={geoData} game={props.game} />
        </MapContainer>
    );
};