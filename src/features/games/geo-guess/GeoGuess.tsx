"use client";

import { useEffect, useMemo, useState } from "react";
import { Map } from "@/features/map/Map";
import { GameShell } from "@/features/game-shell/GameShell";
import { useMapDataState } from "@/lib/contexts/hooks/useLoadMapData";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Button, ButtonLink, Dialog } from "@/shared/ui";
import { difficulties, type GameDifficulty } from "@/shared/types/game";
import {
    clearGeoGuess,
    prepareRound,
    startRound,
} from "./model/geo-guess-slice";
import { chooseCountry, GEO_GUESS_RULES } from "./model/rules";
import { GuessPanel } from "./GuessPanel";

export const GeoGuess = () => {
    const dispatch = useAppDispatch();
    const round = useAppSelector((state) => state.geoGuess);
    const { map, info, status, error, retry } = useMapDataState();
    const [resultDismissed, setResultDismissed] = useState(false);
    const countries = useMemo(() => {
        const codes = new Set(
            map?.features.map((feature) => feature.properties?.ISO2),
        );
        return Object.values(info ?? {})
            .filter((country) => codes.has(country.countryCode))
            .sort((a, b) => a.countryName.localeCompare(b.countryName, "en"));
    }, [info, map]);

    useEffect(
        () => () => {
            dispatch(clearGeoGuess());
        },
        [dispatch],
    );

    const start = (difficulty: GameDifficulty) => {
        const country = chooseCountry(
            countries,
            difficulty,
            round.target?.countryCode,
        );
        if (!country) return;
        setResultDismissed(false);
        dispatch(startRound({ country, difficulty }));
    };
    const isFinished = round.status === "won" || round.status === "lost";

    return (
        <GameShell game="geo-guess">
            <Map game="geo-guess" />
            <Dialog
                title="Geo Guess"
                open={round.status === "idle"}
                closeable={false}
                description="Find a mystery country using progressively revealed clues. The first clue is ready before your first guess. Select the country on the map or guess by name. Every distinct guess uses one attempt; repeated guesses are free. Later clue timing depends on difficulty, and there is no timer."
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
                                const rules = GEO_GUESS_RULES[difficulty];
                                const available =
                                    status === "ready" &&
                                    countries.some(
                                        (country) =>
                                            country.area > rules.minimumArea,
                                    );
                                return (
                                    <Button
                                        key={difficulty}
                                        variant="secondary"
                                        disabled={!available}
                                        onClick={() => start(difficulty)}
                                        className="h-auto flex-col items-start gap-1 text-left"
                                    >
                                        <span>{difficulty}</span>
                                        <span className="text-xs font-medium text-muted">
                                            {rules.guesses} guesses ·{" "}
                                            {rules.clues.length} clues
                                        </span>
                                        <span className="text-xs font-medium text-muted">
                                            Clues: start,{" "}
                                            {rules.revealAt.slice(1).join(", ")}
                                        </span>
                                        <span className="text-xs font-medium text-muted">
                                            {rules.minimumArea
                                                ? `Area: >${rules.minimumArea.toLocaleString("en-US")} km²`
                                                : "Area: any"}
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
                        {status === "ready" && countries.length === 0 ? (
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
            {round.status !== "idle" && round.target ? (
                <GuessPanel countries={countries} />
            ) : null}
            <Dialog
                title={
                    round.status === "won"
                        ? "Mystery solved — you win!"
                        : "Mystery escaped — round lost"
                }
                open={isFinished && !resultDismissed}
                closeable={false}
                description={
                    round.status === "won"
                        ? `${round.target?.countryName} was the mystery country. You followed the clues and found it in ${round.guesses.length} ${round.guesses.length === 1 ? "guess" : "guesses"}, with ${round.remainingGuesses} ${round.remainingGuesses === 1 ? "attempt" : "attempts"} still in your pocket.`
                        : `You used every guess, but the trail led to ${round.target?.countryName}. Explore where it sits on the map, remember the clues, and return for another mystery.`
                }
            >
                <p className="mb-5 text-sm text-muted">
                    {round.target?.capital} · {round.target?.countryName}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                    <Button onClick={() => dispatch(prepareRound())}>
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
};
