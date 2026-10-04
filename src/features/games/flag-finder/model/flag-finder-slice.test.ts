import { describe, expect, it, vi } from "vitest";
import type { InfoData } from "@/shared/types/country";
import { difficulties } from "@/shared/types/game";
import reducer, {
    advanceFlag,
    clearFlagFinder,
    getFlagTarget,
    prepareFlagFinder,
    startFlagFinder,
    submitFlagGuess,
} from "./flag-finder-slice";
import { buildFlagDeck, FLAG_FINDER_RULES, type FlagCountry } from "./rules";

const canada: FlagCountry = {
    countryCode: "CA",
    countryName: "Canada",
    capital: "Ottawa",
    region: "Northern America",
};
const china: FlagCountry = {
    countryCode: "CN",
    countryName: "China",
    capital: "Beijing",
    region: "Eastern Asia",
};
const brazil = { countryCode: "BR", countryName: "Brazil" };
const deck = [canada, china];

describe("Flag Finder rounds", () => {
    it.each(difficulties)(
        "starts %s with the configured attempt count",
        (difficulty) => {
            const state = reducer(
                undefined,
                startFlagFinder({ deck, difficulty }),
            );
            expect(state.attemptsRemaining).toBe(
                FLAG_FINDER_RULES[difficulty].attempts,
            );
            expect(getFlagTarget(state)).toEqual(canada);
        },
    );

    it("charges a wrong country, changes the flag, and reveals the final answer", () => {
        let state = reducer(
            undefined,
            startFlagFinder({ deck, difficulty: "Advanced" }),
        );
        state = reducer(state, submitFlagGuess(brazil));
        expect(state.attemptsRemaining).toBe(1);
        expect(getFlagTarget(state)).toEqual(china);
        expect(state.incorrectCodes).toEqual([]);
        state = reducer(
            state,
            submitFlagGuess({ countryCode: "JO", countryName: "Jordan" }),
        );
        expect(state).toMatchObject({
            status: "lost",
            attemptsRemaining: 0,
            revealedAnswer: true,
            streak: 0,
        });
        expect(getFlagTarget(state)).toEqual(china);
        expect(reducer(state, submitFlagGuess(china))).toEqual(state);
    });

    it("wraps to the first flag after a non-final miss at the end of the deck", () => {
        let state = reducer(
            undefined,
            startFlagFinder({ deck, difficulty: "Beginner" }),
        );
        state = reducer(state, submitFlagGuess(canada));
        state = reducer(state, advanceFlag({}));
        state = reducer(state, submitFlagGuess(brazil));
        expect(getFlagTarget(state)).toEqual(canada);
        expect(state.attemptsRemaining).toBe(3);
    });

    it("increments the streak and waits for an explicit next flag", () => {
        let state = reducer(
            undefined,
            startFlagFinder({ deck, difficulty: "Beginner" }),
        );
        state = reducer(state, submitFlagGuess(canada));
        expect(state.streak).toBe(1);
        expect(getFlagTarget(state)).toEqual(canada);
        expect(state.lastSelection?.correct).toBe(true);
        expect(reducer(state, submitFlagGuess(china))).toEqual(state);
        state = reducer(state, advanceFlag({}));
        expect(getFlagTarget(state)).toEqual(china);
        expect(state.lastSelection).toBeNull();
        expect(state.attemptsRemaining).toBe(4);
    });

    it("accepts a replacement deck only after the current deck is exhausted", () => {
        let state = reducer(
            undefined,
            startFlagFinder({ deck: [canada], difficulty: "Expert" }),
        );
        expect(
            reducer(state, advanceFlag({ replacementDeck: [china] })),
        ).toEqual(state);
        state = reducer(state, submitFlagGuess(canada));
        state = reducer(state, advanceFlag({ replacementDeck: [china] }));
        expect(getFlagTarget(state)).toEqual(china);
        expect(state.streak).toBe(1);
        expect(state.attemptsRemaining).toBe(1);
    });

    it("returns to onboarding and can be cleared", () => {
        let state = reducer(
            undefined,
            startFlagFinder({ deck, difficulty: "Beginner" }),
        );
        state = reducer(state, prepareFlagFinder());
        expect(state.status).toBe("idle");
        expect(reducer(state, submitFlagGuess(canada))).toEqual(state);
        expect(reducer(state, clearFlagFinder())).toEqual(
            reducer(undefined, { type: "init" }),
        );
    });

    it("does not start with an empty deck", () => {
        const state = reducer(
            undefined,
            startFlagFinder({ deck: [], difficulty: "Expert" }),
        );
        expect(state.status).toBe("idle");
    });
});

describe("Flag Finder deck selection", () => {
    const info = (country: FlagCountry, area: number): InfoData => ({
        ...country,
        area,
        population: "100",
        currencyCode: "",
        continentName: "",
        borders: [],
        languages: [],
        flag: "",
    });

    it("uses the shared area thresholds and keeps the input immutable", () => {
        const countries = [
            info(canada, 9_000_000),
            info(china, 150_000),
            info({ ...canada, countryCode: "VA" }, 1),
        ];
        const before = structuredClone(countries);
        expect(buildFlagDeck(countries, "Beginner")).toHaveLength(1);
        expect(buildFlagDeck(countries, "Intermediate")).toHaveLength(2);
        expect(buildFlagDeck(countries, "Expert")).toHaveLength(3);
        expect(countries).toEqual(before);
        expect(buildFlagDeck([], "Beginner")).toEqual([]);
        expect(
            buildFlagDeck(
                [
                    info(
                        {
                            ...canada,
                            countryCode: "ZZ",
                            countryName: "No bundled flag",
                        },
                        9_000_000,
                    ),
                ],
                "Expert",
            ),
        ).toEqual([]);
    });

    it("moves the previous opener away from the front after reshuffling", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.99);
        const countries = [info(canada, 9_000_000), info(china, 9_000_000)];
        expect(buildFlagDeck(countries, "Beginner", "CA")[0]).toEqual(china);
        vi.restoreAllMocks();
    });

    it("defines the requested attempt and border curve", () => {
        expect(FLAG_FINDER_RULES).toEqual({
            Beginner: {
                attempts: 4,
                minimumArea: 200_000,
                borderOpacity: 1,
            },
            Intermediate: {
                attempts: 3,
                minimumArea: 100_000,
                borderOpacity: 0.5,
            },
            Advanced: {
                attempts: 2,
                minimumArea: 20_000,
                borderOpacity: 0.18,
            },
            Expert: {
                attempts: 1,
                minimumArea: 0,
                borderOpacity: 0,
            },
        });
    });
});
