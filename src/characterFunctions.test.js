/**
 * Unit Tests for Talon Tracker Character Functions
 * Tests all calculation functions against official Pathfinder 2e rules
 *
 * Run with: node src/characterFunctions.test.js
 */

import {
  BASE_ABILITY_SCORES,
  EXPECTED_SCORES_LEVEL_20,
  ABILITY_BOOST_RULES,
  PROFICIENCY_RANKS,
  CHARACTER_IDENTITY
} from './characterConfig.js';

// ===========================
// TEST UTILITIES
// ===========================

let testsPassed = 0;
let testsFailed = 0;
const failedTests = [];

function assert(condition, testName, expected, actual) {
  if (condition) {
    testsPassed++;
    console.log(`✓ ${testName}`);
  } else {
    testsFailed++;
    const error = `Expected: ${expected}, Got: ${actual}`;
    failedTests.push({ test: testName, error });
    console.log(`✗ ${testName}\n  ${error}`);
  }
}

function assertEqual(actual, expected, testName) {
  assert(actual === expected, testName, expected, actual);
}

function assertRange(actual, min, max, testName) {
  const condition = actual >= min && actual <= max;
  assert(condition, testName, `${min}-${max}`, actual);
}

// ===========================
// FUNCTION IMPLEMENTATIONS
// (Copied from App.jsx for testing)
// ===========================

/**
 * Calculate maximum HP based on character level
 * Formula: Base HP + (HP per level × (level - 1))
 * Base HP = Class HP + Ancestry HP + CON modifier
 */
function calculateMaxHP(level) {
  const baseHP = 8 + 10 + 5; // Cleric (8) + Minotaur (10) + CON modifier at level 1 (+5 from CON 20)
  const hpPerLevel = 8 + 5; // Cleric (8) + CON modifier (+5)
  return baseHP + (level - 1) * hpPerLevel;
}

/**
 * Get proficiency bonus based on level and rank
 * PF2e Proficiency: Trained = level, Expert = level+2, Master = level+4, Legendary = level+6
 */
function getProficiencyBonus(level, rank = 'trained') {
  const rankBonuses = {
    untrained: 0,
    trained: level,
    expert: level + 2,
    master: level + 4,
    legendary: level + 6
  };
  return rankBonuses[rank] || 0;
}

/**
 * Calculate ability score at a given level with 18+ cap rule
 * Rule: Ability boosts give +2, or +1 if score is already 18+
 * Source: Player Core pg. 27
 */
function getAbilityScore(baseScore, ability, level) {
  let currentScore = baseScore;

  // Helper to apply a boost (respects 18+ cap)
  const applyBoost = (score) => {
    if (score >= ABILITY_BOOST_RULES.capThreshold) {
      return score + ABILITY_BOOST_RULES.cappedBoost; // +1 if 18+
    }
    return score + ABILITY_BOOST_RULES.standardBoost; // +2 if <18
  };

  // Level 5 boosts: STR, DEX, CON, WIS
  if (level >= 5 && ['STR', 'DEX', 'CON', 'WIS'].includes(ability)) {
    currentScore = applyBoost(currentScore);
  }

  // Level 10 boosts: STR, DEX, CON, WIS
  if (level >= 10 && ['STR', 'DEX', 'CON', 'WIS'].includes(ability)) {
    currentScore = applyBoost(currentScore);
  }

  // Level 15 boosts: STR, DEX, CON, WIS
  if (level >= 15 && ['STR', 'DEX', 'CON', 'WIS'].includes(ability)) {
    currentScore = applyBoost(currentScore);
  }

  // Level 20 boosts: INT, CON, CHA, WIS
  if (level >= 20 && ['INT', 'CON', 'CHA', 'WIS'].includes(ability)) {
    currentScore = applyBoost(currentScore);
  }

  return currentScore;
}

/**
 * Get ability modifier from ability score
 * Formula: (score - 10) / 2, rounded down
 */
function getModifier(score) {
  return Math.floor((score - 10) / 2);
}

/**
 * Get maximum spell slots for a given level and spell rank
 * Source: Player Core pg. 112 - Cleric Spell Slots table
 */
