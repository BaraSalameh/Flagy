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
        <div className="h-screen flex justify-center">
            <div className="fixed w-fit top-5 flex justify-center z-1000">
                <ProgressTracker counter={counter} maxCounter={20} content={<Text position='center' size='sm'>Where is {rc}?</Text>} />
            </div>
            <div className="fixed h-screen left-5 flex items-center z-1000">
                <Starter />
                <WinLose />
                <Counter />
            </div>
            <Map game="map-master" />
        </div>
    )
}