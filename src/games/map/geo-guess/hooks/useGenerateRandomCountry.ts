import { useLoadInfoData } from "@/lib/contexts/hooks";
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setInformations } from "@/lib/store/slices/hintSlice"
import { InfoData } from "@/lib/store/slices/types.slices";
import { setRandomCountry } from "@/lib/store/slices/geoGuessSlice";

export const useGenerateRandomCountry = () => {
    const dispatch = useAppDispatch();
    const infoData = useLoadInfoData();
    const difficulty = useAppSelector(state => state.general.difficulty);

    useEffect(() => {
        if (difficulty && infoData) {

            const keys = Object.keys(infoData);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            const record = infoData[randomKey as keyof typeof  infoData];

            dispatch(setInformations({
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
            } as InfoData));
            
            dispatch(setRandomCountry(record.countryName))
        }
    }, [infoData, difficulty, dispatch]);
}