"use client";

import { useEffect, useMemo, useState } from "react";
import { Map } from "@/features/map/Map";
import { GameShell } from "@/features/game-shell/GameShell";
import { useMapDataState } from "@/lib/contexts/hooks/useLoadMapData";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Button, ButtonLink, Dialog } from "@/shared/ui";
import { difficulties, type GameDifficulty } from "@/shared/types/game";
import {
    clearMapMaster,
    getTarget,
    prepareRound,
    startRound,
} from "./model/map-master-slice";
import {
    buildChallengeDeck,
    MAP_MASTER_RULES,
    MAX_GUESSES,
    STARTING_SCORE,
    WINNING_SCORE,
} from "./model/rules";
import { ChallengePanel } from "./ChallengePanel";

export const MapMaster = () => {
    const dispatch = useAppDispatch();
    const round = useAppSelector((state) => state.mapMaster);
    const { map, info, status, error, retry } = useMapDataState();
    const [resultDismissed, setResultDismissed] = useState(false);
    const target = getTarget(round);
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
            dispatch(clearMapMaster());
        },
        [dispatch],
    );

    const start = (difficulty: GameDifficulty) => {
        const deck = buildChallengeDeck(
            countries,
            difficulty,
            target?.countryCode,
        );
        if (!deck.length) return;
        setResultDismissed(false);
        dispatch(startRound({ deck, difficulty }));
    };
    const finished = round.status === "won" || round.status === "lost";
    const correctCount = round.history.filter((guess) => guess.correct).length;

    return (
        <GameShell game="map-master">
            <Map game="map-master" />
            <Dialog
                title="Map Master"
                open={round.status === "idle"}
                closeable={false}
                description={`Find each named country on the map. Start with ${STARTING_SCORE} points and reach ${WINNING_SCORE} within ${MAX_GUESSES} guesses. Correct answers earn points and reveal the next challenge. Wrong answers cost points. There is no timer.`}
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
                                const rules = MAP_MASTER_RULES[difficulty];
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
                                            +{rules.reward} correct · −
                                            {rules.penalty} incorrect
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
            {round.status !== "idle" && target ? <ChallengePanel /> : null}
            <Dialog
                title={
                    round.status === "won"
                        ? "Brilliant journey!"
                        : "A little detour"
                }
                open={finished && !resultDismissed}
                closeable={false}
                description={
                    round.status === "won"
                        ? `You reached ${WINNING_SCORE} points! You found ${correctCount} ${correctCount === 1 ? "country" : "countries"} in ${round.history.length} guesses.`
                        : `${round.score === 0 ? "Your score reached zero." : "You used all 20 guesses."} The last country was ${target?.countryName}. Explore it, then try a fresh challenge.`
                }
            >
                <p className="mb-5 text-sm text-muted">
                    Final score: {round.score}/{WINNING_SCORE} · {correctCount}{" "}
                    correct of {round.history.length}
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
