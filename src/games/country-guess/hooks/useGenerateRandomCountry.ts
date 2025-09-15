import { useLoadMapData } from "@/lib/hooks";
import { useEffect } from "react"

export const useGenerateRandomCountry = (setCountryName: (countryName: string) => void) => {
    const mapData = useLoadMapData();

    useEffect(() => {
        if (mapData && mapData.features.length > 0) {
            const randomIndex = Math.floor(Math.random() * mapData.features.length);
            const countryFeature = mapData.features[randomIndex];
            const countryName = countryFeature.properties?.name || 'Unknown';
            setCountryName(countryName);
        }
    }, [mapData]);
}