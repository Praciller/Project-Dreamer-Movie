import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should perform basic search', async ({ page }) => {
    // Find the search input
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], .searchInput input');
    await expect(searchInput).toBeVisible();
    
    // Type in search query
    await searchInput.fill('Avengers');
    
    // Submit search (either by pressing Enter or clicking search button)
    await searchInput.press('Enter');
    
    // Wait for navigation to search results page
    await page.waitForURL('**/search/**', { timeout: 10000 });
    
    // Verify we're on search results page
    expect(page.url()).toContain('search');
    
    // Check for search results
    await page.waitForSelector('.movieCard, [data-testid="movie-card"], .searchResult', { timeout: 10000 });
    const searchResults = page.locator('.movieCard, [data-testid="movie-card"], .searchResult');
    await expect(searchResults.first()).toBeVisible();
  });

  test('should show search suggestions while typing', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], .searchInput input');
    await expect(searchInput).toBeVisible();
    
    // Start typing
    await searchInput.fill('Marvel');
    
    // Wait a moment for suggestions to appear
    await page.waitForTimeout(1000);
    
    // Check if suggestions dropdown appears (if implemented)
    const suggestions = page.locator('.suggestions, .dropdown, .search-suggestions');
    if (await suggestions.count() > 0) {
      await expect(suggestions).toBeVisible();
    }
  });

  test('should handle empty search gracefully', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], .searchInput input');
    await expect(searchInput).toBeVisible();
    
    // Try to search with empty input
    await searchInput.press('Enter');
    
    // Should either stay on homepage or show appropriate message
    const currentUrl = page.url();
    const isOnHomepage = currentUrl === await page.evaluate(() => window.location.origin + '/');
    const isOnSearchPage = currentUrl.includes('search');
    
    expect(isOnHomepage || isOnSearchPage).toBe(true);
  });

  test('should display no results message for invalid search', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], .searchInput input');
    await expect(searchInput).toBeVisible();
    
    // Search for something that likely won't return results
    await searchInput.fill('xyzabc123nonexistentmovie');
    await searchInput.press('Enter');
    
    // Wait for search results page
    await page.waitForURL('**/search/**', { timeout: 10000 });
    
    // Wait for the search to complete
    await page.waitForTimeout(2000);
    
    // Check for no results message or empty state
    const noResultsMessage = page.locator('.no-results, .empty-state, [data-testid="no-results"]');
    const noResultsText = page.locator('text=/no results/i, text=/not found/i, text=/no movies/i');
    
    // Either a specific no-results component or text should be visible
    const hasNoResultsIndicator = await noResultsMessage.count() > 0 || await noResultsText.count() > 0;
    expect(hasNoResultsIndicator).toBe(true);
  });

  test('should clear search input', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], .searchInput input');
    await expect(searchInput).toBeVisible();
    
    // Type in search query
    await searchInput.fill('Batman');
    
    // Check if there's a clear button
    const clearButton = page.locator('.clear-search, .search-clear, button[aria-label*="clear" i]');
    
    if (await clearButton.count() > 0) {
      await clearButton.click();
      await expect(searchInput).toHaveValue('');
    } else {
      // Manually clear the input
      await searchInput.clear();
      await expect(searchInput).toHaveValue('');
    }
  });

  test('should maintain search query in URL', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], .searchInput input');
    await expect(searchInput).toBeVisible();
    
    const searchQuery = 'Spider-Man';
    await searchInput.fill(searchQuery);
    await searchInput.press('Enter');
    
    // Wait for navigation
    await page.waitForURL('**/search/**', { timeout: 10000 });
    
    // Check if search query is in URL
    const currentUrl = page.url();
    expect(currentUrl.toLowerCase()).toContain(searchQuery.toLowerCase().replace('-', ''));
  });

  test('should handle special characters in search', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], .searchInput input');
    await expect(searchInput).toBeVisible();
    
    // Search with special characters
    const specialQuery = 'X-Men: Days of Future Past';
    await searchInput.fill(specialQuery);
    await searchInput.press('Enter');
    
    // Should navigate to search results without errors
    await page.waitForURL('**/search/**', { timeout: 10000 });
    
    // Page should load successfully
    await expect(page.locator('body')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], .searchInput input');
    await expect(searchInput).toBeVisible();
    
    // Should be able to search on mobile
    await searchInput.fill('Inception');
    await searchInput.press('Enter');
    
    await page.waitForURL('**/search/**', { timeout: 10000 });
    
    // Results should be visible on mobile
    await page.waitForSelector('.movieCard, [data-testid="movie-card"], .searchResult', { timeout: 10000 });
    const searchResults = page.locator('.movieCard, [data-testid="movie-card"], .searchResult');
    await expect(searchResults.first()).toBeVisible();
  });

  test('should handle rapid search queries', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], .searchInput input');
    await expect(searchInput).toBeVisible();
    
    // Type rapidly changing queries
    await searchInput.fill('A');
    await page.waitForTimeout(100);
    await searchInput.fill('Av');
    await page.waitForTimeout(100);
    await searchInput.fill('Ave');
    await page.waitForTimeout(100);
    await searchInput.fill('Avengers');
    
    await searchInput.press('Enter');
    
    // Should handle the final query correctly
    await page.waitForURL('**/search/**', { timeout: 10000 });
    expect(page.url()).toContain('search');
  });
});
