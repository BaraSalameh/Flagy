"use client";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { ReduxProvider } from "@/lib/contexts";
export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ReduxProvider>{children}</ReduxProvider>
        </ThemeProvider>
    );
}
