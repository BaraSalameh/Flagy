"use client";
import Link from "next/link";
import { ArrowRight, Globe2, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { gameDefinitions } from "./game-registry";
import { Badge, Card, ThemeToggle } from "@/shared/ui";
const accentClass = {
    ocean: "from-ocean/20 to-teal/5 text-ocean",
    coral: "from-coral/20 to-sun/5 text-coral",
    sun: "from-sun/30 to-coral/5 text-foreground",
} as const;
export function GameHub() {
    const reduceMotion = useReducedMotion();
    return (
        <main className="relative min-h-dvh overflow-hidden px-4 pb-14 pt-5 sm:px-7 lg:px-10">
            <div
                aria-hidden="true"
                className="atlas-grid pointer-events-none absolute inset-0"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-24 top-32 size-80 rounded-full bg-ocean/15 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 top-0 size-96 rounded-full bg-sun/15 blur-3xl"
            />
            <header className="relative mx-auto flex max-w-6xl items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
                >
                    <span className="grid size-11 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-lg">
                        <Globe2 aria-hidden="true" className="size-6" />
                    </span>
                    <span className="text-xl font-black tracking-tight">
                        Flagy
                    </span>
                </Link>
                <ThemeToggle />
            </header>
            <section className="relative mx-auto max-w-6xl pb-10 pt-16 text-center sm:pt-24">
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                >
                    <Badge className="border-teal/25 bg-teal/10 text-accent">
                        <Sparkles
                            aria-hidden="true"
                            className="mr-1.5 size-3.5"
                        />
                        A world of quick challenges
                    </Badge>
                    <h1 className="mx-auto mt-6 max-w-4xl text-balance text-4xl font-black leading-[1.04] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                        Know your world.
                        <br />
                        <span className="bg-gradient-to-r from-ocean via-teal to-coral bg-clip-text text-transparent">
                            Play your way around it.
                        </span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted sm:text-lg">
                        Three fast geography games, four difficulty levels, and
                        a whole planet to discover. Pick a challenge and start
                        exploring.
                    </p>
                </motion.div>
            </section>
            <section
                aria-labelledby="games-heading"
                className="relative mx-auto max-w-6xl"
            >
                <div className="mb-5 flex items-end justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[.22em] text-accent">
                            Choose your route
                        </p>
                        <h2
                            id="games-heading"
                            className="mt-1 text-2xl font-black tracking-tight sm:text-3xl"
                        >
                            Where will you begin?
                        </h2>
                    </div>
                    <span className="hidden text-sm text-muted sm:block">
                        No sign-up. Jump straight in.
                    </span>
                </div>
                <div className="grid gap-4 lg:grid-cols-3">
                    {gameDefinitions.map((game, index) => {
                        const Icon = game.icon;
                        return (
                            <motion.article
                                key={game.slug}
                                initial={
                                    reduceMotion ? false : { opacity: 0, y: 24 }
                                }
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: reduceMotion
                                        ? 0
                                        : 0.12 + index * 0.08,
                                }}
                                whileHover={
                                    reduceMotion ? undefined : { y: -6 }
                                }
                            >
                                <Card className="group relative h-full overflow-hidden p-5 transition duration-300 hover:border-accent/40 hover:shadow-[0_28px_80px_-35px_var(--shadow)] sm:p-6">
                                    <div
                                        aria-hidden="true"
                                        className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${accentClass[game.accent]}`}
                                    />
                                    <div className="relative flex h-full flex-col">
                                        <div
                                            className={`grid size-14 place-items-center rounded-2xl bg-gradient-to-br ${accentClass[game.accent]} shadow-sm`}
                                        >
                                            <Icon
                                                aria-hidden="true"
                                                className="size-7"
                                            />
                                        </div>
                                        <p className="mt-8 text-xs font-black uppercase tracking-[.18em] text-muted">
                                            {game.eyebrow}
                                        </p>
                                        <h3 className="mt-2 text-2xl font-black tracking-tight">
                                            {game.title}
                                        </h3>
                                        <p className="mt-3 flex-1 leading-7 text-muted">
                                            {game.description}
                                        </p>
                                        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                                            <span className="text-xs font-bold text-muted">
                                                {game.difficulties.length}{" "}
                                                difficulty levels
                                            </span>
                                            <Link
                                                href={`/map/${game.slug}`}
                                                className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 font-bold text-accent transition hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
                                            >
                                                Play now{" "}
                                                <ArrowRight
                                                    aria-hidden="true"
                                                    className="size-4 transition group-hover:translate-x-1"
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            </motion.article>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
