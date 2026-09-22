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
                description="Find a mystery country using clues. Select it on the map or guess by name. Every new guess uses one attempt; another clue unlocks after every two guesses. Take your time."
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
                        ? "Brilliant journey!"
                        : "A little detour"
                }
                open={isFinished && !resultDismissed}
                closeable={false}
                description={
                    round.status === "won"
                        ? `You found ${round.target?.countryName} in ${round.guesses.length} ${round.guesses.length === 1 ? "guess" : "guesses"}.`
                        : `The mystery country was ${round.target?.countryName}. Every round is a chance to learn.`
                }
            >
                <p className="mb-5 text-sm text-muted">
                    {round.target?.capital} · {round.target?.region}
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
