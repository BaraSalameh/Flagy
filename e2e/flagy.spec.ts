import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import countriesData from "../public/data/countries.info.json";

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

test("game globe rotates between continent missions", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const globe = page.getByRole("group", { name: /rotating game globe/i });
    await expect(globe).toHaveAccessibleName(/africa selected for geo guess/i);
    await globe.focus();
    await page.keyboard.press("ArrowRight");
    await expect(globe).toHaveAccessibleName(/asia selected for map master/i);
    const gamePicker = page.getByRole("button", { name: /choose game/i });
    await gamePicker.click();
    await page.getByRole("option", { name: /flag finder/i }).click();
    await expect(globe).toHaveAccessibleName(
        /europe selected for flag finder/i,
    );
    await expect(gamePicker).toHaveAccessibleName(/flag finder selected/i);
    await expect(
        page.getByRole("link", { name: "Play now: Flag Finder" }),
    ).toHaveAttribute("href", "/map/flag-finder");

    await gamePicker.click();
    await page.getByRole("option", { name: /geo guess/i }).click();
    const bounds = await globe.boundingBox();
    expect(bounds).not.toBeNull();
    if (bounds) {
        await page.mouse.move(
            bounds.x + bounds.width * 0.58,
            bounds.y + bounds.height * 0.5,
        );
        await page.mouse.down();
        await page.mouse.move(
            bounds.x + bounds.width * 0.2,
            bounds.y + bounds.height * 0.5,
            { steps: 5 },
        );
        await page.mouse.up();
    }
    await expect(globe).toHaveAccessibleName(/asia selected for map master/i);
    await expect(gamePicker).toHaveAccessibleName(/map master selected/i);
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
    { slug: "flag-finder", title: "Flag Finder" },
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
    { slug: "flag-finder", title: "Flag Finder" },
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
        await page.route("**/data/countries.info.json", (route) =>
            route.fulfill({
                json:
                    game === "geo-guess"
                        ? { CA: countriesData.CA }
                        : {
                              CA: countriesData.CA,
                              CN: countriesData.CN,
                              BR: countriesData.BR,
                          },
            }),
        );
        await page.goto(`/map/${game}`);
        await page.getByRole("button", { name: /beginner/i }).click();
        if (game === "geo-guess") {
            const canada = page
                .getByRole("button", { name: "Select Canada", exact: true })
                .first();
            await canada.focus();
            await page.keyboard.press("Enter");
        } else {
            const panel = page.getByRole("region", {
                name: "Map Master challenge",
            });
            for (let index = 0; index < 3; index += 1) {
                const target = await panel.getByRole("heading").innerText();
                const country = page
                    .getByRole("button", {
                        name: `Select ${target}`,
                        exact: true,
                    })
                    .first();
                await country.focus();
                await page.keyboard.press("Enter");
            }
        }
        const resultName =
            game === "geo-guess"
                ? "Mystery solved — you win!"
                : "Map mastered — you win!";
        await expect(
            page.getByRole("dialog", { name: resultName }),
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
                    name: /outline decoded|silhouette slipped away/i,
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
        page.getByRole("dialog", {
            name: /outline decoded|silhouette slipped away/i,
        }),
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
