/**
 * Centralized Character Configuration
 * Defines all core character attributes, ancestry, background, class, and progression
 * Source: Pathfinder 2e - Player Core, Howl of the Wild
 */

// ===========================
// CORE CHARACTER IDENTITY
// ===========================

export const CHARACTER_IDENTITY = {
  name: 'Briggeld of Igoria',
  gender: 'Male',
  alignment: 'Neutral',

  // Deity
  deity: {
    name: 'Irori',
    title: 'Master of Masters',
    url: 'https://2e.aonprd.com/Deities.aspx?ID=10',
    alignment: 'Lawful Neutral',
    favoredWeapon: 'Fist (unarmed strikes)',
    divineFont: 'Versatile', // Can choose Heal OR Harm daily
    divineSkill: 'Athletics'
  },

  // Core character building blocks
  ancestry: {
    name: 'Minotaur',
    source: 'Howl of the Wild pg. 38',
    url: 'https://2e.aonprd.com/Ancestries.aspx?ID=75',
    rarity: 'Uncommon',
    size: 'Large',
    speed: 25,
    hitPoints: 10, // HP bonus at level 1

    // Ancestry ability boosts/flaws
    abilityBoosts: ['STR', 'CON', 'Free'], // Free goes to WIS
    abilityFlaws: ['CHA'],

    // Special abilities
    traits: ['Humanoid', 'Minotaur'],
    features: {
      darkvision: true,
      horns: {
        name: 'Horns',
        damage: '1d8',
        damageType: 'piercing',
        traits: ['Unarmed']
      }
    }
  },

  heritage: {
    name: 'Dragonblood',
    source: 'Howl of the Wild pg. 38',
    url: 'https://2e.aonprd.com/Heritages.aspx?ID=368',
    description: 'Draconic heritage grants resistance to fear effects',
    benefits: ['Resistance to fear effects']
  },

  background: {
    name: 'Warrior',
    source: 'Player Core pg. 52',
    url: 'https://2e.aonprd.com/Backgrounds.aspx?ID=38',
    abilityBoosts: ['STR', 'WIS'],
    skillTraining: ['Athletics'],
    loreTraining: 'Warfare Lore',
    feat: null // Background feat selection
  },

  class: {
    name: 'Cleric',
    source: 'Player Core pg. 112',
    url: 'https://2e.aonprd.com/Classes.aspx?ID=5',
    hitPoints: 8, // HP per level
    keyAbility: 'WIS',
    abilityBoosts: ['WIS'],

    // Class details
    doctrine: {
      name: 'Warpriest',
      url: 'https://2e.aonprd.com/Doctrines.aspx?ID=1',
      description: 'Battle-ready divine champion',
      proficiencies: {
        fortitude: 'expert',
        reflex: 'trained',
        will: 'expert',
        perception: 'trained',
        weapons: {
          simple: 'trained',
          martial: 'trained', // Warpriest gets martial
          deityFavored: 'trained'
        },
        armor: {
          light: 'trained',
          medium: 'trained',
          heavy: 'trained', // Warpriest gets heavy
          unarmored: 'trained'
        }
      }
    },

    // Divine spellcasting
    spellcasting: {
      tradition: 'Divine',
      keyAbility: 'WIS',
      proficiency: 'trained', // Expert at 11, Master at 15, Legendary at 19
      spellSlots: true,
      cantrips: 5,
      preparationType: 'prepared'
    },

    divineFont: {
      type: 'Heal', // or 'Harm' based on deity choice
      slotsPerLevel: [0, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8]
    }
  }
};

// ===========================
// ABILITY SCORES
// ===========================

/**
 * Base ability scores at Level 1
 * Includes all Level 1 boosts from ancestry, background, class, and 4 free boosts
 */
export const BASE_ABILITY_SCORES = {
  STR: 16, // 10 + 2 (ancestry) + 2 (background) + 2 (level 1 free)
  DEX: 12, // 10 + 2 (level 1 free)
  CON: 14, // 10 + 2 (ancestry) + 2 (level 1 free)
  INT: 10, // 10 (no boosts)
  WIS: 18, // 10 + 2 (ancestry free) + 2 (background) + 2 (class) + 2 (level 1 free)
  CHA: 8   // 10 - 2 (ancestry flaw)
};

