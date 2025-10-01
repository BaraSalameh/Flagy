import { useLoadInfoData } from "@/lib/contexts/hooks/useLoadMapData";
import { useAppSelector } from "@/lib/store/hooks";
import { InfoData } from "@/lib/store/slices/types.slices";
import { RootState } from "@/lib/store/store";

export const getRandomCountry = (
    info: ReturnType<typeof useLoadInfoData>,
    difficulty?: ReturnType<typeof useAppSelector<RootState['general']['difficulty']>>,
    count: number = 1
): InfoData[] => {
    if (!info) return [];

    let candidates = Object.values(info);
    
    const thresholds: Record<Exclude<Exclude<typeof difficulty, undefined>, "Expert">, number> = {
        Beginner: 200_000,
        Intermediate: 100_000,
        Advanced: 20_000,
    };

    if (difficulty && difficulty !== "Expert") {
        candidates = candidates.filter(c => c.area > thresholds[difficulty]);
    }

    // shuffle candidates (Fisher–Yates)
    for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    // return up to `count` items
    return candidates.slice(0, count);
};
