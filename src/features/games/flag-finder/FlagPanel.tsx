import { Flag, MapPin } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";
import { Button } from "@/shared/ui";
import { getFlagTarget } from "./model/flag-finder-slice";

export function FlagPanel({ onNext }: { onNext: () => void }) {
    const round = useAppSelector((state) => state.flagFinder);
    const target = getFlagTarget(round);
    if (!target) return null;

    const solved = round.lastSelection?.correct === true;
    const finished = round.status === "lost";
    const answerVisible = solved || finished;
    const flagLabel = answerVisible
        ? `Flag of ${target.countryName}`
        : "Mystery country flag";

    return (
        <section
            aria-label="Flag Finder challenge"
            className="absolute inset-x-3 bottom-3 z-[750] max-h-[42dvh] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-surface/95 p-3 shadow-xl backdrop-blur-xl sm:inset-x-auto sm:bottom-auto sm:right-5 sm:top-24 sm:max-h-[calc(100dvh-116px)] sm:w-80 sm:rounded-3xl sm:p-4"
        >
            <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent">
                    <Flag aria-hidden="true" className="size-4" />
                    {finished ? "Final flag" : "Find this flag"}
                </p>
                <p className="rounded-full bg-surface-raised px-3 py-1 font-mono text-xs font-black">
                    Streak {round.streak}
                </p>
            </div>

            <div className="mt-3 grid place-items-center overflow-hidden rounded-2xl border border-border bg-surface-raised p-3 sm:mt-4 sm:p-5">
                <span
                    role="img"
                    aria-label={flagLabel}
                    data-country-code={target.countryCode}
                    className={`fi fi-${target.countryCode.toLowerCase()} text-[4.5rem] shadow-lg sm:text-[5.5rem]`}
                />
            </div>

            <div aria-live="polite" aria-atomic="true" className="mt-3">
                {answerVisible ? (
                    <h2 className="text-lg font-black sm:text-xl">
                        {target.countryName}
                    </h2>
                ) : (
                    <p className="text-sm font-black">Choose on the map</p>
                )}
                <p className="mt-1 text-xs font-bold text-muted">
                    {round.attemptsRemaining}{" "}
                    {round.attemptsRemaining === 1 ? "attempt" : "attempts"}{" "}
                    remaining
                </p>
            </div>

            <p
                role="status"
                aria-live="polite"
                className="mt-3 rounded-xl bg-surface-raised px-3 py-2 text-sm"
            >
                {solved
                    ? `Correct — that’s ${target.countryName}! Your streak is now ${round.streak}.`
                    : finished
                      ? `The flag belongs to ${target.countryName}.`
                      : round.lastSelection
                        ? `${round.lastSelection.countryName} is not the match. Try again.`
                        : "Select a country. Pan or zoom to inspect the world."}
            </p>

            {solved ? (
                <Button className="mt-3 w-full" onClick={onNext}>
                    Next flag
                </Button>
            ) : null}

            {finished ? (
                <p className="mt-3 flex items-start gap-2 text-sm text-muted">
                    <MapPin
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-teal"
                    />
                    <span>
                        {target.capital} · {target.region}
                        <br />
                        The answer is highlighted on the map.
                    </span>
                </p>
            ) : null}

            {!solved && !finished ? (
                <p className="mt-3 text-xs leading-5 text-muted">
                    A wrong country uses an attempt and changes the question
                    flag.
                </p>
            ) : null}
        </section>
    );
}
