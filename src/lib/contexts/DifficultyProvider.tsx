'use client'

import { ReactNode, useState } from "react";
import { DifficultyContext } from "./DifficultyContext";
import { GameDifficulty } from "@/components/shared/types.shared";

export const DifficultyProvider = ({ children }: { children: ReactNode }) => {

    const [ difficulty, setDifficulty ] = useState<GameDifficulty>(null); 
    
    return (
        <DifficultyContext.Provider value={{ difficulty, setDifficulty }}>
            {children}
        </DifficultyContext.Provider>
    );
};
