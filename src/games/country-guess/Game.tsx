'use client';

import { Map } from "@/components";
import { useEffect, useState } from "react";
import { useGenerateRandomCountry } from "./hooks";

export const Game = () => {

    const [ randomCountry, setRandomCountry ] = useState<string | null>(null);
    const [ selectedCountry, setSelectedCountry ] = useState<string>('Unknown');

    useGenerateRandomCountry(setRandomCountry);

    useEffect(() => {
        if (randomCountry) console.log(`Random Country: ${randomCountry}`);
    }, [randomCountry]);
      
    return (
        <Map
            mode="country"
            onCountryClick={setSelectedCountry}
            userSelectedCountry={selectedCountry}
            randomCountryName={randomCountry as string}
        />
    )
}