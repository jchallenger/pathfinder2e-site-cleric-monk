/**
 * Pathbuilder 2e Import/Export Utilities
 *
 * Converts between Talon Tracker character data and Pathbuilder 2e JSON format
 *
 * Source: https://pathbuilder2e.com/
 * Format: https://www.pathbuilder2e.com/json.php?id=[buildID]
 */

import { CHARACTER_IDENTITY, BASE_ABILITY_SCORES } from './characterConfig.js';

/**
 * Export character to Pathbuilder 2e JSON format
 *
 * @param {Object} characterData - Current character state from App
 * @returns {Object} Pathbuilder-compatible JSON
 */
export function exportToPathbuilder(characterData) {
  const {
    level,
    characterName,
    characterGender,
    selectedFeats,
    skillProficiencies,
    gear,
    preparedSpells,
    divineFontChoice
  } = characterData;

  // Calculate ability scores at current level
  const abilityScores = calculateAbilityScores(level);

  // Convert skill proficiencies to Pathbuilder format (0=untrained, 1=trained, 2=expert, 3=master, 4=legendary)
  const rankToNumber = {
    'untrained': 0,
    'trained': 1,
    'expert': 2,
    'master': 3,
    'legendary': 4
  };

  const proficiencies = {
    // Saves - Warpriest: Fort Expert, Ref Trained, Will Expert
    fortitude: level >= 1 ? 2 : 1, // Expert at 1
    reflex: 1, // Trained
    will: level >= 1 ? 2 : 1, // Expert at 1
    perception: 1, // Trained

    // Class DC
    classDC: level >= 1 ? 1 : 0,

    // Skills
    acrobatics: rankToNumber[skillProficiencies?.acrobatics?.rank || 'untrained'] || 0,
    arcana: rankToNumber[skillProficiencies?.arcana?.rank || 'untrained'] || 0,
    athletics: rankToNumber[skillProficiencies?.athletics?.rank || 'untrained'] || 0,
    crafting: rankToNumber[skillProficiencies?.crafting?.rank || 'untrained'] || 0,
    deception: rankToNumber[skillProficiencies?.deception?.rank || 'untrained'] || 0,
    diplomacy: rankToNumber[skillProficiencies?.diplomacy?.rank || 'untrained'] || 0,
    intimidation: rankToNumber[skillProficiencies?.intimidation?.rank || 'untrained'] || 0,
    medicine: rankToNumber[skillProficiencies?.medicine?.rank || 'untrained'] || 0,
    nature: rankToNumber[skillProficiencies?.nature?.rank || 'untrained'] || 0,
    occultism: rankToNumber[skillProficiencies?.occultism?.rank || 'untrained'] || 0,
    performance: rankToNumber[skillProficiencies?.performance?.rank || 'untrained'] || 0,
    religion: rankToNumber[skillProficiencies?.religion?.rank || 'untrained'] || 0,
    society: rankToNumber[skillProficiencies?.society?.rank || 'untrained'] || 0,
    stealth: rankToNumber[skillProficiencies?.stealth?.rank || 'untrained'] || 0,
    survival: rankToNumber[skillProficiencies?.survival?.rank || 'untrained'] || 0,
    thievery: rankToNumber[skillProficiencies?.thievery?.rank || 'untrained'] || 0,

    // Spell casting proficiency
    castingDivine: level >= 19 ? 4 : level >= 15 ? 3 : level >= 7 ? 2 : 1, // Trained → Expert (7) → Master (15) → Legendary (19)
    castingArcane: 0,
    castingOccult: 0,
    castingPrimal: 0,

    // Weapon proficiencies - Warpriest gets trained in simple, martial
    simple: 1,
    martial: 1,
    unarmed: 1,

    // Armor proficiencies - Warpriest gets trained in all armor
    unarmored: 1,
    light: 1,
    medium: 1,
    heavy: 1,
    advanced: 0
  };

  // Format feats as [name, null, null, level]
  const feats = selectedFeats.map(feat => [
    feat.name,
    null, // source
    null, // URL
    feat.levelGained
  ]);

  // Format equipment as [name, quantity]
  const equipment = gear.map(item => [
    item.name,
    item.quantity || 1
  ]);

  // Build Pathbuilder JSON
  const pathbuilderJSON = {
    success: true,
    build: {
      name: characterName || CHARACTER_IDENTITY.name,
      level: level,
      age: '', // Not tracked in Talon Tracker
      gender: characterGender || CHARACTER_IDENTITY.gender,
      alignment: CHARACTER_IDENTITY.alignment,
      keyability: 'wis',
      deity: CHARACTER_IDENTITY.deity.name,
      size: 2, // Large = 2
      sizeName: 'Large',
      class: CHARACTER_IDENTITY.class.name,
      dualClass: null,
      ancestry: CHARACTER_IDENTITY.ancestry.name,
      heritage: CHARACTER_IDENTITY.heritage.name,
      background: CHARACTER_IDENTITY.background.name,

      abilities: abilityScores,
      proficiencies: proficiencies,

      languages: ['Common', 'Jotun'], // Minotaur languages

      attributes: {
        ancestryhp: CHARACTER_IDENTITY.ancestry.hitPoints,
        classhp: CHARACTER_IDENTITY.class.hitPoints,
        bonushp: 0,
        bonushpPerLevel: 0,
        speed: CHARACTER_IDENTITY.ancestry.speed,
        speedBonus: 0
      },

      money: {
        pp: 0,
        gp: 0,
        sp: 0,
        cp: 0
      },

      feats: feats,
      specials: [
        'Darkvision',
        'Horns (1d8 piercing)',
        'Dragonblood Heritage - Fear resistance',
        `Divine Font: ${divineFontChoice === 'heal' ? 'Heal' : 'Harm'}`
      ],

      equipment: equipment,
      weapons: [], // TODO: Parse weapons from gear
      armor: [], // TODO: Parse armor from gear
      lores: [], // TODO: Add lores if tracked

      spellCasters: [{
        name: 'Cleric',
        ability: 'wis',
        proficiency: proficiencies.castingDivine,
        magicTradition: 'Divine',
        spellcastingType: 'Prepared',
        focusPoints: 0,
        perDay: getSpellSlotsPerDay(level),
        spells: formatPreparedSpells(preparedSpells)
      }]
    }
  };

  return pathbuilderJSON;
}

