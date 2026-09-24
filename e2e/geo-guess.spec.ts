import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import countries from "../public/data/countries.info.json";

test("same-difficulty replay selects a new country, restores clues, and can be won again", async ({
    page,
}) => {
    await page.route("**/data/countries.info.json", (route) =>
        route.fulfill({ json: { CA: countries.CA, CN: countries.CN } }),
    );
    await page.goto("/map/geo-guess");
    await page.getByRole("button", { name: /beginner/i }).click();
    const panel = page.getByRole("region", { name: "Round clues and guesses" });
    const clues = page.getByRole("list", { name: "Revealed clues" });
    await expect(clues.getByRole("listitem")).toHaveCount(1);
    const firstClue = await clues.innerText();
    const canadaPopulation = Number(countries.CA.population).toLocaleString(
        "en-US",
        { notation: "compact" },
    );
    const firstCode = firstClue.includes(canadaPopulation) ? "CA" : "CN";
    const secondCode = firstCode === "CA" ? "CN" : "CA";
    await page.getByLabel("Guess by name").selectOption(firstCode);
    await page.getByRole("button", { name: "Guess", exact: true }).click();
    const result = page.getByRole("dialog", { name: "Brilliant journey!" });
    await expect(result).toContainText(countries[firstCode].countryName);
    await result.getByRole("button", { name: "Play again" }).click();
    await page.getByRole("button", { name: /beginner/i }).click();
    await expect(panel).toContainText("15 guesses left");
    await expect(clues.getByRole("listitem")).toHaveCount(1);
    await expect(clues).not.toHaveText(firstClue);
    await page.getByLabel("Guess by name").selectOption(secondCode);
    await page.getByRole("button", { name: "Guess", exact: true }).click();
    await expect(result).toContainText(countries[secondCode].countryName);
    await result.getByRole("button", { name: "Explore answer" }).click();
    await expect(panel).toContainText("Correct!");
    await expect(page.getByLabel("Guess by name")).toHaveCount(0);
});

test("map aliases use country codes and guesses preserve clues", async ({
    page,
}) => {
    // Only Vatican meets Beginner eligibility in this deterministic fixture.
    const fixture = Object.fromEntries(
        Object.entries(countries).map(([code, country]) => [
            code,
            { ...country, area: code === "VA" ? 30_000_000 : 1 },
        ]),
    );
    await page.route("**/data/countries.info.json", (route) =>
        route.fulfill({ json: fixture }),
    );
    await page.goto("/map/geo-guess");
    await page.getByRole("button", { name: /beginner/i }).click();
    const panel = page.getByRole("region", { name: "Round clues and guesses" });
    const clues = page.getByRole("list", { name: "Revealed clues" });
    const canada = page.getByRole("button", {
        name: "Select Canada",
        exact: true,
    });
    await canada.focus();
    await page.keyboard.press("Enter");
    await expect(panel).toContainText("14 guesses left");
    await expect(clues.getByRole("listitem")).toHaveCount(1);
    await expect(canada).toHaveCSS("outline-style", "none");
    // A repeated key press cannot consume another attempt or show a box outline.
    await page.keyboard.press("Enter");
    await expect(panel).toContainText("14 guesses left");
    await page.getByLabel("Guess by name").selectOption("CN");
    await page.getByRole("button", { name: "Guess", exact: true }).click();
    await expect(clues.getByRole("listitem")).toHaveCount(2);
    const accessibility = await new AxeBuilder({ page })
        .include('[aria-label="Round clues and guesses"]')
        .analyze();
    expect(accessibility.violations).toEqual([]);
    await page
        .getByRole("button", { name: "Select Vatican City", exact: true })
        .focus();
    await page.keyboard.press("Enter");
    await expect(
        page.getByRole("dialog", { name: "Brilliant journey!" }),
    ).toContainText("Vatican City");
});

test("the SVG renderer stays buffered while the map is moving", async ({
    page,
}) => {
    await page.goto("/map/geo-guess");
    await page.getByRole("button", { name: /beginner/i }).click();

    const map = page.locator(".leaflet-container");
    const renderer = page.locator(".leaflet-overlay-pane svg");
    const mapBounds = await map.boundingBox();
    const rendererBounds = await renderer.boundingBox();
    expect(mapBounds).not.toBeNull();
    expect(rendererBounds).not.toBeNull();
    expect(rendererBounds!.width).toBeGreaterThanOrEqual(
        mapBounds!.width * 2.9,
    );
    expect(rendererBounds!.height).toBeGreaterThanOrEqual(
        mapBounds!.height * 2.9,
    );

    await page.mouse.move(
        mapBounds!.x + mapBounds!.width * 0.35,
        mapBounds!.y + mapBounds!.height * 0.5,
    );
    await page.mouse.down();
    await page.mouse.move(
        mapBounds!.x + mapBounds!.width * 0.8,
        mapBounds!.y + mapBounds!.height * 0.5,
        { steps: 12 },
    );
    expect(
        await page
            .locator('.leaflet-overlay-pane svg path:not([d="M0 0"])')
            .count(),
    ).toBeGreaterThan(0);
    await page.mouse.up();
});

test("atlas failures can be retried from onboarding", async ({ page }) => {
    await page.route("**/data/countries.info.json", (route) =>
        route.fulfill({ status: 503, body: "unavailable" }),
    );
    await page.goto("/map/geo-guess");
    const onboarding = page.getByRole("dialog", { name: "Geo Guess" });
    await expect(onboarding).toContainText(
        "Country information is unavailable",
    );
    await page.unroute("**/data/countries.info.json");
    await onboarding.getByRole("button", { name: "Try again" }).click();
    await onboarding.getByRole("button", { name: /beginner/i }).click();
    await expect(
        page
            .getByRole("list", { name: "Revealed clues" })
            .getByRole("listitem"),
    ).toHaveCount(1);
    await page.getByRole("link", { name: "Back to game hub" }).click();
    await page.getByRole("link", { name: "Play now" }).first().click();
    await expect(onboarding).toBeVisible();
});
