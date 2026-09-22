import { describe, expect, it } from "vitest";
import reducer, {
    clearMapMaster,
    getTarget,
    prepareRound,
    startRound,
    submitGuess,
} from "./map-master-slice";
import { buildChallengeDeck, MAP_MASTER_RULES, type MapCountry } from "./rules";
import { difficulties } from "@/shared/types/game";
import type { InfoData } from "@/shared/types/country";

const canada: MapCountry = {
    countryCode: "CA",
    countryName: "Canada",
    capital: "Ottawa",
    region: "Northern America",
};
const china: MapCountry = {
    countryCode: "CN",
    countryName: "China",
    capital: "Beijing",
    region: "Eastern Asia",
};
const wrongCountry = { countryCode: "BR", countryName: "Brazil" };
const deck = [canada, china];

describe("Map Master rounds", () => {
    it.each(difficulties)(
        "applies %s rewards and penalties exactly once",
        (difficulty) => {
            let state = reducer(undefined, startRound({ deck, difficulty }));
            state = reducer(state, submitGuess(wrongCountry));
            expect(state.score).toBe(10 - MAP_MASTER_RULES[difficulty].penalty);
            expect(getTarget(state)).toEqual(canada);
            state = reducer(state, submitGuess(canada));
            expect(state.score).toBe(
                10 -
                    MAP_MASTER_RULES[difficulty].penalty +
                    MAP_MASTER_RULES[difficulty].reward,
            );
            expect(getTarget(state)).toEqual(china);
            expect(state.history).toHaveLength(2);
            expect(state.history.at(-1)).toMatchObject({
                correct: true,
                countryName: "Canada",
            });
        },
    );

    it("does not charge repeated wrong guesses or a double click on the last correct answer", () => {
        let state = reducer(
            undefined,
            startRound({ deck, difficulty: "Beginner" }),
        );
        state = reducer(state, submitGuess(wrongCountry));
        expect(reducer(state, submitGuess(wrongCountry))).toEqual(state);
        state = reducer(state, submitGuess(canada));
        expect(reducer(state, submitGuess(canada))).toEqual(state);
        state = reducer(state, submitGuess(wrongCountry));
        expect(state.score).toBe(12);
        expect(state.history).toHaveLength(3);
    });

    it("matches country codes even when display names differ", () => {
        const state = reducer(
            undefined,
            startRound({
                deck: [
                    {
                        ...canada,
                        countryCode: "VA",
                        countryName: "Vatican City",
                    },
                    china,
                ],
                difficulty: "Beginner",
            }),
        );
        const next = reducer(
            state,
            submitGuess({ countryCode: "VA", countryName: "Vatican" }),
        );
        expect(next.score).toBe(14);
        expect(next.history[0].correct).toBe(true);
        expect(getTarget(next)).toEqual(china);
    });

    it("caps winning scores and prevents updates after a win or loss", () => {
        let state = reducer(
            undefined,
            startRound({ deck, difficulty: "Beginner" }),
        );
        for (const country of [canada, china, canada])
            state = reducer(state, submitGuess(country));
        expect(state.status).toBe("won");
        expect(state.score).toBe(20);
        expect(state.history.at(-1)?.points).toBe(2);
        expect(reducer(state, submitGuess(wrongCountry))).toEqual(state);
        let lost = reducer(
            undefined,
            startRound({ deck, difficulty: "Expert" }),
        );
        for (const code of ["BR", "JO", "DE"])
            lost = reducer(
                lost,
                submitGuess({ countryCode: code, countryName: code }),
            );
        expect(lost.score).toBe(0);
        expect(lost.status).toBe("lost");
        expect(reducer(lost, submitGuess(canada))).toEqual(lost);
    });

    it("wins on the twentieth guess when that guess reaches the goal", () => {
        let state = reducer(
            undefined,
            startRound({ deck, difficulty: "Intermediate" }),
        );
        for (let index = 0; index < 10; index += 1) {
            state = reducer(state, submitGuess(wrongCountry));
            state = reducer(state, submitGuess(getTarget(state)!));
        }
        expect(state.history).toHaveLength(20);
        expect(state.score).toBe(20);
        expect(state.status).toBe("won");
    });

    it("ends at twenty guesses even if the score is still positive", () => {
        let state = reducer(
            undefined,
            startRound({ deck, difficulty: "Beginner" }),
        );
        for (let index = 0; index < 4; index += 1) {
            for (const code of ["BR", "JO", "DE", "AU"])
                state = reducer(
                    state,
                    submitGuess({ countryCode: code, countryName: code }),
                );
            state = reducer(state, submitGuess(getTarget(state)!));
        }
        expect(state.history).toHaveLength(20);
        expect(state.score).toBe(10);
        expect(state.status).toBe("lost");
    });

    it("replays with the same difficulty and resets all score and selection state", () => {
        let state = reducer(
            undefined,
            startRound({ deck, difficulty: "Beginner" }),
        );
        for (const country of [canada, china, canada])
            state = reducer(state, submitGuess(country));
        state = reducer(state, prepareRound());
        expect(reducer(state, submitGuess(wrongCountry))).toEqual(state);
        state = reducer(
            state,
            startRound({ deck: [china, canada], difficulty: state.difficulty }),
        );
        expect(state).toMatchObject({
            score: 10,
            status: "playing",
            history: [],
            incorrectCodes: [],
        });
        expect(getTarget(state)).toEqual(china);
        expect(reducer(state, submitGuess(china)).score).toBe(14);
        expect(reducer(state, clearMapMaster())).toEqual(
            reducer(undefined, { type: "init" }),
        );
    });

    it("handles empty pools without starting an unwinnable game", () => {
        const state = reducer(
            undefined,
            startRound({ deck: [], difficulty: "Expert" }),
        );
        expect(state.status).toBe("idle");
        expect(reducer(state, submitGuess(canada))).toEqual(state);
    });
});

describe("Map Master challenge selection", () => {
    const info = (country: MapCountry, area: number): InfoData => ({
        ...country,
        area,
        population: "100",
        currencyCode: "",
        continentName: "",
        borders: [],
        languages: [],
        flag: "",
    });
    it("filters eligibility without mutating input and avoids the previous opener", () => {
        const countries = [
            info(canada, 9_000_000),
            info(china, 9_000_000),
            info({ ...canada, countryCode: "VA" }, 1),
        ];
        const before = structuredClone(countries);
        const result = buildChallengeDeck(countries, "Beginner", "CA");
        expect(result.map((country) => country.countryCode)).toEqual([
            "CN",
            "CA",
        ]);
        expect(countries).toEqual(before);
        expect(buildChallengeDeck(countries, "Expert")).toHaveLength(3);
        expect(buildChallengeDeck([], "Beginner")).toEqual([]);
        expect(buildChallengeDeck([countries[0]], "Beginner", "CA")).toEqual([
            canada,
        ]);
    });
});
