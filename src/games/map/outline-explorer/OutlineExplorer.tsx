'use client';

import { Map } from "@/components/shared";
import { Starter } from "./Starter";
import { useGenerateRandomCountry } from "./hooks";

export const OutlineExplorer = () => {
    useGenerateRandomCountry();
    return (
        <div className="h-screen flex justify-center">
            <Starter />
            <Map game="outline-explorer" />
        </div>
    )
}