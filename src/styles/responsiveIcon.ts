import { cva, VariantProps } from 'class-variance-authority';

export const responsiveIcon = cva(
    '',
    {
        variants: {
            size: {
                xs: 'h-2 w-2',
                sm: 'h-4 w-4',
                md: 'h-6 w-6',
                lg: 'h-8 w-8',
                xl: 'h-10 w-10',
                huge: 'h-12 w-12'
            },
            clickable: {
                true: 'cursor-pointer hover:text-light-bg-hover dark:hover:text-dark-bg-hover',
                false: null
            }
        },
        defaultVariants: {
            size: 'md',
            clickable: false
        },
    }
);

export type ResponsiveIconVariantProps = VariantProps<typeof responsiveIcon>;
