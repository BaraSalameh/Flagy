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

export const useLoadInfoData = () => {
    const [infoData, setInfoData] = useState<Record<string, string>[] | null>(null);
    
    useEffect(() => {
        fetch('/data/countries.info.json')
            .then(res => res.json())
            .then(data => setInfoData(data));
    }, []);

    return infoData;
}

export const useLoadStatisticsData = () => {
    const [statisticsData, setStatisticsData] = useState<Record<string, string>[] | null>(null);
    
    useEffect(() => {
        fetch('/data/countries.statistics.json')
            .then(res => res.json())
            .then(data => setStatisticsData(data));
    }, []);

    return statisticsData;
}