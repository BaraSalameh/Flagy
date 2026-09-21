import { useAppDispatch } from "@/lib/store/hooks";
import { Button, Card } from "@/shared/ui";
import type { ActionCreatorWithPayload } from "@reduxjs/toolkit";

interface CountryMenuProps {
    randomCountries: string[];
    onAction: ActionCreatorWithPayload<string>;
}

export const CountryMenu = ({
    randomCountries,
    onAction,
}: CountryMenuProps) => {
    const dispatch = useAppDispatch();

    return (
        randomCountries && (
            <Card
                aria-label="Country choices"
                className="absolute inset-x-3 bottom-3 z-[700] grid grid-cols-2 gap-2 rounded-[1.5rem] p-2 sm:inset-x-auto sm:bottom-5 sm:left-1/2 sm:flex sm:-translate-x-1/2"
            >
                {randomCountries?.map((country, idx) => (
                    <Button
                        key={`${country}-${idx}`}
                        variant="secondary"
                        className="px-3"
                        onClick={() => dispatch(onAction(country))}
                    >
                        {country}
                    </Button>
                ))}
            </Card>
        )
    );
};
