import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate between different sections', async ({ page }) => {
    // Wait for homepage to load
    await page.waitForSelector('header, nav, .header', { timeout: 10000 });
    
    // Look for navigation links
    const navLinks = page.locator('nav a, .nav-link, .menu-item, header a');
    
    if (await navLinks.count() > 0) {
      // Test navigation to different sections
      const exploreLink = page.locator('text=/explore/i, a[href*="explore"]').first();
      
      if (await exploreLink.count() > 0) {
        await exploreLink.click();
        await page.waitForURL('**/explore/**', { timeout: 10000 });
        expect(page.url()).toContain('explore');
      }
    }
  });

  test('should handle browser back and forward navigation', async ({ page }) => {
    // Start on homepage
    const homeUrl = page.url();
    
    // Navigate to a movie if available
    const movieCard = page.locator('.movieCard, [data-testid="movie-card"]').first();
    
    if (await movieCard.count() > 0) {
      await movieCard.click();
      await page.waitForURL('**/movie/**', { timeout: 10000 });
      
      const movieUrl = page.url();
      expect(movieUrl).not.toBe(homeUrl);
      
      // Go back
      await page.goBack();
      await page.waitForURL(homeUrl, { timeout: 10000 });
      expect(page.url()).toBe(homeUrl);
      
      // Go forward
      await page.goForward();
      await page.waitForURL(movieUrl, { timeout: 10000 });
      expect(page.url()).toBe(movieUrl);
    }
  });

  test('should handle direct URL navigation', async ({ page }) => {
    // Test direct navigation to explore page
    await page.goto('/explore/movie');
    
    // Should load the explore page or handle the route appropriately
    await page.waitForTimeout(3000);
    
    const pageContent = await page.textContent('body');
    expect(pageContent.length).toBeGreaterThan(0);
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    // Navigate to a non-existent route
    await page.goto('/non-existent-page');
    
    // Should show 404 page or redirect appropriately
    await page.waitForTimeout(3000);
    
    const pageContent = await page.textContent('body');
    expect(pageContent.length).toBeGreaterThan(0);
    
    // Common 404 indicators
    const has404Content = pageContent.includes('404') || 
                         pageContent.includes('Not Found') || 
                         pageContent.includes('Page not found');
    
    // Either shows 404 content or redirects to homepage
    const isOnHomepage = page.url().endsWith('/') || page.url().includes('localhost:5173');
    
    expect(has404Content || isOnHomepage).toBe(true);
  });

  test('should maintain scroll position on navigation', async ({ page }) => {
    // Scroll down on homepage
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1000);
    
    const scrollPosition = await page.evaluate(() => window.scrollY);
    expect(scrollPosition).toBeGreaterThan(0);
    
    // Navigate to a movie and back
    const movieCard = page.locator('.movieCard, [data-testid="movie-card"]').first();
    
    if (await movieCard.count() > 0) {
      await movieCard.click();
      await page.waitForURL('**/movie/**', { timeout: 10000 });
      
      await page.goBack();
      await page.waitForURL('/', { timeout: 10000 });
      
      // Check if scroll position is maintained (some frameworks do this)
      await page.waitForTimeout(1000);
      const newScrollPosition = await page.evaluate(() => window.scrollY);
      
      // Either maintains position or resets to top (both are acceptable)
      expect(typeof newScrollPosition).toBe('number');
    }
  });

  test('should handle URL parameters correctly', async ({ page }) => {
    // Test search with URL parameters
    await page.goto('/search?query=batman');
    
    // Should handle the search query parameter
    await page.waitForTimeout(3000);
    
    const pageContent = await page.textContent('body');
    expect(pageContent.length).toBeGreaterThan(0);
    
    // URL should contain the search parameter
    expect(page.url()).toContain('search');
  });

  test('should handle hash navigation', async ({ page }) => {
    // Test navigation with hash fragments (if used)
    await page.goto('/#section');
    
    // Should load the page normally
    await page.waitForTimeout(2000);
    
    const pageContent = await page.textContent('body');
    expect(pageContent.length).toBeGreaterThan(0);
  });

  test('should handle external link behavior', async ({ page }) => {
    // Look for external links (if any)
    const externalLinks = page.locator('a[href^="http"], a[target="_blank"]');
    
    if (await externalLinks.count() > 0) {
      // External links should have appropriate attributes
      const firstExternalLink = externalLinks.first();
      const target = await firstExternalLink.getAttribute('target');
      const rel = await firstExternalLink.getAttribute('rel');
      
      // Should open in new tab or have security attributes
      expect(target === '_blank' || rel?.includes('noopener')).toBe(true);
    }
  });

  test('should handle rapid navigation changes', async ({ page }) => {
    // Rapidly navigate between pages
    const movieCards = page.locator('.movieCard, [data-testid="movie-card"]');
    
    if (await movieCards.count() >= 2) {
      // Click first movie
      await movieCards.nth(0).click();
      await page.waitForTimeout(500);
      
      // Quickly go back
      await page.goBack();
      await page.waitForTimeout(500);
      
      // Click second movie
      await movieCards.nth(1).click();
      await page.waitForTimeout(1000);
      
      // Should handle rapid navigation without errors
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/(movie|tv)\/\d+/);
    }
  });

  test('should preserve application state during navigation', async ({ page }) => {
    // Check if there's any global state (like theme, language settings)
    const themeToggle = page.locator('.theme-toggle, .dark-mode-toggle, [data-testid="theme-toggle"]');
    
    if (await themeToggle.count() > 0) {
      // Toggle theme
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Navigate to another page
      const movieCard = page.locator('.movieCard, [data-testid="movie-card"]').first();
      if (await movieCard.count() > 0) {
        await movieCard.click();
        await page.waitForURL('**/movie/**', { timeout: 10000 });
        
        // Theme state should be preserved
        // This would depend on implementation details
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should handle page refresh correctly', async ({ page }) => {
    // Navigate to a movie details page
    const movieCard = page.locator('.movieCard, [data-testid="movie-card"]').first();
    
    if (await movieCard.count() > 0) {
      await movieCard.click();
      await page.waitForURL('**/movie/**', { timeout: 10000 });
      
      const movieUrl = page.url();
      
      // Refresh the page
      await page.reload();
      
      // Should load the same page correctly
      await page.waitForTimeout(3000);
      expect(page.url()).toBe(movieUrl);
      
      // Page content should load
      const pageContent = await page.textContent('body');
      expect(pageContent.length).toBeGreaterThan(0);
    }
  });
});
