import { GameDifficulty } from '@/components/shared/types.shared';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import React from 'react';

export type MapContextType = {
    map: FeatureCollection<Geometry, GeoJsonProperties> | null;
};

export type DifficultyContextType = {
    difficulty: GameDifficulty;
    setDifficulty: React.Dispatch<React.SetStateAction<GameDifficulty>>;
};