/**
 * Import character from Pathbuilder 2e JSON
 *
 * @param {Object} pathbuilderJSON - Pathbuilder JSON data
 * @returns {Object} Character data to update in App
 */
export function importFromPathbuilder(pathbuilderJSON) {
  const build = pathbuilderJSON.build;

  // Only import if it's a Cleric character
  if (build.class !== 'Cleric') {
    throw new Error(`Cannot import ${build.class}. Talon Tracker is configured for Cleric characters only.`);
  }

  // Convert proficiencies back to rank names
  const numberToRank = ['untrained', 'trained', 'expert', 'master', 'legendary'];

  // Convert skill proficiencies
  const skillProficiencies = {};
  const skills = [
    'acrobatics', 'arcana', 'athletics', 'crafting', 'deception',
    'diplomacy', 'intimidation', 'medicine', 'nature', 'occultism',
    'performance', 'religion', 'society', 'stealth', 'survival', 'thievery'
  ];

  skills.forEach(skill => {
    const profValue = build.proficiencies[skill] || 0;
    if (profValue > 0) {
      skillProficiencies[skill] = {
        rank: numberToRank[profValue],
        levelGained: 1 // Would need to parse from feat data
      };
    }
  });

  // Parse feats
  const selectedFeats = build.feats.map(feat => ({
    levelGained: feat[3] || 1,
    type: 'general', // Would need more parsing to determine type
    category: 'general',
    featKey: feat[0].toLowerCase().replace(/\s+/g, '-'),
    name: feat[0],
    source: 'Pathbuilder Import',
    url: '',
    granted: false
  }));

  // Parse equipment
  const gear = build.equipment.map(item => ({
    name: item[0],
    quantity: item[1] || 1,
    bulk: 0, // Would need lookup
    source: 'Pathbuilder Import'
  }));

  return {
    level: build.level,
    characterName: build.name,
    characterGender: build.gender,
    skillProficiencies,
    selectedFeats,
    gear,
    divineFontChoice: build.spellCasters?.[0]?.spells?.find(s => s.list?.includes('Heal')) ? 'heal' : 'harm'
  };
}

