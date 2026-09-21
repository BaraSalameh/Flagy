import { ArrowRight, Gauge, Mountain, Rocket, Sprout } from "lucide-react";
import { useAppDispatch } from "@/lib/store/hooks";
import { setDifficulty } from "@/features/game-shell/model/session-slice";
import type { GameDifficulty } from "@/shared/types/game";
import { Button } from "@/shared/ui";

const options = [
    {
        value: "Beginner",
        detail: "More time and generous scoring",
        icon: Sprout,
    },
    {
        value: "Intermediate",
        detail: "A balanced trip around the world",
        icon: Gauge,
    },
    {
        value: "Advanced",
        detail: "Less time and tighter scoring",
        icon: Mountain,
    },
    { value: "Expert", detail: "Fast, focused, and unforgiving", icon: Rocket },
] satisfies Array<{
    value: GameDifficulty;
    detail: string;
    icon: typeof Sprout;
}>;

export const GameDifficultyMenu = ({
    sideEffect,
}: {
    sideEffect?: () => void;
}) => {
    const dispatch = useAppDispatch();

    const handleClick = (difficulty: GameDifficulty) => {
        dispatch(setDifficulty(difficulty));
        sideEffect?.();
    };

    return (
        <div className="grid gap-2 sm:grid-cols-2">
            {options.map(({ value, detail, icon: Icon }) => (
                <Button
                    key={value}
                    variant="secondary"
                    className="group h-auto justify-start p-3.5 text-left"
                    onClick={() => handleClick(value)}
                >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                        <Icon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block font-black">{value}</span>
                        <span className="mt-0.5 block text-xs font-medium leading-5 text-muted">
                            {detail}
                        </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-muted transition group-hover:translate-x-1" />
                </Button>
            ))}
        </div>
    );
};
