import { test, expect } from '@playwright/test';

test.describe('Lead Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/commercial/');
  });

  test('renders the contact form', async ({ page }) => {
    const form = page.locator('#contact form');
    await expect(form).toBeVisible();
  });

  test('shows validation errors for empty submission', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /request contact/i });
    await submitButton.click();

    await expect(page.getByText('Required')).toHaveCount(3); // name, company, role
    await expect(page.getByText('Valid work email required')).toBeVisible();
  });

  test('accepts valid input without validation errors', async ({ page }) => {
    await page.fill('input[placeholder="Jane Smith"]', 'Test User');
    await page.fill('input[placeholder="jane@company.com"]', 'test@company.com');
    await page.fill('input[placeholder="Acme Fabrication"]', 'Test Company');
    await page.selectOption('select', 'Operations');

    const submitButton = page.getByRole('button', { name: /request contact/i });
    await submitButton.click();

    // Should not show validation errors
    await expect(page.getByText('Required')).toHaveCount(0);
  });
});

test.describe('Calculator', () => {
  test('renders the quick estimate calculator', async ({ page }) => {
    await page.goto('/calculator/');
    await expect(page.getByText(/Quick Estimate/i)).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('navigates between pages', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Reality Anchors/);

    await page.getByRole('link', { name: 'Production' }).first().click();
    await expect(page).toHaveURL(/commercial/);
  });

  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const menuButton = page.getByRole('button', { name: /open menu/i });
    await menuButton.click();
    await expect(page.locator('#mobile-nav')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-nav')).not.toBeVisible();
  });
});
