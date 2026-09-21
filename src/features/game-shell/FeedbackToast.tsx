"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Lightbulb, X } from "lucide-react";
import { IconButton } from "@/shared/ui";
export function FeedbackToast({
    message,
    onDismiss,
}: {
    message?: string | string[];
    onDismiss: () => void;
}) {
    const reduceMotion = useReducedMotion();
    const content = Array.isArray(message) ? message.join(", ") : message;
    return (
        <div className="pointer-events-none absolute inset-x-3 top-24 z-[750] flex justify-center sm:top-5">
            <AnimatePresence>
                {content ? (
                    <motion.aside
                        role="status"
                        aria-live="polite"
                        initial={
                            reduceMotion
                                ? false
                                : { opacity: 0, y: -12, scale: 0.97 }
                        }
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-[1.5rem] border border-sun/35 bg-surface/95 p-3 shadow-2xl backdrop-blur-xl"
                    >
                        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-sun/20 text-foreground">
                            <Lightbulb className="size-5" />
                        </span>
                        <div className="min-w-0 flex-1 py-1">
                            <p className="text-xs font-black uppercase tracking-[.16em] text-muted">
                                New clue
                            </p>
                            <p className="mt-1 font-bold">{content}</p>
                        </div>
                        <IconButton
                            label="Dismiss hint"
                            icon={X}
                            onClick={onDismiss}
                            className="border-0 bg-transparent shadow-none"
                        />
                    </motion.aside>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
