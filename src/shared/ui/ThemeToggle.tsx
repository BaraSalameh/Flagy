"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IconButton } from "./IconButton";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return <span aria-hidden="true" className="block size-11" />;
    const dark = resolvedTheme === "dark";
    return (
        <IconButton
            label={`Switch to ${dark ? "light" : "dark"} theme`}
            icon={dark ? Sun : Moon}
            onClick={() => setTheme(dark ? "light" : "dark")}
        />
    );
}
