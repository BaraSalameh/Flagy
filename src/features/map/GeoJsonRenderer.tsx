import L from "leaflet";
import { GeoJSON, useMap } from "react-leaflet";
import { useLoadMapData } from "@/lib/contexts/hooks/useLoadMapData";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setCurrentCountry } from "@/features/games/geo-guess/model/geo-guess-slice";
import { setCurrentCountry as MMCC } from "@/features/games/map-master/model/map-master-slice";
import { useEffect, useRef } from "react";
import type { GeoJsonRendererProps } from "./types";

const makeCountryInteractive = (
    layer: L.Layer,
    countryName: string,
    selectCountry: () => void,
) => {
    const activate = (latlng?: L.LatLng) => {
        selectCountry();
        layer.bindPopup(countryName).openPopup(latlng);
    };
    layer.on("click", (event: L.LeafletMouseEvent) => activate(event.latlng));
    layer.on("add", () => {
        const element = (layer as L.Path).getElement();
        if (!element) return;
        element.setAttribute("tabindex", "0");
        element.setAttribute("role", "button");
        element.setAttribute("aria-label", `Select ${countryName}`);
        const onKeyDown = (event: Event) => {
            const keyboardEvent = event as KeyboardEvent;
            if (keyboardEvent.key !== "Enter" && keyboardEvent.key !== " ")
                return;
            event.preventDefault();
            activate();
        };
        element.addEventListener("keydown", onKeyDown);
        layer.once("remove", () =>
            element.removeEventListener("keydown", onKeyDown),
        );
    });
};

export const GeoJsonRenderer = ({ geoData, game }: GeoJsonRendererProps) => {
    switch (game) {
        case "geo-guess":
            return <GetGuessCountryGeoJson geoData={geoData} />;
        case "map-master":
            return <GetMapMasterGeoJson geoData={geoData} />;
        case "outline-explorer":
            return <GetOutlineExplorerGeoJson geoData={geoData} />;
        default:
            return null;
    }
};

const GetGuessCountryGeoJson = ({
    geoData,
}: {
    geoData: ReturnType<typeof useLoadMapData>;
}) => {
    const dispatch = useAppDispatch();

    const currentCountry = useAppSelector(
        (state) => state.geoGuess.currentCountry,
    );
    const userDidWin = useAppSelector((state) => state.general.result);

    if (!geoData) return null;
    return (
        <GeoJSON
            data={geoData}
            style={(feature) => {
                const countryName = feature?.properties?.name;
                const isSelected = countryName === currentCountry;

                return {
                    fillColor: isSelected
                        ? userDidWin
                            ? "var(--teal)"
                            : "var(--coral)"
                        : "var(--map-country)",
                    fillOpacity: isSelected ? 0.7 : 1,
                    color: isSelected
                        ? userDidWin
                            ? "var(--teal)"
                            : "var(--coral)"
                        : "var(--map-border)",
                    weight: isSelected ? 2 : 1,
                };
            }}
            onEachFeature={(feature, layer) => {
                const countryName = feature.properties?.name;
                if (countryName)
                    makeCountryInteractive(layer, countryName, () =>
                        dispatch(setCurrentCountry(countryName)),
                    );
            }}
        />
    );
};

const GetMapMasterGeoJson = ({
    geoData,
}: {
    geoData: ReturnType<typeof useLoadMapData>;
}) => {
    const dispatch = useAppDispatch();

    const mapMasterState = useAppSelector((state) => state.mapMaster);
    const currentCountry = mapMasterState.currentCountry;
    const isTrueSelection = mapMasterState.isTrueSelection;

    return (
        geoData && (
            <GeoJSON
                data={geoData}
                style={(feature) => {
                    const countryName = feature?.properties?.name;
                    const isSelected = countryName === currentCountry;

                    return {
                        fillColor: isSelected
                            ? isTrueSelection
                                ? "var(--teal)"
                                : "var(--coral)"
                            : "var(--map-country)",
                        fillOpacity: isSelected ? 0.7 : 1,
                        color: isSelected
                            ? isTrueSelection
                                ? "var(--teal)"
                                : "var(--coral)"
                            : "var(--map-border)",
                        weight: isSelected ? 2 : 1,
                    };
                }}
                onEachFeature={(feature, layer) => {
                    const countryName = feature.properties?.name;
                    if (countryName)
                        makeCountryInteractive(layer, countryName, () =>
                            dispatch(MMCC(countryName)),
                        );
                }}
            />
        )
    );
};

const GetOutlineExplorerGeoJson = ({
    geoData,
}: {
    geoData: ReturnType<typeof useLoadMapData>;
}) => {
    const map = useMap();
    const boundsMapRef = useRef<Map<string, L.LatLngBounds>>(new Map());
    const randomCountry = useAppSelector(
        (state) => state.outlineExplorer.randomCountry,
    );

    useEffect(() => {
        const bounds = boundsMapRef.current.get(randomCountry);
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [randomCountry, map]);

    return (
        geoData && (
            <GeoJSON
                data={geoData}
                onEachFeature={(feature, layer) => {
                    const name = feature?.properties?.name;
                    const bounds = (layer as L.Polygon).getBounds?.();
                    if (name && bounds) boundsMapRef.current.set(name, bounds);
                }}
                style={(feature) => {
                    const isSelected =
                        feature?.properties?.name === randomCountry;

                    return {
                        fillColor: isSelected
                            ? "var(--map-selected)"
                            : "var(--map-country)",
                        fillOpacity: isSelected ? 0.7 : 1,
                        color: isSelected
                            ? "var(--map-selected)"
                            : "var(--map-border)",
                        weight: isSelected ? 2 : 1,
                    };
                }}
            />
        )
    );
};
