import { useLoadInfoData } from "@/lib/contexts/hooks/useLoadMapData";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
    setIsTrueSelection,
    setRandomCountry,
} from "@/features/games/map-master/model/map-master-slice";
import { getRandomCountry } from "@/features/games/shared/getRandomCountry";

export const useGenerateRandomCountry = () => {
    const dispatch = useAppDispatch();
    const infoData = useLoadInfoData();
    const difficulty = useAppSelector((state) => state.general.difficulty);
    const mapMasterState = useAppSelector((state) => state.mapMaster);
    const currentCountry = mapMasterState.currentCountry;
    const randomCountry = mapMasterState.randomCountry;

    useEffect(() => {
        if (!difficulty || !infoData) return;

        if (currentCountry === randomCountry) {
            const randomCountry = getRandomCountry(infoData, difficulty)[0]
                ?.countryName;
            dispatch(setIsTrueSelection(true));
            dispatch(setRandomCountry(randomCountry as string));
        } else {
            dispatch(setIsTrueSelection(false));
        }
    }, [infoData, difficulty, currentCountry, randomCountry, dispatch]);
};