/**
 * Reset character to Level 8 preset
 *
 * @returns {Object} Level 8 character data
 */
export function resetToLevel8() {
  return {
    level: 8,
    note: 'Character reset to Level 8 with appropriate ability boosts and features'
  };
}

// ===========================
// HELPER FUNCTIONS
// ===========================

/**
 * Calculate ability scores at given level
 */
function calculateAbilityScores(level) {
  const scores = { ...BASE_ABILITY_SCORES };

  // Apply ability boosts at levels 5, 10, 15, 20
  if (level >= 5) {
    scores.STR += 2;
    scores.DEX += 2;
    scores.CON += 2;
    scores.WIS += 2;
  }
  if (level >= 10) {
    scores.STR += 2;
    scores.DEX += 2;
    scores.CON += 2;
    scores.WIS += 2;
  }
  if (level >= 15) {
    scores.STR += 2;
    scores.DEX += 2;
    scores.CON += 2;
    scores.WIS += 2;
  }
  if (level >= 20) {
    scores.INT += 2;
    scores.CON += 2;
    scores.CHA += 2;
    scores.WIS += 2;
  }

  return {
    str: scores.STR,
    dex: scores.DEX,
    con: scores.CON,
    int: scores.INT,
    wis: scores.WIS,
    cha: scores.CHA
  };
}

/**
 * Get spell slots per day at given level
 */
function getSpellSlotsPerDay(level) {
  const slotTable = {
    1: [2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2: [3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    3: [3, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    4: [3, 3, 0, 0, 0, 0, 0, 0, 0, 0],
    5: [3, 3, 2, 0, 0, 0, 0, 0, 0, 0],
    6: [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    7: [3, 3, 3, 2, 0, 0, 0, 0, 0, 0],
    8: [3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
    9: [3, 3, 3, 3, 2, 0, 0, 0, 0, 0],
    10: [3, 3, 3, 3, 3, 0, 0, 0, 0, 0],
    11: [3, 3, 3, 3, 3, 2, 0, 0, 0, 0],
    12: [3, 3, 3, 3, 3, 3, 0, 0, 0, 0],
    13: [3, 3, 3, 3, 3, 3, 2, 0, 0, 0],
    14: [3, 3, 3, 3, 3, 3, 3, 0, 0, 0],
    15: [3, 3, 3, 3, 3, 3, 3, 2, 0, 0],
    16: [3, 3, 3, 3, 3, 3, 3, 3, 0, 0],
    17: [3, 3, 3, 3, 3, 3, 3, 3, 2, 0],
    18: [3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
    19: [3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
    20: [3, 3, 3, 3, 3, 3, 3, 3, 3, 1]
  };

  return slotTable[level] || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

/**
 * Format prepared spells for Pathbuilder
 */
function formatPreparedSpells(preparedSpells) {
  const formatted = [];

  // Group by spell level
  ['rank1', 'rank2', 'rank3', 'rank4', 'rank5', 'rank6'].forEach((rank, index) => {
    const rankNum = index + 1;
    const instances = preparedSpells[rank] || [];

    if (instances.length > 0) {
      const uniqueSpells = [...new Set(instances.map(inst => inst.spellId))];
      formatted.push({
        spellLevel: rankNum,
        list: uniqueSpells
      });
    }
  });

  return formatted;
}
