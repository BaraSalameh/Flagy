import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "rounded-[1.75rem] border border-border bg-surface/92 shadow-[0_24px_70px_-35px_var(--shadow)] backdrop-blur-xl",
                className,
            )}
            {...props}
        />
    );
}
