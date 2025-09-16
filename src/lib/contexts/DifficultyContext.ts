'use client'

import { createContext } from "react";
import { DifficultyContextType } from "./types.context";

export const DifficultyContext = createContext<DifficultyContextType>({
    difficulty: null,
    setDifficulty: () => {}
});
