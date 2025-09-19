'use client';

import { useParams } from "next/navigation";
import { GameCategory, GameName } from "@/lib/types.lib";
import { gamesMap } from "@/lib/gamesMap";

const GamePage = () => {
    const params = useParams();

    const gameCategory = params['game-category'] as GameCategory['path'];
    const game = params['game'] as GameName;

    const Game = gamesMap[gameCategory].games.find(g => g.path === game)?.component;

    return (
        <div className="h-screen">
            {Game}
        </div>
    )
}
    
export default GamePage;