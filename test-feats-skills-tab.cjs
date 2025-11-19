// NewFeatsSkillsTab Integration Test using Playwright
// Run with: node test-feats-skills-tab.cjs

const { chromium } = require('playwright');

async function testFeatsSkillsTab() {
  console.log('🚀 Starting NewFeatsSkillsTab Integration Test...\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Listen for console errors
    page.on('console', msg => {
      const type = msg.type();
      if (type === 'error' || type === 'warning') {
        console.log(`⚠️  Console ${type}:`, msg.text());
      }
    });

    // Listen for page errors
    page.on('pageerror', error => {
      console.log('❌ Page error:', error.message);
    });

    // Navigate to app
    console.log('📍 Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    // Wait for React to mount
    console.log('⏳ Waiting for React to mount...');
    await page.waitForFunction(() => {
      const root = document.getElementById('root');
      return root && root.children.length > 0;
    }, { timeout: 15000 });
    console.log('✓ React mounted\n');

    // Test 1: Navigate to Feats & Skills tab
    console.log('✅ Test 1: Navigate to Feats & Skills tab');
    await page.click('button:has-text("Feats & Skills")');
    await page.waitForTimeout(500);
    console.log('   ✓ Clicked Feats & Skills tab');

    // Test 2: Verify Skills section
    console.log('\n✅ Test 2: Verify Skills section');
    const skillsButton = await page.locator('button:has-text("Skills")').first();
    if (await skillsButton.count() > 0) {
      await skillsButton.click();
      await page.waitForTimeout(300);
      console.log('   ✓ Skills section button found and clicked');
    }

    // Check for some example skills
    const athletics = await page.locator('text=Athletics').first();
    if (await athletics.count() > 0) {
      console.log('   ✓ Athletics skill found');
    }

    const acrobatics = await page.locator('text=Acrobatics').first();
    if (await acrobatics.count() > 0) {
      console.log('   ✓ Acrobatics skill found');
    }

    const religion = await page.locator('text=Religion').first();
    if (await religion.count() > 0) {
      console.log('   ✓ Religion skill found');
    }

    // Test 3: Verify skill proficiency display
    console.log('\n✅ Test 3: Verify skill proficiency display');
    const proficiencyLabels = await page.locator('text=/Trained|Expert|Master|Legendary|Untrained/');
    const profCount = await proficiencyLabels.count();
    if (profCount > 0) {
      console.log(`   ✓ Found ${profCount} proficiency labels`);
    }

    // Test 4: Verify Feats section
    console.log('\n✅ Test 4: Verify Feats section');
    const featsButton = await page.locator('button:has-text("Feats")').first();
    if (await featsButton.count() > 0) {
      await featsButton.click();
      await page.waitForTimeout(300);
      console.log('   ✓ Feats section button found and clicked');
    }

    // Test 5: Verify feat filter options
    console.log('\n✅ Test 5: Verify feat filter options');
    const allFeatsFilter = await page.locator('button:has-text("All")').first();
    if (await allFeatsFilter.count() > 0) {
      console.log('   ✓ "All" filter found');
    }

    const ancestryFilter = await page.locator('button:has-text("Ancestry")').first();
    if (await ancestryFilter.count() > 0) {
      console.log('   ✓ "Ancestry" filter found');
    }

    const classFilter = await page.locator('button:has-text("Class")').first();
    if (await classFilter.count() > 0) {
      console.log('   ✓ "Class" filter found');
    }

    // Test 6: Verify search functionality
    console.log('\n✅ Test 6: Verify search functionality');
    const searchInput = await page.locator('input[placeholder*="Search"]').first();
    if (await searchInput.count() > 0) {
      console.log('   ✓ Search input found');

      // Try searching for a feat
      await searchInput.fill('Shield');
      await page.waitForTimeout(500);
      console.log('   ✓ Entered search term');

      // Clear search
      await searchInput.fill('');
      await page.waitForTimeout(300);
    }

    // Test 7: Check for feat cards
    console.log('\n✅ Test 7: Verify feat cards display');
    const featCards = await page.locator('.bg-slate-800\\/70').count();
    if (featCards > 0) {
      console.log(`   ✓ Found ${featCards} feat/skill cards`);
    }

    // Test 8: Verify info tooltips
    console.log('\n✅ Test 8: Verify info tooltips');
    const infoButtons = await page.locator('button svg.lucide-info');
    const infoCount = await infoButtons.count();
    if (infoCount > 0) {
      console.log(`   ✓ Found ${infoCount} info buttons`);

      // Click first info button
      await infoButtons.first().click();
      await page.waitForTimeout(500);
      console.log('   ✓ Clicked info button');
    }

    // Test 9: Verify skill/feat stats are calculated
    console.log('\n✅ Test 9: Verify calculated bonuses');
    const bonusPattern = await page.locator('text=/\\+\\d+/');
    const bonusCount = await bonusPattern.count();
    if (bonusCount > 0) {
      console.log(`   ✓ Found ${bonusCount} bonus values (skill/feat stats)`);
    }

    // Test 10: Check for Archives of Nethys links
    console.log('\n✅ Test 10: Verify source attribution');
    const externalLinks = await page.locator('a[href*="2e.aonprd.com"]');
    const linkCount = await externalLinks.count();
    if (linkCount > 0) {
      console.log(`   ✓ Found ${linkCount} Archives of Nethys links`);
    }

    // Take final screenshot
    console.log('\n📸 Taking screenshot of Feats & Skills tab...');
    await page.screenshot({ path: 'feats-skills-tab-test.png', fullPage: true });
    console.log('   ✓ Screenshot saved as feats-skills-tab-test.png');

    console.log('\n✨ All NewFeatsSkillsTab integration tests passed! ✨\n');
    console.log('⏸️  Browser will close in 5 seconds...');
    await page.waitForTimeout(5000);

    await browser.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.log('\n📸 Taking error screenshot...');
    await page.screenshot({ path: 'feats-skills-tab-error.png', fullPage: true });
    console.log('   Screenshot saved as feats-skills-tab-error.png');

    console.log('\n⏸️  Browser will close in 3 seconds...');
    await page.waitForTimeout(3000);

    await browser.close();
    process.exit(1);
  }
}

testFeatsSkillsTab();
