'use client';

import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ResponsiveIcon } from './ResponsiveIcon';
import { Text } from './Text';
import { BlurBackground } from './BlurBackground';
import { card } from '@/styles';
import { ModalProps } from './types.ui';
import { NavButton } from './NavButton';

export const Modal = ({
    title,
    subTitle = title,
    content,
    icon,
    closeOnOutsideClick = true,
    isModalOpen = false,
    isOpenable = true,
    isCloseable = true
}: ModalProps) => {

    const [openModal, setOpenModal] = useState(isModalOpen);

    useEffect(() => {
        if (openModal !== isModalOpen) setOpenModal(isModalOpen);
    }, [isModalOpen, openModal]); // open modal is added without testing
            
    return (
        <React.Fragment>
            {isOpenable &&
                <NavButton
                    label={title}
                    onClick={() => setOpenModal(true)}
                    icon={icon}
                />
            }
            {openModal && (
                <BlurBackground intent='sm' onClick={closeOnOutsideClick ? () => setOpenModal(false) : undefined}>
                    <div className={card()}>
                        {/* Header */}
                        <div className='flex justify-between'>
                            {subTitle && <Text size="md">{subTitle}</Text>}
                            {isCloseable &&
                                <ResponsiveIcon icon={X} onClick={() => setOpenModal(false)} />
                            }
                        </div>
                        <hr />
                        {/* Main */}
                        { typeof content === 'string'
                        ?    <Text size="md">{content}</Text>
                        :   content
                        }
                    </div>
                </BlurBackground>
            )}
        </React.Fragment>
    );
};
