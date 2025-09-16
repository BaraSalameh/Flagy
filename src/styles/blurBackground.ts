import { cva, VariantProps } from 'class-variance-authority';

export const blurBackground = cva(
    'flex items-center justify-center inset-0 z-50',
    {
        variants: {
            fullScreen: {
                true: 'fixed ',
                false: 'absolute'
            },
            intent: {
                sm: 'bg-black/25 backdrop-blur-sm bg-opacity-25',
                md: 'bg-black/50 backdrop-blur-md bg-opacity-50',
                lg: 'bg-black/75 backdrop-blur-lg bg-opacity-75'
            },
            clickable: {
                true: 'cursor-pointer [&>*]:cursor-default',
                false: null
            }
        },
        defaultVariants: {
            fullScreen: true,
            intent: 'md',
            clickable: false
        },
    }
);

export type BlurBackgroundVariantProps = VariantProps<typeof blurBackground>;
