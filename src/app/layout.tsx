import "leaflet/dist/leaflet.css";
import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { AppProviders } from "./providers";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
});
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});
export const metadata: Metadata = {
    title: { default: "Flagy — Explore the world", template: "%s · Flagy" },
    description:
        "Play colorful geography games and learn the world one country at a time.",
};
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#f3f8fb" },
        { media: "(prefers-color-scheme: dark)", color: "#071822" },
    ],
};
export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}
