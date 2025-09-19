
import { GameProps } from "@/components/shared/types.shared";
import { useLoadMapData } from "@/lib/contexts/hooks";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setCurrentCountry } from "@/lib/store/slices/countrySlice";
import {  JSX } from "react"
import { GeoJSON } from 'react-leaflet';

export const getGeoJson = (geoData: ReturnType<typeof useLoadMapData>, props: GameProps): JSX.Element | null => {
    switch (props.mode) {
        case 'map':
            return <GetGuessCountryGeoJson geoData={geoData} />;
        default: return null;
    }
}

const GetGuessCountryGeoJson = ({ geoData }: {geoData: ReturnType<typeof useLoadMapData>}): JSX.Element | null => {
    const dispatch = useAppDispatch();

    const currentCountry = useAppSelector(state => state.country.currentCountry);
    const userDidWin = useAppSelector(state => state.country.result);

    return geoData &&
    <GeoJSON
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