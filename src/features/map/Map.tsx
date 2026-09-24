"use client";
import dynamic from "next/dynamic";
import type { WorldMapProps } from "./types";
import { GameLoadingOverlay } from "./GameLoadingOverlay";
const LazyWorldMap = dynamic(
    () => import("./WorldMap").then((module) => module.WorldMap),
    {
        ssr: false,
        loading: () => <GameLoadingOverlay />,
    },
);
export function Map(props: WorldMapProps) {
    return <LazyWorldMap {...props} />;
}
