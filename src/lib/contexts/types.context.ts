import { GameDifficulty } from '@/components/shared/types.shared';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import React from 'react';

export interface InfoData {
    countryCode: string;
    countryName: string;
    currencyCode: string;
    population: string;
    capital: string;
    continentName: string;
    region: string;
    area: number;
    borders: string[],
    languages: string[],
    flag: string;
}

export type MapContextType = {
    map: FeatureCollection<Geometry, GeoJsonProperties> | null;
    info: Record<string, InfoData> | null;
};

export type DifficultyContextType = {
    difficulty: GameDifficulty;
    setDifficulty: React.Dispatch<React.SetStateAction<GameDifficulty>>;
};