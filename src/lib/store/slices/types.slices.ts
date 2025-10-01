export interface HintState {
    information: InfoData;
    hint: string | string[] | undefined;
}

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
}
export type GameDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

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
    isTrueSelection: boolean;
    randomCountries: InfoData['countryName'][],
}