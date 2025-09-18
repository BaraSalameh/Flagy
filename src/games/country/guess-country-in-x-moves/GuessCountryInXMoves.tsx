'use client';

import { useDetermineCounter, useGenerateRandomCountry } from "../hooks";
import { Counter, Map } from "@/components/shared";
import { Starter } from "./Starter";
import { Hint } from "./Hint";
import { WinLose } from "./WinLose";

export const GuessCountryInXMoves = () => {
    useGenerateRandomCountry();
    useDetermineCounter();
      
    return (
        <div className="h-screen">
            <div className="fixed h-screen left-5 flex items-center z-1000">
                <Starter />
                <Hint />
                <WinLose />
                <Counter />
            </div>
            <Map mode="country" />
        </div>
    )
}