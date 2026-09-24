import { describe, expect, it } from "vitest";
import reducer, {
    clearOutlineExplorer,
    getChallenge,
    nextChallenge,
    prepareRound,
    startRound,
    submitGuess,
} from "./outline-explorer-slice";
import {
    buildChallenges,
    getOutlineAnswer,
    outlineDifficulties,
    OUTLINE_RULES,
    type OutlineCountry,
    type OutlineChallenge,
} from "./rules";
import type { InfoData } from "@/shared/types/country";

const country = (code: string): OutlineCountry => ({
    countryCode: code,
    countryName: code,
    capital: `${code} Capital`,
    region: "Region",
    continentName: "Continent",
});
const choices = ["CA", "CN", "BR", "AU", "IN", "DE"].map(country);
const challenges: OutlineChallenge[] = [
    { target: choices[0], choices },
    { target: choices[1], choices },
];

describe("Outline Explorer rounds", () => {
    it.each(outlineDifficulties)(
        "scores %s exactly once and pauses after a correct answer",
        (difficulty) => {
            let state = reducer(
                undefined,
                startRound({ challenges, difficulty }),
            );
            state = reducer(state, submitGuess("BR"));
            expect(state.score).toBe(10 - OUTLINE_RULES[difficulty].penalty);
            expect(reducer(state, submitGuess("BR"))).toEqual(state);
            expect(reducer(state, submitGuess("XX"))).toEqual(state);
            state = reducer(state, submitGuess("CA"));
            expect(state.score).toBe(
                10 -
                    OUTLINE_RULES[difficulty].penalty +
                    OUTLINE_RULES[difficulty].reward,
            );
            expect(state.solved).toBe(true);
            expect(getChallenge(state)?.target.countryCode).toBe("CA");
            expect(reducer(state, submitGuess("CN"))).toEqual(state);
            state = reducer(state, nextChallenge());
            expect(getChallenge(state)?.target.countryCode).toBe("CN");
            expect(state.incorrectCodes).toEqual([]);
            expect(state.solved).toBe(false);
            expect(reducer(state, nextChallenge())).toEqual(state);
        },
    );

    it("caps winning scores and freezes completed rounds", () => {
        let state = reducer(
            undefined,
            startRound({ challenges, difficulty: "Beginner" }),
        );
        for (let index = 0; index < 3; index += 1) {
            state = reducer(
                state,
                submitGuess(getChallenge(state)!.target.countryCode),
            );
            state = reducer(state, nextChallenge());
        }
        expect(state.score).toBe(20);
        expect(state.status).toBe("won");
        expect(state.history.at(-1)?.points).toBe(2);
        expect(reducer(state, submitGuess("BR"))).toEqual(state);
        let lost = reducer(
            undefined,
            startRound({ challenges, difficulty: "Expert" }),
        );
        for (const code of ["BR", "AU", "IN", "DE"])
            lost = reducer(lost, submitGuess(code));
        expect(lost.score).toBe(0);
        expect(lost.status).toBe("lost");
        expect(reducer(lost, submitGuess("CA"))).toEqual(lost);
        expect(reducer(lost, nextChallenge())).toEqual(lost);
    });

    it("can win after using 15 guesses", () => {
        let state = reducer(
            undefined,
            startRound({ challenges, difficulty: "Intermediate" }),
        );
        for (let index = 0; index < 7; index += 1) {
            state = reducer(state, submitGuess("BR"));
            state = reducer(
                state,
                submitGuess(getChallenge(state)!.target.countryCode),
            );
            state = reducer(state, nextChallenge());
        }
        state = reducer(
            state,
            submitGuess(getChallenge(state)!.target.countryCode),
        );
        expect(state.history).toHaveLength(15);
        expect(state.status).toBe("won");
    });

    it("keeps playing after 15 guesses while the score is positive", () => {
        let state = reducer(
            undefined,
            startRound({ challenges, difficulty: "Beginner" }),
        );
        for (let index = 0; index < 3; index += 1) {
            const targetCode = getChallenge(state)!.target.countryCode;
            for (const code of choices
                .map((item) => item.countryCode)
                .filter((code) => code !== targetCode)
                .slice(0, 4))
                state = reducer(state, submitGuess(code));
            state = reducer(
                state,
                submitGuess(getChallenge(state)!.target.countryCode),
            );
            state = reducer(state, nextChallenge());
        }
        expect(state.history).toHaveLength(15);
        expect(state.score).toBe(10);
        expect(state.status).toBe("playing");
    });

    it("uses capital answers in Extreme", () => {
        let state = reducer(
            undefined,
            startRound({ challenges, difficulty: "Extreme" }),
        );
        state = reducer(state, submitGuess("BR"));
        expect(state.history.at(-1)).toMatchObject({
            countryName: "BR Capital",
            targetName: "CA Capital",
            correct: false,
        });
        state = reducer(state, submitGuess("CA"));
        expect(state.history.at(-1)).toMatchObject({
            countryName: "CA Capital",
            targetName: "CA Capital",
            correct: true,
        });
    });

    it("resets replay at the same difficulty and clears on exit", () => {
        let state = reducer(
            undefined,
            startRound({ challenges, difficulty: "Beginner" }),
        );
        state = reducer(state, submitGuess("BR"));
        state = reducer(state, prepareRound());
        expect(reducer(state, submitGuess("CA"))).toEqual(state);
        state = reducer(
            state,
            startRound({
                challenges: [...challenges].reverse(),
                difficulty: state.difficulty,
            }),
        );
        expect(state).toMatchObject({
            score: 10,
            status: "playing",
            solved: false,
            history: [],
            incorrectCodes: [],
        });
        expect(getChallenge(state)?.target.countryCode).toBe("CN");
        expect(reducer(state, submitGuess("CN")).score).toBe(14);
        expect(reducer(state, clearOutlineExplorer())).toEqual(
            reducer(undefined, { type: "init" }),
        );
    });

    it("does not start with an empty challenge set", () => {
        const state = reducer(
            undefined,
            startRound({ challenges: [], difficulty: "Expert" }),
        );
        expect(state.status).toBe("idle");
        expect(reducer(state, submitGuess("CA"))).toEqual(state);
    });
});

