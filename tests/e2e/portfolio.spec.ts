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
  await expect(page.getByRole("heading", { name: "A problem rarely stays inside one box." })).toBeVisible();
  await expect(page.getByText(/Working in startups taught me not to treat a job description/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Engineering across the system" })).not.toBeAttached();
  await expect(page.locator("main h2")).toHaveText([
    "A problem rarely stays inside one box.",
    "Case studies"
  ]);
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
  await expect(audicinV2Card).toContainText("original CMS-backed application");
  await expect(audicinV2Card).toContainText("Impact:");
  await expect(audicinV2Card).not.toContainText("Key challenge:");
  await expect(page.getByRole("heading", { name: "Sproutly Mobile" })).toBeVisible();
});

test("Audicin V2 renders as a live product and platform replacement", async ({ page }) => {
  await page.goto("/work/");

  const audicinV2Card = page.locator("[data-project-card]").filter({
    has: page.getByRole("heading", { name: "Audicin V2" })
  });

  await expect(audicinV2Card).toContainText("Audicin’s original CMS-backed application had become difficult to extend");
  await expect(audicinV2Card).toContainText("promoted to CTO as delivery began");
  await expect(audicinV2Card).toContainText("migrated the live product with negligible interruption");
  await expect(audicinV2Card).not.toContainText("Key challenge:");

  await audicinV2Card.getByRole("link", { name: "Read the case study" }).click();
  await expect(page).toHaveURL(/\/work\/audicin-v2\/$/);

  await expect(page.getByRole("heading", { level: 1, name: "Audicin V2" })).toBeVisible();
  await expect(page.getByText("Rebuilding a live product for personalization and measurable outcomes")).toBeVisible();

  const projectFacts = page.locator("[data-project-facts]");
  await expect(projectFacts).toContainText("Software Engineer → CTO");
  await expect(projectFacts).toContainText("January–August 2025");
  await expect(projectFacts).toContainText("Three engineers across backend, Android, and iOS");
  await expect(projectFacts).toContainText("Product definition, architecture, migration, subscriptions, analytics, data pipelines, infrastructure, internal tooling, and engineering leadership");

  for (const heading of [
    "Why V2 was necessary",
    "Replacing the live platform",
    "Separating authentication from access",
    "Redesigning subscription and legal state",
    "Measuring actual listening behaviour",
    "Health data and the Audicin Sleep Score",
    "Rebuilding delivery and production operations",
    "Replacing the CMS administration layer",
    "Product and mobile delivery",
    "Engineering leadership",
    "Outcome",
    "Reflection"
  ]) {
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  }

  await expect(page.getByRole("heading", { name: "What I owned" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Collaborated with" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Key decisions" })).toBeVisible();
  await expect(page.getByText("provider-agnostic entitlement model")).toBeVisible();
  await expect(page.getByText("Audicin Sleep Score", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("AWS CodeDeploy", { exact: true }).first()).toBeVisible();

  const pageCopy = await page.locator("main").innerText();
  expect(pageCopy).toContain("formal delivery in February 2025");
  expect(pageCopy).toContain("launched toward the end of August 2025");
  expect(pageCopy).toContain("The mobile engineers implemented their respective clients");
  expect(pageCopy).toContain("A UI designer produced the final screen designs");
  expect(pageCopy).toContain("The chief scientist and researchers defined the underlying scoring logic");
  expect(pageCopy).toContain("The CEO retained final approval from the business side");
  expect(pageCopy).not.toMatch(/Kubernetes|\bEKS\b|\bAKS\b/);
  expect(pageCopy).not.toMatch(/wellness score|Sleep nScore|\bnScore\b/i);
  expect(pageCopy).not.toContain("health-tech data-platform rebuild");
  expect(pageCopy).not.toContain("audio-health product");
});

test("Audicin V2 remains accessible and contained at narrow and wide widths", async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1600, height: 1000 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/work/audicin-v2/");

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalOverflow).toBe(false);
  }

  await expect(page.getByRole("figure", { name: /Audicin V2 system architecture/ })).toBeVisible();
  await page.addScriptTag({ content: axe.source });
  const results = await page.evaluate(async () => await window.axe.run(document));
  expect(results.violations).toEqual([]);
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
