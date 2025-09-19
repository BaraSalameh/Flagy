'use client';

import { Modal, NavButton } from "@/components/ui";
import { gamesMap } from "@/lib/gamesMap";
import { GameCategory } from "@/lib/types.lib";
import { RedoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Fragment, useState } from "react";

const Home = () => {
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    const handleClick = (gameCategory: GameCategory['path']) => {
        setIsModalOpen(false);
        redirect(`/${gameCategory}`);
    }

    return(
        <Modal
            subTitle="Games Category"
            modalOpen={!isModalOpen}
            isOpenable={false}
            closeOnOutsideClick={false}
            isCloseable={false}
            content= {
                <Fragment>
                    {Object.entries(gamesMap).map(([key, value], idx) =>
                        <NavButton key={idx} icon={RedoIcon} label={value.name} hoverable={false} onClick={() => handleClick(key as GameCategory['path'])} />
                    )}
                </Fragment>
            }
        />
    )
}

export default Home;