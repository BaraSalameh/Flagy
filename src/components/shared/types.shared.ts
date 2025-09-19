export type GameProps = GeoGuess | FlagGuess;

interface GeoGuess {
    mode: 'map';
}

interface FlagGuess {
    mode: 'flag';
    flagName: string;
}