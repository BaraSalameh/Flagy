import { countryMenu } from "@/styles"
import { NavButton } from "../ui"
import { LucideMoveRight } from "lucide-react"
import { useAppDispatch } from "@/lib/store/hooks"
import { CountryMenuProps } from "./types.shared"

export const CountryMenu = ({randomCountries, onAction}: CountryMenuProps) => {
    const dispatch = useAppDispatch();

    return (
        randomCountries &&
        <div className={countryMenu()}>
            {randomCountries?.map((country, idx) => 
                <NavButton
                    key={idx}
                    icon={LucideMoveRight}
                    hoverable={false}
                    label={country}
                    onClick={() => dispatch(onAction(country))}
                />
            )}
        </div>
    )
}