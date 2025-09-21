'use client'

import { createContext, ReactNode } from "react";
import { useFetchGeoData, useFetchInfoData } from "./hooks/useLoadGeoData";
import { MapContextType } from "./types.context";

type Props = { children: ReactNode };

export const MapContext = createContext<MapContextType>({
    map: null,
    info: null
});

export const MapProvider = ({ children }: Props) => {

    const map = useFetchGeoData();
    const info = useFetchInfoData();

    return (
        <MapContext.Provider value={{ map, info }}>
            {children}
        </MapContext.Provider>
    );
};
