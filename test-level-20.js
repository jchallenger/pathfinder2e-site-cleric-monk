// Level 20 Verification Test
// This script verifies that the level 20 character stats match the Pathbuilder export

import { chromium } from 'playwright';

async function verifyLevel20() {
  console.log('\n🚀 Starting Level 20 Verification Test...\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to the application
    console.log('📍 Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    // Wait for React to mount
    await page.waitForFunction(() => {
      const root = document.getElementById('root');
      return root && root.children.length > 0;
    }, { timeout: 5000 });

    console.log('✓ React mounted\n');

    // Set level to 20
    console.log('⚙️ Setting character level to 20...');

    // Click Level + button multiple times to reach 20
    for (let i = 0; i < 19; i++) {
      await page.click('button:has-text("Level +")');
      await page.waitForTimeout(100);
    }

    // Verify level is 20
    const levelDisplay = await page.locator('text=/Level 20/');
    await levelDisplay.waitFor({ timeout: 5000 });
    console.log('✓ Character level set to 20\n');

    // Navigate to Combat tab
    await page.click('button:has-text("Combat")');
    await page.waitForTimeout(500);

    console.log('📊 Verifying Level 20 Stats:\n');

    // Expected values from Pathbuilder export
    const expected = {
      hp: 208,
      ac: 40,
      attackBonus: 29,
      fortitude: 27,
      reflex: 24,
      will: 26,
      spellDC: 36,
      spellAttack: 26
    };

    // Get page content for verification
    const bodyText = await page.textContent('body');

    // Check HP
    const hpMatch = bodyText.match(/(\d+)\s*\/\s*(\d+)/);
    if (hpMatch) {
      const maxHP = parseInt(hpMatch[2]);
      console.log(`HP: ${maxHP} (expected ${expected.hp}) ${maxHP === expected.hp ? '✅' : '❌'}`);
    } else {
      console.log('HP: ❌ Could not find HP value');
    }

    // Check AC
    const acMatch = bodyText.match(/Armor Class\s*(\d+)/i) || bodyText.match(/AC\s*(\d+)/);
    if (acMatch) {
      const ac = parseInt(acMatch[1]);
      console.log(`AC: ${ac} (expected ${expected.ac}) ${ac === expected.ac ? '✅' : '❌'}`);
    } else {
      console.log('AC: ❌ Could not find AC value');
    }

    // Check Attack Bonus
    const attackMatch = bodyText.match(/Fist Strike[^+]*\+(\d+)/i);
    if (attackMatch) {
      const attack = parseInt(attackMatch[1]);
      console.log(`Attack Bonus: +${attack} (expected +${expected.attackBonus}) ${attack === expected.attackBonus ? '✅' : '❌'}`);
    } else {
      console.log('Attack Bonus: ❌ Could not find attack value');
    }

    // Check Fortitude
    const fortMatch = bodyText.match(/Fortitude[^+]*\+(\d+)/i) || bodyText.match(/Fort[^+]*\+(\d+)/i);
    if (fortMatch) {
      const fort = parseInt(fortMatch[1]);
      console.log(`Fortitude: +${fort} (expected +${expected.fortitude}) ${fort === expected.fortitude ? '✅' : '❌'}`);
    } else {
      console.log('Fortitude: ❌ Could not find Fortitude value');
    }

    // Check Reflex
    const reflexMatch = bodyText.match(/Reflex[^+]*\+(\d+)/i) || bodyText.match(/Ref[^+]*\+(\d+)/i);
    if (reflexMatch) {
      const reflex = parseInt(reflexMatch[1]);
      console.log(`Reflex: +${reflex} (expected +${expected.reflex}) ${reflex === expected.reflex ? '✅' : '❌'}`);
    } else {
      console.log('Reflex: ❌ Could not find Reflex value');
    }

    // Check Will
    const willMatch = bodyText.match(/Will[^+]*\+(\d+)/i);
    if (willMatch) {
      const will = parseInt(willMatch[1]);
      console.log(`Will: +${will} (expected +${expected.will}) ${will === expected.will ? '✅' : '❌'}`);
    } else {
      console.log('Will: ❌ Could not find Will value');
    }

    // Check Spell DC
    const spellDCMatch = bodyText.match(/Spell DC (\d+)/i);
    if (spellDCMatch) {
      const spellDC = parseInt(spellDCMatch[1]);
      console.log(`Spell DC: ${spellDC} (expected ${expected.spellDC}) ${spellDC === expected.spellDC ? '✅' : '❌'}`);
    } else {
      console.log('Spell DC: ❌ Could not find Spell DC value');
    }

    // Check Spell Attack
    const spellAttackMatch = bodyText.match(/Spell Attack \+(\d+)/i);
    if (spellAttackMatch) {
      const spellAttack = parseInt(spellAttackMatch[1]);
      console.log(`Spell Attack: +${spellAttack} (expected +${expected.spellAttack}) ${spellAttack === expected.spellAttack ? '✅' : '❌'}`);
    } else {
      console.log('Spell Attack: ❌ Could not find Spell Attack value');
    }

    // Navigate to Progression tab to verify feats
    console.log('\n📜 Verifying Feat Display...');
    await page.click('button:has-text("Progression")');
    await page.waitForTimeout(500);

    const progressionText = await page.textContent('body');

    // Check for some key feats
    const keyFeats = [
      'Shield Block',
      'Deadly Simplicity',
      'Monk Dedication',
      'Ki Strike',
      'Incredible Initiative',
      'Deity\'s Domain',
      'Replenishment of War'
    ];

    console.log('\nKey Feats:');
    for (const feat of keyFeats) {
      const found = progressionText.includes(feat);
      console.log(`  ${feat}: ${found ? '✅' : '❌'}`);
    }

    // Take screenshot
    console.log('\n📸 Taking level 20 screenshot...');
    await page.screenshot({ path: 'screenshot-level-20.png', fullPage: true });
    console.log('✓ Screenshot saved as screenshot-level-20.png');

    console.log('\n✨ Verification complete! Browser will remain open for manual inspection.');
    console.log('Press Ctrl+C to close.');

    // Keep browser open for manual verification
    await new Promise(() => {});

  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    await page.screenshot({ path: 'error-level-20.png' });
    await browser.close();
    process.exit(1);
  }
}

verifyLevel20();
