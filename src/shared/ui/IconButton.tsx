import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/cn";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    icon: LucideIcon;
}

export function IconButton({
    label,
    icon: Icon,
    className,
    type = "button",
    ...props
}: IconButtonProps) {
    return (
        <button
            type={type}
            aria-label={label}
            title={label}
            className={cn(
                "inline-grid size-11 shrink-0 place-items-center rounded-2xl border border-border bg-surface/90 text-foreground shadow-sm backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus",
                className,
            )}
            {...props}
        >
            <Icon aria-hidden="true" className="size-5" />
        </button>
    );
}
