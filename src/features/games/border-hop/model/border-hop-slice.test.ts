import { describe, expect, it } from "vitest";
import type { InfoData } from "@/shared/types/country";
import reducer, {
    clearBorderHop,
    giveUp,
    resetPath,
    selectCountry,
    startRound,
    undoStop,
    useHint,
} from "./border-hop-slice";
import {
    BORDER_HOP_RULES,
    buildBorderGraph,
    buildBorderHopPuzzle,
    findShortestPath,
    type BorderHopPuzzle,
} from "./rules";

const info = (code: string, borders: string[] = []): InfoData => ({
    countryCode: code,
    countryName: code,
    currencyCode: "",
    population: "1",
    capital: `${code} City`,
    continentName: "Test",
    region: "Test",
    area: 1,
    borders,
    languages: [],
    flag: "",
});
const countries = [
    info("AA", ["BB"]),
    info("BB", ["AA", "CC", "MISSING"]),
    info("CC", ["BB", "DD"]),
    info("DD", ["CC", "EE"]),
    info("EE", ["DD", "FF"]),
    info("FF", ["EE", "GG"]),
    info("GG", ["FF", "HH"]),
    info("HH", ["GG", "II"]),
    info("II", ["HH"]),
    info("ISLAND"),
];
const graph = buildBorderGraph(countries);
const puzzle: BorderHopPuzzle = {
    start: graph.countries.AA,
    destination: graph.countries.DD,
    optimalPath: ["AA", "BB", "CC", "DD"],
    maxMoves: 5,
    neighbors: graph.neighbors,
};

describe("Border Hop graph and puzzle generation", () => {
    it("builds undirected edges and ignores unresolved borders", () => {
        expect(graph.neighbors.AA).toEqual(["BB"]);
        expect(graph.neighbors.BB).toEqual(["AA", "CC"]);
        expect(graph.neighbors.ISLAND).toEqual([]);
        expect(findShortestPath(graph.neighbors, "AA", "DD")).toEqual([
            "AA",
            "BB",
            "CC",
            "DD",
        ]);
        expect(findShortestPath(graph.neighbors, "AA", "ISLAND")).toEqual([]);
    });

    it("creates only solvable puzzles in each difficulty range", () => {
        for (const difficulty of [
            "Beginner",
            "Intermediate",
            "Advanced",
            "Expert",
        ] as const) {
            const generated = buildBorderHopPuzzle(
                countries,
                difficulty,
                undefined,
                () => 0,
            );
            expect(generated).toBeDefined();
            const hops = generated!.optimalPath.length - 1;
            expect(hops).toBeGreaterThanOrEqual(
                BORDER_HOP_RULES[difficulty].minHops,
            );
            expect(hops).toBeLessThanOrEqual(
                BORDER_HOP_RULES[difficulty].maxHops,
            );
            expect(generated!.maxMoves).toBe(
                hops + BORDER_HOP_RULES[difficulty].extraMoves,
            );
        }
    });
});

describe("Border Hop rounds", () => {
    it("accepts neighboring countries, rejects jumps, and wins at the destination", () => {
        let state = reducer(
            undefined,
            startRound({ puzzle, difficulty: "Intermediate" }),
        );
        state = reducer(state, selectCountry("CC"));
        expect(state.path).toEqual(["AA"]);
        expect(state.invalidCode).toBe("CC");
        state = reducer(state, selectCountry("BB"));
        state = reducer(state, selectCountry("CC"));
        state = reducer(state, selectCountry("DD"));
        expect(state.status).toBe("won");
        expect(state.path).toEqual(puzzle.optimalPath);
        expect(reducer(state, selectCountry("EE"))).toEqual(state);
    });

    it("supports undo, path reset, backtracking, hints, and giving up", () => {
        let state = reducer(
            undefined,
            startRound({ puzzle, difficulty: "Beginner" }),
        );
        state = reducer(state, selectCountry("BB"));
        state = reducer(state, undoStop());
        expect(state.path).toEqual(["AA"]);
        state = reducer(state, useHint());
        expect(state.path).toEqual(["AA", "BB"]);
        expect(state.hintsUsed).toBe(1);
        state = reducer(state, selectCountry("AA"));
        expect(state.path).toEqual(["AA"]);
        state = reducer(state, resetPath());
        expect(state.path).toEqual(["AA"]);
        state = reducer(state, giveUp());
        expect(state.status).toBe("lost");
        expect(reducer(state, useHint())).toEqual(state);
        expect(reducer(state, clearBorderHop()).status).toBe("idle");
    });
});