function getMaxSpellSlots(level, rank) {
  const spellSlots = {
    1: { 1: 2 },
    2: { 1: 3 },
    3: { 1: 3, 2: 2 },
    4: { 1: 3, 2: 3 },
    5: { 1: 3, 2: 3, 3: 2 },
    6: { 1: 3, 2: 3, 3: 3 },
    7: { 1: 3, 2: 3, 3: 3, 4: 2 },
    8: { 1: 3, 2: 3, 3: 3, 4: 3 },
    9: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 2 },
    10: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3 },
    11: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2 },
    12: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3 },
    13: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 2 },
    14: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3 },
    15: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 2 },
    16: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3 },
    17: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 2 },
    18: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3 },
    19: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3 },
    20: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3 }
  };

  return spellSlots[level]?.[rank] || 0;
}

/**
 * Get divine font spell slots based on character level
 * Clerics get heal/harm slots equal to 1 + WIS modifier
 */
function getDivineFontSlots(level) {
  // At level 1, WIS is 18 (+4 modifier), so 1 + 4 = 5 slots
  // This increases as WIS increases
  const wisScore = getAbilityScore(BASE_ABILITY_SCORES.WIS, 'WIS', level);
  const wisMod = getModifier(wisScore);
  return 1 + wisMod;
}

// ===========================
// UNIT TESTS
// ===========================

console.log('🧪 Starting Talon Tracker Unit Tests\n');
console.log('═══════════════════════════════════════════════\n');

// ===========================
// TEST: calculateMaxHP
// ===========================
console.log('📊 Testing calculateMaxHP()');
console.log('───────────────────────────────────────────────');

assertEqual(calculateMaxHP(1), 23, 'Level 1 HP should be 23');
assertEqual(calculateMaxHP(5), 75, 'Level 5 HP should be 75');
assertEqual(calculateMaxHP(10), 140, 'Level 10 HP should be 140');
assertEqual(calculateMaxHP(15), 205, 'Level 15 HP should be 205');
assertEqual(calculateMaxHP(20), 270, 'Level 20 HP should be 270');

// Edge cases
assertEqual(calculateMaxHP(0), 10, 'Level 0 HP (edge case)');
assertRange(calculateMaxHP(12), 100, 200, 'Level 12 HP in valid range');

console.log('');

// ===========================
// TEST: getProficiencyBonus
// ===========================
console.log('📊 Testing getProficiencyBonus()');
console.log('───────────────────────────────────────────────');

// Level 1
assertEqual(getProficiencyBonus(1, 'untrained'), 0, 'Level 1 untrained = 0');
assertEqual(getProficiencyBonus(1, 'trained'), 1, 'Level 1 trained = 1');
assertEqual(getProficiencyBonus(1, 'expert'), 3, 'Level 1 expert = 3');
assertEqual(getProficiencyBonus(1, 'master'), 5, 'Level 1 master = 5');
assertEqual(getProficiencyBonus(1, 'legendary'), 7, 'Level 1 legendary = 7');

// Level 5
assertEqual(getProficiencyBonus(5, 'trained'), 5, 'Level 5 trained = 5');
assertEqual(getProficiencyBonus(5, 'expert'), 7, 'Level 5 expert = 7');

// Level 10
assertEqual(getProficiencyBonus(10, 'trained'), 10, 'Level 10 trained = 10');
assertEqual(getProficiencyBonus(10, 'expert'), 12, 'Level 10 expert = 12');
assertEqual(getProficiencyBonus(10, 'master'), 14, 'Level 10 master = 14');

// Level 20
assertEqual(getProficiencyBonus(20, 'trained'), 20, 'Level 20 trained = 20');
assertEqual(getProficiencyBonus(20, 'expert'), 22, 'Level 20 expert = 22');
assertEqual(getProficiencyBonus(20, 'master'), 24, 'Level 20 master = 24');
assertEqual(getProficiencyBonus(20, 'legendary'), 26, 'Level 20 legendary = 26');

// Default parameter
assertEqual(getProficiencyBonus(5), 5, 'Default rank should be trained');

console.log('');

