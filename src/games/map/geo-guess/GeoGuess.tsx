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
        <div className="relative h-screen w-screen">
            <Map game="geo-guess" />
            <Starter />
            <Hint />
            <WinLose />
            <Counter />
        </div>
    )
}