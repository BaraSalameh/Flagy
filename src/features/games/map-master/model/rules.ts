import type { InfoData } from "@/shared/types/country";
import type { GameDifficulty } from "@/shared/types/game";

export const STARTING_SCORE = 10;
export const WINNING_SCORE = 20;
export const MAX_GUESSES = 15;

export type MapCountry = Pick<
    InfoData,
    "countryCode" | "countryName" | "capital" | "region"
>;

export const MAP_MASTER_RULES: Record<
    GameDifficulty,
    { reward: number; penalty: number; minimumArea: number }
> = {
    Beginner: { reward: 4, penalty: 1, minimumArea: 200_000 },
    Intermediate: { reward: 3, penalty: 2, minimumArea: 100_000 },
    Advanced: { reward: 2, penalty: 2, minimumArea: 20_000 },
    Expert: { reward: 2, penalty: 3, minimumArea: 0 },
};

// Randomness belongs to the start event, keeping all reducer transitions pure.
export function buildChallengeDeck(
    countries: readonly InfoData[],
    difficulty: GameDifficulty,
    previousCode?: string,
): MapCountry[] {
    const deck = countries
        .filter(
            (country) =>
                country.area > MAP_MASTER_RULES[difficulty].minimumArea,
        )
        .map(({ countryCode, countryName, capital, region }) => ({
            countryCode,
            countryName,
            capital,
            region,
        }));
    for (let index = deck.length - 1; index > 0; index -= 1) {
        const other = Math.floor(Math.random() * (index + 1));
        [deck[index], deck[other]] = [deck[other], deck[index]];
    }
    if (deck.length > 1 && deck[0].countryCode === previousCode) {
        [deck[0], deck[1]] = [deck[1], deck[0]];
    }
    return deck;
}
