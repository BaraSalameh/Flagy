import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { CountrySelectionMap } from "@/features/map/CountrySelectionMap";
import type { GeoJsonRendererProps } from "@/features/map/types";
import { submitGuess } from "./model/geo-guess-slice";

export function GeoGuessMap({
    geoData,
}: Pick<GeoJsonRendererProps, "geoData">) {
    const dispatch = useAppDispatch();
    const round = useAppSelector((state) => state.geoGuess);
    const finished = round.status === "won" || round.status === "lost";
    return (
        <CountrySelectionMap
            geoData={geoData}
            playing={round.status === "playing"}
            incorrectCodes={round.guesses}
            correctCodes={[]}
            disabledCodes={round.guesses}
            revealCode={finished ? round.target?.countryCode : undefined}
            viewKey={round.target?.countryCode}
            onSelect={(country) => dispatch(submitGuess(country.countryCode))}
        />
    );
}
