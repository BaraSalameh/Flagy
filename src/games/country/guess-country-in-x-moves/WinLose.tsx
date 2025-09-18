import { Modal, Text } from "@/components/ui"
import { useEffect, useState } from "react"

export const WinLose = ({ counter, didWin }: { counter: number | undefined; didWin: boolean }) => {

    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ message, setMessage ] = useState<string | undefined>(undefined);

    useEffect(() => {
        
        if (counter === 0) {
            setMessage("Unfortunately! You Lose");
        }

        if (didWin) {
            setMessage('Congratulations! You Win')
        }
    }, [counter, didWin]);

    useEffect(() => {
        setIsModalOpen(message ? true : false);
    }, [message]);

    return (
        <Modal
            subTitle={didWin ? 'You won' : 'You lose'}
            modalOpen={isModalOpen}
            setModalOpen={setIsModalOpen}
            isOpenable={false}
            content= {
                <Text>
                    {message}
                </Text>
            }
        />
    )
}