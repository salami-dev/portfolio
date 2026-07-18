import { expect, test } from "@playwright/test";
import axe from "axe-core";

declare global {
  interface Window {
    axe: typeof axe;
  }
}

test("homepage navigation and project links work", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Product interfaces/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Audicin V2/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Working approach" })).toBeVisible();
  await page.getByRole("link", { name: "View selected work" }).click();
  await expect(page).toHaveURL(/\/work\/$/);
  await expect(page.getByRole("heading", { name: /Selected systems across product/ })).toBeVisible();
});

test("mobile menu exposes primary navigation", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile-only navigation behavior");
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Contact" })).toBeVisible();
});

test("work page lists real project summaries", async ({ page }) => {
  await page.goto("/work/");
  await expect(page.getByRole("heading", { name: "Primary case studies" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Audicin Web/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Bridger/ })).toBeVisible();
  await expect(page.locator("dd", { hasText: "origination, KYC, wallet" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Supporting work" })).toBeVisible();
});

test("project story pages support images and fallback media", async ({ page }) => {
  await page.goto("/work/audicin-web/");
  await expect(page.getByRole("heading", { name: /Audicin Web/ })).toBeVisible();
  await expect(page.getByRole("img", { name: "Audicin web application interface." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Scope" })).toBeVisible();

  await page.goto("/work/bridger-web/");
  await expect(page.getByRole("heading", { name: /Bridger/ })).toBeVisible();
  await expect(page.getByRole("img", { name: /inventory financing workflows/i })).toBeVisible();
});

test("keyboard focus can reach primary actions", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("reduced motion disables transitions", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  const durationMs = await page.locator(".button-primary").first().evaluate((element) => {
    const duration = getComputedStyle(element).transitionDuration;
    return duration.endsWith("ms") ? Number.parseFloat(duration) : Number.parseFloat(duration) * 1000;
  });
  expect(durationMs).toBeLessThanOrEqual(0.01);
  await context.close();
});

test("homepage has no detectable axe violations", async ({ page }) => {
  await page.goto("/");
  const source = axe.source;
  await page.addScriptTag({ content: source });
  const results = await page.evaluate(async () => await window.axe.run(document));
  expect(results.violations).toEqual([]);
});

test("responsive layouts do not horizontally overflow", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
