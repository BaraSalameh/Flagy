import { ArrowBigRightIcon } from "lucide-react"
import { NavButton } from "../ui"
import { Fragment } from "react"
import { useAppDispatch } from "@/lib/store/hooks"
import { setDifficulty } from "@/lib/store/slices/generalSlice"
import { GameDifficulty } from "@/lib/store/slices/types.slices"

export const GameDifficultyMenu = ({ sideEffect } : {sideEffect?: () => void}) => {
    const dispatch = useAppDispatch();

    const handleClick = (difficulty: GameDifficulty) => {
        dispatch(setDifficulty(difficulty))
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
    