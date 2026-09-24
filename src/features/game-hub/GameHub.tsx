"use client";

import Link from "next/link";
import {
    ArrowUpRight,
    Asterisk,
    ChevronRight,
    Layers3,
    MoveUpRight,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { gameDefinitions } from "./game-registry";
import { LogoMark, ThemeToggle } from "@/shared/ui";

const gameStyles = {
    ocean: {
        number: "text-[#1769ff] dark:text-[#7c9cff]",
        icon: "bg-[#1769ff] text-white dark:bg-[#7c9cff] dark:text-[#091323]",
        wash: "from-[#1769ff]/18 via-[#1769ff]/5 to-transparent dark:from-[#7c9cff]/20",
    },
    coral: {
        number: "text-[#ed6335] dark:text-[#ff8059]",
        icon: "bg-[#ed6335] text-white dark:bg-[#ff8059] dark:text-[#271007]",
        wash: "from-[#ed6335]/18 via-[#ed6335]/5 to-transparent dark:from-[#ff8059]/20",
    },
    sun: {
        number: "text-[#857400] dark:text-[#d8ff52]",
        icon: "bg-[#d8ff52] text-[#172000] dark:bg-[#d8ff52] dark:text-[#172000]",
        wash: "from-[#d8ff52]/30 via-[#d8ff52]/5 to-transparent dark:from-[#d8ff52]/20",
    },
} as const;

export function GameHub() {
    const reduceMotion = useReducedMotion();

    return (
        <main className="hub-shell relative min-h-dvh overflow-hidden px-4 pb-6 pt-4 text-[var(--hub-ink)] sm:px-6 sm:pb-8 sm:pt-6 lg:px-8">
            <div aria-hidden="true" className="hub-contours absolute inset-0" />

            <header className="relative mx-auto flex max-w-[90rem] items-center justify-between border-b border-[var(--hub-line)] pb-4">
                <Link
                    href="/"
                    className="group flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
                >
                    <LogoMark
                        aria-hidden="true"
                        className="size-11 shrink-0 drop-shadow-[0_8px_14px_rgb(22_34_29_/_0.18)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"
                    />
                    <span>
                        <span className="block text-[0.65rem] font-bold uppercase leading-none tracking-[0.28em] text-[var(--hub-faint)]">
                            World games
                        </span>
                        <span className="mt-1 block text-xl font-black leading-none tracking-[-0.06em]">
                            flagy
                            <span className="text-[#1769ff] dark:text-[#7c9cff]">
                                .
                            </span>
                        </span>
                    </span>
                </Link>

                <div className="flex items-center gap-2 sm:gap-4">
                    <p className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--hub-faint)] sm:flex">
                        <span className="size-2 rounded-full bg-[#8bae00] dark:bg-[#d8ff52]" />
                        Atlas ready
                    </p>
                    <ThemeToggle />
                </div>
            </header>

            <div className="relative mx-auto grid max-w-[90rem] gap-5 pt-5 lg:grid-cols-[minmax(17rem,0.72fr)_minmax(34rem,1.48fr)] lg:gap-6">
                <motion.section
                    initial={reduceMotion ? false : { opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45 }}
                    className="flex min-h-[25rem] flex-col justify-between rounded-[2rem] border border-[var(--hub-line)] bg-[var(--hub-panel)] p-6 shadow-[0_30px_90px_-55px_var(--shadow)] sm:p-8 lg:min-h-[calc(100dvh-8.25rem)]"
                >
                    <div>
                        <div className="flex items-center justify-between">
                            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[var(--hub-faint)]">
                                Explorer dashboard / 01
                            </p>
                            <Asterisk
                                aria-hidden="true"
                                className="size-6 text-[#1769ff] dark:text-[#d8ff52]"
                            />
                        </div>

                        <h1 className="mt-10 max-w-lg text-balance text-[clamp(3.15rem,6.3vw,6.6rem)] font-black leading-[0.84] tracking-[-0.085em]">
                            Know
                            <br />
                            your
                            <br />
                            <span className="relative inline-block text-[#1769ff] dark:text-[#d8ff52]">
                                world.
                                <span
                                    aria-hidden="true"
                                    className="absolute -right-7 top-1 size-4 rounded-full border-4 border-current sm:-right-10 sm:size-6"
                                />
                            </span>
                        </h1>

                        <p className="mt-8 max-w-sm text-base font-medium leading-7 text-[var(--hub-muted)] sm:text-lg">
                            Pick a route through borders, clues, and
                            silhouettes. Every round makes the map feel a little
                            smaller.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-3 border-t border-[var(--hub-line)] pt-5">
                        <div>
                            <p className="text-2xl font-black tracking-[-0.05em]">
                                03
                            </p>
                            <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--hub-faint)]">
                                Games
                            </p>
                        </div>
                        <div className="border-l border-[var(--hub-line)] pl-4">
                            <p className="text-2xl font-black tracking-[-0.05em]">
                                04
                            </p>
                            <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--hub-faint)]">
                                Levels
                            </p>
                        </div>
                        <div className="border-l border-[var(--hub-line)] pl-4">
                            <p className="text-2xl font-black tracking-[-0.05em]">
                                ∞
                            </p>
                            <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--hub-faint)]">
                                Routes
                            </p>
                        </div>
                    </div>
                </motion.section>

                <section
                    aria-labelledby="games-heading"
                    className="flex flex-col"
                >
                    <div className="mb-4 flex items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                            <Layers3
                                aria-hidden="true"
                                className="size-4 text-[var(--hub-faint)]"
                            />
                            <h2
                                id="games-heading"
                                className="text-sm font-black uppercase tracking-[0.16em]"
                            >
                                Choose a mission
                            </h2>
                        </div>
                        <p className="hidden font-mono text-xs text-[var(--hub-faint)] sm:block">
                            No sign-up · Start instantly
                        </p>
                    </div>

                    <div className="grid flex-1 gap-4 sm:grid-cols-2 sm:grid-rows-2">
                        {gameDefinitions.map((game, index) => {
                            const Icon = game.icon;
                            const style = gameStyles[game.accent];
                            const featured = index === 0;

                            return (
                                <motion.article
                                    key={game.slug}
                                    initial={
                                        reduceMotion
                                            ? false
                                            : { opacity: 0, y: 24 }
                                    }
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: reduceMotion
                                            ? 0
                                            : 0.08 + index * 0.08,
                                    }}
                                    className={featured ? "sm:col-span-2" : ""}
                                >
                                    <Link
                                        href={`/map/${game.slug}`}
                                        aria-label={`Play now: ${game.title}`}
                                        className="group relative flex h-full min-h-[17rem] overflow-hidden rounded-[2rem] border border-[var(--hub-line)] bg-[var(--hub-panel)] p-6 shadow-[0_24px_80px_-58px_var(--shadow)] transition duration-300 hover:-translate-y-1 hover:border-[var(--hub-strong-line)] hover:shadow-[0_34px_90px_-48px_var(--shadow)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus sm:p-7"
                                    >
                                        <div
                                            aria-hidden="true"
                                            className={`absolute inset-0 bg-gradient-to-br ${style.wash}`}
                                        />
                                        <span
                                            aria-hidden="true"
                                            className="absolute -right-14 -top-14 size-44 rounded-full border border-[var(--hub-line)] transition-transform duration-500 group-hover:scale-125"
                                        />
                                        <span
                                            aria-hidden="true"
                                            className="absolute -right-2 top-14 size-20 rounded-full border border-[var(--hub-line)]"
                                        />

                                        <div className="relative flex w-full flex-col justify-between">
                                            <div className="flex items-start justify-between">
                                                <span
                                                    className={`font-mono text-5xl font-light tracking-[-0.08em] ${style.number}`}
                                                >
                                                    0{index + 1}
                                                </span>
                                                <span
                                                    className={`grid size-12 place-items-center rounded-full ${style.icon}`}
                                                >
                                                    <Icon
                                                        aria-hidden="true"
                                                        className="size-5"
                                                    />
                                                </span>
                                            </div>

                                            <div
                                                className={
                                                    featured
                                                        ? "mt-14 sm:grid sm:grid-cols-[1fr_0.75fr] sm:items-end sm:gap-10"
                                                        : "mt-12"
                                                }
                                            >
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--hub-faint)]">
                                                        {game.eyebrow}
                                                    </p>
                                                    <h3 className="mt-2 text-3xl font-black tracking-[-0.055em] sm:text-4xl">
                                                        {game.title}
                                                    </h3>
                                                </div>
                                                <div
                                                    className={
                                                        featured
                                                            ? "mt-4 sm:mt-0"
                                                            : "mt-4"
                                                    }
                                                >
                                                    <p className="max-w-md text-sm font-medium leading-6 text-[var(--hub-muted)] sm:text-base">
                                                        {game.description}
                                                    </p>
                                                    <div className="mt-5 flex items-center justify-between border-t border-[var(--hub-line)] pt-4">
                                                        <span className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-[var(--hub-faint)]">
                                                            {
                                                                game
                                                                    .difficulties
                                                                    .length
                                                            }{" "}
                                                            levels
                                                        </span>
                                                        <span className="flex items-center gap-2 text-sm font-black">
                                                            Play now
                                                            <ArrowUpRight
                                                                aria-hidden="true"
                                                                className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                                                            />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.article>
                            );
                        })}
                    </div>
                </section>
            </div>

            <footer className="relative mx-auto mt-5 flex max-w-[90rem] flex-col gap-3 border-t border-[var(--hub-line)] pt-4 text-xs font-bold uppercase tracking-[0.14em] text-[var(--hub-faint)] sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2">
                    <MoveUpRight aria-hidden="true" className="size-4" />
                    Three ways to read the world
                </p>
                <p className="flex items-center gap-2">
                    Follow your curiosity
                    <ChevronRight aria-hidden="true" className="size-4" />
                </p>
            </footer>
        </main>
    );
}