/**
 * Ability boost progression by level
 * Players get 4 free ability boosts at levels 5, 10, 15, 20
 * This character chooses: STR, DEX, CON, WIS at 5/10/15
 * And: INT, CON, CHA, WIS at 20
 */
export const ABILITY_BOOST_PROGRESSION = {
  1: [], // Already included in BASE_ABILITY_SCORES
  5: ['STR', 'DEX', 'CON', 'WIS'],
  10: ['STR', 'DEX', 'CON', 'WIS'],
  15: ['STR', 'DEX', 'CON', 'WIS'],
  20: ['INT', 'CON', 'CHA', 'WIS']
};

/**
 * Expected ability scores at Level 20 (for validation)
 * Source: MINOTAUR_CLERIC_CHARACTER_SHEET.md
 */
export const EXPECTED_SCORES_LEVEL_20 = {
  STR: 20, // +5 modifier
  DEX: 18, // +4 modifier
  CON: 20, // +5 modifier
  INT: 12, // +1 modifier
  WIS: 22, // +6 modifier
  CHA: 10  // +0 modifier
};

// ===========================
// SKILLS & PROFICIENCIES
// ===========================

/**
 * Initial skill proficiencies at Level 1
 */
export const INITIAL_SKILL_PROFICIENCIES = {
  // From Background (Warrior)
  athletics: { rank: 'trained', levelGained: 1, source: 'Background (Warrior)' },
  warfare: { rank: 'trained', levelGained: 1, source: 'Background (Warrior)', lore: true },

  // From Class (Cleric) - Religion + INT mod (0) additional skills
  religion: { rank: 'trained', levelGained: 1, source: 'Cleric Class' },
  intimidation: { rank: 'trained', levelGained: 1, source: 'Class (Cleric) - additional skill' },
  medicine: { rank: 'trained', levelGained: 1, source: 'Class (Cleric) - additional skill' },
  survival: { rank: 'trained', levelGained: 1, source: 'Class (Cleric) - additional skill' }
};

/**
 * Skill proficiency progression (example for this character)
 * Customize based on feat selections and level-up choices
 */
export const SKILL_PROGRESSION = {
  athletics: { 2: 'expert', 7: 'master', 15: 'legendary' },
  medicine: { 2: 'expert', 7: 'master', 15: 'legendary' },
  survival: { 2: 'expert', 7: 'master', 15: 'legendary' },
  intimidation: { 2: 'expert' },
  religion: { 2: 'expert' },
  nature: { 2: 'expert' }
};

// ===========================
// FEATS & FEATURES
// ===========================

/**
 * Initial feats granted at Level 1
 */
export const INITIAL_FEATS = [
  {
    levelGained: 1,
    type: 'ancestry',
    category: 'ancestry',
    featKey: 'minotaur-ferocity',
    name: 'Minotaur Ferocity',
    source: 'Howl of the Wild pg. 38',
    url: 'https://2e.aonprd.com/Feats.aspx?ID=4371',
    granted: false
  },
  {
    levelGained: 1,
    type: 'heritage',
    category: 'dragonblood',
    featKey: 'dragonblood',
    name: 'Dragonblood',
    source: 'Howl of the Wild pg. 38',
    url: 'https://2e.aonprd.com/Heritages.aspx?ID=368',
    granted: true
  }
];

/**
 * Feat slots by level and type
 * Source: Player Core - Class progression tables
 */
export const FEAT_PROGRESSION = {
  ancestry: [1, 5, 9, 13, 17], // Ancestry feats
  class: [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20], // Class feats
  skill: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20], // Skill feats (every even level)
  general: [3, 7, 11, 15, 19] // General feats
};

// ===========================
// EQUIPMENT & GEAR
// ===========================

/**
 * Starting equipment at Level 1
 */
