import { Fragment, useEffect, useState } from "react";
import { Modal, NavButton, Text } from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { UndoIcon } from "lucide-react";
import { clearGeneral, setGameStarted } from "@/lib/store/slices/generalSlice";
import { clearMapMaster, setResult } from "@/lib/store/slices/mapMasterSlice";

export const WinLose = () => {
    const dispatch = useAppDispatch();
    const counter = useAppSelector(state => state.mapMaster.counter);
    const generalCounter = useAppSelector(state => state.general.counter);
    const result = useAppSelector(state => state.mapMaster.result);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ message, setMessage ] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (counter <= 0) {
            dispatch(setResult(false));
            setMessage(`😅 Work harder!`);
        }

        if (counter >= 20) {
            dispatch(setResult(true));
            setMessage(`🚀 Good job! Keep it up!`)
        }

        if (generalCounter === 20) {
            dispatch(setResult(false));
            setMessage(`😅 You need to be smarter!`);
        }
    }, [counter, generalCounter, dispatch]);

    useEffect(() => {
        setIsModalOpen(message ? true : false);
    }, [message]);

    const handleClick = () => {
        dispatch(clearGeneral());
        dispatch(clearMapMaster());
        dispatch(setGameStarted(false));
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
                    <NavButton icon={UndoIcon} label="Play again" hoverable={false} onClick={handleClick} />
                </Fragment>
            }
        />
    )
}