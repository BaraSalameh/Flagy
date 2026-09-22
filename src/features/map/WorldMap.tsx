"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer } from "react-leaflet";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { GeoJsonRenderer } from "./GeoJsonRenderer";
import { useMapDataState } from "@/lib/contexts/hooks/useLoadMapData";
import type { WorldMapProps } from "./types";
import { Button, Card } from "@/shared/ui";

export function WorldMap(props: WorldMapProps) {
    const { map: geoData, status, error, retry } = useMapDataState();
    if (status === "loading")
        return (
            <div
                className="grid h-full w-full place-items-center bg-surface-raised"
                role="status"
            >
                <div className="text-center">
                    <div className="mx-auto size-11 animate-spin rounded-full border-4 border-surface-muted border-t-accent" />
                    <p className="mt-4 font-bold text-muted">
                        Unfolding the atlas…
                    </p>
                </div>
            </div>
        );
    if (status === "error" || !geoData)
        return (
            <div className="grid h-full w-full place-items-center bg-surface-raised p-4">
                <Card className="max-w-sm p-6 text-center">
                    <AlertTriangle className="mx-auto size-8 text-coral" />
                    <h2 className="mt-3 text-xl font-black">
                        The map took a wrong turn
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted">
                        {error ?? "The atlas could not be loaded."}
                    </p>
                    <Button className="mt-5" icon={RefreshCw} onClick={retry}>
                        Try again
                    </Button>
                </Card>
            </div>
        );
    return (
        <MapContainer
            center={[20, 0]}
            zoom={3}
            minZoom={props.game === "outline-explorer" ? 0 : 2}
            maxZoom={props.game === "outline-explorer" ? 18 : 10}
            dragging
            zoomControl={false}
            scrollWheelZoom
            doubleClickZoom
            maxBounds={[
                [-90, -180],
                [90, 180],
            ]}
            maxBoundsViscosity={1}
            className="h-full w-full z-0"
            aria-label="Interactive world map"
        >
            <GeoJsonRenderer geoData={geoData} game={props.game} />
        </MapContainer>
    );
}
