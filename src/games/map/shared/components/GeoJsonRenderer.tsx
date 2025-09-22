import { GeoJSON } from 'react-leaflet';
import { useLoadMapData } from "@/lib/contexts/hooks";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setCurrentCountry } from "@/lib/store/slices/geoGuessSlice";
import { setCurrentCountry as MMCC } from "@/lib/store/slices/mapMasterSlice";
import { GameName } from "@/lib/types.lib";

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