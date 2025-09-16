'use client';

import React from 'react';
import { cn } from '@/components/utils';
import { text as paragraph } from '@/styles';
import { TextProps } from './types.ui';

export const Text = ({
    children,
    intent,
    size,
    text,
    position,
    space,
    className,
    copyable,
    onClick
}: TextProps) => {
    return (
        <p className={cn(paragraph({ intent, size, text, position, space, clickable: copyable ? false : onClick ? true : false, copyable }), className)} onClick={onClick}>
            {children}
        </p>
    );

};
