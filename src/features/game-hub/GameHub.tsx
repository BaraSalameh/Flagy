"use client";

import Link from "next/link";
import { Asterisk, ChevronRight, MoveUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { LogoMark, ThemeToggle } from "@/shared/ui";
import { GameGlobe } from "./GameGlobe";

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
                            Pick a route through flags, borders, clues, and
                            silhouettes. Every round makes the map feel a little
                            smaller.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-3 border-t border-[var(--hub-line)] pt-5">
                        <div>
                            <p className="text-2xl font-black tracking-[-0.05em]">
                                05
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

                <GameGlobe />
            </div>

            <footer className="relative mx-auto mt-5 flex max-w-[90rem] flex-col gap-3 border-t border-[var(--hub-line)] pt-4 text-xs font-bold uppercase tracking-[0.14em] text-[var(--hub-faint)] sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2">
                    <MoveUpRight aria-hidden="true" className="size-4" />
                    Five ways to read the world
                </p>
                <p className="flex items-center gap-2">
                    Follow your curiosity
                    <ChevronRight aria-hidden="true" className="size-4" />
                </p>
            </footer>
        </main>
    );
}
