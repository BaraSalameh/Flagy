
import { CountryGuess, GameProps } from "@/components/shared/types.shared";
import { useLoadMapData } from "@/lib/contexts/hooks";
import {  JSX } from "react"
import { GeoJSON } from 'react-leaflet';

export const getGeoJson = (geoData: ReturnType<typeof useLoadMapData>, props: GameProps): JSX.Element | null => {
    switch (props.mode) {
        case 'country':
            return getGuessCountryGeoJson(geoData, props);
        default: return null;
    }
}

const getGuessCountryGeoJson = (geoData: ReturnType<typeof useLoadMapData>, props: CountryGuess): JSX.Element | null => {
    const { onCountryClick, onWin, randomCountryName, userSelectedCountry } = props;

    return geoData &&
    <GeoJSON
        data={geoData}
        style={(feature) => {
            const countryName = feature?.properties?.name;
            const isSelected = countryName === userSelectedCountry;
            const userDidWin = countryName === randomCountryName;

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
                    onCountryClick?.(countryName);
                    if (countryName === randomCountryName) onWin();
                    layer.bindPopup(`${countryName}`).openPopup(e.latlng);
                });
            }
        }}
    />
}