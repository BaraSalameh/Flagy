import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGameDefinition } from "@/features/game-hub/game-registry";
import { MapProvider } from "@/lib/contexts";
type Params = Promise<{ "game-category": string; game: string }>;
export function generateStaticParams() {
    return ["geo-guess", "map-master", "outline-explorer"].map((game) => ({
        "game-category": "map",
        game,
    }));
}
export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata> {
    const { game } = await params;
    const definition = getGameDefinition(game);
    return definition
        ? { title: definition.title, description: definition.description }
        : {};
}
export default async function GamePage({ params }: { params: Params }) {
    const { "game-category": category, game } = await params;
    if (category !== "map") notFound();
    const definition = getGameDefinition(game);
    if (!definition) notFound();
    const { default: Game } = await definition.load();
    return (
        <MapProvider>
            <Game />
        </MapProvider>
    );
}
