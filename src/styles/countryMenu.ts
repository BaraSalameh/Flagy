import { cva, VariantProps } from 'class-variance-authority';

export const countryMenu = cva(
    'fixed bottom-0 z-1 w-full py-3 bg-light-component dark:bg-dark-component rounded-t-3xl sm:rounded-t-full shadow-md flex flex-wrap justify-center gap-x-10 transition hover:shadow-xl'
);

export type CountryMenuVariantProps = VariantProps<typeof countryMenu>;
