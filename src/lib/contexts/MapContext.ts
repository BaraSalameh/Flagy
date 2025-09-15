'use client'

import { createContext } from "react";
import { MapContextType } from "./types.context";

export const MapContext = createContext<MapContextType>({
    map: null,
});
