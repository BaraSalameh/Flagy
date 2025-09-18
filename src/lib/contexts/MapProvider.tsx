'use client'

import { createContext, ReactNode } from "react";
import { useLoadGeoData, useLoadInfoData } from "./hooks/useLoadGeoData";
import { MapContextType } from "./types.context";

type Props = { children: ReactNode };

export const MapContext = createContext<MapContextType>({
    map: null,
    info: null
});

export const MapProvider = ({ children }: Props) => {

    const map = useLoadGeoData();
    const info = useLoadInfoData();

    return (
        <MapContext.Provider value={{ map, info }}>
            {children}
        </MapContext.Provider>
    );
};
