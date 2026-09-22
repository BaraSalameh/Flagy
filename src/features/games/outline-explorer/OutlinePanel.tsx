import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Button, Progress } from "@/shared/ui";
import {
    getChallenge,
    nextChallenge,
    prepareRound,
    submitGuess,
} from "./model/outline-explorer-slice";
import { MAX_GUESSES, OUTLINE_RULES, WINNING_SCORE } from "./model/rules";

export function OutlinePanel() {
    const dispatch = useAppDispatch();
    const round = useAppSelector((state) => state.outlineExplorer);
    const challenge = getChallenge(round);
    if (!challenge) return null;
    const playing = round.status === "playing";
    const last = round.history.at(-1);
    const rules = OUTLINE_RULES[round.difficulty];
    const remaining = MAX_GUESSES - round.history.length;
    const reveal = round.solved || !playing;

    return (
        <section
            aria-label="Outline challenge"
            className="absolute inset-x-3 bottom-5 z-[750] max-h-[48dvh] overflow-y-auto rounded-3xl border border-border bg-surface/95 p-4 shadow-xl backdrop-blur-xl sm:inset-x-auto sm:bottom-auto sm:right-5 sm:top-24 sm:max-h-[calc(100dvh-116px)] sm:w-80"
        >
            <h2 className="text-lg font-black">
                {reveal
                    ? challenge.target.countryName
                    : "Which country is highlighted?"}
            </h2>
            <Progress
                value={round.score}
                max={WINNING_SCORE}
                label="Score"
                className="mt-3"
            />
            <p className="mt-2 text-xs font-bold text-muted">
                {remaining} {remaining === 1 ? "guess" : "guesses"} left · +
                {rules.reward} correct / −{rules.penalty} incorrect
            </p>
            <p
                role="status"
                aria-live="polite"
                className="mt-3 text-sm text-muted"
            >
                {reveal
                    ? round.solved
                        ? `Correct! ${challenge.target.countryName} earned +${last?.points ?? 0} points.`
                        : `The answer is ${challenge.target.countryName}.`
                    : round.incorrectCodes.length
                      ? `${last?.countryName} isn’t the highlighted country. Try another choice.`
                      : "Study the highlighted outline, then choose its name."}
            </p>
            <div
                role="group"
                aria-label="Country choices"
                className="mt-3 grid grid-cols-2 gap-2"
            >
                {challenge.choices.map((country) => {
                    const incorrect = round.incorrectCodes.includes(
                        country.countryCode,
                    );
                    const answer =
                        reveal &&
                        country.countryCode === challenge.target.countryCode;
                    return (
                        <Button
                            key={country.countryCode}
                            variant="secondary"
                            disabled={!playing || round.solved || incorrect}
                            onClick={() =>
                                dispatch(submitGuess(country.countryCode))
                            }
                            className="h-auto min-h-12 flex-col gap-1 break-words px-2 py-2 text-center text-xs"
                        >
                            <span>{country.countryName}</span>
                            {incorrect || answer ? (
                                <span className="text-[10px] font-medium">
                                    {answer
                                        ? "Correct answer"
                                        : "Already tried"}
                                </span>
                            ) : null}
                        </Button>
                    );
                })}
            </div>
            {round.solved && playing ? (
                <Button
                    autoFocus
                    className="mt-3 w-full"
                    onClick={() => dispatch(nextChallenge())}
                >
                    Next country
                </Button>
            ) : null}
            {reveal ? (
                <p className="mt-3 text-xs text-muted">
                    {challenge.target.capital} · {challenge.target.region}
                </p>
            ) : (
                <p className="mt-3 text-xs text-muted">
                    Each wrong choice is charged once. Use zoom or Center
                    outline for a closer look.
                </p>
            )}
            {!playing ? (
                <Button
                    className="mt-3 w-full"
                    onClick={() => dispatch(prepareRound())}
                >
                    Play again
                </Button>
            ) : null}
            {round.history.length ? (
                <details className="mt-3 text-xs text-muted">
                    <summary className="cursor-pointer py-2 font-bold">
                        Guess history ({round.history.length})
                    </summary>
                    <ol className="mt-1 space-y-2">
                        {round.history.map((guess, index) => (
                            <li key={index}>
                                {index + 1}. {guess.countryName} —{" "}
                                {guess.correct ? "correct" : "incorrect"} (
                                {guess.points > 0 ? "+" : ""}
                                {guess.points})
                            </li>
                        ))}
                    </ol>
                </details>
            ) : null}
        </section>
    );
}
