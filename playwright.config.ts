import { defineConfig, devices } from "@playwright/test";

const serverMode = process.env.PLAYWRIGHT_SERVER_MODE === "dev" ? "dev" : "production";
const serverCommand = serverMode === "dev"
  ? "ASTRO_DEV_BACKGROUND=0 npm run dev -- --host 127.0.0.1 --port 4322 --ignore-lock"
  : "npm run preview -- --host 127.0.0.1 --port 4322";

export default defineConfig({
  testDir: "tests/e2e",
  webServer: {
    command: serverCommand,
    url: "http://127.0.0.1:4322",
    reuseExistingServer: false
  },
  use: {
    baseURL: "http://127.0.0.1:4322",
    trace: "on-first-retry"
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ]
});
