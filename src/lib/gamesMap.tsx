
import { GamesMap } from "./types.lib";
import { GeoGuess, MapMaster, OutlineExplorer } from '@/games';

export const gamesMap: GamesMap = {
    map: {
        name: 'Map',
        games: [
            { name: 'Geo Guess', path: 'geo-guess', component: <GeoGuess />},
            { name: 'Map Master', path: 'map-master', component: <MapMaster />},
            { name: 'Outline Explorer', path: 'outline-explorer', component: <OutlineExplorer />}
        ]
    }
}