describe("Outline challenge generation", () => {
    const info: InfoData[] = choices.map((item) => ({
        ...item,
        area: 500_000,
        population: "100",
        currencyCode: "",
        continentName: "",
        borders: [],
        languages: [],
        flag: "",
    }));
    it.each(outlineDifficulties)(
        "always includes the answer once in %s choices",
        (difficulty) => {
            const before = structuredClone(info);
            const result = buildChallenges(info, difficulty, "CA");
            expect(result).toHaveLength(info.length);
            expect(result[0].target.countryCode).not.toBe("CA");
            expect(
                new Set(
                    result.slice(0, 6).map((item) => item.target.countryCode),
                ).size,
            ).toBe(6);
            for (const challenge of result) {
                expect(challenge.choices).toHaveLength(
                    OUTLINE_RULES[difficulty].choices,
                );
                expect(
                    challenge.choices.filter(
                        (item) =>
                            item.countryCode === challenge.target.countryCode,
                    ),
                ).toHaveLength(1);
                expect(
                    new Set(challenge.choices.map((item) => item.countryCode))
                        .size,
                ).toBe(challenge.choices.length);
            }
            expect(info).toEqual(before);
        },
    );
    it("handles small and insufficient eligible pools", () => {
        expect(buildChallenges([], "Beginner")).toEqual([]);
        expect(buildChallenges(info.slice(0, 1), "Beginner")).toEqual([]);
        expect(
            buildChallenges(
                info.map((item) => ({ ...item, area: 10 })),
                "Beginner",
            ),
        ).toEqual([]);
        expect(
            buildChallenges(info.slice(0, 2), "Beginner")[0].choices,
        ).toHaveLength(2);
    });

    it("prioritizes continent and region distractors before fallbacks", () => {
        const groupedInfo: InfoData[] = [
            ["AA", "R1", "X"],
            ["AB", "R1", "X"],
            ["AC", "R2", "X"],
            ["BA", "R3", "Y"],
            ["BB", "R3", "Y"],
            ["CA", "R4", "Z"],
        ].map(([countryCode, region, continentName]) => ({
            countryCode,
            countryName: countryCode,
            capital: `${countryCode} Capital`,
            region,
            continentName,
            area: 500_000,
            population: "100",
            currencyCode: "",
            borders: [],
            languages: [],
            flag: "",
        }));

        for (const difficulty of [
            "Intermediate",
            "Advanced",
            "Expert",
        ] as const) {
            for (const challenge of buildChallenges(groupedInfo, difficulty)) {
                const sameContinent = groupedInfo.filter(
                    (item) =>
                        item.continentName === challenge.target.continentName,
                ).length;
                expect(
                    challenge.choices.filter(
                        (item) =>
                            item.continentName ===
                            challenge.target.continentName,
                    ),
                ).toHaveLength(
                    Math.min(OUTLINE_RULES[difficulty].choices, sameContinent),
                );

                if (difficulty !== "Intermediate") {
                    const sameRegion = groupedInfo.filter(
                        (item) => item.region === challenge.target.region,
                    ).length;
                    expect(
                        challenge.choices.filter(
                            (item) => item.region === challenge.target.region,
                        ),
                    ).toHaveLength(
                        Math.min(OUTLINE_RULES[difficulty].choices, sameRegion),
                    );
                }
            }
        }
    });

    it("builds Extreme choices from unique, non-empty capitals", () => {
        const withDuplicateAndEmpty = [
            ...info,
            { ...info[0], countryCode: "XX", capital: info[0].capital },
            { ...info[1], countryCode: "YY", capital: "" },
        ];
        const result = buildChallenges(withDuplicateAndEmpty, "Extreme");
        expect(result).toHaveLength(info.length);
        for (const challenge of result) {
            const answers = challenge.choices.map((choice) =>
                getOutlineAnswer(choice, "Extreme"),
            );
            expect(answers.every(Boolean)).toBe(true);
            expect(new Set(answers).size).toBe(answers.length);
        }
    });

    it("uses the balanced score, choice, and session settings", () => {
        expect(OUTLINE_RULES).toMatchObject({
            Beginner: {
                reward: 4,
                penalty: 1,
                minimumArea: 200_000,
                choices: 3,
            },
            Intermediate: {
                reward: 3,
                penalty: 2,
                minimumArea: 100_000,
                choices: 4,
            },
            Advanced: {
                reward: 2,
                penalty: 2,
                minimumArea: 20_000,
                choices: 5,
            },
            Expert: {
                reward: 2,
                penalty: 3,
                minimumArea: 0,
                choices: 6,
            },
            Extreme: {
                reward: 2,
                penalty: 3,
                minimumArea: 0,
                choices: 6,
                answer: "capital",
            },
        });
    });
});
