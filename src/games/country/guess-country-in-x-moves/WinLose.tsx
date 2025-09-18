import { Fragment, useEffect, useState } from "react";
import { Modal, NavButton, Text } from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { clearCountry, setGameStarted, setResult } from "@/lib/store/slices/countrySlice";
import { UndoIcon } from "lucide-react";
import { clearGeneral } from "@/lib/store/slices/generalSlice";
import { clearHint } from "@/lib/store/slices/hintSlice";

export const WinLose = () => {
    const dispatch = useAppDispatch();
    const counter = useAppSelector(state => state.general.counter);
    const randomCountry = useAppSelector(state => state.country.randomCountry);
    const currentCountry = useAppSelector(state => state.country.currentCountry);
    const result = useAppSelector(state => state.country.result);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ message, setMessage ] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (counter === 0 && randomCountry !== currentCountry) {
            dispatch(setResult(false));
            setMessage("Unfortunately! You Lose");
        }

        if (randomCountry && currentCountry && randomCountry === currentCountry) {
            dispatch(setResult(true));
            setMessage('Congratulations! You Win')
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
            subTitle={result ? 'You won' : 'You lose'}
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