export const INITIAL_EQUIPMENT = [
  {
    id: 1,
    name: 'Religious Symbol (Wooden)',
    quantity: 1,
    equipped: true,
    bulk: 'L',
    category: 'adventuring-gear',
    description: 'Divine focus for spellcasting'
  },
  {
    id: 2,
    name: "Adventurer's Pack",
    quantity: 1,
    equipped: true,
    bulk: 2,
    category: 'adventuring-gear',
    description: 'Backpack, bedroll, basic tools'
  },
  {
    id: 3,
    name: 'Scale Mail',
    quantity: 1,
    equipped: true,
    bulk: 2,
    category: 'armor',
    description: 'Medium armor, AC +3, Dex cap +2'
  },
  {
    id: 4,
    name: 'Steel Shield',
    quantity: 1,
    equipped: true,
    bulk: 1,
    category: 'shield',
    description: 'Hardness 5, HP 20, BT 10'
  },
  {
    id: 5,
    name: 'Mace',
    quantity: 1,
    equipped: true,
    bulk: 1,
    category: 'weapon',
    description: 'Simple weapon, 1d6 bludgeoning'
  }
];

// ===========================
// LEVEL PROGRESSION MILESTONES
// ===========================

/**
 * Class features and abilities gained at each level
 */
export const LEVEL_MILESTONES = {
  1: [
    'Initial Proficiencies - Trained in Fortitude and Will saves',
    'Deity and Divine Font - Choose deity and divine font (Heal or Harm)',
    'Divine Spellcasting - Cast divine spells using Wisdom',
    'Anathema - Must follow deity\'s anathema restrictions',
    'Cleric Feat - Select one 1st-level cleric feat',
    'Doctrine - Warpriest doctrine (martial weapons, medium/heavy armor)'
  ],
  2: [
    'Cleric Feat - Select one cleric feat',
    'Skill Feat - Select one skill feat'
  ],
  3: [
    'General Feat - Select one general feat',
    '2nd-level Spells - Can prepare 2nd-level spells'
  ],
  4: [
    'Cleric Feat - Select one cleric feat',
    'Skill Feat - Select one skill feat'
  ],
  5: [
    'Ability Boosts - Four ability boosts',
    'Ancestry Feat - Select one ancestry feat',
    'Alertness - Expert in Perception',
    '3rd-level Spells - Can prepare 3rd-level spells'
  ],
  6: [
    'Cleric Feat - Select one cleric feat',
    'Skill Feat - Select one skill feat'
  ],
  7: [
    'General Feat - Select one general feat',
    '4th-level Spells - Can prepare 4th-level spells'
  ],
  8: [
    'Cleric Feat - Select one cleric feat',
    'Skill Feat - Select one skill feat'
  ],
  9: [
    'Ancestry Feat - Select one ancestry feat',
    'Resolve - Expert in Will saves',
    '5th-level Spells - Can prepare 5th-level spells'
  ],
  10: [
    'Ability Boosts - Four ability boosts',
    'Cleric Feat - Select one cleric feat',
    'Skill Feat - Select one skill feat'
  ],
  11: [
    'General Feat - Select one general feat',
    'Divine Defense - Expert in Fortitude saves (Warpriest)',
    'Weapon Specialization - Extra damage with trained weapons',
    '6th-level Spells - Can prepare 6th-level spells'
  ],
  12: [
    'Cleric Feat - Select one cleric feat',
    'Skill Feat - Select one skill feat'
  ],
  13: [
    'Ancestry Feat - Select one ancestry feat',
    'Weapon Expertise - Expert in simple and martial weapons',
    '7th-level Spells - Can prepare 7th-level spells'
  ],
  14: [
    'Cleric Feat - Select one cleric feat',
    'Skill Feat - Select one skill feat'
  ],
  15: [
    'Ability Boosts - Four ability boosts',
    'General Feat - Select one general feat',
    '8th-level Spells - Can prepare 8th-level spells'
  ],
  16: [
    'Cleric Feat - Select one cleric feat',
    'Skill Feat - Select one skill feat'
  ],
  17: [
    'Ancestry Feat - Select one ancestry feat',
    '9th-level Spells - Can prepare 9th-level spells'
  ],
  18: [
    'Cleric Feat - Select one cleric feat',
    'Skill Feat - Select one skill feat'
  ],
  19: [
    'General Feat - Select one general feat',
    'Armor Mastery - Master in armor (Warpriest)',
    'Miraculous Spell - One extra top-level spell slot'
  ],
  20: [
    'Ability Boosts - Four ability boosts',
    'Cleric Feat - Select one cleric feat',
    'Skill Feat - Select one skill feat'
  ]
};

