import { chromium } from "playwright";

async function deployToNetlify() {
  console.log("🚀 Starting Netlify deployment automation...");

  // Launch browser
  const browser = await chromium.launch({
    headless: false, // Keep visible so user can see the process
    slowMo: 1000, // Slow down for better visibility
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Step 1: Navigate to Netlify
    console.log("📱 Navigating to Netlify...");
    await page.goto("https://www.netlify.com");
    await page.waitForLoadState("networkidle");

    // Step 2: Click Sign Up/Login
    console.log("🔐 Looking for login options...");

    // Try to find login button - multiple possible selectors
    const loginSelectors = [
      "text=Log in",
      "text=Sign in",
      "text=Login",
      '[data-testid="login"]',
      'a[href*="login"]',
      'button:has-text("Log in")',
    ];

    let loginClicked = false;
    for (const selector of loginSelectors) {
      try {
        const loginBtn = page.locator(selector).first();
        if (await loginBtn.isVisible({ timeout: 2000 })) {
          await loginBtn.click();
          loginClicked = true;
          console.log("✅ Clicked login button");
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (!loginClicked) {
      console.log(
        "⚠️  Could not find login button automatically. Please click login manually."
      );
      await page.pause(); // Pause for manual intervention
    }

    // Wait for login page to load
    await page.waitForLoadState("networkidle");

    // Step 3: Click GitHub login
    console.log("🐙 Looking for GitHub login option...");

    const githubSelectors = [
      "text=GitHub",
      "text=Continue with GitHub",
      "text=Sign in with GitHub",
      '[data-testid="github"]',
      'button:has-text("GitHub")',
      ".github",
      '[href*="github"]',
    ];

    let githubClicked = false;
    for (const selector of githubSelectors) {
      try {
        const githubBtn = page.locator(selector).first();
        if (await githubBtn.isVisible({ timeout: 3000 })) {
          await githubBtn.click();
          githubClicked = true;
          console.log("✅ Clicked GitHub login");
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (!githubClicked) {
      console.log(
        "⚠️  Could not find GitHub login button. Please click it manually."
      );
      await page.pause();
    }

    // Step 4: Handle GitHub authentication
    console.log("🔑 Waiting for GitHub authentication...");

    // Wait for either GitHub login page or redirect back to Netlify
    await Promise.race([
      page.waitForURL("**/github.com/**", { timeout: 10000 }),
      page.waitForURL("**/netlify.com/**", { timeout: 10000 }),
    ]);

    // If we're on GitHub, user needs to authenticate
    if (page.url().includes("github.com")) {
      console.log("🔐 Please complete GitHub authentication in the browser...");
      console.log("   - Enter your GitHub username/email and password");
      console.log("   - Complete any 2FA if required");
      console.log("   - Authorize Netlify if prompted");

      // Wait for redirect back to Netlify
      await page.waitForURL("**/netlify.com/**", { timeout: 120000 }); // 2 minutes timeout
    }

    console.log("✅ GitHub authentication completed!");

    // Step 5: Create new site
    console.log("🏗️  Creating new site...");
    await page.waitForLoadState("networkidle");

    // Look for "New site" or "Add new site" button
    const newSiteSelectors = [
      "text=New site from Git",
      "text=Add new site",
      "text=New site",
      "text=Import from Git",
      '[data-testid="new-site"]',
      'button:has-text("New site")',
      'a:has-text("New site")',
    ];

    let newSiteClicked = false;
    for (const selector of newSiteSelectors) {
      try {
        const newSiteBtn = page.locator(selector).first();
        if (await newSiteBtn.isVisible({ timeout: 3000 })) {
          await newSiteBtn.click();
          newSiteClicked = true;
          console.log("✅ Clicked new site button");
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (!newSiteClicked) {
      console.log(
        "⚠️  Could not find new site button. Please click it manually."
      );
      await page.pause();
    }

    // Step 6: Select GitHub as source
    console.log("🐙 Selecting GitHub as source...");
    await page.waitForTimeout(2000);

    const githubSourceSelectors = [
      "text=GitHub",
      'button:has-text("GitHub")',
      '[data-testid="github"]',
      ".github-provider",
    ];

    let githubSourceClicked = false;
    for (const selector of githubSourceSelectors) {
      try {
        const githubSourceBtn = page.locator(selector).first();
        if (await githubSourceBtn.isVisible({ timeout: 3000 })) {
          await githubSourceBtn.click();
          githubSourceClicked = true;
          console.log("✅ Selected GitHub as source");
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (!githubSourceClicked) {
      console.log(
        "⚠️  Could not find GitHub source option. Please select it manually."
      );
      await page.pause();
    }

    // Step 7: Search and select repository
    console.log("🔍 Looking for Project-Dreamer-Movie repository...");
    await page.waitForTimeout(3000);

    // Look for the repository in the list
    const repoSelectors = [
      "text=Project-Dreamer-Movie",
      '[data-testid*="Project-Dreamer-Movie"]',
      'button:has-text("Project-Dreamer-Movie")',
      'a:has-text("Project-Dreamer-Movie")',
    ];

    let repoFound = false;
    for (const selector of repoSelectors) {
      try {
        const repoBtn = page.locator(selector).first();
        if (await repoBtn.isVisible({ timeout: 5000 })) {
          await repoBtn.click();
          repoFound = true;
          console.log("✅ Selected Project-Dreamer-Movie repository");
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (!repoFound) {
      console.log(
        "⚠️  Could not find Project-Dreamer-Movie repository automatically."
      );
      console.log("   Please search for and select it manually.");
      await page.pause();
    }

    // Step 8: Configure build settings
    console.log("⚙️  Configuring build settings...");
    await page.waitForTimeout(2000);

    // Fill in build settings for Vite React app
    try {
      // Build command
      const buildCommandInput = page.locator(
        'input[name*="build"], input[placeholder*="build"], #build-command'
      );
      if (await buildCommandInput.isVisible({ timeout: 3000 })) {
        await buildCommandInput.clear();
        await buildCommandInput.fill("npm run build");
        console.log("✅ Set build command: npm run build");
      }

      // Publish directory
      const publishDirInput = page.locator(
        'input[name*="publish"], input[placeholder*="publish"], #publish-directory'
      );
      if (await publishDirInput.isVisible({ timeout: 3000 })) {
        await publishDirInput.clear();
        await publishDirInput.fill("dist");
        console.log("✅ Set publish directory: dist");
      }
    } catch (e) {
      console.log(
        "⚠️  Could not auto-fill build settings. Please configure manually:"
      );
      console.log("   - Build command: npm run build");
      console.log("   - Publish directory: dist");
      await page.pause();
    }

    // Step 9: Deploy site
    console.log("🚀 Deploying site...");

    const deploySelectors = [
      "text=Deploy site",
      "text=Deploy",
      'button:has-text("Deploy")',
      '[data-testid="deploy"]',
    ];

    let deployClicked = false;
    for (const selector of deploySelectors) {
      try {
        const deployBtn = page.locator(selector).first();
        if (await deployBtn.isVisible({ timeout: 3000 })) {
          await deployBtn.click();
          deployClicked = true;
          console.log("✅ Started deployment");
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (!deployClicked) {
      console.log(
        "⚠️  Could not find deploy button. Please click it manually."
      );
      await page.pause();
    }

    // Step 10: Wait for deployment to complete
    console.log("⏳ Waiting for deployment to complete...");
    console.log("   This may take a few minutes...");

    // Wait for deployment success indicators
    await page.waitForTimeout(5000);

    // Look for success indicators or site URL
    try {
      await page.waitForSelector("text=Published", { timeout: 300000 }); // 5 minutes timeout
      console.log("🎉 Deployment completed successfully!");

      // Try to get the site URL
      const urlSelectors = [
        '[data-testid="site-url"]',
        'a[href*=".netlify.app"]',
        "text=https://",
        ".site-url",
      ];

      for (const selector of urlSelectors) {
        try {
          const urlElement = page.locator(selector).first();
          if (await urlElement.isVisible({ timeout: 2000 })) {
            const siteUrl = await urlElement.textContent();
            console.log(`🌐 Site URL: ${siteUrl}`);
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
    } catch (e) {
      console.log(
        "⚠️  Deployment may still be in progress. Please check the Netlify dashboard."
      );
    }

    console.log("✅ Netlify deployment automation completed!");
    console.log(
      "🎯 Your Project Dreamer Movie app should now be live on Netlify!"
    );
  } catch (error) {
    console.error("❌ Error during deployment:", error.message);
    console.log(
      "💡 The browser will remain open for manual completion if needed."
    );
  }

  // Keep browser open for user to see results
  console.log("🔍 Browser will remain open for you to verify the deployment.");
  console.log("   Close this terminal when you're done to close the browser.");

  // Wait indefinitely until user closes
  await new Promise(() => {});
}

// Run the deployment
deployToNetlify().catch(console.error);
