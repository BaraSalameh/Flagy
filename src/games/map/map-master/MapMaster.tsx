'use client';

import { Counter, Map, ProgressTracker } from "@/components/shared";
import { useGenerateRandomCountry, useDetermineMapMasterCounter } from "./hooks";
import { useAppSelector } from "@/lib/store/hooks";
import { Text } from "@/components/ui";
import { GameOverModal } from "../shared/components/GameOverModal";
import { clearMapMaster } from "@/lib/store/slices/mapMasterSlice";
import { GameStarterModal } from "../shared/components/GameStarterModal";
import { useGeneralCounter } from "../shared/hooks/useGeneralCounter";

export const MapMaster = () => {
    const generalState = useAppSelector(state => state.general);
    const generalCounter = generalState.counter;
    
    const mapMasterState = useAppSelector(state => state.mapMaster);
    const mapMasterCounter = mapMasterState.counter;
    const currentCountry = mapMasterState.currentCountry;
    const randomCountry = mapMasterState.randomCountry;

    useGenerateRandomCountry();
    useDetermineMapMasterCounter();
    useGeneralCounter(currentCountry);

    return (
        <div className="relative h-screen w-screen">
            <Map game="map-master" />
            <ProgressTracker
                counter={mapMasterCounter}
                maxCounter={20}
                content={
                    <Text position='center' size='sm'>
                        Where is {randomCountry}?
                    </Text>
                }
            />
            <GameStarterModal
                title="Map Master"
                description={`A country is randomly highlighted.\n Based on the difficulty level, select the correct area on the map. Each correct selection brings you closer to victory, but too many wrong choices will end the game. Can you master the map?`}
            />
            <GameOverModal
                thresholds={[
                    {
                        condition: (mapMasterCounter <= 0),
                        result: false,
                        message: `😅 Work harder!`
                    },
                    {
                        condition: (mapMasterCounter >= 20),
                        result: true,
                        message: `🚀 Good job! Keep it up!`
                    },
                    {
                        condition: (generalCounter === 20),
                        result: false,
                        message: `😅 You need to be smarter!`
                    }
                ]}
                onClear={clearMapMaster}
            />
            <Counter />
        </div>
    )
}