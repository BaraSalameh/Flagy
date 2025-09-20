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
            subTitle="Map Master"
            icon={File}
            modalOpen={!gameStarted}
            isOpenable={false}
            closeOnOutsideClick={false}
            isCloseable={false}
            customHeaderButton={<NavButton icon={UndoIcon} hoverable={false} onClick={() => redirect('/')} />}
            content= {
                <Fragment>
                    <Text>
                        {`A country is randomly highlighted. Based on the difficulty level, select the correct area on the map.\n\nEach correct selection brings you closer to victory, but too many wrong choices will end the game. Can you master the map?`}
                    </Text>
                    <GameDifficultyMenu sideEffect={() => dispatch(setGameStarted(true))} />
                </Fragment>
            }
        />
    )
}