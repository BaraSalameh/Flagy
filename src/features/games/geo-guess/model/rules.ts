import type { GameDifficulty } from "@/shared/types/game";
import type { InfoData } from "@/shared/types/country";

type ClueKey =
    | "population"
    | "area"
    | "continentName"
    | "region"
    | "languages"
    | "borders"
    | "capital";

interface DifficultyRules {
    guesses: number;
    minimumArea: number;
    clues: readonly ClueKey[];
    revealAt: readonly number[];
}

export const GEO_GUESS_RULES: Record<GameDifficulty, DifficultyRules> = {
    Beginner: {
        guesses: 12,
        minimumArea: 200_000,
        clues: [
            "continentName",
            "capital",
            "region",
            "languages",
            "borders",
            "area",
            "population",
        ],
        revealAt: [0, 1, 2, 3, 5, 7, 9],
    },
    Intermediate: {
        guesses: 10,
        minimumArea: 100_000,
        clues: [
            "continentName",
            "region",
            "languages",
            "borders",
            "area",
            "population",
        ],
        revealAt: [0, 2, 4, 6, 8, 9],
    },
    Advanced: {
        guesses: 8,
        minimumArea: 20_000,
        clues: ["region", "languages", "borders", "area", "population"],
        revealAt: [0, 2, 4, 6, 7],
    },
    Expert: {
        guesses: 6,
        minimumArea: 0,
        clues: ["area", "population", "region", "languages"],
        revealAt: [0, 2, 4, 5],
    },
};

export function getClues(
    country: InfoData,
    difficulty: GameDifficulty,
    guessesUsed: number,
) {
    const values: Record<ClueKey, string> = {
        population: `Population: about ${Number(country.population).toLocaleString("en-US", { notation: "compact" })}`,
        area: `Area: ${country.area.toLocaleString("en-US")} km²`,
        continentName: `Continent: ${country.continentName}`,
        region: `Region: ${country.region}`,
        languages: `Languages: ${country.languages.join(", ") || "Not available"}`,
        borders: `Neighbors: ${country.borders.join(", ") || "No land borders"}`,
        capital: `Capital: ${country.capital || "Not available"}`,
    };
    const rules = GEO_GUESS_RULES[difficulty];
    const visibleClues = Math.max(
        1,
        rules.revealAt.filter((threshold) => guessesUsed >= threshold).length,
    );
    return rules.clues
        .slice(0, visibleClues)
        .map((key) => ({ key, text: values[key] }));
}

export function chooseCountry(
    countries: readonly InfoData[],
    difficulty: GameDifficulty,
    previousCode?: string,
): InfoData | undefined {
    const eligible = countries.filter(
        (country) => country.area > GEO_GUESS_RULES[difficulty].minimumArea,
    );
    const alternatives = eligible.filter(
        (country) => country.countryCode !== previousCode,
    );
    const pool = alternatives.length ? alternatives : eligible;
    return pool[Math.floor(Math.random() * pool.length)];
}
