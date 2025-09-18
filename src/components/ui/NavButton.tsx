'use client'

import { useState } from "react";
import { ResponsiveIcon } from "./ResponsiveIcon";
import { Text } from '@/components/ui'
import { NavButtonProps } from "./types.ui";
import { navButtonContainer, navButtonIconContainer, navButtonText } from "@/styles";

export const NavButton = ({ navigateTo, label, icon, onClick, hoverable = true}: NavButtonProps) => {
    const [hovered, setHovered] = useState(false);

    const handleClick = () => {
        onClick?.();
        setHovered(false);
    }
    
    return (
        onClick
        ?
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={navButtonContainer({hovered: hoverable ? hovered : true})}
                onClick={handleClick}
            >
                <Text className={navButtonIconContainer()}>{<ResponsiveIcon icon={icon} />}</Text>
                <Text className={navButtonText({hovered: hoverable ? hovered : true})}>
                    {label}
                </Text>
            </div>
        :
            <a
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={navButtonContainer({hovered: hoverable ? hovered : true})}
                href={`#${navigateTo}`}
            >
                <Text className={navButtonIconContainer()}>{<ResponsiveIcon icon={icon} />}</Text>
                <Text className={navButtonText({hovered: hoverable ? hovered : true})}>
                    {label}
                </Text>
            </a>
    )
}