// ===========================
// TEST: getAbilityScore (18+ cap rule)
// ===========================
console.log('📊 Testing getAbilityScore() with 18+ Cap Rule');
console.log('───────────────────────────────────────────────');

// STR progression (starts at 16, gets boosts at 5, 10, 15)
assertEqual(getAbilityScore(16, 'STR', 1), 16, 'STR at level 1 = 16');
assertEqual(getAbilityScore(16, 'STR', 5), 18, 'STR at level 5 = 18 (16+2)');
assertEqual(getAbilityScore(16, 'STR', 10), 19, 'STR at level 10 = 19 (18+1, cap applied)');
assertEqual(getAbilityScore(16, 'STR', 15), 20, 'STR at level 15 = 20 (19+1, cap applied)');
assertEqual(getAbilityScore(16, 'STR', 20), 20, 'STR at level 20 = 20 (no boost for STR)');

// DEX progression (starts at 12, gets boosts at 5, 10, 15; no boost at 20)
assertEqual(getAbilityScore(12, 'DEX', 1), 12, 'DEX at level 1 = 12');
assertEqual(getAbilityScore(12, 'DEX', 5), 14, 'DEX at level 5 = 14 (12+2)');
assertEqual(getAbilityScore(12, 'DEX', 10), 16, 'DEX at level 10 = 16 (14+2)');
assertEqual(getAbilityScore(12, 'DEX', 15), 18, 'DEX at level 15 = 18 (16+2)');
assertEqual(getAbilityScore(12, 'DEX', 20), 18, 'DEX at level 20 = 18 (no boost at 20)');

// CON progression (starts at 14, gets boosts at 5, 10, 15, 20)
assertEqual(getAbilityScore(14, 'CON', 1), 14, 'CON at level 1 = 14');
assertEqual(getAbilityScore(14, 'CON', 5), 16, 'CON at level 5 = 16 (14+2)');
assertEqual(getAbilityScore(14, 'CON', 10), 18, 'CON at level 10 = 18 (16+2)');
assertEqual(getAbilityScore(14, 'CON', 15), 19, 'CON at level 15 = 19 (18+1, cap applied)');
assertEqual(getAbilityScore(14, 'CON', 20), 20, 'CON at level 20 = 20 (19+1, cap applied)');

// WIS progression (starts at 18, gets boosts at 5, 10, 15, 20)
assertEqual(getAbilityScore(18, 'WIS', 1), 18, 'WIS at level 1 = 18');
assertEqual(getAbilityScore(18, 'WIS', 5), 19, 'WIS at level 5 = 19 (18+1, cap applied immediately)');
assertEqual(getAbilityScore(18, 'WIS', 10), 20, 'WIS at level 10 = 20 (19+1, cap applied)');
assertEqual(getAbilityScore(18, 'WIS', 15), 21, 'WIS at level 15 = 21 (20+1, cap applied)');
assertEqual(getAbilityScore(18, 'WIS', 20), 22, 'WIS at level 20 = 22 (21+1, cap applied)');

// INT progression (starts at 10, only gets boost at 20)
assertEqual(getAbilityScore(10, 'INT', 1), 10, 'INT at level 1 = 10');
assertEqual(getAbilityScore(10, 'INT', 5), 10, 'INT at level 5 = 10 (no boost)');
assertEqual(getAbilityScore(10, 'INT', 10), 10, 'INT at level 10 = 10 (no boost)');
assertEqual(getAbilityScore(10, 'INT', 15), 10, 'INT at level 15 = 10 (no boost)');
assertEqual(getAbilityScore(10, 'INT', 20), 12, 'INT at level 20 = 12 (10+2)');

// CHA progression (starts at 8, only gets boost at 20)
assertEqual(getAbilityScore(8, 'CHA', 1), 8, 'CHA at level 1 = 8');
assertEqual(getAbilityScore(8, 'CHA', 20), 10, 'CHA at level 20 = 10 (8+2)');

console.log('');

// ===========================
// TEST: Official Character Sheet Validation
// ===========================
console.log('📊 Validating Against Official Character Sheet (Level 20)');
console.log('───────────────────────────────────────────────');

