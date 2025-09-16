import { cn } from '@/components/utils';
import { blurBackground } from '@/styles';
import { BlurBackgroundProps } from './types.ui';

export const BlurBackground = ({
    children,
    fullScreen,
    intent,
    className,
    onClick,
}: BlurBackgroundProps) => 
    <div
        className={cn(blurBackground({ intent, fullScreen, clickable: onClick ? true : false }), className)}
        onClick={e => {
            if(e.target === e.currentTarget) onClick?.();
        }}
    >
        {children}
    </div>
