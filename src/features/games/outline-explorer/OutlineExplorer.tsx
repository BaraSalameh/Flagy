"use client";

import { Map } from "@/features/map/Map";
import { GameHud } from "@/features/game-shell/GameHud";
import { ProgressTracker } from "@/features/game-shell/components/ProgressTracker";
import { CountryMenu } from "./CountryMenu";
import { useGenerateRandomCountry } from "./hooks";
import { useAppSelector } from "@/lib/store/hooks";
import {
    clearOutlineExplorer,
    setCounter,
    setCurrentCountry,
    updateCounter,
} from "@/features/games/outline-explorer/model/outline-explorer-slice";
import { GameStarterModal } from "@/features/game-shell/components/GameStarterModal";
import { useCounter } from "@/features/game-shell/hooks/useCounter";
import { GameOverModal } from "@/features/game-shell/components/GameOverModal";
import { GameShell } from "@/features/game-shell/GameShell";

export const OutlineExplorer = () => {
    const generalState = useAppSelector((state) => state.general);
    const difficulty = generalState.difficulty;
    const generalCounter = generalState.counter;

    const outlineExplorerState = useAppSelector(
        (state) => state.outlineExplorer,
    );
    const currentCountry = outlineExplorerState.currentCountry;
    const randomCountries = outlineExplorerState.randomCountries;
    const randomCountry = outlineExplorerState.randomCountry;
    const outlineExplorerCounter = outlineExplorerState.counter;

    const incDicThresholds: Record<
        typeof difficulty,
        { increment: number; decrement: number }
    > = {
        Beginner: { increment: 4, decrement: -1 },
        Intermediate: { increment: 3, decrement: -2 },
        Advanced: { increment: 2, decrement: -3 },
        Expert: { increment: 1, decrement: -4 },
    };

    const getIncDecThreshold = () =>
        incDicThresholds[difficulty][
            randomCountry === currentCountry ? "increment" : "decrement"
        ];

    useGenerateRandomCountry();
    useCounter(
        currentCountry,
        10,
        getIncDecThreshold,
        setCounter,
        updateCounter,
    );
    useCounter(currentCountry);

    return (
        <GameShell game="outline-explorer">
            <Map game="outline-explorer" />
            <GameStarterModal
                title="Outline Explorer"
                description={`Test your geography skills in Outline Explorer! Each round, you’ll see the outline of a mystery country. Can you guess its name before time runs out?`}
            />
            <GameHud />
            <GameOverModal
                thresholds={[
                    {
                        condition: outlineExplorerCounter <= 0,
                        result: false,
                        message: `😅 Work harder!`,
                    },
                    {
                        condition: outlineExplorerCounter >= 20,
                        result: true,
                        message: `🚀 Good job! Keep it up!`,
                    },
                    {
                        condition: generalCounter === 20,
                        result: false,
                        message: `😅 You need to be smarter!`,
                    },
                ]}
                onClear={clearOutlineExplorer}
            />
            <ProgressTracker
                counter={outlineExplorerCounter}
                maxCounter={20}
                content={<p>Mystery country?</p>}
            />
            <CountryMenu
                randomCountries={randomCountries}
                onAction={setCurrentCountry}
            />
        </GameShell>
    );
};
