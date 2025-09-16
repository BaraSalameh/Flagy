import { GameDifficulty } from "@/components/shared/types.shared";
import { useLoadMapData } from "@/lib/contexts/hooks";
import { useEffect } from "react"

export const useGenerateRandomCountry = (difficulty: GameDifficulty, setCountryName: (countryName: string) => void) => {
    const mapData = useLoadMapData();

    useEffect(() => {
        if (difficulty && mapData && mapData.features.length > 0) {
            const randomIndex = Math.floor(Math.random() * mapData.features.length);
            const countryFeature = mapData.features[randomIndex];
            const countryName = countryFeature.properties?.name || 'Unknown';
            setCountryName(countryName);
        }
    }, [mapData, setCountryName, difficulty]);
}