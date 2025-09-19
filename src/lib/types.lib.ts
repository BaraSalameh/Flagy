import React from "react";

export type UseStateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export type GamesMap = Record<GameCategory['path'], CategoryAtts>;
interface CategoryAtts {
    name: GameCategory['name'];
    games: Game[]
}

export interface GameCategory {
    name: 'Map';
    path: 'map';
};

export interface Game {
    name: string;
    path: GameName;
    component: React.ReactNode;
}
export type GameName = MapGameName;
export type MapGameName = 'geo-guess' | 'map-master';