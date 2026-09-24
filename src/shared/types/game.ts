import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

export const difficulties = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
] as const;
export type GameDifficulty = (typeof difficulties)[number];
export type GameStatus = "idle" | "playing" | "won" | "lost";
export type GameSlug = "geo-guess" | "map-master" | "outline-explorer";

export interface GameDefinition {
    slug: GameSlug;
    title: string;
    eyebrow: string;
    description: string;
    icon: LucideIcon;
    accent: "ocean" | "coral" | "sun";
    difficulties: readonly (GameDifficulty | "Extreme")[];
    load: () => Promise<{ default: ComponentType }>;
}
