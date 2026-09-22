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
            ).toEqual([{ key: "population", text: "Population: about 40M" }]);
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
        expect(state.remainingGuesses).toBe(15);
        expect(getClues(state.target!, state.difficulty, 0)[0].text).toBe(
            "Population: about 1.4B",
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
        expect(state.remainingGuesses).toBe(5);
    });

    it("accepts a correct final guess and freezes completed rounds", () => {
        let state = reducer(
            undefined,
            startRound({ country: canada, difficulty: "Expert" }),
        );
        for (const code of ["CN", "AU", "BR", "US", "JO", "IN"])
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
    it("keeps earlier clues visible between unlocks and formats lists readably", () => {
        const first = getClues(canada, "Beginner", 0);
        expect(getClues(canada, "Beginner", 1)).toEqual(first);
        expect(getClues(canada, "Beginner", 2)).toHaveLength(2);
        expect(getClues(canada, "Beginner", 2)[0]).toEqual(first[0]);
        expect(getClues(canada, "Beginner", 12)).toContainEqual({
            key: "languages",
            text: "Languages: English, French",
        });
        expect(getClues(canada, "Expert", 6).map((clue) => clue.key)).toEqual([
            "population",
            "area",
            "continentName",
            "region",
        ]);
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
