import { useCallback, useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { GeoJSON, useMap, ZoomControl } from "react-leaflet";
import { useLoadInfoData } from "@/lib/contexts/hooks/useLoadMapData";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import type { GeoJsonRendererProps } from "@/features/map/types";
import { selectCountry } from "./model/border-hop-slice";

export function BorderHopMap({
    geoData,
}: Pick<GeoJsonRendererProps, "geoData">) {
    const dispatch = useAppDispatch();
    const round = useAppSelector((state) => state.borderHop);
    const info = useLoadInfoData();
    const map = useMap();
    const layers = useRef<L.GeoJSON>(null);
    const puzzle = round.puzzle;
    const displayedPath = useMemo(
        () =>
            round.status === "lost" ? (puzzle?.optimalPath ?? []) : round.path,
        [puzzle?.optimalPath, round.path, round.status],
    );
    const currentCode = round.path.at(-1);
    const puzzleKey = puzzle
        ? `${puzzle.start.countryCode}-${puzzle.destination.countryCode}`
        : "idle";

    const getStyle = useCallback(
        (feature?: GeoJSON.Feature) => {
            const code = feature?.properties?.ISO2;
            const isStart = code === puzzle?.start.countryCode;
            const isDestination = code === puzzle?.destination.countryCode;
            const isCurrent =
                round.status === "playing" && code === currentCode;
            const isInvalid = code === round.invalidCode;
            const isRoute = displayedPath.includes(code);
            const fillColor = isInvalid
                ? "var(--danger)"
                : isCurrent
                  ? "var(--sun)"
                  : isDestination
                    ? "var(--coral)"
                    : isStart
                      ? "var(--ocean)"
                      : isRoute
                        ? "var(--teal)"
                        : "var(--map-country)";
            const emphasized =
                isStart || isDestination || isCurrent || isInvalid || isRoute;
            return {
                fillColor,
                fillOpacity: emphasized ? 0.86 : 1,
                color: emphasized ? fillColor : "var(--map-border)",
                weight: emphasized ? 2.5 : 1,
            };
        },
        [currentCode, displayedPath, puzzle, round.invalidCode, round.status],
    );

    useEffect(() => {
        layers.current?.setStyle(getStyle);
    }, [getStyle]);

    useEffect(() => {
        if (!puzzle) {
            map.setView([20, 0], 3, { animate: false });
            return;
        }
        const bounds = L.latLngBounds([]);
        layers.current?.eachLayer((layer) => {
            const polygon = layer as L.Polygon & { feature?: GeoJSON.Feature };
            const code = polygon.feature?.properties?.ISO2;
            if (
                code === puzzle.start.countryCode ||
                code === puzzle.destination.countryCode
            )
                bounds.extend(polygon.getBounds());
        });
        if (bounds.isValid())
            map.fitBounds(bounds, {
                paddingTopLeft: [55, 95],
                paddingBottomRight:
                    map.getSize().x >= 640
                        ? [370, 40]
                        : [40, map.getSize().y * 0.5],
                maxZoom: 5,
                animate: false,
            });
    }, [map, puzzle, puzzleKey]);

    useEffect(() => {
        layers.current?.eachLayer((layer) => {
            const path = layer as L.Path & { feature?: GeoJSON.Feature };
            const code = path.feature?.properties?.ISO2;
            const element = path.getElement();
            if (!element || !info?.[code]) return;
            const disabled = round.status !== "playing";
            element.setAttribute("aria-disabled", String(disabled));
            element.setAttribute("tabindex", disabled ? "-1" : "0");
        });
    }, [info, round.status]);

    if (!geoData || !info) return null;
    return (
        <>
            <ZoomControl position="topleft" />
            <GeoJSON
                ref={layers}
                data={geoData}
                style={getStyle}
                onEachFeature={(feature, layer) => {
                    const code: string = feature.properties?.ISO2;
                    const country = info[code];
                    if (!country) return;
                    const activate = () => dispatch(selectCountry(code));
                    layer.on("click", activate);
                    layer.on("add", () => {
                        const element = (layer as L.Path).getElement();
                        if (!element) return;
                        element.setAttribute("tabindex", "0");
                        element.setAttribute("role", "button");
                        element.setAttribute(
                            "aria-label",
                            `Add ${country.countryName} to route`,
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
