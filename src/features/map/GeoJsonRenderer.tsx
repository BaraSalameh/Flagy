"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { GeoGuessMap } from "@/features/games/geo-guess/GeoGuessMap";
import { MapMasterMap } from "@/features/games/map-master/MapMasterMap";
import { OutlineMap } from "@/features/games/outline-explorer/OutlineMap";
import type { GeoJsonRendererProps } from "./types";

function MapPaintReporter({
    geoData,
    onReady,
}: Pick<GeoJsonRendererProps, "geoData" | "onReady">) {
    const map = useMap();

    useEffect(() => {
        let firstFrame = 0;
        let secondFrame = 0;
        let cancelled = false;

        map.whenReady(() => {
            firstFrame = requestAnimationFrame(() => {
                secondFrame = requestAnimationFrame(() => {
                    if (!cancelled) onReady();
                });
            });
        });

        return () => {
            cancelled = true;
            cancelAnimationFrame(firstFrame);
            cancelAnimationFrame(secondFrame);
        };
    }, [geoData, map, onReady]);

    return null;
}

export const GeoJsonRenderer = ({
    geoData,
    game,
    onReady,
}: GeoJsonRendererProps) => {
    let renderer;

    switch (game) {
        case "geo-guess":
            renderer = <GeoGuessMap geoData={geoData} />;
            break;
        case "map-master":
            renderer = <MapMasterMap geoData={geoData} />;
            break;
        case "outline-explorer":
            renderer = <OutlineMap geoData={geoData} />;
            break;
    }

    return (
        <>
            {renderer}
            <MapPaintReporter geoData={geoData} onReady={onReady} />
        </>
    );
};
