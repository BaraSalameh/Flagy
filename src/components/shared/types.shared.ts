export type GameProps = CountryGuess | FlagGuess;

interface CountryGuess {
    mode: 'country';
}

interface FlagGuess {
    mode: 'flag';
    flagName: string;
}