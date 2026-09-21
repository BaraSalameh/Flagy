import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("hub navigation, theme, and onboarding are accessible", async ({
    page,
}) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(
        page.getByRole("heading", { name: /know your world/i }),
    ).toBeVisible();
    const hubResults = await new AxeBuilder({ page }).analyze();
    expect(hubResults.violations).toEqual([]);
    await page.getByRole("button", { name: /switch to/i }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await page
        .getByRole("link", { name: /play now/i })
        .first()
        .click();
    await expect(page.getByRole("dialog", { name: "Geo Guess" })).toBeVisible();
    await expect(page.getByRole("button", { name: /beginner/i })).toBeVisible();
    const results = await new AxeBuilder({ page })
        .include("[role=dialog]")
        .analyze();
    expect(results.violations).toEqual([]);
});

test("hub can be navigated by keyboard", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Play now" }).first().focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog", { name: "Geo Guess" })).toBeVisible();
    await expect(page.getByRole("button", { name: /beginner/i })).toBeFocused();
});

test("invalid games use the friendly not-found screen", async ({ page }) => {
    await page.goto("/map/not-a-game");
    await expect(
        page.getByRole("heading", { name: /off the map/i }),
    ).toBeVisible();
});

for (const game of [
    { slug: "geo-guess", title: "Geo Guess" },
    { slug: "map-master", title: "Map Master" },
    { slug: "outline-explorer", title: "Outline Explorer" },
]) {
    test(`${game.title} starts with a responsive game shell`, async ({
        page,
    }) => {
        await page.goto(`/map/${game.slug}`);
        await expect(
            page.getByRole("dialog", { name: game.title }),
        ).toBeVisible();
        await page.getByRole("button", { name: /beginner/i }).click();
        await expect(
            page.getByRole("link", { name: "Back to game hub" }),
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: /switch to/i }),
        ).toBeVisible();
        await expect(page.locator(".leaflet-container")).toBeVisible();
        await expect(page.locator("body")).not.toContainText("undefined");
    });
}

test("map data failure is recoverable", async ({ page }) => {
    await page.route("**/data/countries.geo.json", (route) =>
        route.fulfill({ status: 503, body: "unavailable" }),
    );
    await page.goto("/map/geo-guess");
    await expect(
        page.getByRole("heading", { name: /map took a wrong turn/i }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
});

for (const game of ["geo-guess", "map-master"] as const) {
    test(`${game} can reach a result by keyboard and replay`, async ({
        page,
    }, testInfo) => {
        test.skip(
            testInfo.project.name !== "desktop",
            "Covered once; mobile startup is tested separately.",
        );
        await page.goto(`/map/${game}`);
        await page.getByRole("button", { name: /beginner/i }).click();
        const countries = page.locator(
            '[role="button"][aria-label^="Select "]',
        );
        await expect(countries.first()).toBeVisible();
        const maxSelections = game === "geo-guess" ? 24 : 20;
        for (let index = 0; index < maxSelections; index += 1) {
            if (
                await page
                    .getByRole("dialog", {
                        name: /brilliant journey|little detour/i,
                    })
                    .isVisible()
            )
                break;
            await countries.nth(index % (await countries.count())).focus();
            await page.keyboard.press("Enter");
            await page.waitForTimeout(30);
        }
        await expect(
            page.getByRole("dialog", {
                name: /brilliant journey|little detour/i,
            }),
        ).toBeVisible();
        await page.getByRole("button", { name: "Play again" }).click();
        await expect(
            page.getByRole("dialog", {
                name: game === "geo-guess" ? "Geo Guess" : "Map Master",
            }),
        ).toBeVisible();
    });
}

test("outline explorer can reach a result and replay", async ({
    page,
}, testInfo) => {
    test.skip(
        testInfo.project.name !== "desktop",
        "Covered once; mobile startup is tested separately.",
    );
    await page.goto("/map/outline-explorer");
    await page.getByRole("button", { name: /beginner/i }).click();
    const choices = page.locator('[aria-label="Country choices"] button');
    await expect(choices.first()).toBeVisible();
    for (let index = 0; index < 32; index += 1) {
        if (
            await page
                .getByRole("dialog", {
                    name: /brilliant journey|little detour/i,
                })
                .isVisible()
        )
            break;
        await choices.nth(index % (await choices.count())).click();
        await page.waitForTimeout(30);
    }
    await expect(
        page.getByRole("dialog", { name: /brilliant journey|little detour/i }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Play again" }).click();
    await expect(
        page.getByRole("dialog", { name: "Outline Explorer" }),
    ).toBeVisible();
});

test("hub and onboarding fit a 320px viewport", async ({ page }, testInfo) => {
    test.skip(
        testInfo.project.name !== "desktop",
        "Runs once with an explicit minimum viewport.",
    );
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/");
    await expect(
        page.getByRole("heading", { name: /know your world/i }),
    ).toBeVisible();
    expect(
        await page.evaluate(
            () =>
                document.documentElement.scrollWidth <=
                document.documentElement.clientWidth,
        ),
    ).toBe(true);
    await page.getByRole("link", { name: "Play now" }).first().click();
    const dialog = page.getByRole("dialog", { name: "Geo Guess" });
    await expect(dialog).toBeVisible();
    const bounds = await dialog.boundingBox();
    expect(bounds?.x).toBeGreaterThanOrEqual(0);
    expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(320);
});
