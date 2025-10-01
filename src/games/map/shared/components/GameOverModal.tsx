import { Fragment, useEffect, useState } from "react";
import { Modal, NavButton, Text } from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { UndoIcon } from "lucide-react";
import { clearGeneral, setResult } from "@/lib/store/slices/generalSlice";
import { GameOverModalProps } from "./types.sharedGameComponents";

export const GameOverModal = ({ thresholds, onClear }: GameOverModalProps) => {
    const dispatch = useAppDispatch();
    const generalState = useAppSelector(state => state.general);
    const counter = generalState.counter;
    const result = generalState.result;
    
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ message, setMessage ] = useState<string | undefined>(undefined);

    useEffect(() => {
        Object.values(thresholds).map(threshold => {
            if(threshold.condition) {
                dispatch(setResult(threshold.result));
                setMessage(threshold.message);
            }
        })
    }, [counter, dispatch]);

    useEffect(() => {
        setIsModalOpen(message ? true : false);
    }, [message]);

    const handleGameOver = () => {
        dispatch(clearGeneral());
        dispatch(onClear());
        setMessage(undefined);
        setIsModalOpen(false);
    }

    return (
        <Modal
            subTitle={result ? '✨ Brilliant!' : '❌ Oops!'}
            modalOpen={isModalOpen}
            isOpenable={false}
            closeOnOutsideClick={false}
            isCloseable={false}
            content= {
                <Fragment>
                    <Text>
                        {message}
                    </Text>
                    <NavButton
                        icon={UndoIcon}
                        label="Play again"
                        hoverable={false}
                        onClick={handleGameOver}
                    />
                </Fragment>
            }
        />
    )
}