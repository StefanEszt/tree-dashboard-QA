import { test, expect } from "@playwright/test";

test("CO₂ Goal Calculator works correctly", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // Locate the input field
  const input = page.locator('input[placeholder="Enter goal in tonnes"]');

  // Case 1: Enter 1 tonne
  await input.fill("1");
  await page.waitForTimeout(500);

  const result = page.locator("text=To offset 1 tonnes CO₂/year");
  await expect(result).toBeVisible();

  // Case 2: Enter 0 (should clear result)
  await input.fill("0");
  await page.waitForTimeout(500);

  await expect(result).not.toBeVisible();

  // Case 3: Enter invalid text (should clear result)
  await input.fill(" ");
  await page.waitForTimeout(500);

  await expect(result).not.toBeVisible();
});
