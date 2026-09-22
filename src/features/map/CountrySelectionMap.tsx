import { useEffect, useRef } from "react";
import L from "leaflet";
import { GeoJSON, useMap, ZoomControl } from "react-leaflet";
import { useLoadInfoData } from "@/lib/contexts/hooks/useLoadMapData";
import type { InfoData } from "@/shared/types/country";
import type { GeoJsonRendererProps } from "./types";

interface CountrySelectionMapProps {
    geoData: GeoJsonRendererProps["geoData"];
    playing: boolean;
    incorrectCodes: readonly string[];
    correctCodes: readonly string[];
    disabledCodes: readonly string[];
    revealCode?: string;
    viewKey?: string;
    onSelect: (country: InfoData) => void;
}

export function CountrySelectionMap({
    geoData,
    playing,
    incorrectCodes,
    correctCodes,
    disabledCodes,
    revealCode,
    viewKey,
    onSelect,
}: CountrySelectionMapProps) {
    const info = useLoadInfoData();
    const map = useMap();
    const layers = useRef<L.GeoJSON>(null);
    const selectRef = useRef(onSelect);
    useEffect(() => {
        selectRef.current = onSelect;
    }, [onSelect]);

    useEffect(() => {
        if (!revealCode) {
            map.setView([20, 0], 3, { animate: false });
            map.closePopup();
            return;
        }
        const bounds = L.latLngBounds([]);
        layers.current?.eachLayer((layer) => {
            const polygon = layer as L.Polygon & { feature?: GeoJSON.Feature };
            if (polygon.feature?.properties?.ISO2 === revealCode)
                bounds.extend(polygon.getBounds());
        });
        if (bounds.isValid()) {
            map.fitBounds(bounds, {
                paddingTopLeft: [45, 95],
                paddingBottomRight:
                    map.getSize().x >= 640
                        ? [355, 30]
                        : [30, map.getSize().y * 0.48],
                maxZoom: 6,
                animate: false,
            });
        }
    }, [revealCode, viewKey, map]);

    useEffect(() => {
        layers.current?.eachLayer((layer) => {
            const path = layer as L.Path & { feature?: GeoJSON.Feature };
            const code = path.feature?.properties?.ISO2;
            const element = path.getElement();
            if (!element || !info?.[code]) return;
            const disabled = !playing || disabledCodes.includes(code);
            element.setAttribute("aria-disabled", String(disabled));
            element.setAttribute("tabindex", disabled ? "-1" : "0");
        });
    }, [playing, disabledCodes, info]);

    if (!geoData || !info) return null;
    return (
        <>
            <ZoomControl position="topleft" />
            <GeoJSON
                ref={layers}
                data={geoData}
                style={(feature) => {
                    const code = feature?.properties?.ISO2;
                    const answer = code === revealCode;
                    const incorrect = incorrectCodes.includes(code);
                    const correct = correctCodes.includes(code);
                    const color = answer
                        ? "var(--teal)"
                        : incorrect
                          ? "var(--coral)"
                          : correct
                            ? "var(--teal)"
                            : undefined;
                    return {
                        fillColor: color ?? "var(--map-country)",
                        fillOpacity: color ? 0.8 : 1,
                        color: color ?? "var(--map-border)",
                        weight: color ? 2 : 1,
                    };
                }}
                onEachFeature={(feature, layer) => {
                    const code: string = feature.properties?.ISO2;
                    const country = info[code];
                    if (!country) return;
                    const activate = () => selectRef.current(country);
                    layer.on("click", activate);
                    layer.on("add", () => {
                        const element = (layer as L.Path).getElement();
                        if (!element) return;
                        element.setAttribute("tabindex", "0");
                        element.setAttribute("role", "button");
                        element.setAttribute(
                            "aria-label",
                            `Select ${country.countryName}`,
                        );
                        const onKeyDown = (event: Event) => {
                            const key = (event as KeyboardEvent).key;
                            if (key !== "Enter" && key !== " ") return;
                            event.preventDefault();
                            activate();
                        };
                        element.addEventListener("keydown", onKeyDown);
                        layer.once("remove", () =>
                            element.removeEventListener("keydown", onKeyDown),
                        );
                    });
                }}
            />
        </>
    );
}
