import React from 'react';
import { PlusIcon } from 'lucide-react'; 
import { ResponsiveIconProps } from './types.ui';
import { cn } from '../utils';
import { responsiveIcon } from '@/styles/responsiveIcon';
import Image from "next/image";

export const ResponsiveIcon = ({
    icon: Icon = PlusIcon,
    iconType = 'Lucide',
    className,
    onClick,
    size
}: ResponsiveIconProps) => {
    switch(iconType) {
        case 'Lucide':
            return (
                <Icon
                    className={cn(responsiveIcon({ size, clickable: onClick ? true : false }), className)}
                    onClick={onClick}
                />
            )
        case 'Image':
            return (
                <Image
                    aria-hidden
                    src={Icon as string}
                    alt={`logo`}
                    width={16}
                    height={16}
                />
            )
    }
}