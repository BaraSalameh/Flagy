'use client';

import { Modal, NavButton } from "@/components/ui";
import { RedoIcon, UndoIcon } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { Fragment, useState } from "react";
import { Game, GameCategory } from "@/lib/types.lib";
import { gamesMap } from "@/lib/gamesMap";

const GameCategoryPage = () => {
    const params = useParams();
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    const gameCategory = params['game-category'] as GameCategory['path'];

    const handleClick = (mapGame: Game['path']) => {
        setIsModalOpen(false);
        redirect(`/${gameCategory}/${mapGame}`);
    }

    return (
        <Modal
            subTitle={`${gamesMap[gameCategory].name} Games`}
            modalOpen={!isModalOpen}
            isOpenable={false}
            closeOnOutsideClick={false}
            isCloseable={false}
            customHeaderButton={<NavButton icon={UndoIcon} hoverable={false} onClick={() => redirect('/')} />}
            content= {
                <Fragment>
                    
                    {gamesMap[gameCategory].games.map((game, idx) =>
                        <NavButton key={idx} icon={RedoIcon} label={game.name} hoverable={false} onClick={() => handleClick(game.path)} />
                    )}
                </Fragment>
            }
        />
    )
       
}

export default GameCategoryPage;