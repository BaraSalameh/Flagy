'use client'

import { useEffect, useState } from "react";
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

export const useLoadGeoData = () => {
    const [geoData, setGeoData] = useState<FeatureCollection<Geometry, GeoJsonProperties> | null>(null);
    
    useEffect(() => {
        fetch('/data/countries.geo.json')
            .then(res => res.json())
            .then(data => setGeoData(data));
    }, []);

    return geoData;
}