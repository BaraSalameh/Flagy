import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button, ButtonLink } from "./Button";

vi.mock("next/link", () => ({
    default: ({
        href,
        children,
        ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a href={String(href)} {...props}>
            {children}
        </a>
    ),
}));

describe("Button", () => {
    it("is a semantic button and handles keyboard activation", async () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Begin</Button>);
        const button = screen.getByRole("button", { name: "Begin" });
        button.focus();
        await userEvent.keyboard("{Enter}");
        expect(onClick).toHaveBeenCalledOnce();
    });
    it("renders navigation as a link", () => {
        render(<ButtonLink href="/map/geo-guess">Play</ButtonLink>);
        expect(screen.getByRole("link", { name: "Play" })).toHaveAttribute(
            "href",
            "/map/geo-guess",
        );
    });
});