// ===========================
// VALIDATION CONSTANTS
// ===========================

/**
 * Proficiency ranks and their bonuses
 */
export const PROFICIENCY_RANKS = {
  untrained: 0,
  trained: 0,    // level + 0
  expert: 2,     // level + 2
  master: 4,     // level + 4
  legendary: 6   // level + 6
};

/**
 * Ability score boost rules
 */
export const ABILITY_BOOST_RULES = {
  standardBoost: 2,    // +2 if score < 18
  cappedBoost: 1,      // +1 if score >= 18
  capThreshold: 18     // Threshold where cap applies
};

/**
 * Character configuration metadata
 */
export const CHARACTER_META = {
  version: '1.0.0',
  lastUpdated: '2025-11-11',
  rulesSystem: 'Pathfinder 2e Remaster',
  sourcebooks: [
    'Player Core',
    'Howl of the Wild'
  ],
  complianceLevel: 'Official Rules Compliant',
  validated: true
};

// ===========================
// EQUIPMENT DATABASE
// ===========================

/**
 * Equipment database with full PF2e stats
 * Source: Player Core, equipment tables
 */
export const EQUIPMENT_DATABASE = {
  // ARMOR
  armor: {
    'hide-armor': {
      name: 'Hide Armor',
      category: 'armor',
      armorType: 'medium',
      acBonus: 3,
      dexCap: 2,
      checkPenalty: -2,
      speedPenalty: -5,
      strength: 14,
      bulk: 2,
      group: 'leather',
      traits: [],
      price: { gp: 2 },
      level: 0,
      description: 'Medium armor made from thick hides'
    },
    'scale-mail': {
      name: 'Scale Mail',
      category: 'armor',
      armorType: 'medium',
      acBonus: 3,
      dexCap: 2,
      checkPenalty: -2,
      speedPenalty: -5,
      strength: 14,
      bulk: 2,
      group: 'composite',
      traits: [],
      price: { gp: 4 },
      level: 0,
      description: 'Medium armor made of overlapping metal scales'
    },
    'breastplate': {
      name: 'Breastplate',
      category: 'armor',
      armorType: 'medium',
      acBonus: 4,
      dexCap: 1,
      checkPenalty: -2,
      speedPenalty: -5,
      strength: 16,
      bulk: 2,
      group: 'plate',
      traits: [],
      price: { gp: 8 },
      level: 0,
      description: 'Medium armor with reinforced chest plate'
    },
    'half-plate': {
      name: 'Half Plate',
      category: 'armor',
      armorType: 'heavy',
      acBonus: 5,
      dexCap: 1,
      checkPenalty: -3,
      speedPenalty: -10,
      strength: 16,
      bulk: 3,
      group: 'plate',
      traits: [],
      price: { gp: 18 },
      level: 1,
      description: 'Heavy armor covering torso and limbs'
    },
    'full-plate': {
      name: 'Full Plate',
      category: 'armor',
      armorType: 'heavy',
      acBonus: 6,
      dexCap: 0,
      checkPenalty: -3,
      speedPenalty: -10,
      strength: 18,
      bulk: 4,
      group: 'plate',
      traits: [],
      price: { gp: 30 },
      level: 2,
      description: 'Heavy armor providing maximum protection'
    },
    'lattice-armor': {
      name: 'Lattice Armor',
      category: 'armor',
      armorType: 'medium',
      acBonus: 4,
      dexCap: 2,
      checkPenalty: -2,
      speedPenalty: -5,
      strength: 14,
      bulk: 2,
      group: 'composite',
      traits: [],
      price: { gp: 45 },
      level: 5,
      description: 'Intricate medium armor made of interlocking metal plates that provides excellent protection while maintaining flexibility'
    }
  },

  // SHIELDS
  shields: {
    'wooden-shield': {
      name: 'Wooden Shield',
      category: 'shield',
      acBonus: 2,
      hardness: 3,
      hp: 12,
      bt: 6,
      bulk: 1,
      traits: [],
      price: { sp: 1 },
      level: 0,
      description: 'Basic wooden shield'
    },
    'steel-shield': {
      name: 'Steel Shield',
      category: 'shield',
      acBonus: 2,
      hardness: 5,
      hp: 20,
      bt: 10,
      bulk: 1,
      traits: [],
      price: { gp: 2 },
      level: 0,
      description: 'Sturdy metal shield'
    },
    'tower-shield': {
      name: 'Tower Shield',
      category: 'shield',
      acBonus: 2,
      hardness: 5,
      hp: 20,
      bt: 10,
      bulk: 4,
      traits: ['tower-shield'],
      price: { gp: 10 },
      level: 0,
      description: 'Large shield providing cover (+2 circumstance bonus to AC when raised, can take cover action)'
    },
    'salvo-shield': {
      name: 'Salvo Shield',
      category: 'shield',
      acBonus: 2,
      hardness: 6,
      hp: 24,
      bt: 12,
      bulk: 1,
      traits: ['attached-to-crossbow-or-firearm'],
      price: { gp: 20 },
      level: 1,
      description: 'Special shield with integrated weapon mount. Can be used for reactions even while wielding a weapon'
    }
  },

  // WEAPONS
  weapons: {
    'mace': {
      name: 'Mace',
      category: 'weapon',
      weaponType: 'simple',
      hands: 1,
      damage: '1d6',
      damageType: 'bludgeoning',
      traits: ['agile', 'shove'],
      bulk: 1,
      group: 'club',
      price: { gp: 1 },
      level: 0,
      description: 'Simple one-handed bludgeoning weapon'
    },
    'greatsword': {
      name: 'Greatsword',
      category: 'weapon',
      weaponType: 'martial',
      hands: 2,
      damage: '1d12',
      damageType: 'slashing',
      traits: ['versatile piercing'],
      bulk: 2,
      group: 'sword',
      price: { gp: 2 },
      level: 0,
      description: 'Two-handed slashing weapon'
    },
    'longbow': {
      name: 'Longbow',
      category: 'weapon',
      weaponType: 'martial',
      hands: 2,
      damage: '1d8',
      damageType: 'piercing',
      range: 100,
      reload: 0,
      traits: ['deadly d10', 'propulsive', 'volley 30ft'],
      bulk: 2,
      group: 'bow',
      price: { gp: 6 },
      level: 0,
      description: 'Ranged weapon for long-distance combat'
    },
    'handwraps-of-mighty-blows': {
      name: 'Handwraps of Mighty Blows',
      category: 'weapon',
      weaponType: 'unarmed',
      hands: 0,
      damage: '1d6',
      damageType: 'bludgeoning',
      traits: ['unarmed', 'invested'],
      bulk: 'L',
      group: 'brawling',
      price: { gp: 4 },
      level: 2,
      description: 'Magical wraps that enhance unarmed strikes and can hold runes',
      special: 'Allows you to etch fundamental and property runes onto your unarmed attacks'
    }
  },

  // RUNES (Weapon/Armor enhancements)
  runes: {
    'weapon-potency-1': {
      name: '+1 Weapon Potency Rune',
      category: 'rune',
      runeType: 'weapon-potency',
      bonus: 1,
      appliesTo: 'weapon',
      statModifiers: {
        attackBonus: 1,
        damageBonus: 0
      },
      bulk: 0,
      price: { gp: 35 },
      level: 2,
      description: 'Grants +1 item bonus to attack rolls'
    },
    'weapon-potency-2': {
      name: '+2 Weapon Potency Rune',
      category: 'rune',
      runeType: 'weapon-potency',
      bonus: 2,
      appliesTo: 'weapon',
      statModifiers: {
        attackBonus: 2,
        damageBonus: 0
      },
      bulk: 0,
      price: { gp: 935 },
      level: 10,
      description: 'Grants +2 item bonus to attack rolls'
    },
    'weapon-potency-3': {
      name: '+3 Weapon Potency Rune',
      category: 'rune',
      runeType: 'weapon-potency',
      bonus: 3,
      appliesTo: 'weapon',
      statModifiers: {
        attackBonus: 3,
        damageBonus: 0
      },
      bulk: 0,
      price: { gp: 20560 },
      level: 16,
      description: 'Grants +3 item bonus to attack rolls'
    },
    'striking': {
      name: 'Striking Rune',
      category: 'rune',
      runeType: 'weapon-striking',
      bonus: 1,
      appliesTo: 'weapon',
      statModifiers: {
        damageDice: '+1d' // Adds 1 extra weapon damage die
      },
      bulk: 0,
      price: { gp: 65 },
      level: 4,
      description: 'Weapon deals an additional weapon damage die'
    },
    'greater-striking': {
      name: 'Greater Striking Rune',
      category: 'rune',
      runeType: 'weapon-striking',
      bonus: 2,
      appliesTo: 'weapon',
      statModifiers: {
        damageDice: '+2d' // Adds 2 extra weapon damage dice
      },
      bulk: 0,
      price: { gp: 1065 },
      level: 12,
      description: 'Weapon deals two additional weapon damage dice'
    },
    'major-striking': {
      name: 'Major Striking Rune',
      category: 'rune',
      runeType: 'weapon-striking',
      bonus: 3,
      appliesTo: 'weapon',
      statModifiers: {
        damageDice: '+3d' // Adds 3 extra weapon damage dice
      },
      bulk: 0,
      price: { gp: 31065 },
      level: 19,
      description: 'Weapon deals three additional weapon damage dice (4 dice total)'
    },
    'armor-potency-1': {
      name: '+1 Armor Potency Rune',
      category: 'rune',
      runeType: 'armor-potency',
      bonus: 1,
      appliesTo: 'armor',
      statModifiers: {
        acBonus: 1
      },
      bulk: 0,
      price: { gp: 160 },
      level: 5,
      description: 'Grants +1 item bonus to AC'
    },
    'armor-potency-2': {
      name: '+2 Armor Potency Rune',
      category: 'rune',
      runeType: 'armor-potency',
      bonus: 2,
      appliesTo: 'armor',
      statModifiers: {
        acBonus: 2
      },
      bulk: 0,
      price: { gp: 1060 },
      level: 11,
      description: 'Grants +2 item bonus to AC'
    },
    'armor-potency-3': {
      name: '+3 Armor Potency Rune',
      category: 'rune',
      runeType: 'armor-potency',
      bonus: 3,
      appliesTo: 'armor',
      statModifiers: {
        acBonus: 3
      },
      bulk: 0,
      price: { gp: 20560 },
      level: 18,
      description: 'Grants +3 item bonus to AC'
    },
    'resilient': {
      name: 'Resilient Rune',
      category: 'rune',
      runeType: 'armor-resilient',
      bonus: 1,
      appliesTo: 'armor',
      statModifiers: {
        savingThrowBonus: 1 // Applies to all saves
      },
      bulk: 0,
      price: { gp: 340 },
      level: 8,
      description: 'Grants +1 item bonus to all saving throws'
    },
    'greater-resilient': {
      name: 'Greater Resilient Rune',
      category: 'rune',
      runeType: 'armor-resilient',
      bonus: 2,
      appliesTo: 'armor',
      statModifiers: {
        savingThrowBonus: 2
      },
      bulk: 0,
      price: { gp: 3440 },
      level: 14,
      description: 'Grants +2 item bonus to all saving throws'
    },
    'major-resilient': {
      name: 'Major Resilient Rune',
      category: 'rune',
      runeType: 'armor-resilient',
      bonus: 3,
      appliesTo: 'armor',
      statModifiers: {
        savingThrowBonus: 3
      },
      bulk: 0,
      price: { gp: 49440 },
      level: 20,
      description: 'Grants +3 item bonus to all saving throws'
    },
    'supreme-reinforcing': {
      name: 'Supreme Reinforcing Rune',
      category: 'rune',
      runeType: 'shield-reinforcing',
      bonus: 3,
      appliesTo: 'shield',
      statModifiers: {
        hardness: 15,
        hpBonus: 96,
        btBonus: 48
      },
      bulk: 0,
      price: { gp: 54000 },
      level: 20,
      description: 'Shield gains +15 hardness, +96 HP, +48 BT. Can use reactions even when using shield'
    }
  },

  // ADVENTURING GEAR
  adventuringGear: {
    'religious-symbol': {
      name: 'Religious Symbol (Wooden)',
      category: 'adventuring-gear',
      bulk: 'L',
      traits: [],
      price: { sp: 2 },
      level: 0,
      description: 'Divine focus for spellcasting',
      statModifiers: {
        enablesDivineFocus: true
      }
    },
    'adventurers-pack': {
      name: "Adventurer's Pack",
      category: 'adventuring-gear',
      bulk: 2,
      traits: [],
      price: { gp: 7 },
      level: 0,
      description: 'Backpack, bedroll, 2 belt pouches, 10 pieces of chalk, flint and steel, 50ft rope, 2 weeks rations, soap, 5 torches, waterskin'
    },
    'healing-potion-minor': {
      name: 'Healing Potion (Minor)',
      category: 'consumable',
      bulk: 'L',
      traits: ['consumable', 'healing', 'magical', 'potion'],
      price: { gp: 4 },
      level: 1,
      description: 'Restores 1d8 HP'
    },
    'healing-potion-lesser': {
      name: 'Healing Potion (Lesser)',
      category: 'consumable',
      bulk: 'L',
      traits: ['consumable', 'healing', 'magical', 'potion'],
      price: { gp: 12 },
      level: 5,
      description: 'Restores 2d8+5 HP'
    }
  }
};

