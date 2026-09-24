import Image from "next/image";
import type { ComponentProps } from "react";

type LogoMarkProps = Omit<
    ComponentProps<typeof Image>,
    "src" | "alt" | "width" | "height"
>;

export function LogoMark({ className, ...props }: LogoMarkProps) {
    return (
        <Image
            src="/branding/flagy-mark.png"
            alt=""
            width={512}
            height={512}
            className={className}
            priority
            {...props}
        />
    );
}
