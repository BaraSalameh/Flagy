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
    await expect(page.getByRole("dialog", { name: "Geo Guess" })).toContainText(
        "Choose your difficulty",
    );
    await expect(page.getByRole("button", { name: /beginner/i })).toBeEnabled();
    await page.getByRole("button", { name: /beginner/i }).focus();
    await page.keyboard.press("Enter");
    await expect(
        page.getByRole("list", { name: "Revealed clues" }),
    ).toBeVisible();
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
    { slug: "border-hop", title: "Border Hop" },
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

for (const game of [
    { slug: "geo-guess", title: "Geo Guess" },
    { slug: "map-master", title: "Map Master" },
    { slug: "outline-explorer", title: "Outline Explorer" },
    { slug: "border-hop", title: "Border Hop" },
]) {
    test(`${game.title} keeps the loading overlay until the atlas is painted`, async ({
        page,
    }) => {
        let releaseAtlas: () => void = () => undefined;
        const atlasGate = new Promise<void>((resolve) => {
            releaseAtlas = () => resolve();
        });
        await page.route("**/data/countries.*.json", async (route) => {
            await atlasGate;
            await route.continue();
        });

        await page.goto(`/map/${game.slug}`);
        const onboarding = page.getByRole("dialog", { name: game.title });
        const loadingOverlay = page.getByRole("status", {
            name: "Preparing your game…",
        });
        await expect(onboarding).toBeVisible();
        await expect(loadingOverlay).toBeVisible();
        await expect(
            onboarding.getByRole("button", { name: /beginner/i }),
        ).toBeDisabled();

        releaseAtlas();

        await expect(loadingOverlay).toBeHidden();
        expect(
            await page.locator(".leaflet-overlay-pane svg path").count(),
        ).toBeGreaterThan(0);
        await expect(
            onboarding.getByRole("button", { name: /beginner/i }),
        ).toBeEnabled();
    });
}

test("map data failure is recoverable", async ({ page }) => {
    await page.route("**/data/countries.geo.json", (route) =>
        route.fulfill({ status: 503, body: "unavailable" }),
    );
    await page.goto("/map/geo-guess");
    const onboarding = page.getByRole("dialog", { name: "Geo Guess" });
    await expect(onboarding).toContainText("Map data is unavailable");
    await expect(
        onboarding.getByRole("button", { name: "Try again" }),
    ).toBeVisible();

    await page.unroute("**/data/countries.geo.json");
    let releaseRetry: () => void = () => undefined;
    const retryGate = new Promise<void>((resolve) => {
        releaseRetry = () => resolve();
    });
    await page.route("**/data/countries.*.json", async (route) => {
        await retryGate;
        await route.continue();
    });
    await onboarding.getByRole("button", { name: "Try again" }).click();
    await expect(
        page.getByRole("status", {
            name: "Preparing your game…",
        }),
    ).toBeVisible();
    releaseRetry();
    await expect(
        onboarding.getByRole("button", { name: /beginner/i }),
    ).toBeEnabled();
});

test("game loading indicator honors reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.route("**/data/countries.*.json", () => undefined);
    await page.goto("/map/geo-guess");
    const loadingOverlay = page.getByRole("status", {
        name: "Preparing your game…",
    });
    await expect(loadingOverlay).toBeVisible();
    const activeAnimations = await loadingOverlay
        .locator(".game-loading-indicator__orbit--outer")
        .evaluate((element) => element.getAnimations().length);
    expect(activeAnimations).toBe(0);
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
        const next = page.getByRole("button", {
            name: "Next country",
            exact: true,
        });
        if (await next.isVisible()) await next.click();
        const available = page.locator(
            '[aria-label="Country choices"] button:not(:disabled)',
        );
        if (await available.count()) await available.first().click();
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

test("border hop can complete a beginner route with hints", async ({
    page,
}, testInfo) => {
    test.skip(
        testInfo.project.name !== "desktop",
        "Covered once; responsive startup is tested separately.",
    );
    await page.goto("/map/border-hop");
    await page.getByRole("button", { name: /beginner/i }).click();
    const routePanel = page.getByRole("region", { name: "Border Hop route" });
    await expect(routePanel).toBeVisible();
    await expect(
        routePanel.getByText(/shortest route takes 2 moves/i),
    ).toBeVisible();
    await routePanel.getByRole("button", { name: /hint \(2\)/i }).click();
    await routePanel.getByRole("button", { name: /hint \(1\)/i }).click();
    await expect(
        page.getByRole("dialog", { name: "Perfect route!" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "New route" }).click();
    await expect(
        page.getByRole("dialog", { name: "Border Hop" }),
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
