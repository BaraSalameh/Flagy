import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import countries from "../public/data/countries.info.json";

const panel = (page: Page) =>
    page.getByRole("region", { name: "Map Master challenge" });
async function selectCountry(page: Page, name: string) {
    await page
        .getByRole("button", { name: `Select ${name}`, exact: true })
        .first()
        .focus();
    await page.keyboard.press("Enter");
}
async function selectTarget(page: Page) {
    const name = await panel(page).getByRole("heading").innerText();
    await selectCountry(page, name);
    return name;
}

test("Palestine is a single clickable feature and mobile back stays available", async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.route("**/data/countries.info.json", (route) =>
        route.fulfill({ json: { PS: countries.PS } }),
    );
    await page.goto("/map/map-master");
    await page.locator('a[aria-label="Back to game hub"]').click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto("/map/map-master");
    await page.getByRole("button", { name: /advanced/i }).click();
    const palestine = page.getByRole("button", {
        name: "Select Palestine",
        exact: true,
    });
    await expect(palestine).toHaveCount(1);
    await palestine.focus();
    await page.keyboard.press("Enter");
    await expect(panel(page)).toContainText("Correct! Palestine earned");
});

test("correct scores, persistent feedback, and same-difficulty replay through another win", async ({
    page,
}) => {
    await page.route("**/data/countries.info.json", (route) =>
        route.fulfill({
            json: { CA: countries.CA, CN: countries.CN, JO: countries.JO },
        }),
    );
    await page.goto("/map/map-master");
    await page.getByRole("button", { name: /beginner/i }).click();
    const score = page.getByRole("progressbar", { name: "Score", exact: true });
    await expect(score).toHaveAttribute("aria-valuenow", "10");
    await selectCountry(page, "Jordan");
    await expect(score).toHaveAttribute("aria-valuenow", "9");
    await page.keyboard.press("Enter");
    await expect(score).toHaveAttribute("aria-valuenow", "9");
    const first = await selectTarget(page);
    await expect(score).toHaveAttribute("aria-valuenow", "13");
    await expect(panel(page)).toContainText(
        `Correct! ${first} earned +4 points.`,
    );
    await expect(panel(page).getByRole("heading")).not.toHaveText(first);
    // The second click of a double-click must not count against the new question.
    await page.keyboard.press("Enter");
    await expect(score).toHaveAttribute("aria-valuenow", "13");
    await selectTarget(page);
    await expect(score).toHaveAttribute("aria-valuenow", "17");
    const last = await selectTarget(page);
    const result = page.getByRole("dialog", { name: "Brilliant journey!" });
    await expect(result).toContainText("3 countries in 4 guesses");
    await result.getByRole("button", { name: "Play again" }).click();
    await page.getByRole("button", { name: /beginner/i }).click();
    await expect(score).toHaveAttribute("aria-valuenow", "10");
    await expect(panel(page)).toContainText("20 guesses left");
    await expect(panel(page).getByRole("heading")).not.toHaveText(last);
    for (let index = 0; index < 3; index += 1) await selectTarget(page);
    await expect(result).toContainText("3 countries in 3 guesses");
    await result.getByRole("button", { name: "Explore answer" }).click();
    await expect(panel(page)).toContainText("The last answer is highlighted");
    await expect(
        page.getByRole("progressbar", { name: "Score" }),
    ).toHaveAttribute("aria-valuenow", "20");
});

test("country aliases work and score exhaustion reveals the answer", async ({
    page,
}) => {
    // A single eligible country makes the first target deterministic.
    await page.route("**/data/countries.info.json", (route) =>
        route.fulfill({
            json: {
                VA: { ...countries.VA, area: 300_000 },
                JO: countries.JO,
                DE: { ...countries.DE, area: 1 },
                BR: { ...countries.BR, area: 1 },
            },
        }),
    );
    await page.goto("/map/map-master");
    await page.getByRole("button", { name: /beginner/i }).click();
    await expect(panel(page).getByRole("heading")).toHaveText("Vatican City");
    await selectTarget(page);
    await expect(
        page.getByRole("progressbar", { name: "Score" }),
    ).toHaveAttribute("aria-valuenow", "14");
    await page.getByRole("link", { name: "Back to game hub" }).click();
    await page.getByRole("link", { name: "Play now" }).nth(1).click();
    await page.getByRole("button", { name: /expert/i }).click();
    const target = await panel(page).getByRole("heading").innerText();
    const wrong = ["Vatican City", "Jordan", "Germany", "Brazil"].filter(
        (name) => name !== target,
    );
    for (const name of wrong) await selectCountry(page, name);
    const result = page.getByRole("dialog", { name: "A little detour" });
    await expect(result).toContainText(`The last country was ${target}`);
    await expect(result).toContainText("Final score: 0/20");
    await result.getByRole("button", { name: "Explore answer" }).click();
    await expect(panel(page)).toContainText(target);
});

test("loading retry, accessible controls, and mobile layout", async ({
    page,
}, testInfo) => {
    await page.route("**/data/countries.info.json", (route) =>
        route.fulfill({ status: 503, body: "unavailable" }),
    );
    await page.goto("/map/map-master");
    const onboarding = page.getByRole("dialog", { name: "Map Master" });
    await expect(onboarding).toContainText(
        "Country information is unavailable",
    );
    await page.unroute("**/data/countries.info.json");
    await onboarding.getByRole("button", { name: "Try again" }).click();
    await expect(
        onboarding.getByRole("button", { name: /beginner/i }),
    ).toBeEnabled();
    // Contrast must be measured after the disabled-to-enabled opacity transition.
    await expect(
        onboarding.getByRole("button", { name: /beginner/i }),
    ).toHaveCSS("opacity", "1");
    expect(
        (await new AxeBuilder({ page }).include('[role="dialog"]').analyze())
            .violations,
    ).toEqual([]);
    await onboarding.getByRole("button", { name: /beginner/i }).click();
    expect(
        (
            await new AxeBuilder({ page })
                .include('[aria-label="Map Master challenge"]')
                .analyze()
        ).violations,
    ).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath("map-master.png") });
    await page.getByRole("button", { name: /switch to dark/i }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    expect(
        (
            await new AxeBuilder({ page })
                .include('[aria-label="Map Master challenge"]')
                .analyze()
        ).violations,
    ).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath("map-master-dark.png") });
    if (testInfo.project.name === "mobile") {
        await page.setViewportSize({ width: 320, height: 700 });
        const bounds = await panel(page).boundingBox();
        expect(bounds?.x).toBeGreaterThanOrEqual(0);
        expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(
            320,
        );
        expect(
            await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBe(320);
        await page.screenshot({
            path: testInfo.outputPath("map-master-narrow.png"),
        });
    }
});
