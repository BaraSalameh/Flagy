import 'leaflet/dist/leaflet.css';
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import { MapProvider, ReduxProvider } from '@/lib/contexts';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Flagy",
    description: "Countrie and flag puzzles",
};

const RootLayout = ({ children }: { children: ReactNode })  => 
    <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <ReduxProvider>
                <MapProvider>
                    {children}
                </MapProvider>
            </ReduxProvider>
        </body>
    </html>

export default RootLayout;