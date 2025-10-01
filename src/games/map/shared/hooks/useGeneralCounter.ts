import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { updateCounter, setCounter } from "@/lib/store/slices/generalSlice";
import { useEffect } from "react"

export const useGeneralCounter = (
    toWatch: string | undefined,
    start: number = 0,
    incDecBy: number = 1
) => {
    const dispatch = useAppDispatch();
    const isGameStarted = useAppSelector(state => state.general.gameStarted);

    useEffect(() => {
        if (toWatch) {
            dispatch(updateCounter(incDecBy));
            return;
        }

        if (isGameStarted) {
            dispatch(setCounter(start));
        }
    }, [isGameStarted, toWatch, dispatch]);
}