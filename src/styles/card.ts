import { cva, VariantProps } from 'class-variance-authority';

export const card = cva(
    'max-w-sm w-full rounded-2xl shadow-md flex flex-col gap-4 transition hover:shadow-xl',
    {
        variants: {
            subComponent: {
                true: 'bg-light-sub-component dark:bg-dark-sub-component',
                false: 'bg-light-component dark:bg-dark-component'
            },
            scrollable: {
                true: 'overflow-auto scrollbar-hide max-h-[40vh] sm:max-h-[90vh]',
                false: null
            },
            padding: {
                none: null,
                xs: 'p-1',
                sm: 'p-2',
                md: 'p-3',
                lg: 'p-4',
                xl: 'p-5'
            }
        },
        defaultVariants: {
            subComponent: false,
            scrollable: true,
            padding: 'md'
        }
    }
);

export type CardVariantProps = VariantProps<typeof card>;
