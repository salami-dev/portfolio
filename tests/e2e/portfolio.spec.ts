import { expect, test } from "@playwright/test";
import axe from "axe-core";

declare global {
  interface Window {
    axe: typeof axe;
  }
}

test("homepage renders all case-study cards and navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /I build the product surface/ })).toBeVisible();
  await expect(page.locator("[data-project-card]")).toHaveCount(3);
  await expect(page.getByRole("heading", { name: /Audicin V2/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "How I work" })).toBeVisible();
  await page.getByRole("link", { name: "View work" }).click();
  await expect(page).toHaveURL(/\/work\/$/);
  await expect(page.getByRole("heading", { name: /Products for listening/ })).toBeVisible();
});

test("mobile menu exposes primary navigation", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile-only navigation behavior");
  await page.goto("/");
  await page.getByRole("banner").getByRole("button", { name: "Menu" }).click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Contact" })).toBeVisible();
});

test("work page renders the complete project card set", async ({ page }) => {
  await page.goto("/work/");
  await expect(page.locator("[data-project-card]")).toHaveCount(7);
  await expect(page.locator('[data-card-variant="featured"]')).toHaveCount(3);
  await expect(page.locator('[data-card-variant="supporting"]')).toHaveCount(4);
  await expect(page.getByRole("heading", { name: /Audicin Web/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Bridger/ })).toBeVisible();
  const audicinV2Card = page.locator("article").filter({ has: page.getByRole("heading", { name: "Audicin V2" }) }).first();
  await expect(audicinV2Card).toContainText("Audicin is an audio-health product");
  await expect(audicinV2Card).toContainText("Impact:");
  await expect(audicinV2Card).toContainText("Key challenge:");
  await expect(page.getByRole("heading", { name: "Sproutly Mobile" })).toBeVisible();
});

test("project story pages support images and fallback media", async ({ page }) => {
  await page.goto("/work/audicin-web/");
  await expect(page.getByRole("heading", { name: /Audicin Web/ })).toBeVisible();
  await expect(page.getByRole("img", { name: "Audicin web application interface." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Browser product" })).toBeVisible();

  await page.goto("/work/bridger-web/");
  await expect(page.getByRole("heading", { name: /Bridger/ })).toBeVisible();
  await expect(page.getByRole("img", { name: /inventory financing workflows/i })).toBeVisible();
});

test("about page explains whole-problem ownership and working style", async ({ page }) => {
  await page.goto("/about/");
  await expect(page.getByRole("heading", { name: "I like owning the whole problem, not just the technical part." })).toBeVisible();
  await expect(page.getByText(/work across the boundaries between product, engineering, data, and operations/)).toBeVisible();
  await expect(page.getByText(/following the work beyond implementation/)).toBeVisible();
  await expect(page.getByText(/breadth came from working in startups/)).toBeVisible();
  await expect(page.getByText(/habit has carried beyond startup environments/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "How I work" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Outside work" })).toBeVisible();
  const outsideWorkCopy = page.getByText(/playing table tennis or travelling across West Africa/);
  await expect(outsideWorkCopy).toBeVisible();
  await expect(page.locator("[data-travel-gallery]")).not.toBeAttached();

  const [copyBounds, footerBounds] = await Promise.all([
    outsideWorkCopy.boundingBox(),
    page.getByRole("contentinfo").boundingBox()
  ]);
  expect(copyBounds).not.toBeNull();
  expect(footerBounds).not.toBeNull();
  expect(footerBounds!.y - (copyBounds!.y + copyBounds!.height)).toBeGreaterThanOrEqual(48);
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

test("homepage technical diagram keeps node labels inside their boxes on wide screens", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto("/");

  const overflowingLabels = await page.locator(".hero-visual .flow-node").evaluateAll((nodes) =>
    nodes.filter((node) => node.scrollWidth > node.clientWidth).map((node) => node.textContent)
  );

  expect(overflowingLabels).toEqual([]);
});
