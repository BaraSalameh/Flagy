import { useLoadInfoData } from "@/lib/contexts/hooks/useLoadMapData";
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setIsTrueSelection, setRandomCountry } from "@/lib/store/slices/outlineExplorerSlice";
import { getRandomCountry } from "../../shared";

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
            const randomCountry = getRandomCountry(infoData, difficulty)?.countryName;
            dispatch(setRandomCountry(randomCountry as string));
            if (currentCountry && randomCountry) {
                dispatch(setIsTrueSelection(true));
            }
        } else {
            dispatch(setIsTrueSelection(false));
        }
    }, [infoData, difficulty, currentCountry, dispatch]);
}