'use client'

import { createContext, ReactNode } from "react";
import { useLoadGeoData } from "./hooks/useLoadGeoData";
import { MapContextType } from "./types.context";

type Props = { children: ReactNode };

export const MapContext = createContext<MapContextType>({
    map: null,
});

export const MapProvider = ({ children }: Props) => {

    const map = useLoadGeoData();

    return (
        <MapContext.Provider value={{ map }}>
            {children}
        </MapContext.Provider>
    );
};
