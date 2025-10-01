import { GameName } from "@/lib/types.lib";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { ReactNode } from "react";

export interface MapProps {
    game: GameName;
}

export interface ProgressProps {
    counter: number;
    maxCounter: number;
    content?: ReactNode
}

export interface CountryMenuProps {
    randomCountries: string[];
    onAction: ActionCreatorWithPayload<string>;
}