/**
 * Attribute modification tracking
 * Tracks how feats, skills, and equipment modify character attributes
 */
export const ATTRIBUTE_MODIFIERS = {
  // Example structure for tracking modifications
  // This will be populated dynamically based on selected feats, equipped items, etc.

  // Example: Shield Block feat grants ability to use shield to reduce damage
  // Example: +1 Weapon Potency Rune grants +1 to attack rolls
  // Example: Armor provides AC bonus

  // Categories of modifiers
  types: {
    'item': 'Item Bonus',           // From equipment
    'circumstance': 'Circumstance', // From situations
    'status': 'Status Bonus',       // From conditions/spells
    'ability': 'Ability Modifier',  // From ability scores
    'proficiency': 'Proficiency',   // From training
    'feat': 'Feat Bonus'            // From feats
  },

  // Stacking rules: Same type bonuses don't stack (use highest), different types do
  stackingRules: {
    note: 'Item bonuses do not stack with other item bonuses. Circumstance, status, and untyped bonuses stack.'
  }
};

export default {
  CHARACTER_IDENTITY,
  BASE_ABILITY_SCORES,
  ABILITY_BOOST_PROGRESSION,
  EXPECTED_SCORES_LEVEL_20,
  INITIAL_SKILL_PROFICIENCIES,
  SKILL_PROGRESSION,
  INITIAL_FEATS,
  FEAT_PROGRESSION,
  INITIAL_EQUIPMENT,
  LEVEL_MILESTONES,
  PROFICIENCY_RANKS,
  ABILITY_BOOST_RULES,
  CHARACTER_META,
  EQUIPMENT_DATABASE,
  ATTRIBUTE_MODIFIERS
};
