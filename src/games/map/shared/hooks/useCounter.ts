import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { updateCounter, setCounter } from "@/lib/store/slices/generalSlice";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useEffect } from "react"

export const useCounter = (
    toWatch: string | undefined,
    start: number = 0,
    incDecBy: number | (() => number) = 1,
    onInit: ActionCreatorWithPayload<number> = setCounter,
    onUpdate: ActionCreatorWithPayload<number> = updateCounter,
) => {
    const dispatch = useAppDispatch();
    const isGameStarted = useAppSelector(state => state.general.gameStarted);

    useEffect(() => {
        if (toWatch) {
            dispatch(
                onUpdate(
                    typeof incDecBy === 'number'
                    ? incDecBy
                    : incDecBy()
                )
            );
            return;
        }

        if (isGameStarted) {
            dispatch(onInit(start));
        }
    }, [isGameStarted, toWatch, dispatch]);
}