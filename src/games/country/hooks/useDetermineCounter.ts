import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { decrementCounter, setCounter } from "@/lib/store/slices/generalSlice";
import { useEffect } from "react"

export const useDetermineCounter = () => {
    const dispatch = useAppDispatch();
    const difficulty = useAppSelector(state => state.general.difficulty);
    const currentCountry = useAppSelector(state => state.country.currentCountry);

    useEffect(() => {
        if (currentCountry) {
            dispatch(decrementCounter());
            return;
        }

        if (difficulty) {
            dispatch(setCounter(difficulty === 'Beginner' ? 15 : difficulty === 'Intermediate' ? 12 : difficulty === 'Advanced' ? 10 : 7));
        }
    }, [difficulty, currentCountry, dispatch]);
}
