import bundledFlags from "flag-icons/country.json";
import type { InfoData } from "@/shared/types/country";
import type { GameDifficulty } from "@/shared/types/game";

export type FlagCountry = Pick<
    InfoData,
    "countryCode" | "countryName" | "capital" | "region"
>;

export const FLAG_FINDER_RULES: Record<
    GameDifficulty,
    {
        attempts: number;
        minimumArea: number;
        borderOpacity: number;
    }
> = {
    Beginner: { attempts: 4, minimumArea: 200_000, borderOpacity: 1 },
    Intermediate: { attempts: 3, minimumArea: 100_000, borderOpacity: 0.5 },
    Advanced: { attempts: 2, minimumArea: 20_000, borderOpacity: 0.18 },
    Expert: { attempts: 1, minimumArea: 0, borderOpacity: 0 },
};

const BUNDLED_FLAG_CODES = new Set(
    bundledFlags.map((country) => country.code.toUpperCase()),
);

export function buildFlagDeck(
    countries: readonly InfoData[],
    difficulty: GameDifficulty,
    previousCode?: string,
): FlagCountry[] {
    const deck = countries
        .filter(
            (country) =>
                BUNDLED_FLAG_CODES.has(country.countryCode) &&
                country.area > FLAG_FINDER_RULES[difficulty].minimumArea,
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
