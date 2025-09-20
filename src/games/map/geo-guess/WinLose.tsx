import { Fragment, useEffect, useState } from "react";
import { Modal, NavButton, Text } from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { clearCountry, setResult } from "@/lib/store/slices/geoGuessSlice";
import { UndoIcon } from "lucide-react";
import { clearGeneral, setGameStarted } from "@/lib/store/slices/generalSlice";
import { clearHint } from "@/lib/store/slices/hintSlice";

export const WinLose = () => {
    const dispatch = useAppDispatch();
    const counter = useAppSelector(state => state.general.counter);
    const randomCountry = useAppSelector(state => state.geoGuess.randomCountry);
    const currentCountry = useAppSelector(state => state.geoGuess.currentCountry);
    const result = useAppSelector(state => state.geoGuess.result);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ message, setMessage ] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (counter === 0 && randomCountry !== currentCountry) {
            dispatch(setResult(false));
            setMessage(`😅 It was ${randomCountry}!`);
        }

        if (randomCountry && currentCountry && randomCountry === currentCountry) {
            dispatch(setResult(true));
            setMessage(`🚀 ${randomCountry} is a Perfect guess! Keep it up!`)
        }
    }, [counter, currentCountry, randomCountry, dispatch]);

    useEffect(() => {
        setIsModalOpen(message ? true : false);
    }, [message]);

    const handleClick = () => {
        dispatch(clearGeneral());
        dispatch(clearCountry());
        dispatch(clearHint());
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