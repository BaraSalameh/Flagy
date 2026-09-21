import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

export function Badge({
    className,
    ...props
}: HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            className={cn(
                "inline-flex min-h-7 items-center rounded-full border border-border bg-surface-raised px-3 text-xs font-bold tracking-wide text-muted",
                className,
            )}
            {...props}
        />
    );
}
