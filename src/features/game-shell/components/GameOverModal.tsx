import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Home, RotateCcw, Sparkles, XCircle } from "lucide-react";
import {
    clearGeneral,
    setResult,
} from "@/features/game-shell/model/session-slice";
import type { GameOverModalProps } from "@/features/game-shell/types";
import { Button, ButtonLink, Dialog } from "@/shared/ui";

export const GameOverModal = ({ thresholds, onClear }: GameOverModalProps) => {
    const dispatch = useAppDispatch();
    const generalState = useAppSelector((state) => state.general);
    const counter = generalState.counter;
    const result = generalState.result;
    const gameStarted = generalState.gameStarted;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState<string | undefined>(undefined);
    const hasActiveCounter = useRef(false);

    useEffect(() => {
        if (!gameStarted) hasActiveCounter.current = false;
        if (gameStarted && counter > 0) hasActiveCounter.current = true;
    }, [counter, gameStarted]);

    const activeThreshold =
        gameStarted && (counter > 0 || hasActiveCounter.current)
            ? thresholds.find((threshold) => threshold.condition)
            : undefined;
    const activeResult = activeThreshold?.result;
    const activeMessage = activeThreshold?.message;
    useEffect(() => {
        if (activeResult === undefined || !activeMessage) return;
        dispatch(setResult(activeResult));
        setMessage(activeMessage);
    }, [activeMessage, activeResult, counter, dispatch]);

    useEffect(() => {
        setIsModalOpen(message ? true : false);
    }, [message]);

    const handleGameOver = () => {
        dispatch(clearGeneral());
        dispatch(onClear());
        setMessage(undefined);
        setIsModalOpen(false);
    };

    return (
        <Dialog
            title={result ? "Brilliant journey!" : "A little detour"}
            description={message}
            open={isModalOpen}
            closeable={false}
        >
            <div
                className={`mx-auto mb-5 grid size-16 place-items-center rounded-3xl ${result ? "bg-teal/15 text-teal" : "bg-coral/15 text-coral"}`}
            >
                {result ? (
                    <Sparkles className="size-8" />
                ) : (
                    <XCircle className="size-8" />
                )}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
                <Button icon={RotateCcw} onClick={handleGameOver}>
                    Play again
                </Button>
                <ButtonLink href="/" icon={Home} variant="secondary">
                    Game hub
                </ButtonLink>
            </div>
        </Dialog>
    );
};
