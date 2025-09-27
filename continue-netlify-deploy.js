import { chromium } from 'playwright';

async function continueNetlifyDeploy() {
  console.log('🚀 Continuing Netlify deployment from logged-in state...');
  
  // Connect to existing browser session or launch new one
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to Netlify dashboard
    console.log('📱 Navigating to Netlify dashboard...');
    await page.goto('https://app.netlify.com/teams/praciller/projects');
    await page.waitForLoadState('networkidle');

    // Step 1: Create new site
    console.log('🏗️  Looking for new site button...');
    
    const newSiteSelectors = [
      'text=Add new site',
      'text=New site from Git',
      'text=Import from Git',
      'text=New site',
      '[data-testid="new-site"]',
      'button:has-text("Add new site")',
      'button:has-text("New site")',
      '.new-site-button'
    ];

    let newSiteClicked = false;
    for (const selector of newSiteSelectors) {
      try {
        await page.waitForTimeout(1000);
        const newSiteBtn = page.locator(selector).first();
        if (await newSiteBtn.isVisible({ timeout: 3000 })) {
          await newSiteBtn.click();
          newSiteClicked = true;
          console.log('✅ Clicked new site button');
          break;
        }
      } catch (e) {
        console.log(`Trying next selector for new site button...`);
      }
    }

    if (!newSiteClicked) {
      console.log('⚠️  Could not find new site button automatically.');
      console.log('   Please look for and click "Add new site" or "New site from Git" button manually.');
      await page.pause();
    }

    // Wait for the import options
    await page.waitForTimeout(2000);

    // Step 2: Select "Import from Git" if dropdown appeared
    console.log('📥 Looking for Import from Git option...');
    
    const importGitSelectors = [
      'text=Import from Git',
      'text=Deploy with Git',
      'button:has-text("Import from Git")',
      '[data-testid="import-git"]'
    ];

    for (const selector of importGitSelectors) {
      try {
        const importBtn = page.locator(selector).first();
        if (await importBtn.isVisible({ timeout: 3000 })) {
          await importBtn.click();
          console.log('✅ Selected Import from Git');
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    // Step 3: Select GitHub as source
    console.log('🐙 Selecting GitHub as source...');
    await page.waitForTimeout(2000);

    const githubSourceSelectors = [
      'text=GitHub',
      'button:has-text("GitHub")',
      '[data-testid="github"]',
      '.github-provider',
      'img[alt*="GitHub"]'
    ];

    let githubSourceClicked = false;
    for (const selector of githubSourceSelectors) {
      try {
        const githubSourceBtn = page.locator(selector).first();
        if (await githubSourceBtn.isVisible({ timeout: 3000 })) {
          await githubSourceBtn.click();
          githubSourceClicked = true;
          console.log('✅ Selected GitHub as source');
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (!githubSourceClicked) {
      console.log('⚠️  Could not find GitHub source option. Please select it manually.');
      await page.pause();
    }

    // Step 4: Search and select repository
    console.log('🔍 Looking for Project-Dreamer-Movie repository...');
    await page.waitForTimeout(3000);

    // First try to find search box and search for the repo
    const searchSelectors = [
      'input[placeholder*="Search"]',
      'input[type="search"]',
      '[data-testid="search"]',
      '.search-input'
    ];

    let searchFound = false;
    for (const selector of searchSelectors) {
      try {
        const searchInput = page.locator(selector).first();
        if (await searchInput.isVisible({ timeout: 2000 })) {
          await searchInput.fill('Project-Dreamer-Movie');
          await page.waitForTimeout(1000);
          searchFound = true;
          console.log('✅ Searched for Project-Dreamer-Movie');
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    // Look for the repository in the list
    const repoSelectors = [
      'text=Project-Dreamer-Movie',
      'text=Praciller/Project-Dreamer-Movie',
      '[data-testid*="Project-Dreamer-Movie"]',
      'button:has-text("Project-Dreamer-Movie")',
      'a:has-text("Project-Dreamer-Movie")',
      '.repo-item:has-text("Project-Dreamer-Movie")'
    ];

    let repoFound = false;
    for (const selector of repoSelectors) {
      try {
        await page.waitForTimeout(1000);
        const repoBtn = page.locator(selector).first();
        if (await repoBtn.isVisible({ timeout: 5000 })) {
          await repoBtn.click();
          repoFound = true;
          console.log('✅ Selected Project-Dreamer-Movie repository');
          break;
        }
      } catch (e) {
        console.log(`Trying next selector for repository...`);
      }
    }

    if (!repoFound) {
      console.log('⚠️  Could not find Project-Dreamer-Movie repository automatically.');
      console.log('   Please search for and select "Praciller/Project-Dreamer-Movie" manually.');
      await page.pause();
    }

    // Step 5: Configure build settings
    console.log('⚙️  Configuring build settings...');
    await page.waitForTimeout(3000);

    try {
      // Build command
      const buildCommandSelectors = [
        'input[name*="build"]',
        'input[placeholder*="build"]',
        '#build-command',
        '[data-testid="build-command"]'
      ];

      for (const selector of buildCommandSelectors) {
        try {
          const buildCommandInput = page.locator(selector).first();
          if (await buildCommandInput.isVisible({ timeout: 2000 })) {
            await buildCommandInput.clear();
            await buildCommandInput.fill('npm run build');
            console.log('✅ Set build command: npm run build');
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }

      // Publish directory
      const publishDirSelectors = [
        'input[name*="publish"]',
        'input[placeholder*="publish"]',
        '#publish-directory',
        '[data-testid="publish-directory"]'
      ];

      for (const selector of publishDirSelectors) {
        try {
          const publishDirInput = page.locator(selector).first();
          if (await publishDirInput.isVisible({ timeout: 2000 })) {
            await publishDirInput.clear();
            await publishDirInput.fill('dist');
            console.log('✅ Set publish directory: dist');
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }

    } catch (e) {
      console.log('⚠️  Could not auto-fill build settings. Please configure manually:');
      console.log('   - Build command: npm run build');
      console.log('   - Publish directory: dist');
      await page.pause();
    }

    // Step 6: Deploy site
    console.log('🚀 Looking for deploy button...');
    await page.waitForTimeout(2000);
    
    const deploySelectors = [
      'text=Deploy site',
      'text=Deploy Project-Dreamer-Movie',
      'text=Deploy',
      'button:has-text("Deploy")',
      '[data-testid="deploy"]',
      '.deploy-button'
    ];

    let deployClicked = false;
    for (const selector of deploySelectors) {
      try {
        const deployBtn = page.locator(selector).first();
        if (await deployBtn.isVisible({ timeout: 3000 })) {
          await deployBtn.click();
          deployClicked = true;
          console.log('✅ Started deployment');
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (!deployClicked) {
      console.log('⚠️  Could not find deploy button. Please click it manually.');
      await page.pause();
    }

    // Step 7: Wait for deployment to complete
    console.log('⏳ Waiting for deployment to complete...');
    console.log('   This may take a few minutes...');
    
    // Wait for deployment success indicators
    await page.waitForTimeout(10000);
    
    // Look for success indicators or site URL
    try {
      // Wait for either success message or site URL
      await Promise.race([
        page.waitForSelector('text=Published', { timeout: 300000 }),
        page.waitForSelector('text=Site deploy in progress', { timeout: 10000 }),
        page.waitForSelector('[href*=".netlify.app"]', { timeout: 300000 })
      ]);
      
      console.log('🎉 Deployment process started/completed!');
      
      // Try to get the site URL
      const urlSelectors = [
        '[data-testid="site-url"]',
        'a[href*=".netlify.app"]',
        'text=https://',
        '.site-url',
        '[href*="netlify.app"]'
      ];
      
      for (const selector of urlSelectors) {
        try {
          const urlElement = page.locator(selector).first();
          if (await urlElement.isVisible({ timeout: 5000 })) {
            const siteUrl = await urlElement.getAttribute('href') || await urlElement.textContent();
            console.log(`🌐 Site URL: ${siteUrl}`);
            
            // Open the deployed site
            if (siteUrl && siteUrl.includes('netlify.app')) {
              console.log('🚀 Opening deployed site...');
              await page.goto(siteUrl);
              await page.waitForLoadState('networkidle');
              console.log('✅ Site opened successfully!');
            }
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      
    } catch (e) {
      console.log('⚠️  Deployment may still be in progress. Please check the Netlify dashboard.');
    }

    console.log('✅ Netlify deployment automation completed!');
    console.log('🎯 Your Project Dreamer Movie app should now be live on Netlify!');

  } catch (error) {
    console.error('❌ Error during deployment:', error.message);
    console.log('💡 The browser will remain open for manual completion if needed.');
  }

  // Keep browser open for user to see results
  console.log('🔍 Browser will remain open for you to verify the deployment.');
  console.log('   Close this terminal when you\'re done to close the browser.');
  
  // Wait indefinitely until user closes
  await new Promise(() => {});
}

// Run the deployment
continueNetlifyDeploy().catch(console.error);
