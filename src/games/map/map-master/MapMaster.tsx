'use client';

import { Counter, Map } from "@/components/shared";
import { Starter } from "./Starter";
// import { Hint } from "./Hint";
// import { WinLose } from "./WinLose";
// import { useDetermineCounter, useGenerateRandomCountry } from "./hooks";

export const MapMaster = () => {
    // useGenerateRandomCountry();
    // useDetermineCounter();
      
    return (
        <div className="h-screen">
            <div className="fixed h-screen left-5 flex items-center z-1000">
                <Starter />
                {/* <Hint /> */}
                {/* <WinLose /> */}
                <Counter />
            </div>
            <Map game="map-master" />
        </div>
    )
}