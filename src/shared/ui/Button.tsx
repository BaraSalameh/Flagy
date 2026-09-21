import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface CommonProps {
    children: ReactNode;
    className?: string;
    variant?: Variant;
    icon?: LucideIcon;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

const styles: Record<Variant, string> = {
    primary:
        "bg-accent text-accent-foreground shadow-[0_12px_30px_-14px_var(--accent)] hover:-translate-y-0.5 hover:brightness-105",
    secondary:
        "border border-border bg-surface/90 text-foreground shadow-sm hover:-translate-y-0.5 hover:border-accent/50 hover:bg-surface-raised",
    ghost: "text-muted hover:bg-surface-raised hover:text-foreground",
    danger: "bg-danger text-white shadow-lg hover:-translate-y-0.5 hover:brightness-105",
};

export function Button({
    children,
    className,
    variant = "primary",
    icon: Icon,
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={cn(
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus disabled:pointer-events-none disabled:opacity-50",
                styles[variant],
                className,
            )}
            {...props}
        >
            {Icon ? <Icon aria-hidden="true" className="size-4" /> : null}
            {children}
        </button>
    );
}

export function ButtonLink({
    href,
    children,
    className,
    variant = "primary",
    icon: Icon,
}: CommonProps & { href: string }) {
    return (
        <Link
            href={href}
            className={cn(
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus",
                styles[variant],
                className,
            )}
        >
            {Icon ? <Icon aria-hidden="true" className="size-4" /> : null}
            {children}
        </Link>
    );
}
