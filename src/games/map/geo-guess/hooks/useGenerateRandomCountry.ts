import { useLoadInfoData } from "@/lib/contexts/hooks/useLoadMapData";
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setHintInformations } from "@/lib/store/slices/geoGuessSlice"
import { InfoData } from "@/lib/store/slices/types.slices";
import { setRandomCountry } from "@/lib/store/slices/geoGuessSlice";
import { getRandomCountry } from "../../shared";

export const useGenerateRandomCountry = () => {
    const dispatch = useAppDispatch();
    const infoData = useLoadInfoData();
    const difficulty = useAppSelector(state => state.general.difficulty);

    useEffect(() => {
        if (difficulty && infoData) {

            const randomCountry = getRandomCountry(infoData, difficulty)[0];

            dispatch(setHintInformations({
                countryCode: randomCountry?.countryCode,
                currencyCode: randomCountry?.currencyCode,
                population: randomCountry?.population,
                capital: randomCountry?.capital,
                continentName: randomCountry?.continentName,
                region: randomCountry?.region,
                area: randomCountry?.area,
                borders: randomCountry?.borders,
                languages: randomCountry?.languages,
                flag: randomCountry?.flag
            } as InfoData));
            
            dispatch(setRandomCountry(randomCountry?.countryName as string));
        }
    }, [infoData, difficulty, dispatch]);
}