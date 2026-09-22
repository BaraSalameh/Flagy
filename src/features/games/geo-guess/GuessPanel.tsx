import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import type { InfoData } from "@/shared/types/country";
import { Button } from "@/shared/ui";
import { prepareRound, submitGuess } from "./model/geo-guess-slice";
import { getClues, GEO_GUESS_RULES } from "./model/rules";

export function GuessPanel({ countries }: { countries: readonly InfoData[] }) {
    const dispatch = useAppDispatch();
    const round = useAppSelector((state) => state.geoGuess);
    const [selectedCode, setSelectedCode] = useState("");
    if (!round.target) return null;
    const playing = round.status === "playing";
    const clues = getClues(
        round.target,
        round.difficulty,
        round.guesses.length,
    );
    const lastGuess = countries.find(
        (country) => country.countryCode === round.guesses.at(-1),
    );
    const nextClueIn = 2 - (round.guesses.length % 2);

    return (
        <section
            aria-label="Round clues and guesses"
            className="absolute inset-x-3 bottom-5 z-[750] max-h-[44dvh] overflow-y-auto rounded-3xl border border-border bg-surface/95 p-4 shadow-xl backdrop-blur-xl sm:inset-x-auto sm:bottom-auto sm:right-5 sm:top-24 sm:max-h-[calc(100dvh-116px)] sm:w-80"
        >
            <div className="flex items-center justify-between gap-3">
                <h2 className="font-black">
                    {playing ? "Mystery country" : round.target.countryName}
                </h2>
                <p
                    role="status"
                    aria-live="polite"
                    className="shrink-0 text-sm font-bold text-accent"
                >
                    {round.remainingGuesses}{" "}
                    {round.remainingGuesses === 1 ? "guess" : "guesses"} left
                </p>
            </div>
            <p
                role="status"
                aria-live="polite"
                className="mt-2 text-sm text-muted"
            >
                {playing
                    ? lastGuess
                        ? `${lastGuess.countryName} isn’t the one. Try another country.`
                        : "Your first clue is ready. Pan or zoom to explore."
                    : round.status === "won"
                      ? "Correct! The answer is highlighted on the map."
                      : "The answer is highlighted on the map."}
            </p>
            <ol
                aria-label="Revealed clues"
                aria-live="polite"
                aria-relevant="additions"
                className="mt-3 space-y-2 text-sm"
            >
                {clues.map((clue) => (
                    <li
                        key={clue.key}
                        className="rounded-xl bg-surface-raised px-3 py-2"
                    >
                        {clue.text}
                    </li>
                ))}
            </ol>
            {playing ? (
                <>
                    <p className="mt-2 text-xs text-muted">
                        {clues.length <
                        GEO_GUESS_RULES[round.difficulty].clues.length
                            ? `Next clue in ${nextClueIn} ${nextClueIn === 1 ? "guess" : "guesses"}.`
                            : "All clues revealed."}{" "}
                        Repeated guesses are free.
                    </p>
                    <form
                        className="mt-4"
                        onSubmit={(event) => {
                            event.preventDefault();
                            if (selectedCode)
                                dispatch(submitGuess(selectedCode));
                            setSelectedCode("");
                        }}
                    >
                        <label
                            htmlFor="country-guess"
                            className="text-xs font-bold"
                        >
                            Guess by name
                        </label>
                        <div className="mt-1 flex gap-2">
                            <select
                                id="country-guess"
                                value={selectedCode}
                                onChange={(event) =>
                                    setSelectedCode(event.target.value)
                                }
                                className="min-h-11 min-w-0 flex-1 rounded-xl border border-border bg-surface px-2 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
                            >
                                <option value="">Choose a country</option>
                                {countries.map((country) => (
                                    <option
                                        key={country.countryCode}
                                        value={country.countryCode}
                                        disabled={round.guesses.includes(
                                            country.countryCode,
                                        )}
                                    >
                                        {country.countryName}
                                    </option>
                                ))}
                            </select>
                            <Button
                                type="submit"
                                disabled={
                                    !selectedCode ||
                                    round.guesses.includes(selectedCode)
                                }
                                className="px-3"
                            >
                                Guess
                            </Button>
                        </div>
                    </form>
                </>
            ) : (
                <Button
                    className="mt-4 w-full"
                    onClick={() => dispatch(prepareRound())}
                >
                    Play again
                </Button>
            )}
            {round.guesses.length > 0 ? (
                <details className="mt-3 text-xs text-muted">
                    <summary className="cursor-pointer py-2 font-bold">
                        Previous guesses ({round.guesses.length})
                    </summary>
                    <p className="mt-1 leading-6">
                        {round.guesses
                            .map(
                                (code) =>
                                    countries.find(
                                        (country) =>
                                            country.countryCode === code,
                                    )?.countryName ?? code,
                            )
                            .join(" · ")}
                    </p>
                </details>
            ) : null}
        </section>
    );
}
