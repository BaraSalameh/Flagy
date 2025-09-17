'use client';

import { useEffect, useState } from "react";
import { useDetermineCounter, useGenerateRandomCountry } from "../hooks";
import { Map } from "@/components/shared";
import { Starter } from "./Starter";
import { useGetDifficulty } from "@/lib/contexts/hooks";
import { NavButton } from "@/components/ui";
import { Clock } from "lucide-react";

export const GuessCountryInXMoves = () => {

    const difficulty = useGetDifficulty();

    const [ randomCountry, setRandomCountry ] = useState<string | null>(null);
    const [ selectedCountry, setSelectedCountry ] = useState<string | undefined>(undefined);
    const [ counter, setCounter ] = useState<number | undefined>(undefined);
    const [ hint, seHint ] = useState<Record<string, string> | null>(null);
    
    useGenerateRandomCountry(difficulty, setRandomCountry, seHint);
    useDetermineCounter(difficulty, setCounter, selectedCountry);

    useEffect(() => {
        if (randomCountry) alert(randomCountry);
    }, [randomCountry]);

    useEffect(() => {
        if (hint) console.log(hint);
    }, [hint]);
      
    return (
        <div className="h-screen">
            <div className="fixed h-screen left-5 flex items-center z-1000">
                <Starter />
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
                userSelectedCountry={selectedCountry}
                randomCountryName={randomCountry as string}
            />
        </div>
    )
}