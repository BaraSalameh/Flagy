'use client';

import { Counter, Map } from "@/components/shared";
import { Hint } from "./Hint";
import { useGenerateRandomCountry } from "./hooks";
import { GameOverModal } from "../shared/components/GameOverModal";
import { useAppSelector } from "@/lib/store/hooks";
import { clearGeoGuess } from "@/lib/store/slices/geoGuessSlice";
import { GameStarterModal } from "../shared/components/GameStarterModal";
import { useCounter } from "../shared/hooks/useCounter";

export const GeoGuess = () => {
    const generalState= useAppSelector(state => state.general);
    const difficulty = generalState.difficulty;
    const counter = generalState.counter;
    
    const geoGuessState = useAppSelector(state => state.geoGuess);
    const randomCountry = geoGuessState.randomCountry;
    const currentCountry = geoGuessState.currentCountry;
    
    useGenerateRandomCountry();
    const counterStartIndex =
    difficulty === 'Beginner'
        ? 15
    : difficulty === 'Intermediate'
        ? 12
    : difficulty === 'Advanced'
        ? 10
    : 7;
    useCounter(currentCountry, counterStartIndex, -1);

    return (
        <div className="relative h-screen w-screen">
            <Map game="geo-guess" />
            <GameStarterModal
                title="Geo Guess"
                description={`A country has been randomly selected. Choose your difficulty level and use the hints to guess the country before your counter reaches zero.\n\nSharpen your geography skills with each move!`}
            />
            <Hint />
            <GameOverModal
                thresholds={[
                    {
                        condition: (counter === 0 && randomCountry !== currentCountry),
                        result: false,
                        message: `😅 It was ${randomCountry}!`
                    },
                    {
                        condition: (randomCountry && currentCountry && randomCountry === currentCountry) as boolean,
                        result: true,
                        message: `🚀 ${randomCountry} is a Perfect guess! Keep it up!`
                    }
                ]}
                onClear={clearGeoGuess}
            />
            <Counter />
        </div>
    )
}