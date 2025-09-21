// src/games/map/utils/index.ts
import dynamic from 'next/dynamic';

export const GeoJsonRenderer = dynamic(() => import('@/games/map/shared/components/GeoJsonRenderer').then((mod) => mod.GeoJsonRenderer),{ ssr: false });

export { getRandomCountry } from './utils/getRandomCountry';