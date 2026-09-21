"use client";

import { Map } from "@/features/map/Map";
import { GameHud } from "@/features/game-shell/GameHud";
import { ProgressTracker } from "@/features/game-shell/components/ProgressTracker";
import { useGenerateRandomCountry } from "./hooks";
import { useAppSelector } from "@/lib/store/hooks";
import { GameOverModal } from "@/features/game-shell/components/GameOverModal";
import {
    clearMapMaster,
    setCounter,
    updateCounter,
} from "@/features/games/map-master/model/map-master-slice";
import { GameStarterModal } from "@/features/game-shell/components/GameStarterModal";
import { useCounter } from "@/features/game-shell/hooks/useCounter";
import { GameShell } from "@/features/game-shell/GameShell";

export const MapMaster = () => {
    const generalState = useAppSelector((state) => state.general);
    const difficulty = generalState.difficulty;
    const generalCounter = generalState.counter;

    const mapMasterState = useAppSelector((state) => state.mapMaster);
    const mapMasterCounter = mapMasterState.counter;
    const currentCountry = mapMasterState.currentCountry;
    const randomCountry = mapMasterState.randomCountry;

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
    useCounter(currentCountry);
    useCounter(
        currentCountry,
        10,
        getIncDecThreshold,
        setCounter,
        updateCounter,
    );

    return (
        <GameShell game="map-master">
            <Map game="map-master" />
            <ProgressTracker
                counter={mapMasterCounter}
                maxCounter={20}
                content={
                    <p>
                        Where is <strong>{randomCountry}</strong>?
                    </p>
                }
            />
            <GameStarterModal
                title="Map Master"
                description={`A country is randomly highlighted.\n Based on the difficulty level, select the correct area on the map. Each correct selection brings you closer to victory, but too many wrong choices will end the game. Can you master the map?`}
            />
            <GameOverModal
                thresholds={[
                    {
                        condition: mapMasterCounter <= 0,
                        result: false,
                        message: `😅 Work harder!`,
                    },
                    {
                        condition: mapMasterCounter >= 20,
                        result: true,
                        message: `🚀 Good job! Keep it up!`,
                    },
                    {
                        condition: generalCounter === 20,
                        result: false,
                        message: `😅 You need to be smarter!`,
                    },
                ]}
                onClear={clearMapMaster}
            />
            <GameHud />
        </GameShell>
    );
};
