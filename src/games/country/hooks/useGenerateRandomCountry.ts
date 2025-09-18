import { GameDifficulty } from "@/components/shared/types.shared";
import { useLoadInfoData } from "@/lib/contexts/hooks";
import { useEffect } from "react"
import { UseStateSetter } from "./types.hooks";
import { InfoData } from "@/lib/contexts/types.context";

export const useGenerateRandomCountry = (
    difficulty: GameDifficulty,
    setCountryName: UseStateSetter<string | undefined>,
    setHint: UseStateSetter<InfoData | undefined>
) => {
    const infoData = useLoadInfoData();

    useEffect(() => {
        if (difficulty && infoData) {

            const keys = Object.keys(infoData);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            const record = infoData[randomKey as keyof typeof  infoData];

            setHint({
                countryCode: record.countryCode,
                currencyCode: record.currencyCode,
                population: record.population,
                capital: record.capital,
                continentName: record.continentName,
                region: record.region,
                area: record.area,
                borders: record.borders,
                languages: record.languages,
                flag: record.flag
            } as InfoData);
            
            setCountryName(record.countryName);
        }
    }, [infoData, setCountryName, difficulty]);
}