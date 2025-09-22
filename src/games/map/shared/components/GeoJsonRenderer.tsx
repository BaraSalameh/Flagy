import L from "leaflet";
import { GeoJSON, useMap } from 'react-leaflet';
import { useLoadMapData } from "@/lib/contexts/hooks";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setCurrentCountry } from "@/lib/store/slices/geoGuessSlice";
import { setCurrentCountry as MMCC } from "@/lib/store/slices/mapMasterSlice";
import { GameName } from "@/lib/types.lib";
import { useEffect, useRef } from 'react';

export const GeoJsonRenderer = ({geoData, game}: {geoData: ReturnType<typeof useLoadMapData>; game: GameName}) => {
    switch (game) {
        case 'geo-guess':
            return <GetGuessCountryGeoJson geoData={geoData} />;
        case 'map-master':
            return <GetMapMasterGeoJson geoData={geoData} />;
        case 'outline-explorer':
            return <GetOutlineExplorerGeoJson geoData={geoData} />;
        default: return null;
    }
}

const GetGuessCountryGeoJson = ({ geoData }: {geoData: ReturnType<typeof useLoadMapData>}) => {
    const dispatch = useAppDispatch();

    const currentCountry = useAppSelector(state => state.geoGuess.currentCountry);
    const userDidWin = useAppSelector(state => state.geoGuess.result);

    if (!geoData) return null;
    return <GeoJSON
        data={geoData}
        style={(feature) => {
            const countryName = feature?.properties?.name;
            const isSelected = countryName === currentCountry;

            return {
                fillColor: isSelected ? userDidWin ? 'green' : 'red' : '#f5f5f5',
                fillOpacity: isSelected ? 0.7 : 1,
                color: isSelected ? userDidWin ? 'green' : 'red' : '#666',
                weight: isSelected ? 2 : 1,
            };
        }}
        onEachFeature={(feature, layer) => {
            if (feature.properties?.name) {
                layer.on('click', (e) => {
                    const countryName = feature.properties.name;
                    dispatch(setCurrentCountry(countryName));
                    layer.bindPopup(`${countryName}`).openPopup(e.latlng);
                });
            }
        }}
    />
}

const GetMapMasterGeoJson = ({ geoData }: {geoData: ReturnType<typeof useLoadMapData>}) => {
    const dispatch = useAppDispatch();

    const mapMasterState = useAppSelector(state => state.mapMaster);
    const currentCountry = mapMasterState.currentCountry;
    const isTrueSelection = mapMasterState.isTrueSelection;

    return geoData &&
    <GeoJSON
        data={geoData}
        style={(feature) => {
            const countryName = feature?.properties?.name;
            const isSelected = countryName === currentCountry;

            return {
                fillColor: isSelected ? isTrueSelection ? 'green' : 'red' : '#f5f5f5',
                fillOpacity: isSelected ? 0.7 : 1,
                color: isSelected ? isTrueSelection ? 'green' : 'red' : '#666',
                weight: isSelected ? 2 : 1,
            };
        }}
        onEachFeature={(feature, layer) => {
            if (feature.properties?.name) {
                layer.on('click', (e) => {
                    const countryName = feature.properties.name;
                    dispatch(MMCC(countryName));
                    layer.bindPopup(`${countryName}`).openPopup(e.latlng);
                });
            }
        }}
    />
}

const GetOutlineExplorerGeoJson = ({ geoData }: {geoData: ReturnType<typeof useLoadMapData>}) => {
    const map = useMap();
    const boundsMapRef = useRef<Map<string, L.LatLngBounds>>(new Map());
    const randomCountry = useAppSelector(state => state.outlineExplorer.randomCountry);

    useEffect(() => {
        const bounds = boundsMapRef.current.get(randomCountry);
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [randomCountry, map]);

    return geoData && 
    <GeoJSON
        data={geoData}
        onEachFeature={(feature, layer) => {
            const name = feature?.properties?.name;
            const bounds = (layer as L.Polygon).getBounds?.();
            if (name && bounds) boundsMapRef.current.set(name, bounds);
        }}
        style={(feature) => {
            const isSelected = feature?.properties?.name === randomCountry;
            
            return {
                fillColor: isSelected ? "green" : "#f5f5f5",
                fillOpacity: isSelected ? 0.7 : 1,
                color: isSelected ? "green" : "#666",
                weight: isSelected ? 2 : 1,
            };
        }}
    />
};
