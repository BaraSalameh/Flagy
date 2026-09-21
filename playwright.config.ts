import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    workers: 4,
    use: { baseURL: "http://127.0.0.1:3010", trace: "on-first-retry" },
    webServer: {
        command:
            "cross-env PLAYWRIGHT_TEST=1 npm run build && cross-env PLAYWRIGHT_TEST=1 next start --port 3010",
        url: "http://127.0.0.1:3010",
        reuseExistingServer: false,
        timeout: 180_000,
    },
    projects: [
        { name: "desktop", use: { ...devices["Desktop Chrome"] } },
        { name: "mobile", use: { ...devices["Pixel 7"] } },
    ],
});
