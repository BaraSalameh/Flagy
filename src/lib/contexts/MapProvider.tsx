'use client'

import { ReactNode } from "react";
import { useLoadGeoData } from "./hooks/useLoadGeoData";
import { MapContext } from "./MapContext";

type Props = { children: ReactNode };

export const MapProvider = ({ children }: Props) => {

    const map = useLoadGeoData();

    return (
        <MapContext.Provider value={{ map }}>
            {children}
        </MapContext.Provider>
    );
};
