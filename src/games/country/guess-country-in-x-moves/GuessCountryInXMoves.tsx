'use client';

import { useState } from "react";
import { useDetermineCounter, useGenerateRandomCountry } from "../hooks";
import { Map } from "@/components/shared";
import { Starter } from "./Starter";
import { useGetDifficulty } from "@/lib/contexts/hooks";
import { NavButton } from "@/components/ui";
import { Clock } from "lucide-react";
import { InfoData } from "@/lib/contexts/types.context";
import { Hint } from "./Hint";
import { WinLose } from "./WinLose";

export const GuessCountryInXMoves = () => {

    const difficulty = useGetDifficulty();

    const [ randomCountry, setRandomCountry ] = useState<string | undefined>(undefined);
    const [ selectedCountry, setSelectedCountry ] = useState<string | undefined>(undefined);
    const [ counter, setCounter ] = useState<number | undefined>(undefined);
    const [ hint, seHint ] = useState<InfoData | undefined>(undefined);
    const [ didWin, setDidWin ] = useState<boolean>(false);
    
    useGenerateRandomCountry(difficulty, setRandomCountry, seHint);
    useDetermineCounter(difficulty, setCounter, selectedCountry);
      
    return (
        <div className="h-screen">
            <div className="fixed h-screen left-5 flex items-center z-1000">
                <Starter />
                <Hint hint={hint} counter={counter} />
                <WinLose counter={counter} didWin={didWin} />
                <NavButton
                    label={`${counter}`}
                    hoverable={false}
                    icon={Clock}
                    onClick={() => {}}
                />
            </div>
            <Map
                mode="country"
                onCountryClick={setSelectedCountry}
                onWin={() => setDidWin(true)}
                userSelectedCountry={selectedCountry}
                randomCountryName={randomCountry as string}
            />
        </div>
    )
}