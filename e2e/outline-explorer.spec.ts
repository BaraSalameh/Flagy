import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import type { FeatureCollection } from "geojson";
import countries from "../public/data/countries.info.json";

const atlas = JSON.parse(
    readFileSync("public/data/countries.geo.json", "utf8"),
) as FeatureCollection;
const features = ["JO", "VA"].map((code) =>
    atlas.features.find((feature) => feature.properties?.ISO2 === code)!,
);
const panel = (page: Page) =>
    page.getByRole("region", { name: "Outline challenge" });
const choices = (page: Page) =>
    page.getByRole("group", { name: "Country choices" });
async function useFixture(page: Page) {
    await page.route("**/data/countries.geo.json", (route) =>
        route.fulfill({ json: { type: "FeatureCollection", features } }),
    );
    await page.route("**/data/countries.info.json", (route) =>
        route.fulfill({
            json: {
                JO: { ...countries.JO, area: 500_000 },
                VA: { ...countries.VA, area: 500_000 },
            },
        }),
    );
}
async function highlightedCountry(page: Page) {
    const paths = page.locator(".leaflet-overlay-pane svg path");
    await expect(paths).toHaveCount(2);
    const index = await paths.evaluateAll((elements) =>
        elements.findIndex(
            (element) => element.getAttribute("fill") === "var(--map-selected)",
        ),
    );
    expect(index).toBeGreaterThanOrEqual(0);
    return index === 0 ? countries.JO : countries.VA;
}

test("scoring, readable feedback, tiny outlines, and same-difficulty replay", async ({
    page,
}, testInfo) => {
    await useFixture(page);
    await page.goto("/map/outline-explorer");
    await page.getByRole("button", { name: /beginner/i }).click();
    const score = page.getByRole("progressbar", { name: "Score" });
    const first = await highlightedCountry(page);
    const wrongName = first.countryCode === "JO" ? "Vatican City" : "Jordan";
    await choices(page)
        .getByRole("button", { name: wrongName, exact: true })
        .click();
    await expect(score).toHaveAttribute("aria-valuenow", "9");
    await expect(
        choices(page).getByRole("button", { name: new RegExp(wrongName) }),
    ).toBeDisabled();
    for (let index = 0; index < 3; index += 1) {
        const target = await highlightedCountry(page);
        if (target.countryCode === "VA") {
            await page.getByRole("button", { name: "Center outline" }).click();
            const bounds = await page
                .locator(
                    '.leaflet-overlay-pane svg path[fill="var(--map-selected)"]',
                )
                .boundingBox();
            expect(bounds?.width).toBeGreaterThan(25);
            expect(bounds?.height).toBeGreaterThan(25);
            await page.screenshot({
                path: testInfo.outputPath("tiny-outline.png"),
            });
        }
        await choices(page)
            .getByRole("button", { name: target.countryName, exact: true })
            .click();
        if (index < 2) {
            await expect(panel(page).getByRole("heading")).toHaveText(
                target.countryName,
            );
            await expect(score).toHaveAttribute(
                "aria-valuenow",
                String(13 + index * 4),
            );
            await expect(choices(page).locator("button:enabled")).toHaveCount(
                0,
            );
            const next = page.getByRole("button", { name: "Next country" });
            await expect(next).toBeFocused();
            await next.click();
            await expect(panel(page).getByRole("heading")).toHaveText(
                "Which country is highlighted?",
            );
        }
    }
    const result = page.getByRole("dialog", {
        name: "Outline decoded — you win!",
    });
    await expect(result).toContainText("3 correct of 4");
    const last = await highlightedCountry(page);
    await result.getByRole("button", { name: "Play again" }).click();
    await page.getByRole("button", { name: /beginner/i }).click();
    await expect(score).toHaveAttribute("aria-valuenow", "10");
    await expect(panel(page)).toContainText("15 guesses left");
    expect((await highlightedCountry(page)).countryCode).not.toBe(
        last.countryCode,
    );
    for (let index = 0; index < 3; index += 1) {
        const target = await highlightedCountry(page);
        await choices(page)
            .getByRole("button", { name: target.countryName, exact: true })
            .click();
        if (index < 2)
            await page.getByRole("button", { name: "Next country" }).click();
    }
    await expect(result).toContainText("3 correct of 3");
    await result.getByRole("button", { name: "Explore answer" }).click();
    await expect(panel(page).getByRole("heading")).toHaveText(
        (await highlightedCountry(page)).countryName,
    );
});

