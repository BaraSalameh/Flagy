import { cn } from "@/shared/lib/cn";

export function Progress({
    value,
    max,
    label,
    className,
}: {
    value: number;
    max: number;
    label: string;
    className?: string;
}) {
    const percent = Math.max(0, Math.min(100, (value / max) * 100));
    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center justify-between gap-4 text-xs font-bold text-muted">
                <span>{label}</span>
                <span className="font-mono">
                    {value} / {max}
                </span>
            </div>
            <div
                className="h-2.5 overflow-hidden rounded-full bg-surface-muted"
                role="progressbar"
                aria-label={label}
                aria-valuemin={0}
                aria-valuemax={max}
                aria-valuenow={value}
            >
                <div
                    className="h-full rounded-full bg-gradient-to-r from-ocean via-teal to-sun transition-[width] duration-300"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
