import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Button, Progress } from "@/shared/ui";
import { getTarget, prepareRound } from "./model/map-master-slice";
import { MAP_MASTER_RULES, MAX_GUESSES, WINNING_SCORE } from "./model/rules";

export function ChallengePanel() {
    const dispatch = useAppDispatch();
    const round = useAppSelector((state) => state.mapMaster);
    const target = getTarget(round);
    if (!target) return null;
    const playing = round.status === "playing";
    const lastGuess = round.history.at(-1);
    const rules = MAP_MASTER_RULES[round.difficulty];
    const remaining = MAX_GUESSES - round.history.length;

    return (
        <section
            aria-label="Map Master challenge"
            className="absolute inset-x-3 bottom-5 z-[750] max-h-[44dvh] overflow-y-auto rounded-3xl border border-border bg-surface/95 p-4 shadow-xl backdrop-blur-xl sm:inset-x-auto sm:bottom-auto sm:right-5 sm:top-24 sm:max-h-[calc(100dvh-116px)] sm:w-80"
        >
            <div role="status" aria-live="polite" aria-atomic="true">
                <p className="text-xs font-black uppercase tracking-widest text-accent">
                    {playing ? "Find on the map" : "Last country"}
                </p>
                <h2 className="mt-1 text-xl font-black">
                    {target.countryName}
                </h2>
            </div>
            <Progress
                value={round.score}
                max={WINNING_SCORE}
                label="Score"
                className="mt-4"
            />
            <p className="mt-2 text-xs font-bold text-muted">
                {remaining} {remaining === 1 ? "guess" : "guesses"} left · +
                {rules.reward} correct / −{rules.penalty} incorrect
            </p>
            <p
                role="status"
                aria-live="polite"
                className="mt-3 rounded-xl bg-surface-raised px-3 py-2 text-sm"
            >
                {lastGuess
                    ? lastGuess.correct
                        ? `Correct! ${lastGuess.countryName} earned +${lastGuess.points} points.`
                        : `${lastGuess.countryName} isn’t ${lastGuess.targetName}. −${Math.abs(lastGuess.points)} points.`
                    : "Select a country to begin. Pan or zoom to explore."}
            </p>
            {playing ? (
                <p className="mt-3 text-xs leading-5 text-muted">
                    Wrong countries stay marked until you find the answer.
                    Repeated guesses for this country are free.
                </p>
            ) : (
                <>
                    <p className="mt-3 text-sm text-muted">
                        {target.capital} · {target.region}
                        <br />
                        The last answer is highlighted on the map.
                    </p>
                    <Button
                        className="mt-4 w-full"
                        onClick={() => dispatch(prepareRound())}
                    >
                        Play again
                    </Button>
                </>
            )}
            {round.history.length ? (
                <details className="mt-3 text-xs text-muted">
                    <summary className="cursor-pointer py-2 font-bold">
                        Guess history ({round.history.length})
                    </summary>
                    <ol className="mt-1 space-y-2">
                        {round.history.map((guess, index) => (
                            <li key={index}>
                                {index + 1}. {guess.countryName} —{" "}
                                {guess.correct
                                    ? "correct"
                                    : `looking for ${guess.targetName}`}{" "}
                                ({guess.points > 0 ? "+" : ""}
                                {guess.points})
                            </li>
                        ))}
                    </ol>
                </details>
            ) : null}
        </section>
    );
}
