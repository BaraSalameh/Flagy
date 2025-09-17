import { GameDifficulty } from "@/components/shared/types.shared";
import { useLoadInfoData, useLoadMapData, useLoadStatisticsData } from "@/lib/contexts/hooks";
import React, { useEffect } from "react"

export const useGenerateRandomCountry = (difficulty: GameDifficulty, setCountryName: (countryName: string) => void, setHint: React.Dispatch<React.SetStateAction<Record<string, string> | null>>) => {
    const mapData = useLoadMapData();
    const infoData = useLoadInfoData();
    const statisticsData = useLoadStatisticsData();

    useEffect(() => {
        if (difficulty && mapData && infoData && statisticsData) {
            const randomIndex = Math.floor(Math.random() * mapData.features.length);
            const countryFeature = mapData.features[randomIndex];
            const countryName = countryFeature.properties?.name;
            const countryISO2 = countryFeature.properties?.ISO2;
            const countryISO3 = countryFeature.properties?.ISO3;
            const countryPopulation = infoData?.[countryISO2]?.population;
            const countryArea = statisticsData?.[countryISO3]?.area;
            const countryNeighbors = statisticsData?.[countryISO3]?.borders;

            setHint({
                iso2: countryISO2,
                iso3: countryISO3,
                population: countryPopulation,
                area: countryArea,
                borders: countryNeighbors
            });
            
            setCountryName(countryName);
        }
    }, [mapData, infoData, statisticsData,  setCountryName, difficulty]);
}