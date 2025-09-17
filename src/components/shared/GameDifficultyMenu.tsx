import { ArrowBigRightIcon } from "lucide-react"
import { NavButton } from "../ui"
import { Fragment } from "react"
import { useSetDifficulty } from "@/lib/contexts/hooks"
import { GameDifficulty } from "./types.shared"

export const GameDifficultyMenu = ({ sideEffect } : {sideEffect?: () => void}) => {
    const setDifficulty = useSetDifficulty();

    const handleClick = (difficulty: GameDifficulty) => {
        setDifficulty(difficulty);
        sideEffect?.();
    }

    return (
        <Fragment>
            <NavButton icon={ArrowBigRightIcon} label="Beginner" hoverable={false} onClick={() => handleClick("Beginner")} />
            <NavButton icon={ArrowBigRightIcon} label="Intermediate" hoverable={false} onClick={() => handleClick("Intermediate")} />
            <NavButton icon={ArrowBigRightIcon} label="Advanced" hoverable={false} onClick={() => handleClick("Advanced")} />
            <NavButton icon={ArrowBigRightIcon} label="Expert" hoverable={false} onClick={() => handleClick("Expert")} />
        </Fragment>
    )
}
    