"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Compass, MapPinned, ScanSearch } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useAppSelector } from "@/lib/store/hooks";
import type { GameSlug } from "@/shared/types/game";
import { Badge, ThemeToggle } from "@/shared/ui";

export function GameShell({
    game,
    children,
}: {
    game: GameSlug;
    children: ReactNode;
}) {
    const difficulty = useAppSelector((state) =>
        game === "geo-guess"
            ? state.geoGuess.difficulty
            : game === "map-master"
              ? state.mapMaster.difficulty
              : state.outlineExplorer.difficulty,
    );
    const gameStarted = useAppSelector((state) =>
        game === "geo-guess"
            ? state.geoGuess.status !== "idle"
            : game === "map-master"
              ? state.mapMaster.status !== "idle"
              : state.outlineExplorer.status !== "idle",
    );
    const definition = {
        "geo-guess": {
            title: "Geo Guess",
            eyebrow: "Follow the clues",
            icon: Compass,
        },
        "map-master": {
            title: "Map Master",
            eyebrow: "Test your map memory",
            icon: MapPinned,
        },
        "outline-explorer": {
            title: "Outline Explorer",
            eyebrow: "Read the silhouette",
            icon: ScanSearch,
        },
    }[game];
    const Icon = definition.icon;
    const reduceMotion = useReducedMotion();
    return (
        <main className="relative h-dvh w-full overflow-hidden bg-background">
            <div className="absolute inset-0">{children}</div>
            <motion.header
                initial={reduceMotion ? false : { opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                className="pointer-events-none absolute inset-x-0 top-0 z-[1100] flex items-start justify-between gap-3 p-3 sm:z-[800] sm:p-5"
            >
                <div className="pointer-events-auto flex min-w-0 items-center gap-2 rounded-[1.4rem] border border-border bg-surface/90 p-1 shadow-xl backdrop-blur-xl sm:p-1.5 sm:pr-3">
                    <Link
                        aria-label="Back to game hub"
                        href="/"
                        className="grid size-11 shrink-0 place-items-center rounded-2xl text-foreground transition hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
                    >
                        <ArrowLeft className="size-5" />
                    </Link>
                    <span className="hidden size-8 place-items-center rounded-xl bg-accent text-accent-foreground sm:grid">
                        <Icon className="size-4" />
                    </span>
                    <div className="hidden min-w-0 sm:block">
                        <p className="truncate text-sm font-black sm:text-base">
                            {definition.title}
                        </p>
                        <p className="hidden text-[11px] font-bold text-muted sm:block">
                            {definition.eyebrow}
                        </p>
                    </div>
                    {gameStarted ? (
                        <div className="ml-1 hidden sm:block">
                            <Badge>{difficulty}</Badge>
                        </div>
                    ) : null}
                </div>
                <div className="pointer-events-auto">
                    <ThemeToggle />
                </div>
            </motion.header>
        </main>
    );
}
