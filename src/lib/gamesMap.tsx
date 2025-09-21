import { GamesMap } from "./types.lib";
import { GeoGuess, MapMaster } from '@/games';

export const gamesMap: GamesMap = {
    map: {
        name: 'Map',
        games: [
            { name: 'Geo Guess', path: 'geo-guess', component: <GeoGuess />},
            { name: 'Map Master', path: 'map-master', component: <MapMaster />}
        ]
    }
}