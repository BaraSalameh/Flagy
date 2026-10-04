import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import countries from "../public/data/countries.info.json";

const namesByCode = Object.fromEntries(
    Object.values(countries).map((country) => [
        country.countryCode,
        country.countryName,
    ]),
);

const panel = (page: Page) =>
    page.getByRole("region", { name: "Flag Finder challenge" });

async function selectCountry(page: Page, name: string) {
    const country = page
        .getByRole("button", { name: `Select ${name}`, exact: true })
        .first();
    await country.focus();
    await page.keyboard.press("Enter");
}

async function targetCode(page: Page) {
    return (await panel(page)
        .getByRole("img", { name: /country flag/i })
        .getAttribute("data-country-code"))!;
}

test("identifies bundled flags, advances explicitly, and keeps expert countries focusable", async ({
    page,
}, testInfo) => {
    await page.route("**/data/countries.info.json", (route) =>
        route.fulfill({
            json: {
                CA: countries.CA,
                CN: countries.CN,
                BR: countries.BR,
            },
        }),
    );
    await page.goto("/map/flag-finder");
    await page.getByRole("button", { name: /beginner/i }).click();

    const firstCode = await targetCode(page);
    const flag = panel(page).locator(".fi");
    await expect(flag).toBeVisible();
    await expect(flag).toHaveCSS("background-image", /url/);
    await selectCountry(page, namesByCode[firstCode]);
    await expect(panel(page)).toContainText("Correct");
    await expect(panel(page)).toContainText("Streak 1");
    await panel(page).getByRole("button", { name: "Next flag" }).click();
    await expect(panel(page).locator(".fi")).not.toHaveAttribute(
        "data-country-code",
        firstCode,
    );

    expect(
        (
            await new AxeBuilder({ page })
                .include('[aria-label="Flag Finder challenge"]')
                .analyze()
        ).violations,
    ).toEqual([]);
    await page.getByRole("button", { name: /switch to dark/i }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await page.screenshot({
        path: testInfo.outputPath("flag-finder-dark.png"),
    });
});

test("expert hides static borders, reveals them on focus, and ends the streak", async ({
    page,
}) => {
    await page.route("**/data/countries.info.json", (route) =>
        route.fulfill({ json: { CA: countries.CA, CN: countries.CN } }),
    );
    await page.goto("/map/flag-finder");
    await page.getByRole("button", { name: /expert/i }).click();

    const code = await targetCode(page);
    const wrongName =
        code === "CA" ? countries.CN.countryName : countries.CA.countryName;
    const wrongCountry = page
        .getByRole("button", { name: `Select ${wrongName}`, exact: true })
        .first();
    await expect(wrongCountry).toHaveAttribute("stroke-opacity", "0");
    await wrongCountry.focus();
    await expect(wrongCountry).toHaveAttribute("stroke-opacity", "1");
    await page.keyboard.press("Enter");

    const result = page.getByRole("dialog", { name: "Streak ended" });
    await expect(result).toContainText("Final streak: 0");
    await result.getByRole("button", { name: "Explore answer" }).click();
    await expect(panel(page)).toContainText(namesByCode[code]);
    await expect(panel(page)).toContainText("highlighted on the map");
});

test("fits the minimum mobile viewport and can replay after a loss", async ({
    page,
}) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.route("**/data/countries.info.json", (route) =>
        route.fulfill({ json: { CA: countries.CA, CN: countries.CN } }),
    );
    await page.goto("/map/flag-finder");
    await page.getByRole("button", { name: /expert/i }).click();
    const code = await targetCode(page);
    await selectCountry(
        page,
        code === "CA" ? countries.CN.countryName : countries.CA.countryName,
    );
    const result = page.getByRole("dialog", { name: "Streak ended" });
    const bounds = await result.boundingBox();
    expect(bounds?.x).toBeGreaterThanOrEqual(0);
    expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(320);
    await result.getByRole("button", { name: "Play again" }).click();
    await expect(
        page.getByRole("dialog", { name: "Flag Finder" }),
    ).toBeVisible();
    expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(320);
});
