import { GameDifficultyMenu } from "@/components/shared"
import { Modal, NavButton, Text } from "@/components/ui"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setGameStarted } from "@/lib/store/slices/generalSlice"
import { UndoIcon } from "lucide-react"
import { redirect } from "next/navigation"
import { Fragment } from "react"
import { GameStarterModalProps } from "./types.sharedGameComponents"

export const GameStarterModal = ({ description }: GameStarterModalProps) => {

    const dispatch = useAppDispatch();
    const gameStarted = useAppSelector(state => state.general.gameStarted);

    return (
        <Modal
            subTitle="Game description"
            modalOpen={!gameStarted}
            isOpenable={false}
            closeOnOutsideClick={false}
            isCloseable={false}
            customHeaderButton={
                <NavButton
                    icon={UndoIcon}
                    hoverable={false}
                    onClick={() => redirect('/')}
                />
            }
            content= {
                <Fragment>
                    <Text>
                        {description}
                    </Text>
                    <GameDifficultyMenu
                        sideEffect={() => dispatch(setGameStarted(true))}
                    />
                </Fragment>
            }
        />
    )
}