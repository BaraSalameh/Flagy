import type { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
export interface GameStarterModalProps {
    title?: string;
    description: string;
}
export interface GameOverModalProps {
    thresholds: Array<{ condition: boolean; result: boolean; message: string }>;
    onClear: ActionCreatorWithoutPayload;
}
