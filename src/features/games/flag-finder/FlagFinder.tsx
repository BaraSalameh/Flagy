"use client";

import { useEffect, useMemo, useState } from "react";
import { Map } from "@/features/map/Map";
import { GameShell } from "@/features/game-shell/GameShell";
import { useMapDataState } from "@/lib/contexts/hooks/useLoadMapData";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Button, ButtonLink, Dialog } from "@/shared/ui";
import { difficulties, type GameDifficulty } from "@/shared/types/game";
import { FlagPanel } from "./FlagPanel";
import {
    advanceFlag,
    clearFlagFinder,
    getFlagTarget,
    prepareFlagFinder,
    startFlagFinder,
} from "./model/flag-finder-slice";
import { buildFlagDeck, FLAG_FINDER_RULES } from "./model/rules";

export function FlagFinder() {
    const dispatch = useAppDispatch();
    const round = useAppSelector((state) => state.flagFinder);
    const { map, info, status, error, retry } = useMapDataState();
    const [resultDismissed, setResultDismissed] = useState(false);
    const target = getFlagTarget(round);
    const countries = useMemo(() => {
        const codes = new Set(
            map?.features.map((feature) => feature.properties?.ISO2),
        );
        return Object.values(info ?? {}).filter((country) =>
            codes.has(country.countryCode),
        );
    }, [info, map]);

    useEffect(
        () => () => {
            dispatch(clearFlagFinder());
        },
        [dispatch],
    );

    const start = (difficulty: GameDifficulty) => {
        const deck = buildFlagDeck(countries, difficulty, target?.countryCode);
        if (!deck.length) return;
        setResultDismissed(false);
        dispatch(startFlagFinder({ deck, difficulty }));
    };

    const nextFlag = () => {
        const replacementDeck =
            round.targetIndex === round.deck.length - 1
                ? buildFlagDeck(
                      countries,
                      round.difficulty,
                      target?.countryCode,
                  )
                : undefined;
        dispatch(advanceFlag({ replacementDeck }));
    };

    return (
        <GameShell game="flag-finder">
            <Map game="flag-finder" />
            <Dialog
                title="Flag Finder"
                open={round.status === "idle"}
                closeable={false}
                description="Study the flag, then locate its country on the world map. Keep your streak alive before the attempts run out. There is no timer."
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
                                const rules = FLAG_FINDER_RULES[difficulty];
                                const borderDescription =
                                    rules.borderOpacity === 1
                                        ? "Clear borders"
                                        : rules.borderOpacity === 0
                                          ? "Hidden borders"
                                          : `${Math.round(rules.borderOpacity * 100)}% borders`;
                                return (
                                    <Button
                                        key={difficulty}
                                        variant="secondary"
                                        disabled={
                                            status !== "ready" ||
                                            !countries.some(
                                                (country) =>
                                                    country.area >
                                                    rules.minimumArea,
                                            )
                                        }
                                        onClick={() => start(difficulty)}
                                        className="h-auto flex-col items-start gap-1 text-left"
                                    >
                                        <span>{difficulty}</span>
                                        <span className="text-xs font-medium text-muted">
                                            {rules.attempts}{" "}
                                            {rules.attempts === 1
                                                ? "attempt"
                                                : "attempts"}{" "}
                                            · {borderDescription}
                                        </span>
                                        <span className="text-xs font-medium text-muted">
                                            {rules.minimumArea
                                                ? `Countries over ${rules.minimumArea.toLocaleString("en-US")} km²`
                                                : "Countries of any size"}
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
                                    No playable countries are available.
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

            {round.status !== "idle" && target ? (
                <FlagPanel onNext={nextFlag} />
            ) : null}

            <Dialog
                title="Streak ended"
                open={round.status === "lost" && !resultDismissed}
                closeable={false}
                description={`You identified ${round.streak} ${round.streak === 1 ? "flag" : "flags"} before running out of attempts. The final flag was ${target?.countryName}.`}
            >
                <p className="mb-5 text-sm text-muted">
                    Final streak: {round.streak}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                    <Button onClick={() => dispatch(prepareFlagFinder())}>
                        Play again
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setResultDismissed(true)}
                    >
                        Explore answer
                    </Button>
                </div>
                <ButtonLink href="/" variant="ghost" className="mt-2 w-full">
                    Game hub
                </ButtonLink>
            </Dialog>
        </GameShell>
    );
}
