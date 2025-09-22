import { GameDifficultyMenu } from "@/components/shared"
import { Modal, NavButton, Text } from "@/components/ui"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setGameStarted } from "@/lib/store/slices/generalSlice"
import { UndoIcon } from "lucide-react"
import { redirect } from "next/navigation"
import { Fragment } from "react"

export const Starter = () => {

    const dispatch = useAppDispatch();
    const gameStarted = useAppSelector(state => state.general.gameStarted);

    return (
        <Modal
            subTitle="Outline Explorer"
            modalOpen={!gameStarted}
            isOpenable={false}
            closeOnOutsideClick={false}
            isCloseable={false}
            customHeaderButton={<NavButton icon={UndoIcon} hoverable={false} onClick={() => redirect('/')} />}
            content= {
                <Fragment>
                    <Text>
                        {`Test your geography skills in Outline Explorer! Each round, you’ll see the outline of a mystery country. Can you guess its name before time runs out?`}
                    </Text>
                    <GameDifficultyMenu sideEffect={() => dispatch(setGameStarted(true))} />
                </Fragment>
            }
        />
    )
}