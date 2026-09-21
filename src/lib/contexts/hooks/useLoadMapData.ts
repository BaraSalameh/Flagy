"use client";
import { useContext } from "react";
import { MapContext } from "../MapProvider";
export const useMapDataState = () => {
    const context = useContext(MapContext);
    if (!context)
        throw new Error("useMapDataState must be used inside MapProvider");
    return context;
};
export const useLoadMapData = () => useMapDataState().map;
export const useLoadInfoData = () => useMapDataState().info;
