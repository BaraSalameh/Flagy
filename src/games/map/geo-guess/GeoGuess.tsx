'use client';

import { Counter, Map } from "@/components/shared";
import { Starter } from "./Starter";
import { Hint } from "./Hint";
import { WinLose } from "./WinLose";
import { useDetermineCounter, useGenerateRandomCountry } from "./hooks";

export const GeoGuess = () => {
    useGenerateRandomCountry();
    useDetermineCounter();
      
    return (
        <div className="h-screen">
            <Map game="geo-guess" />
            <div className="fixed h-screen left-5 flex items-center">
                <Starter />
                <Hint />
                <WinLose />
                <Counter />
            </div>
        </div>
    )
}