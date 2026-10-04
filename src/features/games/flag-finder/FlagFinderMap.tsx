import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { CountrySelectionMap } from "@/features/map/CountrySelectionMap";
import type { GeoJsonRendererProps } from "@/features/map/types";
import { FLAG_FINDER_RULES } from "./model/rules";
import { getFlagTarget, submitFlagGuess } from "./model/flag-finder-slice";

export function FlagFinderMap({
    geoData,
}: Pick<GeoJsonRendererProps, "geoData">) {
    const dispatch = useAppDispatch();
    const round = useAppSelector((state) => state.flagFinder);
    const target = getFlagTarget(round);
    const solved = round.lastSelection?.correct === true;
    const playing = round.status === "playing" && !solved;

    return (
        <CountrySelectionMap
            geoData={geoData}
            playing={playing}
            incorrectCodes={round.incorrectCodes}
            correctCodes={solved && target ? [target.countryCode] : []}
            disabledCodes={round.incorrectCodes}
            revealCode={round.revealedAnswer ? target?.countryCode : undefined}
            viewKey={round.status === "idle" ? "idle" : "active"}
            borderOpacity={FLAG_FINDER_RULES[round.difficulty].borderOpacity}
            onSelect={({ countryCode, countryName }) =>
                dispatch(submitFlagGuess({ countryCode, countryName }))
            }
        />
    );
}
