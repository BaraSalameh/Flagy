import { cva, VariantProps } from 'class-variance-authority';

export const card = cva(
    'max-w-sm w-full rounded-2xl shadow-md p-4 flex flex-col gap-4 transition hover:shadow-xl',
    {
        variants: {
            subComponent: {
                true: 'bg-light-sub-component dark:bg-dark-sub-component',
                false: 'bg-light-component dark:bg-dark-component'
            },
            scrollable: {
                true: 'overflow-auto scrollbar-hide max-h-[40vh] sm:max-h-[90vh]',
                false: null
            }
        },
        defaultVariants: {
            subComponent: false,
            scrollable: true
        }
    }
);

export type CardVariantProps = VariantProps<typeof card>;
