import { countryMenu } from "@/styles"
import { NavButton } from "../ui"
import { LucideMoveRight } from "lucide-react"

export const CountryMenu = () => {
    return (
        <div className={countryMenu()}>
            <NavButton icon={LucideMoveRight} hoverable={false} label="France"/>
            <NavButton icon={LucideMoveRight} hoverable={false} label="Germany"/>
            <NavButton icon={LucideMoveRight} hoverable={false} label="Italy"/>
            <NavButton icon={LucideMoveRight} hoverable={false} label="Sweden"/>
            <NavButton icon={LucideMoveRight} hoverable={false} label="Italy"/>
            <NavButton icon={LucideMoveRight} hoverable={false} label="Sweden"/>
        </div>
    )
}