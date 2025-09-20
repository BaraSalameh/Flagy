import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { updateCounter, setCounter } from "@/lib/store/slices/generalSlice";
import { useEffect } from "react"

export const useDetermineCounter = () => {
    const dispatch = useAppDispatch();
    const difficulty = useAppSelector(state => state.general.difficulty);
    const currentCountry = useAppSelector(state => state.geoGuess.currentCountry);

    useEffect(() => {
        if (currentCountry) {
            dispatch(updateCounter(-1));
            return;
        }

        if (difficulty) {
            dispatch(setCounter(difficulty === 'Beginner' ? 15 : difficulty === 'Intermediate' ? 12 : difficulty === 'Advanced' ? 10 : 7));
        }
    }, [difficulty, currentCountry, dispatch]);
}
