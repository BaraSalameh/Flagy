import { GameDifficultyMenu } from "@/components/shared"
import { Modal, Text } from "@/components/ui"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setGameStarted } from "@/lib/store/slices/countrySlice"
import { File } from "lucide-react"
import { Fragment } from "react"

export const Starter = () => {

    const dispatch = useAppDispatch();
    const gameStarted = useAppSelector(state => state.country.gameStarted);
    
    return (
        <Modal
            subTitle="Game description"
            icon={File}
            modalOpen={!gameStarted}
            isOpenable={false}
            closeOnOutsideClick={false}
            isCloseable={false}
            content= {
                <Fragment>
                    <Text>
                        {`A country is randomly going to be selected!\n\nDepending on the difficulty level, you'll have a number of allowed guesses.\n\nTo start, first set up the difficulty level`}
                    </Text>
                    <GameDifficultyMenu sideEffect={() => dispatch(setGameStarted(true))} />
                </Fragment>
            }
        />
    )
}