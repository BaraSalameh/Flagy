"use client";

import { useEffect, useMemo, useState } from "react";
import { Map } from "@/features/map/Map";
import { GameShell } from "@/features/game-shell/GameShell";
import { useMapDataState } from "@/lib/contexts/hooks/useLoadMapData";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Button, ButtonLink, Dialog } from "@/shared/ui";
import { difficulties, type GameDifficulty } from "@/shared/types/game";
import {
    clearBorderHop,
    prepareRound,
    startRound,
} from "./model/border-hop-slice";
import {
    BORDER_HOP_RULES,
    buildBorderHopPuzzle,
    getPuzzleKey,
} from "./model/rules";
import { RoutePanel } from "./RoutePanel";

export const BorderHop = () => {
    const dispatch = useAppDispatch();
    const round = useAppSelector((state) => state.borderHop);
    const { map, info, status, error, retry } = useMapDataState();
    const [resultDismissed, setResultDismissed] = useState(false);
    const countries = useMemo(() => {
        const codes = new Set(
            map?.features.map((feature) => feature.properties?.ISO2),
        );
        return Object.values(info ?? {}).filter((country) =>
            codes.has(country.countryCode),
        );
    }, [info, map]);
    const playableDifficulties = useMemo(
        () =>
            new Set(
                status === "ready"
                    ? difficulties.filter((difficulty) =>
                          Boolean(
                              buildBorderHopPuzzle(
                                  countries,
                                  difficulty,
                                  undefined,
                                  () => 0,
                              ),
                          ),
                      )
                    : [],
            ),
        [countries, status],
    );

    useEffect(
        () => () => {
            dispatch(clearBorderHop());
        },
        [dispatch],
    );

    const start = (difficulty: GameDifficulty) => {
        const puzzle = buildBorderHopPuzzle(
            countries,
            difficulty,
            getPuzzleKey(round.puzzle),
        );
        if (!puzzle) return;
        setResultDismissed(false);
        dispatch(startRound({ puzzle, difficulty }));
    };
    const finished = round.status === "won" || round.status === "lost";
    const moves = round.path.length - 1;
    const optimalMoves = (round.puzzle?.optimalPath.length ?? 1) - 1;
    const perfect = round.status === "won" && moves === optimalMoves;

    return (
        <GameShell game="border-hop">
            <Map game="border-hop" />
            <Dialog
                title="Border Hop"
                open={round.status === "idle"}
                closeable={false}
                description="Travel from the blue starting country to the coral destination. Every new stop must share a land border with your current country. Build the route within the move limit; there is no timer."
            >
                {status === "error" ? (
                    <div role="alert">
                        <p className="mb-3 text-sm text-muted">{error}</p>
                        <Button onClick={retry}>Try again</Button>
                    </div>
                ) : (
                    <>
                        <p className="mb-3 text-xs font-black uppercase tracking-widest text-accent">
                            Choose your difficulty
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {difficulties.map((difficulty) => {
                                const rules = BORDER_HOP_RULES[difficulty];
                                return (
                                    <Button
                                        key={difficulty}
                                        variant="secondary"
                                        disabled={
                                            !playableDifficulties.has(
                                                difficulty,
                                            )
                                        }
                                        onClick={() => start(difficulty)}
                                        className="h-auto flex-col items-start gap-1 text-left"
                                    >
                                        <span>{difficulty}</span>
                                        <span className="text-xs font-medium text-muted">
                                            {rules.minHops === rules.maxHops
                                                ? `${rules.minHops} borders apart`
                                                : `${rules.minHops}–${rules.maxHops} borders apart`}
                                        </span>
                                        <span className="text-xs font-medium text-muted">
                                            {rules.hints
                                                ? `${rules.hints} ${rules.hints === 1 ? "hint" : "hints"} · ${rules.extraMoves} extra moves`
                                                : `No hints · ${rules.extraMoves} extra move`}
                                        </span>
                                    </Button>
                                );
                            })}
                        </div>
                        {status === "loading" ? (
                            <p
                                role="status"
                                className="mt-3 text-sm text-muted"
                            >
                                Loading the atlas…
                            </p>
                        ) : null}
                        {status === "ready" && !countries.length ? (
                            <div role="alert" className="mt-3">
                                <p className="mb-2 text-sm text-muted">
                                    No playable land routes are available.
                                </p>
                                <Button onClick={retry}>Reload atlas</Button>
                            </div>
                        ) : null}
                    </>
                )}
                <ButtonLink href="/" variant="ghost" className="mt-3 w-full">
                    Game hub
                </ButtonLink>
            </Dialog>

            {round.status !== "idle" ? <RoutePanel /> : null}

            <Dialog
                title={
                    round.status === "won"
                        ? perfect
                            ? "Perfect route!"
                            : "Destination reached!"
                        : "Route revealed"
                }
                open={finished && !resultDismissed}
                closeable={false}
                description={
                    round.status === "won"
                        ? perfect
                            ? `You connected ${round.puzzle?.start.countryName} to ${round.puzzle?.destination.countryName} in the shortest possible route: ${moves} moves.`
                            : `You reached ${round.puzzle?.destination.countryName} in ${moves} moves. The shortest route takes ${optimalMoves}.`
                        : `The shortest path from ${round.puzzle?.start.countryName} to ${round.puzzle?.destination.countryName} takes ${optimalMoves} moves. It is highlighted on the map.`
                }
            >
                <div className="grid gap-2 sm:grid-cols-2">
                    <Button onClick={() => dispatch(prepareRound())}>
                        New route
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setResultDismissed(true)}
                    >
                        Explore map
                    </Button>
                </div>
                <ButtonLink href="/" variant="ghost" className="mt-2 w-full">
                    Game hub
                </ButtonLink>
            </Dialog>
        </GameShell>
    );
};