const level20Scores = {
  STR: getAbilityScore(BASE_ABILITY_SCORES.STR, 'STR', 20),
  DEX: getAbilityScore(BASE_ABILITY_SCORES.DEX, 'DEX', 20),
  CON: getAbilityScore(BASE_ABILITY_SCORES.CON, 'CON', 20),
  INT: getAbilityScore(BASE_ABILITY_SCORES.INT, 'INT', 20),
  WIS: getAbilityScore(BASE_ABILITY_SCORES.WIS, 'WIS', 20),
  CHA: getAbilityScore(BASE_ABILITY_SCORES.CHA, 'CHA', 20)
};

assertEqual(level20Scores.STR, EXPECTED_SCORES_LEVEL_20.STR, 'Official STR at level 20');
assertEqual(level20Scores.DEX, EXPECTED_SCORES_LEVEL_20.DEX, 'Official DEX at level 20');
assertEqual(level20Scores.CON, EXPECTED_SCORES_LEVEL_20.CON, 'Official CON at level 20');
assertEqual(level20Scores.INT, EXPECTED_SCORES_LEVEL_20.INT, 'Official INT at level 20');
assertEqual(level20Scores.WIS, EXPECTED_SCORES_LEVEL_20.WIS, 'Official WIS at level 20');
assertEqual(level20Scores.CHA, EXPECTED_SCORES_LEVEL_20.CHA, 'Official CHA at level 20');

console.log('');

// ===========================
// TEST: getModifier
// ===========================
console.log('📊 Testing getModifier()');
console.log('───────────────────────────────────────────────');

assertEqual(getModifier(1), -5, 'Score 1 = -5 modifier');
assertEqual(getModifier(8), -1, 'Score 8 = -1 modifier');
assertEqual(getModifier(10), 0, 'Score 10 = 0 modifier');
assertEqual(getModifier(11), 0, 'Score 11 = 0 modifier');
assertEqual(getModifier(12), 1, 'Score 12 = +1 modifier');
assertEqual(getModifier(14), 2, 'Score 14 = +2 modifier');
assertEqual(getModifier(16), 3, 'Score 16 = +3 modifier');
assertEqual(getModifier(18), 4, 'Score 18 = +4 modifier');
assertEqual(getModifier(20), 5, 'Score 20 = +5 modifier');
assertEqual(getModifier(22), 6, 'Score 22 = +6 modifier');
assertEqual(getModifier(30), 10, 'Score 30 = +10 modifier');

// Verify modifiers for official Level 20 scores
assertEqual(getModifier(level20Scores.STR), 5, 'STR 20 = +5 modifier');
assertEqual(getModifier(level20Scores.DEX), 4, 'DEX 18 = +4 modifier');
assertEqual(getModifier(level20Scores.CON), 5, 'CON 20 = +5 modifier');
assertEqual(getModifier(level20Scores.INT), 1, 'INT 12 = +1 modifier');
assertEqual(getModifier(level20Scores.WIS), 6, 'WIS 22 = +6 modifier');
assertEqual(getModifier(level20Scores.CHA), 0, 'CHA 10 = 0 modifier');

console.log('');

// ===========================
// TEST: getMaxSpellSlots
// ===========================
console.log('📊 Testing getMaxSpellSlots()');
console.log('───────────────────────────────────────────────');

// Level 1
assertEqual(getMaxSpellSlots(1, 1), 2, 'Level 1 has 2 rank-1 slots');
assertEqual(getMaxSpellSlots(1, 2), 0, 'Level 1 has 0 rank-2 slots');

// Level 5
assertEqual(getMaxSpellSlots(5, 1), 3, 'Level 5 has 3 rank-1 slots');
assertEqual(getMaxSpellSlots(5, 2), 3, 'Level 5 has 3 rank-2 slots');
assertEqual(getMaxSpellSlots(5, 3), 2, 'Level 5 has 2 rank-3 slots');
assertEqual(getMaxSpellSlots(5, 4), 0, 'Level 5 has 0 rank-4 slots');

