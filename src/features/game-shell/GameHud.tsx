import { useAppSelector } from "@/lib/store/hooks";
import { Clock } from "lucide-react";
import { Card } from "@/shared/ui";

export const GameHud = () => {
    const counter = useAppSelector((state) => state.general.counter);

    return (
        <Card
            role="status"
            aria-live="polite"
            className="absolute bottom-5 left-3 z-[700] flex items-center gap-2 rounded-2xl px-3 py-2.5 sm:bottom-auto sm:left-5 sm:top-1/2 sm:-translate-y-1/2"
        >
            <span className="grid size-9 place-items-center rounded-xl bg-coral/15 text-coral">
                <Clock className="size-4" />
            </span>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">
                    Time
                </p>
                <p className="font-mono text-lg font-black leading-none">
                    {counter ?? 0}
                </p>
            </div>
        </Card>
    );
};
