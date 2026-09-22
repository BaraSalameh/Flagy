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
    OUTLINE_RULES,
    type OutlineCountry,
    type OutlineChallenge,
} from "./rules";
import { difficulties } from "@/shared/types/game";
import type { InfoData } from "@/shared/types/country";

const country = (code: string): OutlineCountry => ({
    countryCode: code,
    countryName: code,
    capital: "Capital",
    region: "Region",
});
const choices = ["CA", "CN", "BR", "AU", "IN", "DE"].map(country);
const challenges: OutlineChallenge[] = [
    { target: choices[0], choices },
    { target: choices[1], choices },
];

describe("Outline Explorer rounds", () => {
    it.each(difficulties)(
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
        for (const code of ["BR", "AU", "IN"])
            lost = reducer(lost, submitGuess(code));
        expect(lost.score).toBe(0);
        expect(lost.status).toBe("lost");
        expect(reducer(lost, submitGuess("CA"))).toEqual(lost);
        expect(reducer(lost, nextChallenge())).toEqual(lost);
    });

    it("awards a win on the twentieth guess", () => {
        let state = reducer(
            undefined,
            startRound({ challenges, difficulty: "Intermediate" }),
        );
        for (let index = 0; index < 10; index += 1) {
            state = reducer(state, submitGuess("BR"));
            state = reducer(
                state,
                submitGuess(getChallenge(state)!.target.countryCode),
            );
            state = reducer(state, nextChallenge());
        }
        expect(state.history).toHaveLength(20);
        expect(state.status).toBe("won");
    });

    it("ends at twenty guesses when the positive score is below the goal", () => {
        let state = reducer(
            undefined,
            startRound({ challenges, difficulty: "Beginner" }),
        );
        for (let index = 0; index < 5; index += 1) {
            for (const code of ["BR", "AU", "IN"])
                state = reducer(state, submitGuess(code));
            state = reducer(
                state,
                submitGuess(getChallenge(state)!.target.countryCode),
            );
            state = reducer(state, nextChallenge());
        }
        expect(state.history).toHaveLength(20);
        expect(state.score).toBe(15);
        expect(state.status).toBe("lost");
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
    it.each(difficulties)(
        "always includes the answer once in %s choices",
        (difficulty) => {
            const before = structuredClone(info);
            const result = buildChallenges(info, difficulty, "CA");
            expect(result).toHaveLength(20);
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
});
