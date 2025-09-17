import { GameDifficulty } from "@/components/shared/types.shared";
import { useLoadInfoData, useLoadMapData, useLoadStatisticsData } from "@/lib/contexts/hooks";
import { useEffect } from "react"

export const useGenerateRandomCountry = (difficulty: GameDifficulty, setCountryName: (countryName: string) => void) => {
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

            console.log(`countryName: ${countryName}`);
            console.log(`iso 2: ${countryISO2}`);
            console.log(`iso 3: ${countryISO3}`);
            console.log(`population: ${countryPopulation}`);
            console.log(`area: ${countryArea}`);


            setCountryName(countryName);
        }
    }, [mapData, infoData, statisticsData,  setCountryName, difficulty]);
}