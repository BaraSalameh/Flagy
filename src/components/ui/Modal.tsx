'use client';

import { X } from 'lucide-react';
import React, { useState } from 'react';
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
    modalOpen = false,
    setModalOpen,
    isOpenable = true,
    isCloseable = true
}: ModalProps) => {

    const [openModal, setOpenModal] = useState(false);

    const handleClose = () => {
        setOpenModal(false);
        setModalOpen?.(false);
    }
            
    return (
        <React.Fragment>
            {isOpenable &&
                <NavButton
                    label={title}
                    onClick={() => setOpenModal(true)}
                    icon={icon}
                />
            }
            {(openModal || modalOpen) && (
                <BlurBackground intent='sm' onClick={closeOnOutsideClick ? handleClose : undefined}>
                    <div className={card()}>
                        {/* Header */}
                        <div className='flex justify-between'>
                            {subTitle && <Text size="md">{subTitle}</Text>}
                            {isCloseable &&
                                <ResponsiveIcon icon={X} onClick={handleClose} />
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