test("expert loss reveals the answer and navigation resets the session", async ({
    page,
}) => {
    const pool = [
        countries.CA,
        countries.CN,
        countries.BR,
        countries.AU,
        countries.IN,
        countries.DE,
    ];
    const expertFeatures = pool.map((country) =>
        atlas.features.find(
            (feature) => feature.properties?.ISO2 === country.countryCode,
        )!,
    );
    await page.route("**/data/countries.geo.json", (route) =>
        route.fulfill({
            json: { type: "FeatureCollection", features: expertFeatures },
        }),
    );
    await page.route("**/data/countries.info.json", (route) =>
        route.fulfill({
            json: Object.fromEntries(
                pool.map((country) => [country.countryCode, country]),
            ),
        }),
    );
    await page.goto("/map/outline-explorer");
    await page.getByRole("button", { name: /expert/i }).click();
    const paths = page.locator(".leaflet-overlay-pane svg path");
    await expect(paths).toHaveCount(6);
    const targetIndex = await paths.evaluateAll((elements) =>
        elements.findIndex(
            (element) => element.getAttribute("fill") === "var(--map-selected)",
        ),
    );
    expect(targetIndex).toBeGreaterThanOrEqual(0);
    const target = pool[targetIndex];
    for (const country of pool
        .filter((country) => country.countryCode !== target.countryCode)
        .slice(0, 4))
        await choices(page)
            .getByRole("button", { name: country.countryName, exact: true })
            .click();
    const result = page.getByRole("dialog", {
        name: "Silhouette slipped away — round lost",
    });
    await expect(result).toContainText("Final score: 0/20");
    await expect(result).toContainText(target.countryName);
    await result.getByRole("button", { name: "Explore answer" }).click();
    await expect(choices(page).locator("button:enabled")).toHaveCount(0);
    await expect(panel(page).getByRole("heading")).not.toHaveText(
        "Which country is highlighted?",
    );
    await page.getByRole("link", { name: "Back to game hub" }).click();
    await page.getByRole("link", { name: "Play now" }).nth(2).click();
    await expect(
        page.getByRole("dialog", { name: "Outline Explorer" }),
    ).toBeVisible();
});

test("loading recovery, accessible choices, and narrow layouts", async ({
    page,
}, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/data/countries.info.json", (route) =>
        route.fulfill({ status: 503, body: "unavailable" }),
    );
    await page.goto("/map/outline-explorer");
    const onboarding = page.getByRole("dialog", { name: "Outline Explorer" });
    await expect(onboarding).toContainText(
        "Country information is unavailable",
    );
    await page.unroute("**/data/countries.info.json");
    await onboarding.getByRole("button", { name: "Try again" }).click();
    const beginner = onboarding.getByRole("button", { name: /beginner/i });
    await expect(beginner).toBeEnabled();
    await expect(beginner).toHaveCSS("opacity", "1");
    expect(
        (await new AxeBuilder({ page }).include('[role="dialog"]').analyze())
            .violations,
    ).toEqual([]);
    await beginner.click();
    await expect(choices(page).getByRole("button")).toHaveCount(3);
    expect(
        (
            await new AxeBuilder({ page })
                .include('[aria-label="Outline challenge"]')
                .analyze()
        ).violations,
    ).toEqual([]);
    await page.screenshot({
        path: testInfo.outputPath("outline-explorer.png"),
    });
    await page.getByRole("button", { name: /switch to dark/i }).click();
    expect(
        (
            await new AxeBuilder({ page })
                .include('[aria-label="Outline challenge"]')
                .analyze()
        ).violations,
    ).toEqual([]);
    await page.screenshot({
        path: testInfo.outputPath("outline-explorer-dark.png"),
    });
    if (testInfo.project.name === "mobile") {
        await page.setViewportSize({ width: 320, height: 700 });
        await page.getByRole("button", { name: "Center outline" }).click();
        const bounds = await panel(page).boundingBox();
        expect(bounds?.x).toBeGreaterThanOrEqual(0);
        expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(
            320,
        );
        expect(
            await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBe(320);
        await page.screenshot({
            path: testInfo.outputPath("outline-explorer-narrow.png"),
        });
    }
    expect(errors).toEqual([]);
});
