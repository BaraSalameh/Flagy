import { cva, VariantProps } from 'class-variance-authority';

const hoverStyle = 'hover:text-light-bg-hover dark:hover:text-dark-bg-hover';

export const text = cva(
    'flex items-center whitespace-pre-line font-[family-name:var(--font-geist-mono)]',
    {
        variants: {
            intent: {
                primary:
                    'text-light-primary dark:text-dark-primary',
                secondary:
                    'text-gray-500 dark:text-gray-400',
                success:
                    'text-green-900 dark:text-green-900',
                danger:
                    'text-red-500',
            },
            size: {
                xs: 'text-xs',
                sm: 'text-xs sm:text-sm md:text-base',
                md: 'text-sm sm:text-base md:text-lg',
                lg: 'text-base sm:text-lg md:text-xl',
                xl: 'text-lg sm:text-xl md:text-2xl',
                huge: 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl'
            },
            text: {
                standard: null,
                justify: 'text-justify',
            },
            position: {
                start: null,
                center: 'justify-center'
            },
            space: {
                none: 'gap-0',
                xs: 'gap-3',
                sm: 'gap-2 sm:gap-3',
                md: 'gap-10',
                lg: 'gap-15'
            },
            clickable: {
                true: `cursor-pointer ${hoverStyle}`,
                false: null
            },
            copyable: {
                true: `cursor-copy ${hoverStyle}`,
                false: null
            }
        },
        defaultVariants: {
            intent: 'primary',
            size: 'md',
            text: 'standard',
            position: 'start',
            space: 'sm',
            clickable: false,
            copyable: false,
        },
    }
);

export type TextVariantProps = VariantProps<typeof text>;
