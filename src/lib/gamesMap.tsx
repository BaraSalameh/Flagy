import { GamesMap } from "./types.lib";
import { GeoGuess } from '@/games';

export const gamesMap: GamesMap = {
    map: { name: 'Map', games: [{ name: 'Geo Guess', path: 'geo-guess', component: <GeoGuess />}]}
}