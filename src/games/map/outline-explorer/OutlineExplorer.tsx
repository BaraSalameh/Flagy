'use client';

import { Counter, CountryMenu, Map, ProgressTracker } from "@/components/shared";
import { Starter } from "./Starter";
import { useDetermineCounter, useDetermineOutlineExplorerCounter, useGenerateRandomCountry } from "./hooks";
import { useAppSelector } from "@/lib/store/hooks";
import { setCurrentCountry } from "@/lib/store/slices/outlineExplorerSlice";
import { Text } from "@/components/ui";
import { WinLose } from "./WinLose";

export const OutlineExplorer = () => {
    useGenerateRandomCountry();
    useDetermineCounter();
    useDetermineOutlineExplorerCounter();

    const outlineExplorerState = useAppSelector(state => state.outlineExplorer);
    const randomCountries =outlineExplorerState.randomCountries;
    const counter = outlineExplorerState.counter;

    return (
        <div className="relative h-screen w-screen">
            <Map game="outline-explorer" />
            <Starter />
            <Counter />
            <WinLose />
            <ProgressTracker counter={counter} maxCounter={20} content={<Text position='center' size='sm'>Mystery country?</Text>} />
            <CountryMenu
                randomCountries={randomCountries}
                onAction={setCurrentCountry}
            />
        </div>
    )
}