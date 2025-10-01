export interface InfoData {
    countryCode: string;
    countryName: string;
    currencyCode: string;
    population: string;
    capital: string;
    continentName: string;
    region: string;
    area: number;
    borders: string[],
    languages: string[],
    flag: string;
}

export interface GeneralState {
    counter: number;
    difficulty: GameDifficulty;
    gameStarted: boolean;
    result: boolean;
}
export type GameDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface GeoGuessState {
    currentCountry: InfoData['countryName'];
    randomCountry: InfoData['countryName'];
    hint: Hint;
}
type Hint = {
    information: InfoData;
    message: string | string[] | undefined;
}

export interface CountryState {
    currentCountry: InfoData['countryName'];
    randomCountry: InfoData['countryName'];
    result: boolean;
}

export interface MapMasterState extends CountryState {
    counter: number;
    isTrueSelection: boolean;
}

export interface OutlineExplorerState extends CountryState {
    counter: number;
    randomCountries: InfoData['countryName'][],
}