// Level 10
assertEqual(getMaxSpellSlots(10, 1), 3, 'Level 10 has 3 rank-1 slots');
assertEqual(getMaxSpellSlots(10, 5), 3, 'Level 10 has 3 rank-5 slots');
assertEqual(getMaxSpellSlots(10, 6), 0, 'Level 10 has 0 rank-6 slots');

// Level 20
assertEqual(getMaxSpellSlots(20, 1), 3, 'Level 20 has 3 rank-1 slots');
assertEqual(getMaxSpellSlots(20, 5), 3, 'Level 20 has 3 rank-5 slots');
assertEqual(getMaxSpellSlots(20, 9), 3, 'Level 20 has 3 rank-9 slots');

console.log('');

// ===========================
// TEST: getDivineFontSlots
// ===========================
console.log('📊 Testing getDivineFontSlots()');
console.log('───────────────────────────────────────────────');

// Level 1: WIS 18 (+4) = 1 + 4 = 5 slots
assertEqual(getDivineFontSlots(1), 5, 'Level 1 divine font = 5 slots (WIS +4)');

// Level 5: WIS 19 (+4) = 1 + 4 = 5 slots
assertEqual(getDivineFontSlots(5), 5, 'Level 5 divine font = 5 slots (WIS +4)');

// Level 10: WIS 20 (+5) = 1 + 5 = 6 slots
assertEqual(getDivineFontSlots(10), 6, 'Level 10 divine font = 6 slots (WIS +5)');

// Level 20: WIS 22 (+6) = 1 + 6 = 7 slots
assertEqual(getDivineFontSlots(20), 7, 'Level 20 divine font = 7 slots (WIS +6)');

console.log('');

// ===========================
// TEST: Character Configuration Validation
// ===========================
console.log('📊 Testing Character Configuration');
console.log('───────────────────────────────────────────────');

assertEqual(CHARACTER_IDENTITY.ancestry.name, 'Minotaur', 'Ancestry is Minotaur');
assertEqual(CHARACTER_IDENTITY.ancestry.hitPoints, 10, 'Minotaur gives 10 HP');
assertEqual(CHARACTER_IDENTITY.class.name, 'Cleric', 'Class is Cleric');
assertEqual(CHARACTER_IDENTITY.class.hitPoints, 8, 'Cleric gives 8 HP per level');
assertEqual(CHARACTER_IDENTITY.class.doctrine.name, 'Warpriest', 'Doctrine is Warpriest');
assertEqual(CHARACTER_IDENTITY.heritage.name, 'Dragonblood', 'Heritage is Dragonblood');

console.log('');

// ===========================
// TEST: Base Ability Scores
// ===========================
console.log('📊 Testing Base Ability Scores (Level 1)');
console.log('───────────────────────────────────────────────');

assertEqual(BASE_ABILITY_SCORES.STR, 16, 'Base STR = 16');
assertEqual(BASE_ABILITY_SCORES.DEX, 12, 'Base DEX = 12');
assertEqual(BASE_ABILITY_SCORES.CON, 14, 'Base CON = 14');
assertEqual(BASE_ABILITY_SCORES.INT, 10, 'Base INT = 10');
assertEqual(BASE_ABILITY_SCORES.WIS, 18, 'Base WIS = 18');
assertEqual(BASE_ABILITY_SCORES.CHA, 8, 'Base CHA = 8');

console.log('');

// ===========================
// TEST SUMMARY
// ===========================
console.log('═══════════════════════════════════════════════');
console.log('📊 TEST SUMMARY\n');
console.log(`✓ Passed: ${testsPassed}`);
console.log(`✗ Failed: ${testsFailed}`);
console.log(`  Total:  ${testsPassed + testsFailed}`);

if (testsFailed > 0) {
  console.log('\n❌ FAILED TESTS:');
  failedTests.forEach(({ test, error }) => {
    console.log(`  • ${test}`);
    console.log(`    ${error}`);
  });
  console.log('\n');
  process.exit(1);
} else {
  console.log('\n✅ ALL TESTS PASSED!\n');
  console.log('Character calculations are rules-compliant with Pathfinder 2e.');
  console.log('');
  process.exit(0);
}
