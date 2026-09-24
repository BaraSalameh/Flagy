import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Button, Progress } from "@/shared/ui";
import {
    getChallenge,
    nextChallenge,
    prepareRound,
    submitGuess,
} from "./model/outline-explorer-slice";
import { getOutlineAnswer, OUTLINE_RULES, WINNING_SCORE } from "./model/rules";

export function OutlinePanel() {
    const dispatch = useAppDispatch();
    const round = useAppSelector((state) => state.outlineExplorer);
    const challenge = getChallenge(round);
    if (!challenge) return null;
    const playing = round.status === "playing";
    const last = round.history.at(-1);
    const rules = OUTLINE_RULES[round.difficulty];
    const reveal = round.solved || !playing;
    const capitalMode = rules.answer === "capital";

    return (
        <section
            aria-label="Outline challenge"
            className="absolute inset-x-3 bottom-3 z-[750] max-h-[36dvh] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-surface/95 p-3 shadow-xl backdrop-blur-xl sm:inset-x-auto sm:bottom-auto sm:right-5 sm:top-24 sm:max-h-[calc(100dvh-116px)] sm:w-80 sm:rounded-3xl sm:p-4"
        >
            <h2 className="text-lg font-black">
                {reveal
                    ? capitalMode
                        ? `${challenge.target.capital}, ${challenge.target.countryName}`
                        : challenge.target.countryName
                    : capitalMode
                      ? "What is this country's capital?"
                      : "Which country is highlighted?"}
            </h2>
            <Progress
                value={round.score}
                max={WINNING_SCORE}
                label="Score"
                className="mt-2 sm:mt-3"
            />
            <p className="mt-2 text-xs font-bold text-muted">
                {round.history.length}{" "}
                {round.history.length === 1 ? "guess" : "guesses"} made · +
                {rules.reward} correct / −{rules.penalty} incorrect
            </p>
            <p
                role="status"
                aria-live="polite"
                className="mt-2 text-sm text-muted sm:mt-3"
            >
                {reveal
                    ? round.solved
                        ? `Correct! ${getOutlineAnswer(challenge.target, round.difficulty)} earned +${last?.points ?? 0} points.`
                        : `The answer is ${getOutlineAnswer(challenge.target, round.difficulty)}.`
                    : round.incorrectCodes.length
                      ? `${last?.countryName} isn’t the correct ${capitalMode ? "capital" : "country"}. Try another choice.`
                      : capitalMode
                        ? "Study the highlighted outline, then choose its capital."
                        : "Study the highlighted outline, then choose its name."}
            </p>
            <div
                role="group"
                aria-label="Country choices"
                className="mt-2 grid grid-cols-2 gap-2 sm:mt-3"
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
                            <span>
                                {getOutlineAnswer(country, round.difficulty)}
                            </span>
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
                    Each wrong choice is charged once. The round ends only at
                    zero points. Use zoom or Center outline for a closer look.
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
