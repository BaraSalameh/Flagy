"use client";

import { Map } from "@/features/map/Map";
import { GameHud } from "@/features/game-shell/GameHud";
import { Hint } from "./Hint";
import { useGenerateRandomCountry } from "./hooks";
import { GameOverModal } from "@/features/game-shell/components/GameOverModal";
import { useAppSelector } from "@/lib/store/hooks";
import { clearGeoGuess } from "@/features/games/geo-guess/model/geo-guess-slice";
import { GameStarterModal } from "@/features/game-shell/components/GameStarterModal";
import { useCounter } from "@/features/game-shell/hooks/useCounter";
import { GameShell } from "@/features/game-shell/GameShell";

export const GeoGuess = () => {
    const generalState = useAppSelector((state) => state.general);
    const difficulty = generalState.difficulty;
    const counter = generalState.counter;

    const geoGuessState = useAppSelector((state) => state.geoGuess);
    const randomCountry = geoGuessState.randomCountry;
    const currentCountry = geoGuessState.currentCountry;

    useGenerateRandomCountry();
    const counterStartIndex =
        difficulty === "Beginner"
            ? 15
            : difficulty === "Intermediate"
              ? 12
              : difficulty === "Advanced"
                ? 10
                : 7;
    useCounter(currentCountry, counterStartIndex, -1);

    return (
        <GameShell game="geo-guess">
            <Map game="geo-guess" />
            <GameStarterModal
                title="Geo Guess"
                description={`A country has been randomly selected. Choose your difficulty level and use the hints to guess the country before your counter reaches zero.\n\nSharpen your geography skills with each move!`}
            />
            <Hint />
            <GameOverModal
                thresholds={[
                    {
                        condition:
                            counter <= 0 && randomCountry !== currentCountry,
                        result: false,
                        message: `😅 It was ${randomCountry}!`,
                    },
                    {
                        condition: (randomCountry &&
                            currentCountry &&
                            randomCountry === currentCountry) as boolean,
                        result: true,
                        message: `🚀 ${randomCountry} is a Perfect guess! Keep it up!`,
                    },
                ]}
                onClear={clearGeoGuess}
            />
            <GameHud />
        </GameShell>
    );
};
