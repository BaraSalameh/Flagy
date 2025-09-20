import { GameDifficultyMenu } from "@/components/shared"
import { Modal, NavButton, Text } from "@/components/ui"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setGameStarted } from "@/lib/store/slices/generalSlice"
import { File, UndoIcon } from "lucide-react"
import { redirect } from "next/navigation"
import { Fragment } from "react"

export const Starter = () => {

    const dispatch = useAppDispatch();
    const gameStarted = useAppSelector(state => state.general.gameStarted);

    return (
        <Modal
            subTitle="Game description"
            icon={File}
            modalOpen={!gameStarted}
            isOpenable={false}
            closeOnOutsideClick={false}
            isCloseable={false}
            customHeaderButton={<NavButton icon={UndoIcon} hoverable={false} onClick={() => redirect('/')} />}
            content= {
                <Fragment>
                    <Text>
                        {`A country has been randomly selected. Choose your difficulty level and use the hints to guess the country before your counter reaches zero.\n\nSharpen your geography skills with each move!`}
                    </Text>
                    <GameDifficultyMenu sideEffect={() => dispatch(setGameStarted(true))} />
                </Fragment>
            }
        />
    )
}