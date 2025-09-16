'use client'

import { createContext, ReactNode, useState } from "react";
import { GameDifficulty } from "@/components/shared/types.shared";
import { DifficultyContextType } from "./types.context";

export const DifficultyContext = createContext<DifficultyContextType>({
    difficulty: null,
    setDifficulty: () => {}
});

export const DifficultyProvider = ({ children }: { children: ReactNode }) => {

    const [ difficulty, setDifficulty ] = useState<GameDifficulty>(null); 
    
    return (
        <DifficultyContext.Provider value={{ difficulty, setDifficulty }}>
            {children}
        </DifficultyContext.Provider>
    );
};
