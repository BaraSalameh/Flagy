import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { updateCounter } from "@/lib/store/slices/mapMasterSlice";
import { useEffect } from "react"

export const useDetermineMapMasterCounter = () => {
    const dispatch = useAppDispatch();
    const difficulty = useAppSelector(state => state.general.difficulty);
    const mapMasterState = useAppSelector(state => state.mapMaster);
    const currentCountry = mapMasterState.currentCountry;
    const randomCountry = mapMasterState.randomCountry;

    const updateMap: Record<typeof difficulty, {increment: number; decrement: number}> = {
        Beginner: { increment: 4, decrement: -1},
        Intermediate: { increment: 3, decrement: -2},
        Advanced: { increment: 2, decrement: -3},
        Expert: { increment: 1, decrement: -4},
    }

    useEffect(() => {
        if (currentCountry && randomCountry) {
            const isTrueSelection = currentCountry === randomCountry;
            const map = updateMap[difficulty];
            dispatch(updateCounter(isTrueSelection ? map.increment : map.decrement));
        }
    }, [currentCountry, difficulty, dispatch]);
}
