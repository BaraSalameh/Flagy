import { useCallback, useEffect, useRef } from "react";
import L from "leaflet";
import { GeoJSON, useMap, ZoomControl } from "react-leaflet";
import { LocateFixed } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";
import { IconButton } from "@/shared/ui";
import type { GeoJsonRendererProps } from "@/features/map/types";
import { getChallenge } from "./model/outline-explorer-slice";

export function OutlineMap({ geoData }: Pick<GeoJsonRendererProps, "geoData">) {
    const round = useAppSelector((state) => state.outlineExplorer);
    const code =
        round.status === "idle"
            ? undefined
            : getChallenge(round)?.target.countryCode;
    const map = useMap();
    const layers = useRef<L.GeoJSON>(null);
    const centerOutline = useCallback(() => {
        if (!code) return;
        const bounds = L.latLngBounds([]);
        layers.current?.eachLayer((layer) => {
            const polygon = layer as L.Polygon & { feature?: GeoJSON.Feature };
            if (polygon.feature?.properties?.ISO2 === code)
                bounds.extend(polygon.getBounds());
        });
        if (bounds.isValid())
            map.fitBounds(bounds, {
                paddingTopLeft: [80, 95],
                paddingBottomRight:
                    map.getSize().x >= 640
                        ? [355, 30]
                        : [30, map.getSize().y * 0.52],
                maxZoom: 18,
                animate: false,
            });
    }, [code, map]);

    useEffect(() => {
        centerOutline();
        map.on("resize", centerOutline);
        return () => {
            map.off("resize", centerOutline);
        };
    }, [centerOutline, map]);

    return geoData ? (
        <>
            <ZoomControl position="topleft" />
            {code ? (
                <IconButton
                    label="Center outline"
                    icon={LocateFixed}
                    onClick={centerOutline}
                    className="absolute left-5 top-44 z-[750]"
                />
            ) : null}
            <GeoJSON
                ref={layers}
                data={geoData}
                interactive={false}
                style={(feature) => {
                    const selected =
                        !!code && feature?.properties?.ISO2 === code;
                    return {
                        fillColor: selected
                            ? "var(--map-selected)"
                            : "var(--map-country)",
                        fillOpacity: selected ? 0.9 : 1,
                        color: selected
                            ? "var(--map-selected)"
                            : "var(--map-border)",
                        weight: selected ? 3 : 1,
                    };
                }}
            />
        </>
    ) : null;
}
