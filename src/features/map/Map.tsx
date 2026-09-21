"use client";
import dynamic from "next/dynamic";
import type { WorldMapProps } from "./types";
const LazyWorldMap = dynamic(
    () => import("./WorldMap").then((module) => module.WorldMap),
    {
        ssr: false,
        loading: () => <div className="h-full w-full bg-surface-raised" />,
    },
);
export function Map(props: WorldMapProps) {
    return <LazyWorldMap {...props} />;
}
