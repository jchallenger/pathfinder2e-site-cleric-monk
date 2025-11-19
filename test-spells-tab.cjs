// NewSpellsTab Integration Test using Playwright
// Run with: node test-spells-tab.cjs

const { chromium } = require('playwright');

async function testSpellsTab() {
  console.log('🚀 Starting NewSpellsTab Integration Test...\n');

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
    console.log('📍 Navigating to http://localhost:5174...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });

    // Wait for React to mount
    console.log('⏳ Waiting for React to mount...');
    await page.waitForFunction(() => {
      const root = document.getElementById('root');
      return root && root.children.length > 0;
    }, { timeout: 15000 });
    console.log('✓ React mounted\n');

    // Test 1: Navigate to Spells tab
    console.log('✅ Test 1: Navigate to Spells tab');
    await page.click('button:has-text("Spells")');
    await page.waitForTimeout(500);
    console.log('   ✓ Clicked Spells tab');

    // Test 2: Verify Spell DC and Attack are visible
    console.log('\n✅ Test 2: Verify Spell DC and Attack stats');
    const spellDC = await page.locator('text=Spell DC').first();
    await spellDC.waitFor({ timeout: 5000 });
    console.log('   ✓ Spell DC found');

    const spellAttack = await page.locator('text=Spell Attack').first();
    await spellAttack.waitFor({ timeout: 5000 });
    console.log('   ✓ Spell Attack found');

    // Test 3: Verify Divine Font section
    console.log('\n✅ Test 3: Verify Divine Font section');
    const divineFont = await page.locator('text=Divine Font').first();
    await divineFont.waitFor({ timeout: 5000 });
    console.log('   ✓ Divine Font section found');

    const healButton = await page.locator('button:has-text("Heal")').first();
    await healButton.waitFor({ timeout: 5000 });
    console.log('   ✓ Heal option found');

    const harmButton = await page.locator('button:has-text("Harm")').first();
    await harmButton.waitFor({ timeout: 5000 });
    console.log('   ✓ Harm option found');

    // Test 4: Verify Cantrips section
    console.log('\n✅ Test 4: Verify Cantrips section');
    const cantripsHeader = await page.locator('text=Cantrips').first();
    await cantripsHeader.waitFor({ timeout: 5000 });
    console.log('   ✓ Cantrips section found');

    // Check for some example cantrips
    const divineLance = await page.locator('text=Divine Lance').first();
    if (await divineLance.count() > 0) {
      console.log('   ✓ Divine Lance cantrip found');
    }

    const shield = await page.locator('text=Shield').first();
    if (await shield.count() > 0) {
      console.log('   ✓ Shield cantrip found');
    }

    // Test 5: Verify Rank 1 Spells
    console.log('\n✅ Test 5: Verify Rank 1 Spells section');
    const rank1Header = await page.locator('text=Rank 1').first();
    await rank1Header.waitFor({ timeout: 5000 });
    console.log('   ✓ Rank 1 section found');

    // Test 6: Verify Rest button
    console.log('\n✅ Test 6: Verify Rest button');
    const restButton = await page.locator('button:has-text("Rest")').first();
    await restButton.waitFor({ timeout: 5000 });
    console.log('   ✓ Rest button found');

    // Test 7: Verify Search functionality
    console.log('\n✅ Test 7: Verify Search functionality');
    const searchInput = await page.locator('input[placeholder*="Search"]').first();
    await searchInput.waitFor({ timeout: 5000 });
    console.log('   ✓ Search input found');

    // Test 8: Test spell preparation (if applicable)
    console.log('\n✅ Test 8: Test spell interaction');
    const prepareButtons = await page.locator('button:has-text("Prepare")');
    const prepareCount = await prepareButtons.count();
    if (prepareCount > 0) {
      console.log(`   ✓ Found ${prepareCount} "Prepare" buttons for spells`);

      // Click first prepare button
      await prepareButtons.first().click();
      await page.waitForTimeout(500);
      console.log('   ✓ Successfully clicked Prepare button');

      // Check if it changed to "Prepared"
      const preparedButton = await page.locator('button:has-text("Prepared")').first();
      if (await preparedButton.count() > 0) {
        console.log('   ✓ Spell preparation state updated correctly');
      }
    } else {
      console.log('   ⚠️  No Prepare buttons found (might be all cantrips visible)');
    }

    // Test 9: Check for spell details modal (Info button)
    console.log('\n✅ Test 9: Verify spell info tooltips');
    const infoButtons = await page.locator('button svg.lucide-info');
    const infoCount = await infoButtons.count();
    if (infoCount > 0) {
      console.log(`   ✓ Found ${infoCount} info buttons for spell details`);

      // Click first info button to open modal
      await infoButtons.first().click();
      await page.waitForTimeout(500);

      // Check if modal opened
      const modal = await page.locator('text=Description');
      if (await modal.count() > 0) {
        console.log('   ✓ Spell details modal opened successfully');

        // Close modal
        const closeButton = await page.locator('button svg.lucide-x').first();
        if (await closeButton.count() > 0) {
          await closeButton.click();
          await page.waitForTimeout(300);
          console.log('   ✓ Modal closed successfully');
        }
      }
    }

    // Take final screenshot
    console.log('\n📸 Taking screenshot of Spells tab...');
    await page.screenshot({ path: 'spells-tab-test.png', fullPage: true });
    console.log('   ✓ Screenshot saved as spells-tab-test.png');

    console.log('\n✨ All NewSpellsTab integration tests passed! ✨\n');
    console.log('⏸️  Browser will close in 5 seconds...');
    await page.waitForTimeout(5000);

    await browser.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.log('\n📸 Taking error screenshot...');
    await page.screenshot({ path: 'spells-tab-error.png', fullPage: true });
    console.log('   Screenshot saved as spells-tab-error.png');

    console.log('\n⏸️  Browser will close in 3 seconds...');
    await page.waitForTimeout(3000);

    await browser.close();
    process.exit(1);
  }
}

testSpellsTab();
