import { Flag, Lightbulb, RotateCcw, Undo2 } from "lucide-react";
import { useLoadInfoData } from "@/lib/contexts/hooks/useLoadMapData";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Button, Progress } from "@/shared/ui";
import { BORDER_HOP_RULES } from "./model/rules";
import {
    giveUp,
    prepareRound,
    resetPath,
    undoStop,
    useHint as applyRouteHint,
} from "./model/border-hop-slice";

export function RoutePanel() {
    const dispatch = useAppDispatch();
    const round = useAppSelector((state) => state.borderHop);
    const info = useLoadInfoData();
    const puzzle = round.puzzle;
    if (!puzzle || !info) return null;

    const playing = round.status === "playing";
    const route = round.status === "lost" ? puzzle.optimalPath : round.path;
    const moves = round.path.length - 1;
    const rules = BORDER_HOP_RULES[round.difficulty];
    const hintsLeft = rules.hints - round.hintsUsed;
    const optimalMoves = puzzle.optimalPath.length - 1;

    return (
        <section
            aria-label="Border Hop route"
            className="absolute inset-x-3 bottom-3 z-[750] max-h-[43dvh] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-surface/95 p-3 shadow-xl backdrop-blur-xl sm:inset-x-auto sm:bottom-auto sm:right-5 sm:top-24 sm:max-h-[calc(100dvh-116px)] sm:w-[22rem] sm:rounded-3xl sm:p-4"
        >
            <p className="text-xs font-black uppercase tracking-widest text-accent">
                {round.status === "lost" ? "Shortest route" : "Your journey"}
            </p>
            <div className="mt-1 flex items-center gap-2 text-lg font-black sm:text-xl">
                <span>{puzzle.start.flag}</span>
                <span className="truncate">{puzzle.start.countryName}</span>
                <span aria-hidden="true">→</span>
                <span className="truncate">
                    {puzzle.destination.countryName}
                </span>
                <span>{puzzle.destination.flag}</span>
            </div>

            <Progress
                value={moves}
                max={puzzle.maxMoves}
                label="Moves used"
                className="mt-3"
            />
            <p className="mt-2 text-xs font-bold text-muted">
                {rules.showDistance
                    ? `The shortest route takes ${optimalMoves} ${optimalMoves === 1 ? "move" : "moves"}. `
                    : "Shortest distance hidden. "}
                {puzzle.maxMoves - moves} moves available.
            </p>

            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="mt-3 rounded-xl bg-surface-raised px-3 py-2 text-sm"
            >
                {round.feedback}
            </div>

            <ol
                aria-label="Countries in route"
                className="mt-3 flex flex-wrap gap-1.5"
            >
                {route.map((code, index) => (
                    <li
                        key={`${code}-${index}`}
                        className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-bold"
                    >
                        {info[code]?.flag} {info[code]?.countryName ?? code}
                    </li>
                ))}
            </ol>

            {playing ? (
                <>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <Button
                            variant="secondary"
                            icon={Undo2}
                            disabled={round.path.length <= 1}
                            onClick={() => dispatch(undoStop())}
                        >
                            Undo
                        </Button>
                        <Button
                            variant="secondary"
                            icon={Lightbulb}
                            disabled={hintsLeft <= 0}
                            onClick={() => dispatch(applyRouteHint())}
                        >
                            {rules.hints ? `Hint (${hintsLeft})` : "No hints"}
                        </Button>
                        <Button
                            variant="ghost"
                            icon={RotateCcw}
                            disabled={round.path.length <= 1}
                            onClick={() => dispatch(resetPath())}
                        >
                            Start over
                        </Button>
                        <Button
                            variant="ghost"
                            icon={Flag}
                            onClick={() => dispatch(giveUp())}
                        >
                            Show route
                        </Button>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-muted">
                        Select an earlier stop to backtrack. Invalid border
                        jumps do not use a move.
                    </p>
                </>
            ) : (
                <Button
                    className="mt-4 w-full"
                    onClick={() => dispatch(prepareRound())}
                >
                    New route
                </Button>
            )}
        </section>
    );
}
