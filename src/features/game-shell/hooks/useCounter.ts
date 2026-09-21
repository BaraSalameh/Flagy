import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
    updateCounter,
    setCounter,
} from "@/features/game-shell/model/session-slice";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useEffect, useRef } from "react";

export const useCounter = (
    toWatch: string | undefined,
    start: number = 0,
    incDecBy: number | (() => number) = 1,
    onInit: ActionCreatorWithPayload<number> = setCounter,
    onUpdate: ActionCreatorWithPayload<number> = updateCounter,
) => {
    const dispatch = useAppDispatch();
    const isGameStarted = useAppSelector((state) => state.general.gameStarted);
    const configRef = useRef({ start, incDecBy, onInit, onUpdate });
    configRef.current = { start, incDecBy, onInit, onUpdate };

    useEffect(() => {
        const config = configRef.current;
        if (toWatch) {
            dispatch(
                config.onUpdate(
                    typeof config.incDecBy === "number"
                        ? config.incDecBy
                        : config.incDecBy(),
                ),
            );
            return;
        }

        if (isGameStarted) {
            dispatch(config.onInit(config.start));
        }
    }, [isGameStarted, toWatch, dispatch]);
};
