import { GameDifficultyMenu } from "@/components/shared"
import { Modal, Text } from "@/components/ui"
import { File } from "lucide-react"
import { Fragment, useState } from "react"

export const Starter = () => {

    const [ isModalOpen, setIsModalOpen ] = useState(true);

    return (
        <Modal
            subTitle="Game description"
            icon={File}
            isModalOpen={isModalOpen}
            isOpenable={false}
            closeOnOutsideClick={false}
            isCloseable={false}
            content= {
                <Fragment>
                    <Text>
                        {`A country is randomly going to be selected!\n\nDepending on the difficulty level, you'll have a number of allowed guesses.\n\nTo start, first set up the difficulty level`}
                    </Text>
                    <GameDifficultyMenu sideEffect={() => setIsModalOpen(false)} />
                </Fragment>
            }
        />
    )
}