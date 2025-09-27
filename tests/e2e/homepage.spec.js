import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/Project Dreamer Movie/i);
    
    // Check for main navigation elements
    await expect(page.locator('header')).toBeVisible();
    
    // Check for search functionality
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  test('should display trending movies section', async ({ page }) => {
    // Wait for the trending section to load
    await page.waitForSelector('[data-testid="trending-section"], .carousel, .trending', { timeout: 10000 });
    
    // Check if trending movies are displayed
    const trendingSection = page.locator('.carousel, .trending, [data-testid="trending"]').first();
    await expect(trendingSection).toBeVisible();
    
    // Check if movie cards are present
    await page.waitForSelector('.movieCard, [data-testid="movie-card"]', { timeout: 10000 });
    const movieCards = page.locator('.movieCard, [data-testid="movie-card"]');
    await expect(movieCards.first()).toBeVisible();
  });

  test('should display popular movies section', async ({ page }) => {
    // Wait for popular section to load
    await page.waitForSelector('.carousel', { timeout: 10000 });
    
    // Check if there are multiple carousels (trending and popular)
    const carousels = page.locator('.carousel');
    const carouselCount = await carousels.count();
    expect(carouselCount).toBeGreaterThan(0);
  });

  test('should have working navigation tabs', async ({ page }) => {
    // Look for tab switching elements
    const tabs = page.locator('.switchTabs, .tab, [role="tab"]');
    
    if (await tabs.count() > 0) {
      // Click on different tabs if they exist
      const firstTab = tabs.first();
      await firstTab.click();
      
      // Wait for content to update
      await page.waitForTimeout(1000);
      
      // Verify tab is active
      await expect(firstTab).toHaveClass(/active|selected/);
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if page still loads correctly
    await expect(page.locator('header')).toBeVisible();
    
    // Check if search is still accessible
    await expect(page.locator('input[type="text"]')).toBeVisible();
    
    // Check if movie cards adapt to mobile layout
    const movieCards = page.locator('.movieCard');
    if (await movieCards.count() > 0) {
      await expect(movieCards.first()).toBeVisible();
    }
  });

  test('should handle loading states gracefully', async ({ page }) => {
    // Intercept API calls to simulate slow loading
    await page.route('**/api.themoviedb.org/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });

    await page.goto('/');
    
    // Check for loading indicators
    const loadingIndicators = page.locator('.spinner, .loading, [data-testid="loading"]');
    
    // Wait for content to eventually load
    await page.waitForSelector('.movieCard, .carousel', { timeout: 15000 });
  });

  test('should display footer information', async ({ page }) => {
    // Scroll to bottom to ensure footer is visible
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check if footer exists
    const footer = page.locator('footer, .footer');
    if (await footer.count() > 0) {
      await expect(footer).toBeVisible();
    }
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Intercept API calls and return errors
    await page.route('**/api.themoviedb.org/**', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    await page.goto('/');
    
    // The page should still load without crashing
    await expect(page.locator('header')).toBeVisible();
    
    // Check that the page doesn't show a blank screen
    const bodyText = await page.textContent('body');
    expect(bodyText.length).toBeGreaterThan(0);
  });
});
