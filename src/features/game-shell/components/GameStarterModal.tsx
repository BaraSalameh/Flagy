import { GameDifficultyMenu } from "./GameDifficultyMenu";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setGameStarted } from "@/features/game-shell/model/session-slice";
import type { GameStarterModalProps } from "@/features/game-shell/types";
import { Dialog } from "@/shared/ui";

export const GameStarterModal = ({
    title = "Description",
    description,
}: GameStarterModalProps) => {
    const dispatch = useAppDispatch();
    const gameStarted = useAppSelector((state) => state.general.gameStarted);

    return (
        <Dialog
            title={title}
            description={description}
            open={!gameStarted}
            closeable={false}
        >
            <p className="mb-3 text-xs font-black uppercase tracking-[.18em] text-accent">
                Choose your difficulty
            </p>
            <GameDifficultyMenu
                sideEffect={() => dispatch(setGameStarted(true))}
            />
            <p className="mt-4 text-center text-xs text-muted">
                You can return to the game hub anytime from the top-left button.
            </p>
        </Dialog>
    );
};
