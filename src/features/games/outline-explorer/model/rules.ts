import type { InfoData } from "@/shared/types/country";
import type { GameDifficulty } from "@/shared/types/game";

export const STARTING_SCORE = 10;
export const WINNING_SCORE = 20;
export const outlineDifficulties = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
    "Extreme",
] as const;
export type OutlineDifficulty =
    GameDifficulty | (typeof outlineDifficulties)[number];
export type OutlineCountry = Pick<
    InfoData,
    "countryCode" | "countryName" | "capital" | "region" | "continentName"
>;
export interface OutlineChallenge {
    target: OutlineCountry;
    choices: OutlineCountry[];
}

export const OUTLINE_RULES: Record<
    OutlineDifficulty,
    {
        reward: number;
        penalty: number;
        minimumArea: number;
        choices: number;
        answer: "country" | "capital";
    }
> = {
    Beginner: {
        reward: 4,
        penalty: 1,
        minimumArea: 200_000,
        choices: 3,
        answer: "country",
    },
    Intermediate: {
        reward: 3,
        penalty: 2,
        minimumArea: 100_000,
        choices: 4,
        answer: "country",
    },
    Advanced: {
        reward: 2,
        penalty: 2,
        minimumArea: 20_000,
        choices: 5,
        answer: "country",
    },
    Expert: {
        reward: 2,
        penalty: 3,
        minimumArea: 0,
        choices: 6,
        answer: "country",
    },
    Extreme: {
        reward: 2,
        penalty: 3,
        minimumArea: 0,
        choices: 6,
        answer: "capital",
    },
};

export const getOutlineAnswer = (
    country: OutlineCountry,
    difficulty: OutlineDifficulty,
) =>
    OUTLINE_RULES[difficulty].answer === "capital"
        ? country.capital
        : country.countryName;

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
    difficulty: OutlineDifficulty,
    previousCode?: string,
): OutlineChallenge[] {
    const rules = OUTLINE_RULES[difficulty];
    const answerKeys = new Set<string>();
    const eligible = countries
        .filter(
            (country) =>
                country.area > rules.minimumArea &&
                (rules.answer === "country" || country.capital.trim()),
        )
        .map(
            ({ countryCode, countryName, capital, region, continentName }) => ({
                countryCode,
                countryName,
                capital,
                region,
                continentName,
            }),
        )
        .filter((country) => {
            const answer = getOutlineAnswer(country, difficulty)
                .trim()
                .toLocaleLowerCase();
            if (answerKeys.has(answer)) return false;
            answerKeys.add(answer);
            return true;
        });
    if (eligible.length < 2) return [];
    const targets = shuffled(eligible);
    if (targets[0].countryCode === previousCode)
        [targets[0], targets[1]] = [targets[1], targets[0]];
    return targets.map((target) => {
        const candidates = eligible.filter(
            (country) => country.countryCode !== target.countryCode,
        );
        const distractorGroups =
            difficulty === "Beginner"
                ? [candidates]
                : difficulty === "Intermediate"
                  ? [
                        candidates.filter(
                            (country) =>
                                country.continentName === target.continentName,
                        ),
                        candidates.filter(
                            (country) =>
                                country.continentName !== target.continentName,
                        ),
                    ]
                  : [
                        candidates.filter(
                            (country) => country.region === target.region,
                        ),
                        candidates.filter(
                            (country) =>
                                country.region !== target.region &&
                                country.continentName === target.continentName,
                        ),
                        candidates.filter(
                            (country) =>
                                country.continentName !== target.continentName,
                        ),
                    ];
        const distractors = distractorGroups
            .flatMap((group) => shuffled(group))
            .slice(0, rules.choices - 1);
        return { target, choices: shuffled([target, ...distractors]) };
    });
}
