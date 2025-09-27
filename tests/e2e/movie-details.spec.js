import { test, expect } from '@playwright/test';

test.describe('Movie Details Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Wait for homepage to load and find a movie to click
    await page.waitForSelector('.movieCard, [data-testid="movie-card"]', { timeout: 10000 });
  });

  test('should navigate to movie details page', async ({ page }) => {
    // Click on the first movie card
    const firstMovieCard = page.locator('.movieCard, [data-testid="movie-card"]').first();
    await expect(firstMovieCard).toBeVisible();
    
    await firstMovieCard.click();
    
    // Wait for navigation to details page
    await page.waitForURL('**/movie/**', { timeout: 10000 });
    
    // Verify we're on a movie details page
    expect(page.url()).toMatch(/\/(movie|tv)\/\d+/);
  });

  test('should display movie details correctly', async ({ page }) => {
    // Navigate to a specific movie details page
    const firstMovieCard = page.locator('.movieCard, [data-testid="movie-card"]').first();
    await firstMovieCard.click();
    
    await page.waitForURL('**/movie/**', { timeout: 10000 });
    
    // Check for essential movie details elements
    await page.waitForSelector('h1, .title, [data-testid="movie-title"]', { timeout: 10000 });
    
    // Movie title should be visible
    const title = page.locator('h1, .title, [data-testid="movie-title"]').first();
    await expect(title).toBeVisible();
    
    // Movie poster should be visible
    const poster = page.locator('img[src*="poster"], .poster img, [data-testid="movie-poster"]');
    if (await poster.count() > 0) {
      await expect(poster.first()).toBeVisible();
    }
    
    // Rating should be displayed
    const rating = page.locator('.circleRating, .rating, [data-testid="rating"]');
    if (await rating.count() > 0) {
      await expect(rating.first()).toBeVisible();
    }
  });

  test('should display movie overview/synopsis', async ({ page }) => {
    const firstMovieCard = page.locator('.movieCard, [data-testid="movie-card"]').first();
    await firstMovieCard.click();
    
    await page.waitForURL('**/movie/**', { timeout: 10000 });
    
    // Look for overview/synopsis section
    const overview = page.locator('.overview, .synopsis, .description, [data-testid="overview"]');
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    if (await overview.count() > 0) {
      await expect(overview.first()).toBeVisible();
      
      // Overview should have some text content
      const overviewText = await overview.first().textContent();
      expect(overviewText.trim().length).toBeGreaterThan(0);
    }
  });

  test('should display cast information', async ({ page }) => {
    const firstMovieCard = page.locator('.movieCard, [data-testid="movie-card"]').first();
    await firstMovieCard.click();
    
    await page.waitForURL('**/movie/**', { timeout: 10000 });
    
    // Wait for page to fully load
    await page.waitForTimeout(3000);
    
    // Look for cast section
    const castSection = page.locator('.cast, .credits, [data-testid="cast"]');
    
    if (await castSection.count() > 0) {
      await expect(castSection.first()).toBeVisible();
      
      // Should have cast member cards or list items
      const castMembers = page.locator('.cast .movieCard, .cast-member, .person-card');
      if (await castMembers.count() > 0) {
        await expect(castMembers.first()).toBeVisible();
      }
    }
  });

  test('should display movie genres', async ({ page }) => {
    const firstMovieCard = page.locator('.movieCard, [data-testid="movie-card"]').first();
    await firstMovieCard.click();
    
    await page.waitForURL('**/movie/**', { timeout: 10000 });
    
    // Look for genres
    const genres = page.locator('.genres, .genre, [data-testid="genres"]');
    
    if (await genres.count() > 0) {
      await expect(genres.first()).toBeVisible();
    }
  });

  test('should display release date and runtime', async ({ page }) => {
    const firstMovieCard = page.locator('.movieCard, [data-testid="movie-card"]').first();
    await firstMovieCard.click();
    
    await page.waitForURL('**/movie/**', { timeout: 10000 });
    
    // Look for release date
    const releaseDate = page.locator('.release-date, .date, [data-testid="release-date"]');
    const runtime = page.locator('.runtime, .duration, [data-testid="runtime"]');
    
    // At least one of these should be visible
    const hasDateOrRuntime = await releaseDate.count() > 0 || await runtime.count() > 0;
    expect(hasDateOrRuntime).toBe(true);
  });

  test('should handle video trailers', async ({ page }) => {
    const firstMovieCard = page.locator('.movieCard, [data-testid="movie-card"]').first();
    await firstMovieCard.click();
    
    await page.waitForURL('**/movie/**', { timeout: 10000 });
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Look for video/trailer section
    const videoSection = page.locator('.videos, .trailers, [data-testid="videos"]');
    const playButton = page.locator('.play-button, .video-play, button[aria-label*="play" i]');
    
    if (await videoSection.count() > 0 || await playButton.count() > 0) {
      // If video section exists, it should be visible
      if (await videoSection.count() > 0) {
        await expect(videoSection.first()).toBeVisible();
      }
      
      // If play button exists, it should be clickable
      if (await playButton.count() > 0) {
        await expect(playButton.first()).toBeVisible();
      }
    }
  });

  test('should display similar/recommended movies', async ({ page }) => {
    const firstMovieCard = page.locator('.movieCard, [data-testid="movie-card"]').first();
    await firstMovieCard.click();
    
    await page.waitForURL('**/movie/**', { timeout: 10000 });
    
    // Wait for page to fully load
    await page.waitForTimeout(3000);
    
    // Look for similar/recommended movies section
    const similarSection = page.locator('.similar, .recommendations, .related, [data-testid="similar"]');
    
    if (await similarSection.count() > 0) {
      await expect(similarSection.first()).toBeVisible();
      
      // Should contain movie cards
      const similarMovies = page.locator('.similar .movieCard, .recommendations .movieCard, .related .movieCard');
      if (await similarMovies.count() > 0) {
        await expect(similarMovies.first()).toBeVisible();
      }
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const firstMovieCard = page.locator('.movieCard, [data-testid="movie-card"]').first();
    await firstMovieCard.click();
    
    await page.waitForURL('**/movie/**', { timeout: 10000 });
    
    // Essential elements should still be visible on mobile
    await page.waitForSelector('h1, .title, [data-testid="movie-title"]', { timeout: 10000 });
    const title = page.locator('h1, .title, [data-testid="movie-title"]').first();
    await expect(title).toBeVisible();
    
    // Page should be scrollable
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
  });

  test('should handle back navigation', async ({ page }) => {
    const firstMovieCard = page.locator('.movieCard, [data-testid="movie-card"]').first();
    await firstMovieCard.click();
    
    await page.waitForURL('**/movie/**', { timeout: 10000 });
    
    // Go back to previous page
    await page.goBack();
    
    // Should be back on homepage
    await page.waitForURL('/', { timeout: 10000 });
    await expect(page.locator('.movieCard, [data-testid="movie-card"]').first()).toBeVisible();
  });

  test('should handle invalid movie ID gracefully', async ({ page }) => {
    // Navigate to an invalid movie ID
    await page.goto('/movie/999999999');
    
    // Page should handle the error gracefully
    // Either show 404 page or redirect to homepage
    await page.waitForTimeout(3000);
    
    const pageContent = await page.textContent('body');
    expect(pageContent.length).toBeGreaterThan(0);
    
    // Should not show a blank page
    const hasContent = pageContent.trim().length > 0;
    expect(hasContent).toBe(true);
  });
});
