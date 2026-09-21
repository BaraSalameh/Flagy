"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { IconButton } from "./IconButton";

interface DialogProps {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    title: string;
    description?: string;
    children: ReactNode;
    closeable?: boolean;
}

export function Dialog({
    open,
    onOpenChange,
    title,
    description,
    children,
    closeable = true,
}: DialogProps) {
    const reduceMotion = useReducedMotion();
    return (
        <DialogPrimitive.Root
            open={open}
            onOpenChange={onOpenChange ?? (() => undefined)}
        >
            <AnimatePresence>
                {open ? (
                    <DialogPrimitive.Portal forceMount>
                        <DialogPrimitive.Overlay asChild>
                            <motion.div
                                className="fixed inset-0 z-[1000] bg-ink/55 backdrop-blur-md"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: reduceMotion ? 0 : 0.2,
                                }}
                            />
                        </DialogPrimitive.Overlay>
                        <DialogPrimitive.Content
                            asChild
                            onEscapeKeyDown={(event) => {
                                if (!closeable) event.preventDefault();
                            }}
                            onPointerDownOutside={(event) => {
                                if (!closeable) event.preventDefault();
                            }}
                        >
                            <motion.div
                                className="fixed left-1/2 top-1/2 z-[1001] w-[min(92vw,34rem)] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-border bg-surface p-5 shadow-[0_32px_100px_-24px_var(--shadow)] sm:p-7"
                                initial={
                                    reduceMotion
                                        ? false
                                        : { y: 18, scale: 0.96 }
                                }
                                animate={{ y: 0, scale: 1 }}
                                exit={
                                    reduceMotion
                                        ? undefined
                                        : { y: 12, scale: 0.97 }
                                }
                                transition={{
                                    type: "spring",
                                    stiffness: 360,
                                    damping: 30,
                                }}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <DialogPrimitive.Title className="text-xl font-black tracking-tight sm:text-2xl">
                                            {title}
                                        </DialogPrimitive.Title>
                                        {description ? (
                                            <DialogPrimitive.Description className="mt-2 text-sm leading-6 text-muted">
                                                {description}
                                            </DialogPrimitive.Description>
                                        ) : null}
                                    </div>
                                    {closeable ? (
                                        <DialogPrimitive.Close asChild>
                                            <IconButton
                                                label="Close dialog"
                                                icon={X}
                                            />
                                        </DialogPrimitive.Close>
                                    ) : null}
                                </div>
                                <div className="mt-6">{children}</div>
                            </motion.div>
                        </DialogPrimitive.Content>
                    </DialogPrimitive.Portal>
                ) : null}
            </AnimatePresence>
        </DialogPrimitive.Root>
    );
}
