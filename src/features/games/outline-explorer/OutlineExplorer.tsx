"use client";

import { useEffect, useMemo, useState } from "react";
import { Map } from "@/features/map/Map";
import { GameShell } from "@/features/game-shell/GameShell";
import { useMapDataState } from "@/lib/contexts/hooks/useLoadMapData";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Button, ButtonLink, Dialog } from "@/shared/ui";
import { difficulties, type GameDifficulty } from "@/shared/types/game";
import {
    clearOutlineExplorer,
    getChallenge,
    prepareRound,
    startRound,
} from "./model/outline-explorer-slice";
import {
    buildChallenges,
    OUTLINE_RULES,
    MAX_GUESSES,
    STARTING_SCORE,
    WINNING_SCORE,
} from "./model/rules";
import { OutlinePanel } from "./OutlinePanel";

export const OutlineExplorer = () => {
    const dispatch = useAppDispatch();
    const round = useAppSelector((state) => state.outlineExplorer);
    const { map, info, status, error, retry } = useMapDataState();
    const [resultDismissed, setResultDismissed] = useState(false);
    const target = getChallenge(round)?.target;
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
            dispatch(clearOutlineExplorer());
        },
        [dispatch],
    );

    const start = (difficulty: GameDifficulty) => {
        const challenges = buildChallenges(
            countries,
            difficulty,
            target?.countryCode,
        );
        if (!challenges.length) return;
        setResultDismissed(false);
        dispatch(startRound({ challenges, difficulty }));
    };
    const finished = round.status === "won" || round.status === "lost";
    const correctCount = round.history.filter((guess) => guess.correct).length;

    return (
        <GameShell game="outline-explorer">
            <Map game="outline-explorer" />
            <Dialog
                title="Outline Explorer"
                open={round.status === "idle"}
                closeable={false}
                description={`Name the highlighted country by choosing an answer. Start with ${STARTING_SCORE} points and reach ${WINNING_SCORE} within ${MAX_GUESSES} guesses. Correct answers earn points; wrong answers cost points. Harder levels favor choices from the same continent or region. There is no timer.`}
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
                                const rules = OUTLINE_RULES[difficulty];
                                const count = countries.filter(
                                    (country) =>
                                        country.area > rules.minimumArea,
                                ).length;
                                return (
                                    <Button
                                        key={difficulty}
                                        variant="secondary"
                                        disabled={
                                            status !== "ready" || count < 2
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
                                            Up to {rules.choices} choices ·{" "}
                                            {rules.minimumArea
                                                ? `over ${rules.minimumArea.toLocaleString("en-US")} km²`
                                                : "any country size"}
                                        </span>
                                        <span className="text-xs font-medium text-muted">
                                            {difficulty === "Beginner"
                                                ? "Mixed distractors"
                                                : difficulty === "Intermediate"
                                                  ? "Same-continent distractors first"
                                                  : "Same-region distractors first"}
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
                        {status === "ready" && countries.length < 2 ? (
                            <div role="alert" className="mt-3">
                                <p className="mb-2 text-sm text-muted">
                                    At least two playable countries are needed.
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
            {round.status !== "idle" && target ? <OutlinePanel /> : null}
            <Dialog
                title={
                    round.status === "won"
                        ? "Outline decoded — you win!"
                        : "Silhouette slipped away — round lost"
                }
                open={finished && !resultDismissed}
                closeable={false}
                description={
                    round.status === "won"
                        ? `You reached ${WINNING_SCORE} points by identifying ${correctCount} ${correctCount === 1 ? "outline" : "outlines"} in ${round.history.length} ${round.history.length === 1 ? "guess" : "guesses"}. Your eye for borders carried the round!`
                        : `${round.score === 0 ? `Your score fell to zero before you could reach ${WINNING_SCORE} points.` : `All ${MAX_GUESSES} guesses are used, and you finished with ${round.score} of ${WINNING_SCORE} points.`} The final silhouette belonged to ${target?.countryName}. Study its shape, then return for another challenge.`
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
