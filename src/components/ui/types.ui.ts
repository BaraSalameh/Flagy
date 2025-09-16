
import { BlurBackgroundVariantProps, CardVariantProps, TextVariantProps } from "@/styles";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface ResponsiveIconProps {
    icon?: LucideIcon | string;
    className?: string;
    onClick?: () => void;
    size?: Size;
    iconType?: IconType;
}
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'huge';
type IconType = 'Lucide' | 'Image';

export interface TextProps extends TextVariantProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export interface ModalProps {
    title?: string;
    subTitle?: string;
    content?: ReactNode | string;
    icon?: LucideIcon;
    closeOnOutsideClick?: boolean;
    isModalOpen?: boolean;
    isOpenable?: boolean;
    isCloseable?: boolean;
}

export interface NavButtonProps {
    navigateTo?: string;
    label?: string;
    icon?: LucideIcon;
    onClick?: () => void;
    hoverable?: Hoverable;
}
type Hoverable = true | false;

export interface CardProps extends CardVariantProps {
    title: string;
    subTitle?: string;
    logoUrl?: string;
    content?: React.ReactNode;
    className?: string;
};

export interface BlurBackgroundProps extends BlurBackgroundVariantProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}