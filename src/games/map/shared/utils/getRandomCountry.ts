import { useLoadInfoData } from "@/lib/contexts/hooks/useLoadMapData";
import { useAppSelector } from "@/lib/store/hooks";
import { InfoData } from "@/lib/store/slices/types.slices";
import { RootState } from "@/lib/store/store";

export const getRandomCountry = (
    info: ReturnType<typeof useLoadInfoData>,
    difficulty?: ReturnType<typeof useAppSelector<RootState['general']['difficulty']>>
): InfoData | null => {
    if (!info) return null;

    let candidates = Object.values(info);
    
    const thresholds: Record<Exclude<Exclude<typeof difficulty, undefined>, "Expert">, number> = {
        Beginner: 200_000,
        Intermediate: 100_000,
        Advanced: 20_000,
    };

    if (difficulty && difficulty !== "Expert") {
        candidates = candidates.filter(c => c.area > thresholds[difficulty]);
    }

    if (candidates.length === 0) {
        console.warn("No candidates match the difficulty filter.");
        return null;
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
};
