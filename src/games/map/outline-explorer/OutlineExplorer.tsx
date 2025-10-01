'use client';

import { CountryMenu, Map } from "@/components/shared";
import { Starter } from "./Starter";
import { useGenerateRandomCountry } from "./hooks";
import { useAppSelector } from "@/lib/store/hooks";
import { setCurrentCountry } from "@/lib/store/slices/outlineExplorerSlice";

export const OutlineExplorer = () => {
    useGenerateRandomCountry();
    const randomCountries = useAppSelector(state => state.outlineExplorer.randomCountries);

    return (
        <div className="h-screen">
            <Starter />
            <CountryMenu
                randomCountries={randomCountries}
                onAction={setCurrentCountry}
            />
            <Map game="outline-explorer" />
        </div>
    )
}