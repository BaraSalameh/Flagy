import type { InfoData } from "@/shared/types/country";
import type { GameDifficulty } from "@/shared/types/game";

export type BorderHopCountry = Pick<
    InfoData,
    "countryCode" | "countryName" | "flag"
>;

export interface BorderGraph {
    countries: Record<string, BorderHopCountry>;
    neighbors: Record<string, string[]>;
}

export interface BorderHopPuzzle {
    start: BorderHopCountry;
    destination: BorderHopCountry;
    optimalPath: string[];
    maxMoves: number;
    neighbors: Record<string, string[]>;
}

export const BORDER_HOP_RULES: Record<
    GameDifficulty,
    {
        minHops: number;
        maxHops: number;
        extraMoves: number;
        hints: number;
        showDistance: boolean;
    }
> = {
    Beginner: {
        minHops: 2,
        maxHops: 2,
        extraMoves: 4,
        hints: 2,
        showDistance: true,
    },
    Intermediate: {
        minHops: 3,
        maxHops: 4,
        extraMoves: 3,
        hints: 1,
        showDistance: true,
    },
    Advanced: {
        minHops: 5,
        maxHops: 6,
        extraMoves: 2,
        hints: 1,
        showDistance: false,
    },
    Expert: {
        minHops: 7,
        maxHops: 9,
        extraMoves: 1,
        hints: 0,
        showDistance: false,
    },
};

export function buildBorderGraph(countries: readonly InfoData[]): BorderGraph {
    const byName = new Map(
        countries.map((country) => [country.countryName, country.countryCode]),
    );
    const countryByCode = Object.fromEntries(
        countries.map(({ countryCode, countryName, flag }) => [
            countryCode,
            { countryCode, countryName, flag },
        ]),
    );
    const neighborSets = new Map<string, Set<string>>(
        countries.map((country) => [country.countryCode, new Set<string>()]),
    );

    for (const country of countries) {
        for (const borderName of country.borders) {
            const borderCode = byName.get(borderName);
            if (!borderCode || borderCode === country.countryCode) continue;
            neighborSets.get(country.countryCode)?.add(borderCode);
            neighborSets.get(borderCode)?.add(country.countryCode);
        }
    }

    return {
        countries: countryByCode,
        neighbors: Object.fromEntries(
            [...neighborSets].map(([code, neighbors]) => [
                code,
                [...neighbors].sort(),
            ]),
        ),
    };
}

export function findShortestPath(
    neighbors: Readonly<Record<string, readonly string[]>>,
    startCode: string,
    destinationCode: string,
): string[] {
    if (startCode === destinationCode) return [startCode];
    if (!neighbors[startCode] || !neighbors[destinationCode]) return [];

    const queue = [startCode];
    const previous = new Map<string, string | null>([[startCode, null]]);
    for (let index = 0; index < queue.length; index += 1) {
        const current = queue[index];
        for (const neighbor of neighbors[current] ?? []) {
            if (previous.has(neighbor)) continue;
            previous.set(neighbor, current);
            if (neighbor === destinationCode) {
                const path = [destinationCode];
                let cursor: string | null = current;
                while (cursor) {
                    path.push(cursor);
                    cursor = previous.get(cursor) ?? null;
                }
                return path.reverse();
            }
            queue.push(neighbor);
        }
    }
    return [];
}

export function buildBorderHopPuzzle(
    countries: readonly InfoData[],
    difficulty: GameDifficulty,
    previousKey?: string,
    random: () => number = Math.random,
): BorderHopPuzzle | undefined {
    const graph = buildBorderGraph(countries);
    const rules = BORDER_HOP_RULES[difficulty];
    const codes = Object.keys(graph.countries).filter(
        (code) => graph.neighbors[code]?.length,
    );
    const candidates: Array<{ path: string[]; key: string }> = [];

    for (let startIndex = 0; startIndex < codes.length; startIndex += 1) {
        for (
            let destinationIndex = startIndex + 1;
            destinationIndex < codes.length;
            destinationIndex += 1
        ) {
            const path = findShortestPath(
                graph.neighbors,
                codes[startIndex],
                codes[destinationIndex],
            );
            const hops = path.length - 1;
            if (hops < rules.minHops || hops > rules.maxHops) continue;
            candidates.push({
                path,
                key: [path[0], path.at(-1)].sort().join("-"),
            });
        }
    }

    const fresh = candidates.filter(
        (candidate) => candidate.key !== previousKey,
    );
    const pool = fresh.length ? fresh : candidates;
    if (!pool.length) return undefined;
    const chosen =
        pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))];
    const startCode = chosen.path[0];
    const destinationCode = chosen.path.at(-1)!;
    return {
        start: graph.countries[startCode],
        destination: graph.countries[destinationCode],
        optimalPath: chosen.path,
        maxMoves: chosen.path.length - 1 + rules.extraMoves,
        neighbors: graph.neighbors,
    };
}

export const getPuzzleKey = (puzzle?: BorderHopPuzzle | null) =>
    puzzle
        ? [puzzle.start.countryCode, puzzle.destination.countryCode]
              .sort()
              .join("-")
        : undefined;
