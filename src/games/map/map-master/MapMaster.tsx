'use client';

import { Counter, Map, ProgressTracker } from "@/components/shared";
import { Starter } from "./Starter";
import { useDetermineCounter, useGenerateRandomCountry, useDetermineMapMasterCounter } from "./hooks";
import { WinLose } from "./WinLose";
import { useAppSelector } from "@/lib/store/hooks";
import { Text } from "@/components/ui";

export const MapMaster = () => {
    useGenerateRandomCountry();
    useDetermineCounter();
    useDetermineMapMasterCounter();
    
    const counter = useAppSelector(state => state.mapMaster.counter);
    const rc = useAppSelector(state => state.mapMaster.randomCountry);
    return (
        <div className="relative h-screen w-screen">
            <Map game="map-master" />
            <ProgressTracker counter={counter} maxCounter={20} content={<Text position='center' size='sm'>Where is {rc}?</Text>} />
            <Starter />
            <WinLose />
            <Counter />
        </div>
    )
}