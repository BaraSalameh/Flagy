"use client";
import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import type { InfoData } from "@/shared/types/country";
import type { MapContextType, MapDataStatus } from "./types.context";

export const MapContext = createContext<MapContextType | null>(null);
export const MapProvider = ({ children }: { children: ReactNode }) => {
    const [map, setMap] = useState<FeatureCollection<
        Geometry,
        GeoJsonProperties
    > | null>(null);
    const [info, setInfo] = useState<Record<string, InfoData> | null>(null);
    const [status, setStatus] = useState<MapDataStatus>("loading");
    const [error, setError] = useState<string | null>(null);
    const [attempt, setAttempt] = useState(0);
    const retry = useCallback(() => setAttempt((value) => value + 1), []);
    useEffect(() => {
        const controller = new AbortController();
        setStatus("loading");
        setError(null);
        Promise.all([
            fetch("/data/countries.geo.json", {
                signal: controller.signal,
            }).then((response) => {
                if (!response.ok) throw new Error("Map data is unavailable");
                return response.json();
            }),
            fetch("/data/countries.info.json", {
                signal: controller.signal,
            }).then((response) => {
                if (!response.ok)
                    throw new Error("Country information is unavailable");
                return response.json();
            }),
        ])
            .then(([mapData, infoData]) => {
                setMap(mapData);
                setInfo(infoData);
                setStatus("ready");
            })
            .catch((reason: unknown) => {
                if (controller.signal.aborted) return;
                setError(
                    reason instanceof Error
                        ? reason.message
                        : "We could not load the atlas",
                );
                setStatus("error");
            });
        return () => controller.abort();
    }, [attempt]);
    const value = useMemo(
        () => ({ map, info, status, error, retry }),
        [map, info, status, error, retry],
    );
    return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};
