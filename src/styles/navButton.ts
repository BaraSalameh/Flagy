import { cva, VariantProps } from 'class-variance-authority';

export const navButtonContainer = cva(
    'flex items-center gap-2 bg-light-component dark:bg-dark-component hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover rounded-full px-4 py-2 transition-all duration-1000 ease-in-out overflow-hidden cursor-pointer',
    {
        variants: {
            hovered: {
                true: "max-w-[20rem]",
                false: "max-w-[3.5rem]"
            }
        },
        defaultVariants: {
            hovered: false,
        },
    }
);

export const navButtonIconContainer = cva( 'flex-shrink-0' );

export const navButtonText = cva(
    'whitespace-nowrap transition-opacity duration-200',
    {
        variants: {
            hovered: {
                true: "opacity-100",
                false: "opacity-0"
            },
        },
        defaultVariants: {
            hovered: false,
        },
    }
);

export type NavButtonContainerVariantProps = VariantProps<typeof navButtonContainer>;
export type NavButtonIconContainerVariantProps = VariantProps<typeof navButtonIconContainer>;
export type NavButtonTextVariantProps = VariantProps<typeof navButtonText>;
