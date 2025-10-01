import { useLoadInfoData } from "@/lib/contexts/hooks/useLoadMapData";
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setIsTrueSelection, setRandomCountries } from "@/lib/store/slices/outlineExplorerSlice";
import { getRandomCountry } from "../../shared";
import { setRandomCountry } from "@/lib/store/slices/outlineExplorerSlice";

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
            const randomCountries = getRandomCountry(infoData, difficulty, 4).map(info => info.countryName);
            dispatch(setRandomCountries(randomCountries));
            dispatch(setRandomCountry(randomCountries[Math.floor(Math.random() * randomCountries.length)]))
            if (currentCountry && randomCountry) {
                dispatch(setIsTrueSelection(true));
            }
        } else {
            dispatch(setIsTrueSelection(false));
        }
    }, [infoData, difficulty, currentCountry, dispatch]);
}