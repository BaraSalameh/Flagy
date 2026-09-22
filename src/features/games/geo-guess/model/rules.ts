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
}

export const GEO_GUESS_RULES: Record<GameDifficulty, DifficultyRules> = {
    Beginner: {
        guesses: 15,
        minimumArea: 200_000,
        clues: [
            "population",
            "area",
            "continentName",
            "region",
            "languages",
            "borders",
            "capital",
        ],
    },
    Intermediate: {
        guesses: 12,
        minimumArea: 100_000,
        clues: [
            "population",
            "area",
            "continentName",
            "region",
            "languages",
            "capital",
        ],
    },
    Advanced: {
        guesses: 10,
        minimumArea: 20_000,
        clues: ["population", "area", "continentName", "region", "languages"],
    },
    Expert: {
        guesses: 7,
        minimumArea: 0,
        clues: ["population", "area", "continentName", "region"],
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
    return GEO_GUESS_RULES[difficulty].clues
        .slice(0, Math.floor(guessesUsed / 2) + 1)
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
