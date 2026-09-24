import { describe, expect, it } from "vitest";
import reducer, {
    clearGeoGuess,
    prepareRound,
    startRound,
    submitGuess,
} from "./geo-guess-slice";
import { chooseCountry, getClues, GEO_GUESS_RULES } from "./rules";
import { difficulties } from "@/shared/types/game";
import type { InfoData } from "@/shared/types/country";

const canada: InfoData = {
    countryCode: "CA",
    countryName: "Canada",
    currencyCode: "CAD",
    population: "40000000",
    capital: "Ottawa",
    continentName: "North America",
    region: "Northern America",
    area: 9984670,
    borders: ["United States of America"],
    languages: ["English", "French"],
    flag: "",
};
const china: InfoData = {
    ...canada,
    countryCode: "CN",
    countryName: "China",
    population: "1400000000",
};

describe("Geo Guess rounds", () => {
    it.each(difficulties)(
        "starts %s with its first clue and full guesses",
        (difficulty) => {
            const state = reducer(
                undefined,
                startRound({ country: canada, difficulty }),
            );
            expect(state.status).toBe("playing");
            expect(state.remainingGuesses).toBe(
                GEO_GUESS_RULES[difficulty].guesses,
            );
            expect(
                getClues(state.target!, difficulty, state.guesses.length),
            ).toHaveLength(1);
            expect(
                getClues(state.target!, difficulty, state.guesses.length)[0]
                    .key,
            ).toBe(GEO_GUESS_RULES[difficulty].clues[0]);
        },
    );

    it("replays at the same difficulty with a new target and fresh clues", () => {
        let state = reducer(
            undefined,
            startRound({ country: canada, difficulty: "Beginner" }),
        );
        state = reducer(state, submitGuess("CA"));
        expect(state.status).toBe("won");
        state = reducer(state, prepareRound());
        const nextCountry = chooseCountry(
            [canada, china],
            state.difficulty,
            state.target?.countryCode,
        );
        expect(nextCountry).toEqual(china);
        state = reducer(
            state,
            startRound({ country: nextCountry!, difficulty: state.difficulty }),
        );
        expect(state.status).toBe("playing");
        expect(state.guesses).toEqual([]);
        expect(state.remainingGuesses).toBe(12);
        expect(getClues(state.target!, state.difficulty, 0)[0].text).toBe(
            "Continent: North America",
        );
        expect(reducer(state, submitGuess("CN")).status).toBe("won");
    });

    it("does not charge twice for a repeated country, even after another guess", () => {
        let state = reducer(
            undefined,
            startRound({ country: canada, difficulty: "Expert" }),
        );
        for (const code of ["CN", "AU", "CN", "CN"])
            state = reducer(state, submitGuess(code));
        expect(state.guesses).toEqual(["CN", "AU"]);
        expect(state.remainingGuesses).toBe(4);
    });

    it("accepts a correct final guess and freezes completed rounds", () => {
        let state = reducer(
            undefined,
            startRound({ country: canada, difficulty: "Expert" }),
        );
        for (const code of ["CN", "AU", "BR", "US", "JO"])
            state = reducer(state, submitGuess(code));
        const won = reducer(state, submitGuess("CA"));
        expect(won.status).toBe("won");
        expect(won.remainingGuesses).toBe(0);
        expect(reducer(won, submitGuess("DE"))).toEqual(won);
        const lost = reducer(state, submitGuess("DE"));
        expect(lost.status).toBe("lost");
        expect(reducer(lost, submitGuess("CA"))).toEqual(lost);
    });

    it("ignores selections outside an active round and clears on exit", () => {
        const idle = reducer(undefined, { type: "init" });
        expect(reducer(idle, submitGuess("CA"))).toEqual(idle);
        const playing = reducer(
            idle,
            startRound({ country: canada, difficulty: "Beginner" }),
        );
        expect(reducer(playing, clearGeoGuess())).toEqual(idle);
        expect(
            reducer(reducer(playing, prepareRound()), submitGuess("CA")).status,
        ).toBe("idle");
    });
});

describe("Geo Guess rules", () => {
    const expectedRules = {
        Beginner: {
            guesses: 12,
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
            clues: ["region", "languages", "borders", "area", "population"],
            revealAt: [0, 2, 4, 6, 7],
        },
        Expert: {
            guesses: 6,
            clues: ["area", "population", "region", "languages"],
            revealAt: [0, 2, 4, 5],
        },
    } as const;

    it.each(difficulties)(
        "always reveals the first %s clue before any guess",
        (difficulty) => {
            expect(getClues(canada, difficulty, 0)).toHaveLength(1);
            expect(getClues(canada, difficulty, 0)[0].key).toBe(
                GEO_GUESS_RULES[difficulty].clues[0],
            );
        },
    );

    it.each(difficulties)(
        "uses the complete %s clue order and reveal schedule",
        (difficulty) => {
            const expected = expectedRules[difficulty];
            expect(GEO_GUESS_RULES[difficulty]).toMatchObject(expected);
            for (
                let guessesUsed = 0;
                guessesUsed <= expected.guesses;
                guessesUsed += 1
            ) {
                expect(
                    getClues(canada, difficulty, guessesUsed).map(
                        (clue) => clue.key,
                    ),
                ).toEqual(
                    expected.clues.slice(
                        0,
                        expected.revealAt.filter(
                            (threshold) => guessesUsed >= threshold,
                        ).length,
                    ),
                );
            }
        },
    );

    it("keeps earlier clues visible and formats lists readably", () => {
        expect(getClues(canada, "Beginner", 3)).toContainEqual({
            key: "languages",
            text: "Languages: English, French",
        });
    });

    it("filters by area, handles empty pools, and allows the only eligible country on replay", () => {
        const smallCountry = { ...china, area: 100 };
        expect(chooseCountry([], "Beginner")).toBeUndefined();
        expect(chooseCountry([smallCountry], "Beginner")).toBeUndefined();
        expect(chooseCountry([smallCountry], "Expert")).toEqual(smallCountry);
        expect(chooseCountry([smallCountry, canada], "Beginner", "CA")).toEqual(
            canada,
        );
    });
});
