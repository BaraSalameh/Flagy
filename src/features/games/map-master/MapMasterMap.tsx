import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { CountrySelectionMap } from "@/features/map/CountrySelectionMap";
import type { GeoJsonRendererProps } from "@/features/map/types";
import { getTarget, submitGuess } from "./model/map-master-slice";

export function MapMasterMap({
    geoData,
}: Pick<GeoJsonRendererProps, "geoData">) {
    const dispatch = useAppDispatch();
    const round = useAppSelector((state) => state.mapMaster);
    const target = getTarget(round);
    const finished = round.status === "won" || round.status === "lost";
    const correctCodes = round.history
        .filter(
            (guess) =>
                guess.correct &&
                (finished || guess.countryCode !== target?.countryCode),
        )
        .map((guess) => guess.countryCode);
    const last = round.history.at(-1);
    const disabledCodes =
        last?.correct &&
        last.countryCode !== target?.countryCode &&
        !round.incorrectCodes.length
            ? [last.countryCode]
            : round.incorrectCodes;
    return (
        <CountrySelectionMap
            geoData={geoData}
            playing={round.status === "playing"}
            incorrectCodes={round.incorrectCodes}
            correctCodes={correctCodes}
            disabledCodes={disabledCodes}
            revealCode={finished ? target?.countryCode : undefined}
            viewKey={round.status === "idle" ? "idle" : "active"}
            onSelect={({ countryCode, countryName }) =>
                dispatch(submitGuess({ countryCode, countryName }))
            }
        />
    );
}
