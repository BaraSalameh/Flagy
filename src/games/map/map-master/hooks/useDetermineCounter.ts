import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { updateCounter, setCounter } from "@/lib/store/slices/generalSlice";
import { useEffect } from "react"

export const useDetermineCounter = () => {
    const dispatch = useAppDispatch();
    const currentCountry = useAppSelector(state => state.mapMaster.currentCountry);

    useEffect(() => {
        if (currentCountry) {
            dispatch(updateCounter(1));
            return;
        }
        
        dispatch(setCounter(0));
    }, [currentCountry, dispatch]);
}
