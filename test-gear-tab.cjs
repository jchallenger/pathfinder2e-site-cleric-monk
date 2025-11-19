const { chromium } = require('playwright');

async function testGearTab() {
  console.log('\n🚀 Testing New GearTab Implementation...\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to app
    console.log('📍 Navigating to http://localhost:5174...');
    await page.goto('http://localhost:5174');
    await page.waitForTimeout(2000);

    // Wait for React to mount
    console.log('⏳ Waiting for React to mount...');
    await page.waitForFunction(() => {
      const root = document.getElementById('root');
      return root && root.children.length > 0;
    }, { timeout: 10000 });
    console.log('   ✓ React mounted');

    // Navigate to Gear tab
    console.log('\n✅ Test 1: Navigate to Gear Tab');
    await page.click('button:has-text("Gear")');
    await page.waitForTimeout(1000);
    console.log('   ✓ Gear tab opened');

    // Check for Equipment Slots section
    console.log('\n✅ Test 2: Verify Equipment Slots Section');
    const slotsHeader = await page.locator('text=Equipment Slots');
    await slotsHeader.waitFor({ timeout: 5000 });
    console.log('   ✓ Equipment Slots section found');

    // Check for weapon slot
    console.log('\n✅ Test 3: Verify Weapon Slot');
    const weaponSlot = await page.locator('text=Weapon');
    await weaponSlot.first().waitFor({ timeout: 5000 });
    console.log('   ✓ Weapon slot found');

    // Check for equipped weapon
    console.log('\n✅ Test 4: Verify Equipped Weapon');
    const handwraps = await page.locator('text=Handwraps of Mighty Blows');
    await handwraps.first().waitFor({ timeout: 5000 });
    console.log('   ✓ Handwraps equipped');

    // Check for armor slot
    console.log('\n✅ Test 5: Verify Armor Slot');
    const armorSlot = await page.locator('text=Armor');
    await armorSlot.first().waitFor({ timeout: 5000 });
    console.log('   ✓ Armor slot found');

    // Check for equipped armor
    console.log('\n✅ Test 6: Verify Equipped Armor');
    const armor = await page.locator('text=Lattice Armor');
    await armor.first().waitFor({ timeout: 5000 });
    console.log('   ✓ Lattice Armor equipped');

    // Check for shield slot
    console.log('\n✅ Test 7: Verify Shield Slot');
    const shieldSlot = await page.locator('text=Shield');
    await shieldSlot.first().waitFor({ timeout: 5000 });
    console.log('   ✓ Shield slot found');

    // Check for equipment bonuses
    console.log('\n✅ Test 8: Verify Active Equipment Bonuses');
    const bonusesHeader = await page.locator('text=Active Equipment Bonuses');
    await bonusesHeader.waitFor({ timeout: 5000 });
    console.log('   ✓ Active Equipment Bonuses section found');

    // Check for Manage Runes button
    console.log('\n✅ Test 9: Check Manage Runes Button');
    const manageRunesButton = await page.locator('button:has-text("Manage Runes")');
    const runeButtonCount = await manageRunesButton.count();
    console.log(`   ✓ Found ${runeButtonCount} Manage Runes buttons`);

    // Try clicking Manage Runes on weapon
    if (runeButtonCount > 0) {
      console.log('\n✅ Test 10: Open Rune Manager');
      await manageRunesButton.first().click();
      await page.waitForTimeout(500);

      const runeManagerHeader = await page.locator('h3:has-text("Manage Runes")');
      await runeManagerHeader.waitFor({ timeout: 5000 });
      console.log('   ✓ Rune Manager opened');

      // Close rune manager
      const closeButton = await page.locator('button:has(svg)').last();
      await closeButton.click();
      await page.waitForTimeout(500);
      console.log('   ✓ Rune Manager closed');
    }

    // Check for Wealth Guidance section
    console.log('\n✅ Test 11: Verify Wealth Guidance');
    const wealthHeader = await page.locator('text=Wealth Guidance');
    await wealthHeader.waitFor({ timeout: 5000 });
    console.log('   ✓ Wealth Guidance section found');

    // Check for Bulk Tracking
    console.log('\n✅ Test 12: Verify Bulk Tracking');
    const bulkHeader = await page.locator('text=Carrying Capacity');
    await bulkHeader.waitFor({ timeout: 5000 });
    console.log('   ✓ Carrying Capacity section found');

    // Take final screenshot
    console.log('\n📸 Taking final screenshot...');
    await page.screenshot({ path: 'gear-tab-test.png', fullPage: true });
    console.log('   ✓ Screenshot saved as gear-tab-test.png');

    console.log('\n✅ ALL TESTS PASSED!\n');
    console.log('🎉 New GearTab is working correctly!\n');

    // Keep browser open for 5 seconds to see results
    console.log('⏸️  Browser will close in 5 seconds...');
    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    await page.screenshot({ path: 'gear-tab-error.png', fullPage: true });
    console.log('📸 Error screenshot saved as gear-tab-error.png');
    throw error;
  } finally {
    await browser.close();
  }
}

testGearTab().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
