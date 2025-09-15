export type GameProps = CountryGuess | FlagGuess;

export interface CountryGuess {
    mode: 'country';
    onCountryClick?: (countryName: string) => void;
    userSelectedCountry?: string;
    randomCountryName?: string;
}

interface FlagGuess {
    mode: 'flag';
    flagName: string;
}