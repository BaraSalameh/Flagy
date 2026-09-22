import type { InfoData } from "@/shared/types/country";
import type { GameDifficulty } from "@/shared/types/game";

export const STARTING_SCORE = 10;
export const WINNING_SCORE = 20;
export const MAX_GUESSES = 20;
export type OutlineCountry = Pick<
    InfoData,
    "countryCode" | "countryName" | "capital" | "region"
>;
export interface OutlineChallenge {
    target: OutlineCountry;
    choices: OutlineCountry[];
}

export const OUTLINE_RULES: Record<
    GameDifficulty,
    { reward: number; penalty: number; minimumArea: number; choices: number }
> = {
    Beginner: { reward: 4, penalty: 1, minimumArea: 200_000, choices: 4 },
    Intermediate: { reward: 3, penalty: 2, minimumArea: 100_000, choices: 5 },
    Advanced: { reward: 2, penalty: 3, minimumArea: 20_000, choices: 5 },
    Expert: { reward: 1, penalty: 4, minimumArea: 0, choices: 6 },
};

function shuffled<T>(items: readonly T[]): T[] {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
        const other = Math.floor(Math.random() * (index + 1));
        [result[index], result[other]] = [result[other], result[index]];
    }
    return result;
}

export function buildChallenges(
    countries: readonly InfoData[],
    difficulty: GameDifficulty,
    previousCode?: string,
): OutlineChallenge[] {
    const rules = OUTLINE_RULES[difficulty];
    const eligible = countries
        .filter((country) => country.area > rules.minimumArea)
        .map(({ countryCode, countryName, capital, region }) => ({
            countryCode,
            countryName,
            capital,
            region,
        }));
    if (eligible.length < 2) return [];
    const targets = shuffled(eligible);
    if (targets[0].countryCode === previousCode)
        [targets[0], targets[1]] = [targets[1], targets[0]];
    return Array.from({ length: MAX_GUESSES }, (_, index) => {
        const target = targets[index % targets.length];
        const distractors = shuffled(
            eligible.filter(
                (country) => country.countryCode !== target.countryCode,
            ),
        ).slice(0, rules.choices - 1);
        return { target, choices: shuffled([target, ...distractors]) };
    });
}
