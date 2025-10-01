'use client';

import { CountryMenu, Map } from "@/components/shared";
import { Starter } from "./Starter";
import { useGenerateRandomCountry } from "./hooks";

export const OutlineExplorer = () => {
    useGenerateRandomCountry();
    return (
        <div className="h-screen">
            <Starter />
            <CountryMenu />
            <Map game="outline-explorer" />
        </div>
    )
}