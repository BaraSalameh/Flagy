import { Compass, MapPinned, ScanSearch } from "lucide-react";
import { difficulties, type GameDefinition } from "@/shared/types/game";
export const gameDefinitions: readonly GameDefinition[] = [
    {
        slug: "geo-guess",
        title: "Geo Guess",
        eyebrow: "Follow the clues",
        description:
            "Read smart hints and uncover a mystery country before time runs out.",
        icon: Compass,
        accent: "ocean",
        difficulties,
        load: () =>
            import("@/features/games/geo-guess/GeoGuess").then(
                ({ GeoGuess }) => ({ default: GeoGuess }),
            ),
    },
    {
        slug: "map-master",
        title: "Map Master",
        eyebrow: "Test your map memory",
        description:
            "Find named countries quickly and build a winning score streak.",
        icon: MapPinned,
        accent: "coral",
        difficulties,
        load: () =>
            import("@/features/games/map-master/MapMaster").then(
                ({ MapMaster }) => ({ default: MapMaster }),
            ),
    },
    {
        slug: "outline-explorer",
        title: "Outline Explorer",
        eyebrow: "Read the silhouette",
        description: "Match a highlighted outline to the right country name.",
        icon: ScanSearch,
        accent: "sun",
        difficulties,
        load: () =>
            import("@/features/games/outline-explorer/OutlineExplorer").then(
                ({ OutlineExplorer }) => ({ default: OutlineExplorer }),
            ),
    },
] as const;
export const getGameDefinition = (slug: string) =>
    gameDefinitions.find((game) => game.slug === slug);
