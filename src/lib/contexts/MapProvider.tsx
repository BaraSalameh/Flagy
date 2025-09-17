'use client'

import { createContext, ReactNode } from "react";
import { useLoadGeoData, useLoadInfoData, useLoadStatisticsData } from "./hooks/useLoadGeoData";
import { MapContextType } from "./types.context";

type Props = { children: ReactNode };

export const MapContext = createContext<MapContextType>({
    map: null,
    info: null,
    statistics: null
});

export const MapProvider = ({ children }: Props) => {

    const map = useLoadGeoData();
    const info = useLoadInfoData();
    const statistics = useLoadStatisticsData();

    return (
        <MapContext.Provider value={{ map, info, statistics }}>
            {children}
        </MapContext.Provider>
    );
};
