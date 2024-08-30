import { test, expect } from "@playwright/test";

test("init", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/");
});
