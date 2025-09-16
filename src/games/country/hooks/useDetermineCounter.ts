import { GameDifficulty } from "@/components/shared/types.shared";
import { useEffect } from "react"

export const useDetermineCounter = (difficulty: GameDifficulty, setCounter: React.Dispatch<React.SetStateAction<number | undefined>>, toWatch: string | undefined) => 
    useEffect(() => {
        if (toWatch) {
            setCounter(c => (c as number) - 1);
            return;
        }

        if (difficulty) {
            setCounter(difficulty === 'Beginner' ? 15 : difficulty === 'Intermediate' ? 12 : difficulty === 'Advanced' ? 10 : 7);
        }
    }, [difficulty, setCounter, toWatch]);
