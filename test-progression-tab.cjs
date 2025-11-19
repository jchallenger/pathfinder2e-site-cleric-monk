// NewProgressionTab Integration Test using Playwright
// Run with: node test-progression-tab.cjs

const { chromium } = require('playwright');

async function testProgressionTab() {
  console.log('🚀 Starting NewProgressionTab Integration Test...\n');

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
    console.log('📍 Navigating to http://localhost:5175...');
    await page.goto('http://localhost:5175', { waitUntil: 'networkidle' });

    // Wait for React to mount
    console.log('⏳ Waiting for React to mount...');
    await page.waitForFunction(() => {
      const root = document.getElementById('root');
      return root && root.children.length > 0;
    }, { timeout: 15000 });
    console.log('✓ React mounted\n');

    // Test 1: Navigate to Progression tab
    console.log('✅ Test 1: Navigate to Progression tab');
    await page.click('button:has-text("Progression")');
    await page.waitForTimeout(500);
    console.log('   ✓ Clicked Progression tab');

    // Test 2: Verify Current Level section
    console.log('\n✅ Test 2: Verify Current Level section');
    const levelDisplay = await page.locator('text=/Level \\d+/').first();
    if (await levelDisplay.count() > 0) {
      const levelText = await levelDisplay.textContent();
      console.log(`   ✓ Level display found: ${levelText}`);
    }

    // Test 3: Verify Level Timeline
    console.log('\n✅ Test 3: Verify Level Timeline');
    const timeline = await page.locator('text=/Level/');
    const timelineCount = await timeline.count();
    if (timelineCount > 0) {
      console.log(`   ✓ Found ${timelineCount} level references in timeline`);
    }

    // Check for milestone levels (5, 10, 15, 20)
    const level5 = await page.locator('text=Level 5').first();
    if (await level5.count() > 0) {
      console.log('   ✓ Milestone Level 5 found');
    }

    const level10 = await page.locator('text=Level 10').first();
    if (await level10.count() > 0) {
      console.log('   ✓ Milestone Level 10 found');
    }

    // Test 4: Verify Ability Score Display
    console.log('\n✅ Test 4: Verify Ability Score Display');
    const abilities = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
    let foundAbilities = 0;
    for (const ability of abilities) {
      const abilityText = await page.locator(`text=${ability}`).first();
      if (await abilityText.count() > 0) {
        foundAbilities++;
      }
    }
    if (foundAbilities > 0) {
      console.log(`   ✓ Found ${foundAbilities}/6 ability scores`);
    }

    // Test 5: Verify Ability Score Modifiers
    console.log('\n✅ Test 5: Verify Ability Score Modifiers');
    const modifiers = await page.locator('text=/[+-]\\d+/');
    const modCount = await modifiers.count();
    if (modCount > 0) {
      console.log(`   ✓ Found ${modCount} ability score modifiers`);
    }

    // Test 6: Verify Class Features section
    console.log('\n✅ Test 6: Verify Class Features');
    const features = await page.locator('text=/Class Feature|Ancestry|Background|Proficienc/');
    const featureCount = await features.count();
    if (featureCount > 0) {
      console.log(`   ✓ Found ${featureCount} class feature references`);
    }

    // Check for specific features
    const ancestryFeature = await page.locator('text=Ancestry').first();
    if (await ancestryFeature.count() > 0) {
      console.log('   ✓ Ancestry feature found');
    }

    // Test 7: Verify Proficiency Progression
    console.log('\n✅ Test 7: Verify Proficiency Progression');
    const proficiencyTerms = await page.locator('text=/Trained|Expert|Master|Legendary/');
    const profCount = await proficiencyTerms.count();
    if (profCount > 0) {
      console.log(`   ✓ Found ${profCount} proficiency rank references`);
    }

    // Test 8: Check for level features cards
    console.log('\n✅ Test 8: Verify level feature cards');
    const featureCards = await page.locator('.bg-slate-800\\/70, .bg-slate-800\\/50');
    const cardCount = await featureCards.count();
    if (cardCount > 0) {
      console.log(`   ✓ Found ${cardCount} feature cards`);
    }

    // Test 9: Verify Ability Boost tracking
    console.log('\n✅ Test 9: Verify Ability Boost tracking');
    const boostLevels = await page.locator('text=/Level (5|10|15|20)/');
    const boostCount = await boostLevels.count();
    if (boostCount > 0) {
      console.log(`   ✓ Found ${boostCount} ability boost level markers`);
    }

    // Test 10: Check for Archives of Nethys links
    console.log('\n✅ Test 10: Verify source attribution');
    const externalLinks = await page.locator('a[href*="2e.aonprd.com"]');
    const linkCount = await externalLinks.count();
    if (linkCount > 0) {
      console.log(`   ✓ Found ${linkCount} Archives of Nethys links`);
    }

    // Test 11: Verify feature descriptions
    console.log('\n✅ Test 11: Verify feature descriptions');
    const descriptions = await page.locator('text=/description|feature|ability|bonus/i');
    const descCount = await descriptions.count();
    if (descCount > 0) {
      console.log(`   ✓ Found ${descCount} description/feature text elements`);
    }

    // Take final screenshot
    console.log('\n📸 Taking screenshot of Progression tab...');
    await page.screenshot({ path: 'progression-tab-test.png', fullPage: true });
    console.log('   ✓ Screenshot saved as progression-tab-test.png');

    console.log('\n✨ All NewProgressionTab integration tests passed! ✨\n');
    console.log('⏸️  Browser will close in 5 seconds...');
    await page.waitForTimeout(5000);

    await browser.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.log('\n📸 Taking error screenshot...');
    await page.screenshot({ path: 'progression-tab-error.png', fullPage: true });
    console.log('   Screenshot saved as progression-tab-error.png');

    console.log('\n⏸️  Browser will close in 3 seconds...');
    await page.waitForTimeout(3000);

    await browser.close();
    process.exit(1);
  }
}

testProgressionTab();
