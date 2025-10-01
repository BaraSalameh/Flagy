import { useLoadInfoData } from "@/lib/contexts/hooks/useLoadMapData";
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { getRandomCountry } from "../../shared";
import { setRandomCountries, setRandomCountry } from "@/lib/store/slices/outlineExplorerSlice";

export const useGenerateRandomCountry = () => {
    const dispatch = useAppDispatch();
    const infoData = useLoadInfoData();
    const difficulty = useAppSelector(state => state.general.difficulty);

    const outlineExplorerState = useAppSelector(state => state.outlineExplorer);
    const currentCountry = outlineExplorerState.currentCountry;
    const randomCountry = outlineExplorerState.randomCountry;

    useEffect(() => {
        if (!difficulty || !infoData) return;

        if (currentCountry === randomCountry) {
            const difficultyThreshold = difficulty === 'Beginner' ? 4 : difficulty === 'Expert' ? 6 : 5;
            const randomCountries = getRandomCountry(infoData, difficulty, difficultyThreshold).map(info => info.countryName);
            dispatch(setRandomCountries(randomCountries));
            dispatch(setRandomCountry(randomCountries[Math.floor(Math.random() * randomCountries.length)]))
        }
    }, [infoData, difficulty, currentCountry, randomCountry, dispatch]);
}