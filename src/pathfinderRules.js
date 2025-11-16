// Pathfinder 2e Official Rules Cache
// Sources:
// - Archives of Nethys (https://2e.aonprd.com) - Official Pathfinder 2e Reference Document
// - Pathfinder 2e Core Rulebook (Player Core, GM Core)
// Last Updated: 2025-11-06
//
// All game rules are sourced from official Paizo publications and licensed under the
// Open Game License (OGL) via Archives of Nethys

export const pathfinderRules = {
  // ==================== SOURCE ATTRIBUTION ====================
  sources: {
    aon: {
      name: "Archives of Nethys",
      url: "https://2e.aonprd.com",
      description: "Official Pathfinder 2e Reference Document"
    },
    playerCore: {
      name: "Player Core",
      publisher: "Paizo Inc.",
      description: "Core rulebook for character creation and gameplay"
    },
    godsAndMagic: {
      name: "Gods & Magic",
      publisher: "Paizo Inc.",
      description: "Deity and faith options"
    }
  },
  // ==================== SKILLS ====================
  // Source: Player Core pg. 225, Archives of Nethys
  skills: {
    acrobatics: {
      name: "Acrobatics",
      ability: "Dexterity",
      description: "Movement and balance-related tasks",
      source: "Player Core pg. 225",
      url: "https://2e.aonprd.com/Skills.aspx?ID=1"
    },
    arcana: {
      name: "Arcana",
      ability: "Intelligence",
      description: "Knowledge of magical theory and spellcasting",
      source: "Player Core pg. 225",
      url: "https://2e.aonprd.com/Skills.aspx?ID=2"
    },
    athletics: {
      name: "Athletics",
      ability: "Strength",
      description: "Physical feats and swimming",
      source: "Player Core pg. 225",
      url: "https://2e.aonprd.com/Skills.aspx?ID=3"
    },
    crafting: {
      name: "Crafting",
      ability: "Intelligence",
      description: "Creating and repairing items",
      source: "Player Core pg. 225",
      url: "https://2e.aonprd.com/Skills.aspx?ID=4"
    },
    deception: {
      name: "Deception",
      ability: "Charisma",
      description: "Lying and misleading others",
      source: "Player Core pg. 225",
      url: "https://2e.aonprd.com/Skills.aspx?ID=5"
    },
    diplomacy: {
      name: "Diplomacy",
      ability: "Charisma",
      description: "Negotiation and persuasion",
      source: "Player Core pg. 225",
      url: "https://2e.aonprd.com/Skills.aspx?ID=6"
    },
    intimidation: {
      name: "Intimidation",
      ability: "Charisma",
      description: "Threatening and coercing",
      source: "Player Core pg. 225",
      url: "https://2e.aonprd.com/Skills.aspx?ID=7"
    },
    lore: {
      name: "Lore",
      ability: "Intelligence",
      description: "Specialized knowledge domains",
      source: "Player Core pg. 225",
      url: "https://2e.aonprd.com/Skills.aspx?ID=8"
    },
    medicine: {
      name: "Medicine",
      ability: "Wisdom",
      description: "Healing and medical treatment",
      source: "Player Core pg. 225",
      url: "https://2e.aonprd.com/Skills.aspx?ID=9"
    },
    nature: {
      name: "Nature",
      ability: "Wisdom",
      description: "Knowledge of wilderness and creatures",
      source: "Player Core pg. 225",
      url: "https://2e.aonprd.com/Skills.aspx?ID=10"
    },
    occultism: {
      name: "Occultism",
      ability: "Intelligence",
      description: "Understanding of supernatural phenomena",
      source: "Player Core pg. 225",
      url: "https://2e.aonprd.com/Skills.aspx?ID=11"
    },
    performance: {
      name: "Performance",
      ability: "Charisma",
      description: "Entertainment and artistic expression",
      source: "Player Core pg. 225",
      url: "https://2e.aonprd.com/Skills.aspx?ID=12"
    },
    religion: {
      name: "Religion",
      ability: "Wisdom",
      description: "Knowledge of deities and faith",
      source: "Player Core pg. 225",
      url: "https://2e.aonprd.com/Skills.aspx?ID=13"
    },
    society: {
      name: "Society",
      ability: "Intelligence",
      description: "Understanding of civilization and culture",
      source: "Player Core pg. 225",
      url: "https://2e.aonprd.com/Skills.aspx?ID=14"
    },
    stealth: {
      name: "Stealth",
      ability: "Dexterity",
      description: "Hiding and moving silently",
      source: "Player Core pg. 225",
      url: "https://2e.aonprd.com/Skills.aspx?ID=15"
    },
    survival: {
      name: "Survival",
      ability: "Wisdom",
      description: "Tracking and wilderness survival",
      source: "Player Core pg. 225",
      url: "https://2e.aonprd.com/Skills.aspx?ID=16"
    },
    thievery: {
      name: "Thievery",
      ability: "Dexterity",
      description: "Picking locks and sleight of hand",
      source: "Player Core pg. 225",
      url: "https://2e.aonprd.com/Skills.aspx?ID=17"
    }
  },

  // ==================== ANCESTRIES ====================
  // Source: Ancestry Guide, Archives of Nethys
  ancestries: {
    minotaur: {
      name: "Minotaur",
      source: "Howl of the Wild",
      url: "https://2e.aonprd.com/Ancestries.aspx?ID=75",
      rarity: "Uncommon",
      hitPoints: 10,
      size: "Large",
      speed: 25,
      abilityBoosts: ["Strength", "Constitution", "Free"],
      abilityFlaws: ["Charisma"],
      traits: ["Uncommon", "Beast", "Humanoid", "Minotaur"],
      languages: {
        automatic: ["Common", "Jotun"],
        additional: ["Cyclops", "Dwarven", "Fey", "Petran", "Sakvroth", "Regional languages"]
      },
      specialAbilities: {
        darkvision: {
          name: "Darkvision",
          description: "You can see in darkness and dim light just as well as you can see in bright light, though your vision in darkness is in black and white"
        },
        horns: {
          name: "Horns",
          description: "You have a pair of horns you can use as an unarmed attack",
          damage: "1d8 piercing",
          group: "Brawling",
          traits: ["Unarmed"]
        }
      },
      heritages: {
        dragonblood: {
          name: "Dragonblood",
          source: "Howl of the Wild pg. 38",
          url: "https://2e.aonprd.com/Heritages.aspx?ID=368",
          type: "Versatile Heritage",
          description: "You're descended in some way from a dragon. Your physical features might show this outwardly, with a pair of draconic horns, patches of scaly skin, or even a tail, or you might develop an internal reserve of draconic power.",
          benefits: [
            "Gain the dragonblood trait, in addition to traits from your ancestry",
            "Add Draconic to your ancestry's list of additional languages",
            "When you roll a success on a saving throw against a fear effect, you get a critical success instead",
            "Can choose from dragonblood feats and feats from your ancestry whenever you gain an ancestry feat"
          ],
          mechanicalBonus: {
            fearResistance: "Success on fear saves becomes critical success",
            languages: ["Draconic"],
            traits: ["Dragonblood"]
          }
        }
      }
    },
    minotaur: {
      name: "Minotaur",
      source: "Howl of the Wild",
      url: "https://2e.aonprd.com/Ancestries.aspx?ID=75",
      rarity: "Uncommon",
      hitPoints: 10,
      size: "Large",
      speed: 25,
      abilityBoosts: ["Strength", "Constitution", "Free"],
      abilityFlaws: ["Charisma"],
      traits: ["Uncommon", "Beast", "Humanoid", "Minotaur"],
      languages: {
        automatic: ["Common", "Jotun"],
        additional: ["Cyclops", "Dwarven", "Fey", "Petran", "Sakvroth", "Regional languages"]
      },
      specialAbilities: {
        darkvision: {
          name: "Darkvision",
          description: "You can see in darkness and dim light just as well as you can see in bright light, though your vision in darkness is in black and white.",
          source: "Howl of the Wild",
          url: "https://2e.aonprd.com/Ancestries.aspx?ID=75"
        },
        horns: {
          name: "Horns",
          description: "You have a horns unarmed attack that deals 1d8 piercing damage. Your horns are in the brawling group and have the unarmed trait.",
          damage: "1d8 piercing",
          group: "Brawling",
          traits: ["Unarmed"],
          source: "Howl of the Wild",
          url: "https://2e.aonprd.com/Ancestries.aspx?ID=75"
        },
        adamantine: {
          name: "Adamantine",
          description: "Your hide has a metallic quality, making it extremely resistant to damage. You gain resistance to physical damage equal to half your level (minimum 1).",
          level: 9,
          source: "Howl of the Wild",
          url: "https://2e.aonprd.com/Ancestries.aspx?ID=75"
        }
      },
      heritages: {
        dragonblood: {
          name: "Dragonblood",
          source: "Player Core 2 pg. 44",
          url: "https://2e.aonprd.com/Heritages.aspx?ID=368",
          type: "Versatile Heritage",
          description: "You're descended in some way from a dragon. Your physical features might show this outwardly, with a pair of draconic horns, patches of scaly skin, or even a tail, or you might develop an internal reserve of draconic power.",
          benefits: [
            "Gain the dragonblood trait in addition to ancestral traits",
            "Add Draconic to your ancestry's list of additional languages",
            "When you roll a success on a saving throw against a fear effect, you get a critical success instead",
            "Can choose from dragonblood feats and ancestral feats whenever you gain an ancestry feat"
          ]
        }
      }
    }
  },

  // ==================== CLASSES ====================
  // Source: Player Core, Archives of Nethys
  classes: {
    cleric: {
      name: "Cleric",
      source: "Player Core pg. 112",
      url: "https://2e.aonprd.com/Classes.aspx?ID=5",
      keyAbility: "Wisdom",
      hitPoints: 8,
      initialProficiencies: {
        perception: "Trained",
        fortitudeSave: "Trained",
        reflexSave: "Trained",
        willSave: "Expert",
        skills: {
          religion: "Trained",
          deitySkill: "Trained",
          additional: "2 + Intelligence modifier"
        },
        attacks: {
          simple: "Trained",
          favoredWeapon: "Trained",
          unarmed: "Trained"
        },
        defenses: {
          unarmoredDefense: "Trained"
        },
        spells: {
          spellAttack: "Trained",
          spellDC: "Trained",
          classDC: "Trained"
        }
      },
      spellcasting: {
        tradition: "Divine",
        spellsPerDay: {
          level1: {
            rank1: 2,
            cantrips: 5
          }
        },
        notes: "Cantrips automatically heighten to half character level (rounded up). Prepare spells daily from divine spell list."
      },
      divineFont: {
        description: "Gain 4 additional daily spell slots (at highest rank) for either heal or harm spells exclusively",
        slots: {
          base: 4,
          level5: 5,
          level15: 6
        }
      },
      doctrines: {
        warpriest: {
          name: "Warpriest",
          description: "Balance martial combat training with spellcasting abilities",
          progression: {
            level1: {
              armorProficiency: "Trained in light and medium armor",
              saves: "Expert proficiency in Fortitude saves",
              feats: ["Shield Block", "Deadly Simplicity (if deity's weapon is simple)"]
            },
            level3: {
              weapons: "Trained in martial weapons"
            },
            level7: {
              weapons: "Expert proficiency with deity's favored weapon, martial/simple weapons, and unarmed attacks",
              criticalSpecialization: "Apply critical specialization on crits using favored weapon; use spell DC instead of class DC"
            },
            level11: {
              spellcasting: "Spell attack modifier and spell DC proficiency ranks increase to expert"
            },
            level13: {
              armorProficiency: "Expert proficiency in light and medium armor"
            },
            level15: {
              saves: "Fortitude save proficiency rank increases to master. Treat successful Fortitude saves as critical successes."
            },
            level19: {
              mastery: "Master proficiency with favored weapon, spell attack modifier, and spell DC"
            }
          }
        },
        cloisteredCleric: {
          name: "Cloistered Cleric",
          description: "Focus on divine magic and spellcasting over martial prowess",
          notes: "Alternate doctrine option (details not fully cached)"
        }
      },
      classFeatures: {
        level5: "Perception becomes Expert",
        level9: "Will saves become Master (critical success on success)",
        level11: "Reflex saves become Expert",
        level13: "Unarmored defense becomes Expert; weapon specialization (+2 damage)",
        level19: "Gain single 10th-rank miraculous spell slot"
      }
    }
  },

  // ==================== ARCHETYPES ====================
  // Source: Player Core, Archives of Nethys
  archetypes: {
    monk: {
      name: "Monk Archetype",
      source: "Player Core",
      url: "https://2e.aonprd.com/Archetypes.aspx?ID=8",
      dedication: {
        name: "Monk Dedication",
        level: 2,
        url: "https://2e.aonprd.com/Feats.aspx?ID=715",
        prerequisites: ["Strength 14", "Dexterity 14"],
        benefits: [
          "Trained in unarmed attacks",
          "Gain 'powerful fist' class feature",
          "Trained in Acrobatics or Athletics (or another skill if already trained in both)",
          "Trained in monk class DC",
          "Trained in spell attack modifier and spell DC (if gaining qi spells later)"
        ],
        notes: "You can't select a multiclass archetype's dedication feat if you are a member of the class of the same name"
      },
      feats: {
        basicKata: {
          name: "Basic Kata",
          level: 4,
          url: "https://2e.aonprd.com/Feats.aspx?ID=716",
          prerequisites: ["Monk Dedication"],
          effect: "Gain a 1st- or 2nd-level monk feat"
        },
        monkResiliency: {
          name: "Monk Resiliency",
          level: 4,
          url: "https://2e.aonprd.com/Feats.aspx?ID=717",
          prerequisites: ["Monk Dedication", "Maximum 8 + Constitution modifier HP per level"],
          effect: "Gain 3 additional HP per monk archetype feat taken"
        },
        advancedKata: {
          name: "Advanced Kata",
          level: 6,
          url: "https://2e.aonprd.com/Feats.aspx?ID=718",
          prerequisites: ["Basic Kata"],
          effect: "Gain one monk feat; monk level equals half character level for prerequisites",
          special: "Repeatable"
        },
        monkMoves: {
          name: "Monk Moves",
          level: 8,
          url: "https://2e.aonprd.com/Feats.aspx?ID=719",
          prerequisites: ["Monk Dedication"],
          effect: "+10-foot status bonus to Speed when unarmored"
        },
        monksFlurry: {
          name: "Monk's Flurry",
          level: 10,
          url: "https://2e.aonprd.com/Feats.aspx?ID=720",
          prerequisites: ["Monk Dedication"],
          effect: "Gain Flurry of Blows action; usable once per 1d4 rounds"
        },
        perfectionsPath: {
          name: "Perfection's Path",
          level: 12,
          url: "https://2e.aonprd.com/Feats.aspx?ID=721",
          prerequisites: ["Monk Dedication", "Expert in one saving throw"],
          effect: "Increase one saving throw proficiency from expert to master"
        }
      }
    }
  },

  // ==================== FEATS ====================
  // Source: Player Core, Archives of Nethys
  feats: {
    general: {
      toughness: {
        name: "Toughness",
        level: 1,
        type: "General",
        url: "https://2e.aonprd.com/Feats.aspx?ID=855",
        prerequisites: [],
        benefit: "Increase maximum HP by your level. Reduce dying value by 1 (minimum dying 1)",
        source: "Player Core pg. 267"
      },
      fleetfoot: {
        name: "Fleet",
        level: 1,
        type: "General",
        url: "https://2e.aonprd.com/Feats.aspx?ID=784",
        prerequisites: [],
        benefit: "Your Speed increases by 5 feet",
        source: "Player Core pg. 263"
      }
    },
    cleric: {
      shieldBlock: {
        name: "Shield Block",
        level: 1,
        type: "Class (Cleric)",
        url: "https://2e.aonprd.com/Feats.aspx?ID=839",
        prerequisites: [],
        benefit: "Use shield to reduce damage. Reaction. Reduce damage by shield's Hardness; both you and shield take remaining damage",
        trigger: "While you have your shield raised, you take damage from a physical attack",
        source: "Player Core pg. 266",
        notes: "Automatically granted to Warpriests at level 1"
      },
      deadlySimplicity: {
        name: "Deadly Simplicity",
        level: 1,
        type: "Cleric Doctrine",
        url: "https://2e.aonprd.com/Feats.aspx?ID=268",
        prerequisites: ["Warpriest doctrine", "Deity's favored weapon is simple"],
        benefit: "Increase deity's favored weapon damage die by one step (1d4→1d6, 1d6→1d8, etc.)",
        source: "Player Core pg. 117",
        notes: "Automatically granted to Warpriests if deity's weapon is simple"
      },
      harmedBlade: {
        name: "Harming Hands",
        level: 1,
        type: "Class (Cleric)",
        url: "https://2e.aonprd.com/Feats.aspx?ID=270",
        prerequisites: ["Harmful font or healing font"],
        benefit: "Cast harm or heal with only one action (single target, somatic), but can't cast further harm or heal spells for 1d4 rounds",
        source: "Player Core pg. 117"
      },
      channelSmite: {
        name: "Channel Smite",
        level: 4,
        type: "Class (Cleric)",
        url: "https://2e.aonprd.com/Feats.aspx?ID=265",
        prerequisites: ["Harmful font or healing font"],
        benefit: "2 actions. Make a melee Strike and expend a harm or heal spell to add damage/healing",
        source: "Player Core pg. 116"
      },
      commandUndead: {
        name: "Command Undead",
        level: 4,
        type: "Class (Cleric)",
        url: "https://2e.aonprd.com/Feats.aspx?ID=267",
        prerequisites: ["Harmful font", "Unholy sanctification"],
        benefit: "Expend a harm spell to cast Command targeting only undead",
        source: "Player Core pg. 117"
      }
    },
    monk: {
      kiStrike: {
        name: "Ki Strike",
        level: 1,
        type: "Class (Monk)",
        url: "https://2e.aonprd.com/Feats.aspx?ID=434",
        prerequisites: [],
        benefit: "Gain focus spell 'ki strike' - 1 action to make unarmed Strikes deal 1d6 extra damage (scales with level)",
        source: "Player Core pg. 154"
      },
      kiRush: {
        name: "Ki Rush",
        level: 1,
        type: "Class (Monk)",
        url: "https://2e.aonprd.com/Feats.aspx?ID=433",
        prerequisites: [],
        benefit: "Gain focus spell 'ki rush' - 1 action to move and ignore difficult terrain",
        source: "Player Core pg. 154"
      },
      stunningFist: {
        name: "Stunning Fist",
        level: 1,
        type: "Class (Monk)",
        url: "https://2e.aonprd.com/Feats.aspx?ID=448",
        prerequisites: ["Flurry of Blows"],
        benefit: "When you use Flurry of Blows, try to stun an opponent (Fortitude save vs class DC or stunned 1)",
        source: "Player Core pg. 155"
      },
      craneStance: {
        name: "Crane Stance",
        level: 1,
        type: "Class (Monk)",
        url: "https://2e.aonprd.com/Feats.aspx?ID=427",
        prerequisites: [],
        benefit: "1 action. Enter Crane Stance for +1 circumstance AC, deal 1d6 bludgeoning with crane wing attacks (finesse, nonlethal, unarmed). Can Fly 5 feet if you jump",
        source: "Player Core pg. 153"
      }
    },
    skill: {
      assurance: {
        name: "Assurance",
        level: 1,
        type: "Skill",
        url: "https://2e.aonprd.com/Feats.aspx?ID=756",
        prerequisites: ["Trained in chosen skill"],
        benefit: "Achieve result of 10 + proficiency rank on chosen skill without rolling",
        special: "Can select multiple times for different skills",
        source: "Player Core pg. 258"
      },
      battleMedicine: {
        name: "Battle Medicine",
        level: 1,
        type: "Skill",
        url: "https://2e.aonprd.com/Feats.aspx?ID=760",
        prerequisites: ["Trained in Medicine"],
        benefit: "1 action. Attempt Medicine check to heal creature without spending healer's tools. Can't use again on same target for 1 hour",
        source: "Player Core pg. 258"
      },
      intimidatingGlare: {
        name: "Intimidating Glare",
        level: 1,
        type: "Skill",
        url: "https://2e.aonprd.com/Feats.aspx?ID=796",
        prerequisites: ["Trained in Intimidation"],
        benefit: "Can Demoralize with glare alone (no language required)",
        source: "Player Core pg. 264"
      },
      catFall: {
        name: "Cat Fall",
        level: 1,
        type: "Skill",
        url: "https://2e.aonprd.com/Feats.aspx?ID=765",
        prerequisites: ["Trained in Acrobatics"],
        benefit: "Treat falls as 10 feet shorter; if expert, treat as 25 feet shorter; if master, 50 feet; if legendary, you don't take falling damage",
        source: "Player Core pg. 259"
      }
    }
  },

  // ==================== PROFICIENCY LEVELS ====================
  proficiencyLevels: {
    untrained: {
      name: "Untrained",
      bonus: 0,
      description: "No proficiency bonus"
    },
    trained: {
      name: "Trained",
      bonus: "level",
      description: "Proficiency bonus equals your level"
    },
    expert: {
      name: "Expert",
      bonus: "level + 2",
      description: "Proficiency bonus equals your level + 2"
    },
    master: {
      name: "Master",
      bonus: "level + 4",
      description: "Proficiency bonus equals your level + 4"
    },
    legendary: {
      name: "Legendary",
      bonus: "level + 6",
      description: "Proficiency bonus equals your level + 6"
    }
  },

  // ==================== GENERAL FEAT TYPES ====================
  featTypes: {
    ancestry: {
      name: "Ancestry Feat",
      description: "Feats tied to your character's ancestry, gained at 1st level and every 4 levels"
    },
    class: {
      name: "Class Feat",
      description: "Feats tied to your character's class, gained at even levels"
    },
    skill: {
      name: "Skill Feat",
      description: "Feats that expand your skill capabilities, gained at even levels starting at 2nd"
    },
    general: {
      name: "General Feat",
      description: "Versatile feats available to all characters, gained at 3rd level and every 4 levels"
    },
    archetype: {
      name: "Archetype Feat",
      description: "Feats from multiclass archetypes or other archetype options"
    }
  },

  // ==================== COMMON ACTIONS ====================
  actions: {
    stride: {
      name: "Stride",
      actions: 1,
      description: "Move up to your Speed"
    },
    strike: {
      name: "Strike",
      actions: 1,
      description: "Make a melee or ranged attack"
    },
    cast: {
      name: "Cast a Spell",
      actions: "Varies",
      description: "Cast a spell (varies by spell)"
    },
    raise: {
      name: "Raise a Shield",
      actions: 1,
      description: "Gain a +2 circumstance bonus to AC until the start of your next turn"
    },
    leap: {
      name: "Leap",
      actions: 1,
      description: "Jump a distance determined by your Athletics check"
    }
  },

  // ==================== DAMAGE TYPES ====================
  damageTypes: [
    "Acid",
    "Bludgeoning",
    "Cold",
    "Electricity",
    "Fire",
    "Force",
    "Mental",
    "Negative",
    "Piercing",
    "Poison",
    "Positive",
    "Slashing",
    "Sonic"
  ],

  // ==================== TRAITS ====================
  commonTraits: {
    humanoid: "A creature with this trait is a member of the humanoid ancestry",
    rare: "Requires special permission from GM to use",
    uncommon: "Requires training, permission, or circumstances to access",
    dedication: "Must be taken as character's 2nd-level class feat or higher"
  },

  // ==================== ABILITY SCORES ====================
  abilityScores: {
    strength: {
      name: "Strength",
      abbreviation: "STR",
      description: "Physical power and athleticism"
    },
    dexterity: {
      name: "Dexterity",
      abbreviation: "DEX",
      description: "Agility, reflexes, and balance"
    },
    constitution: {
      name: "Constitution",
      abbreviation: "CON",
      description: "Endurance and health"
    },
    intelligence: {
      name: "Intelligence",
      abbreviation: "INT",
      description: "Reasoning and memory"
    },
    wisdom: {
      name: "Wisdom",
      abbreviation: "WIS",
      description: "Awareness and insight"
    },
    charisma: {
      name: "Charisma",
      abbreviation: "CHA",
      description: "Confidence and presence"
    }
  },

  // ==================== SAVING THROWS ====================
  savingThrows: {
    fortitude: {
      name: "Fortitude",
      ability: "Constitution",
      description: "Resist diseases, poisons, and physical effects"
    },
    reflex: {
      name: "Reflex",
      ability: "Dexterity",
      description: "Dodge area effects and react quickly"
    },
    will: {
      name: "Will",
      ability: "Wisdom",
      description: "Resist mental effects and maintain composure"
    }
  },

  // ==================== DEITIES ====================
  // Source: Gods & Magic, Archives of Nethys
  deities: {
    achaekek: {
      name: "Achaekek",
      title: "He Who Walks in Blood",
      source: "Gods & Magic, https://2e.aonprd.com/Deities.aspx?ID=29",
      category: "Other Gods",
      alignment: "Lawful Evil",
      areasOfConcern: ["Assassins", "Divine punishments", "The Red Mantis"],
      edicts: [
        "Conduct assassinations",
        "Spread Red Mantis infamy",
        "Wield sawtooth sabers in combat"
      ],
      anathema: [
        "Kill a rightful ruler",
        "Fixate on petty matters like gender or ancestry",
        "Abandon agreed assassination contracts"
      ],
      divineAttribute: ["Strength", "Dexterity"],
      divineFont: "Harm",
      divineSanctification: "Unholy (selectable)",
      divineSkill: "Stealth",
      favoredWeapon: "Sawtooth saber",
      domains: ["Death", "Might", "Trickery", "Zeal"],
      alternateDomains: ["Duty", "Fate"],
      clericSpells: {
        1: "Sure Strike",
        2: "Invisibility",
        4: "Vision of Death"
      },
      sacredAnimal: "Crimson mantis",
      sacredColors: ["Red"],
      religiousSymbol: "Crossed mantis claws",
      divineIntercession: {
        minorBoon: "Automatic critical success on critical Stealth check failures (assassination-related)",
        moderateBoon: "Cast Blood Vendetta once daily (heightened to half character level)",
        majorBoon: "Gain sneak attack (3d6 precision damage) or increase existing sneak attack by 3d6",
        minorCurse: "Non-sapient insects become hostile",
        moderateCurse: "Red Mantis assassin tasked with eliminating the cursed character",
        majorCurse: "Instant death with soul sealed against resurrection"
      }
    },
    irori: {
      name: "Irori",
      title: "Master of Masters",
      source: "Player Core 2, https://2e.aonprd.com/Deities.aspx?ID=10",
      category: "Core Deities",
      alignment: "Lawful Neutral",
      areasOfConcern: ["History", "Knowledge", "Self-perfection"],
      edicts: [
        "Be humble",
        "Help others perfect themselves",
        "Hone your body, mind, and spirit to a high degree of perfection"
      ],
      anathema: [
        "Become addicted to a substance",
        "Destroy an important historical text",
        "Repeatedly fail to maintain self-control"
      ],
      divineAttribute: ["Strength", "Wisdom"],
      divineFont: "Harm or Heal", // Versatile Font
      divineSanctification: "None",
      divineSkill: "Athletics",
      favoredWeapon: "Fist (unarmed strikes)",
      domains: ["Knowledge", "Might", "Perfection", "Truth"],
      alternateDomains: ["Ambition", "Change"],
      clericSpells: {
        1: "Jump",
        3: "Haste",
        4: "Stoneskin"
      },
      sacredAnimal: "Snail",
      sacredColors: ["Blue", "White"],
      religiousSymbol: "Open blue palm",
      divineIntercession: {
        minorBoon: "+2 circumstance bonus on saves against mental effects",
        moderateBoon: "Perfect mental clarity - automatically succeed at concentration checks",
        majorBoon: "True self-mastery - once per day, automatically succeed at a save with a critical success",
        minorCurse: "-4 status penalty to Will saves",
        moderateCurse: "Body betrays you - roll twice on physical ability checks and take the lower result",
        majorCurse: "Mind and body in conflict - cannot perform any action that requires thought and physical ability simultaneously"
      }
    }
  },

  // ==================== EQUIPMENT ====================
  // Source: Player Core, Archives of Nethys
  equipment: {
    weapons: {
      sawtoothSaber: {
        name: "Sawtooth Saber",
        source: "Player Core, https://2e.aonprd.com/Weapons.aspx?ID=65",
        category: "Advanced melee weapon",
        price: "5 gp",
        damage: "1d6 slashing",
        bulk: "L",
        hands: 1,
        group: "Sword",
        traits: ["Uncommon", "Agile", "Finesse", "Twin"],
        specialization: "On critical hits with swords, the target becomes off-guard until your next turn",
        description: "The signature weapon of the Red Mantis assassins, this curved blade is serrated like a saw. Associated with Achaekek.",
        traitDetails: {
          agile: "Multiple attack penalties are -4 on second attack and -8 on subsequent ones",
          finesse: "Use Dexterity instead of Strength for attack rolls",
          twin: "Circumstance bonus to damage equal to weapon's damage dice (1d6) when you've attacked with a different weapon of the same type earlier that turn"
        }
      }
    },
    armor: {
      hideArmor: {
        name: "Hide Armor",
        source: "Player Core, https://2e.aonprd.com/Armor.aspx?ID=7",
        category: "Medium",
        price: "2 gp",
        acBonus: 3,
        dexCap: 2,
        checkPenalty: -2,
        speedPenalty: -5,
        strengthRequirement: 2,
        bulk: 2,
        group: "Leather",
        specialization: "Resistance to slashing damage equal to 1 + the value of the armor's potency rune for medium armor",
        description: "A mix of furs, sturdy hide, and sometimes molded boiled leather, hide armor provides basic protection for warriors."
      },
      breastplate: {
        name: "Breastplate",
        source: "Player Core, https://2e.aonprd.com/Armor.aspx?ID=10",
        category: "Medium",
        price: "8 gp",
        acBonus: 4,
        dexCap: 1,
        checkPenalty: -2,
        speedPenalty: -5,
        strengthRequirement: 3,
        bulk: 2,
        group: "Plate",
        specialization: "Resistance to slashing damage equal to 1 + the value of the armor's potency rune for medium armor",
        description: "Consists of several pieces of plate or half-plate armor that protect the torso, chest, neck, and sometimes the hips and lower legs. Allows greater flexibility than full plate."
      }
    }
  },

  // ==================== MONK CLASS (Full Class) ====================
  // Source: Player Core, Archives of Nethys
  monkClass: {
    name: "Monk",
    source: "Player Core, https://2e.aonprd.com/Classes.aspx?ID=8",
    keyAbility: "Strength or Dexterity",
    hitPoints: 10,
    perception: {
      1: "Trained",
      5: "Expert",
      13: "Master",
      19: "Legendary"
    },
    savingThrows: {
      fortitude: { 1: "Expert", 11: "Master" },
      reflex: { 1: "Expert", 13: "Master", 17: "Legendary" },
      will: { 1: "Expert", 11: "Master", 17: "Legendary" }
    },
    unarmedStrikeDamage: {
      1: "1d6",
      note: "Increased from base 1d4 via Powerful Fist class feature"
    },
    weaponProficiency: {
      simple: { 1: "Trained", 5: "Expert", 13: "Master" },
      unarmed: { 1: "Trained", 5: "Expert", 13: "Master", 19: "Legendary" }
    },
    armorProficiency: {
      unarmored: { 1: "Trained", 13: "Master", 17: "Legendary" }
    },
    classDC: {
      1: "Trained",
      9: "Expert",
      17: "Master"
    },
    classFeatures: {
      powerfulFist: {
        level: 1,
        description: "Damage die increases to 1d6; no penalty for lethal unarmed attacks"
      },
      flurryOfBlows: {
        level: 1,
        actions: 1,
        description: "Make two unarmed Strikes. If both hit the same creature, combine their damage for the purpose of resistances and weaknesses."
      },
      mysticStrikes: {
        level: 3,
        description: "Unarmed attacks count as magical"
      },
      speedBonus: {
        level: 3,
        description: "+10 ft. to Speed"
      },
      pathToPerfection: {
        level: 7,
        description: "Choose one save to increase to master proficiency"
      },
      weaponSpecialization: {
        level: 7,
        description: "Adds 2 damage (expert), 3 (master), or 4 (legendary)"
      },
      metalStrikes: {
        level: 9,
        description: "Treat unarmed attacks as cold iron and silver"
      },
      masterStrikes: {
        level: 13,
        description: "Master proficiency in unarmed attacks"
      },
      gracefulMastery: {
        level: 13,
        description: "Critical specialization effects with unarmed attacks"
      },
      perfectedForm: {
        level: 19,
        description: "Minimum roll of 10 on first Strike each turn"
      }
    }
  },

  // ==================== DIVINE SPELLS ====================
  // Source: Player Core, Archives of Nethys
  divineSpells: {
    cantrips: {
      divineLight: {
        name: "Divine Light",
        level: "Cantrip 1",
        traditions: ["Divine"],
        description: "Create light or harm undead",
        source: "Player Core"
      },
      shield: {
        name: "Shield",
        level: "Cantrip 1",
        traditions: ["Arcane", "Divine", "Occult"],
        actions: 1,
        description: "A shield of magical force appears, granting +1 circumstance bonus to AC and saving throws",
        source: "Player Core"
      }
    },
    level1: {
      heal: {
        name: "Heal",
        level: 1,
        traditions: ["Divine", "Primal"],
        actions: "1-3",
        description: "Restores hit points to living creatures",
        heightening: "Increases healing by 1d8 per spell rank",
        source: "Player Core"
      },
      harm: {
        name: "Harm",
        level: 1,
        traditions: ["Divine"],
        actions: "1-3",
        description: "Deals negative damage (inverse of Heal)",
        heightening: "Increases damage by 1d8 per spell rank",
        source: "Player Core"
      },
      bless: {
        name: "Bless",
        level: 1,
        traditions: ["Divine", "Occult"],
        actions: 2,
        description: "+1 status bonus to attack rolls for allies in 15-foot emanation",
        source: "Player Core"
      },
      command: {
        name: "Command",
        level: 1,
        traditions: ["Arcane", "Divine", "Occult"],
        actions: 2,
        description: "Force a creature to follow a one-word command",
        source: "Player Core"
      },
      sureStrike: {
        name: "Sure Strike",
        level: 1,
        traditions: ["Arcane", "Occult"],
        actions: 1,
        description: "Make an attack roll twice and use the better result",
        source: "Player Core",
        notes: "Granted by Achaekek at 1st level"
      }
    },
    level2: {
      invisibility: {
        name: "Invisibility",
        level: 2,
        traditions: ["Arcane", "Occult"],
        actions: 2,
        description: "A creature becomes invisible",
        source: "Player Core",
        notes: "Granted by Achaekek at 2nd level"
      }
    },
    level4: {
      visionOfDeath: {
        name: "Vision of Death",
        level: 4,
        traditions: ["Divine"],
        actions: 2,
        description: "Show a creature a vision of their death",
        source: "Player Core",
        notes: "Granted by Achaekek at 4th level"
      }
    }
  },

  // ==================== FEATS ====================
  // Source: Player Core, Howl of the Wild, Archives of Nethys
  feats: {
    general: {
      shieldBlock: {
        name: "Shield Block",
        level: 1,
        type: "General",
        prerequisites: [],
        description: "Trigger: While you have your shield raised, you would take damage from a physical attack. You snap your shield in place to deflect a blow. Your shield prevents you from taking an amount of damage up to the shield's Hardness. You and the shield each take any remaining damage, possibly breaking or destroying the shield.",
        source: "Player Core pg. 267",
        url: "https://2e.aonprd.com/Feats.aspx?ID=839",
        traits: ["General"],
        actions: "reaction"
      },
      toughness: {
        name: "Toughness",
        level: 1,
        type: "General",
        prerequisites: [],
        description: "You can withstand more punishment than most. Increase your maximum Hit Points by your level. The DC of recovery checks is equal to 9 + your dying condition value.",
        source: "Player Core pg. 268",
        url: "https://2e.aonprd.com/Feats.aspx?ID=855",
        traits: ["General"]
      },
      incredibleInitiative: {
        name: "Incredible Initiative",
        level: 1,
        type: "General",
        prerequisites: [],
        description: "You react more quickly than others can. You gain a +2 circumstance bonus to initiative rolls.",
        source: "Player Core pg. 264",
        url: "https://2e.aonprd.com/Feats.aspx?ID=794",
        traits: ["General"]
      },
      untrainedImprovisation: {
        name: "Untrained Improvisation",
        level: 3,
        type: "General",
        prerequisites: [],
        description: "Your proficiency bonus to untrained skill checks is equal to your level –2. This improves to your level –1 at 5th level and your full level at 7th level. This doesn't allow you to use the skill's trained actions.",
        source: "Player Core pg. 264",
        url: "https://2e.aonprd.com/Feats.aspx?ID=5233",
        traits: ["General"]
      },
      robustHealth: {
        name: "Robust Health",
        level: 3,
        type: "General",
        prerequisites: [],
        description: "Your physiology responds well to first aid. You gain a circumstance bonus to the number of Hit Points you regain equal to your level from a successful attempt to Treat your Wounds or use Battle Medicine on you. Additionally, after you or an ally use Battle Medicine on you, you become temporarily immune to additional Battle Medicine for 1 hour instead of 1 day.",
        source: "Player Core 2 pg. 233",
        url: "https://2e.aonprd.com/Feats.aspx?ID=6499",
        traits: ["General"]
      },
      fleet: {
        name: "Fleet",
        level: 1,
        type: "General",
        prerequisites: [],
        description: "Your Speed increases by 5 feet.",
        source: "Player Core pg. 263",
        url: "https://2e.aonprd.com/Feats.aspx?ID=784",
        traits: ["General"]
      }
    },
    skill: {
      intimidatingGlare: {
        name: "Intimidating Glare",
        level: 1,
        type: "Skill",
        prerequisites: ["Trained in Intimidation"],
        description: "You can Demoralize with a glare alone, without speaking. When you do, Demoralize loses the auditory trait and gains the visual trait.",
        source: "Player Core pg. 261",
        url: "https://2e.aonprd.com/Feats.aspx?ID=796",
        traits: ["General", "Skill"],
        skill: "Intimidation"
      },
      quickJump: {
        name: "Quick Jump",
        level: 1,
        type: "Skill (Athletics)",
        prerequisites: ["trained in Athletics"],
        description: "You can use High Jump and Long Jump as a single action instead of 2 actions. If you do, you don't perform the initial Stride (nor do you fail if you don't Stride 10 feet).",
        source: "Player Core pg. 260",
        url: "https://2e.aonprd.com/Feats.aspx?ID=825",
        traits: ["General", "Skill"],
        skill: "Athletics"
      },
      riskySurgery: {
        name: "Risky Surgery",
        level: 1,
        type: "Skill (Medicine)",
        prerequisites: ["trained in Medicine"],
        description: "Your surgery can bring a patient back from the brink of death, but might push them over the edge. When you Treat Wounds, you can deal 1d8 slashing damage to your patient just before applying the effects of Treat Wounds. If you do, you gain a +2 circumstance bonus to your Medicine check to Treat Wounds, and if you roll a success, you get a critical success instead.",
        source: "Player Core 2 pg. 233",
        url: "https://2e.aonprd.com/Feats.aspx?ID=2146",
        traits: ["General", "Skill"],
        skill: "Medicine"
      },
      battleMedicine: {
        name: "Battle Medicine",
        level: 1,
        type: "Skill",
        prerequisites: ["Trained in Medicine"],
        description: "You can patch up yourself or an adjacent ally, even in combat. Attempt a Medicine check with the same DC as for Treat Wounds, and restore a corresponding amount of Hit Points; this doesn't remove the wounded condition. The target is then temporarily immune to your Battle Medicine for 1 day.",
        source: "Player Core pg. 258",
        url: "https://2e.aonprd.com/Feats.aspx?ID=760",
        traits: ["General", "Healing", "Manipulate", "Skill"],
        skill: "Medicine",
        actions: "1 action"
      },
      continualRecovery: {
        name: "Continual Recovery",
        level: 2,
        type: "Skill (Medicine)",
        prerequisites: ["expert in Medicine"],
        description: "You zealously monitor a patient's progress to administer treatment faster. When you Treat Wounds, your patient becomes immune for only 10 minutes instead of 1 hour. This applies only to your Treat Wounds activities, not any other the patient receives.",
        source: "Player Core pg. 254",
        url: "https://2e.aonprd.com/Feats.aspx?ID=5137",
        traits: ["General", "Skill"],
        skill: "Medicine"
      },
      assurance: {
        name: "Assurance",
        level: 1,
        type: "Skill",
        prerequisites: ["Trained in any skill"],
        description: "Even in the worst of circumstances, you can perform basic tasks. Choose a skill you're trained in. You can forgo rolling a skill check for that skill to instead receive a result of 10 + your proficiency bonus (do not apply any other bonuses, penalties, or modifiers). Special: You can select this feat multiple times, choosing a different skill each time.",
        source: "Player Core pg. 258",
        url: "https://2e.aonprd.com/Feats.aspx?ID=756",
        traits: ["Fortune", "General", "Skill"]
      },
      advancedFirstAid: {
        name: "Advanced First Aid",
        level: 7,
        type: "Skill (Medicine)",
        prerequisites: ["master in Medicine"],
        description: "When you use Medicine to Administer First Aid, instead of Stabilizing a character or Stopping Bleeding, you can reduce an ally's frightened or sickened condition by 2, or remove either of those conditions entirely on a critical success. You can remove only one condition at a time. The DC for the check is usually the DC of the effect that caused the condition.",
        source: "Player Core pg. 252",
        url: "https://2e.aonprd.com/Feats.aspx?ID=2107",
        traits: ["General", "Healing", "Manipulate", "Skill"],
        skill: "Medicine"
      },
      quickSwim: {
        name: "Quick Swim",
        level: 7,
        type: "Skill (Athletics)",
        prerequisites: ["master in Athletics"],
        description: "You Swim 5 feet farther on a success and 10 feet farther on a critical success, to a maximum of your Speed. If you're legendary in Athletics, you gain a swim Speed equal to your Speed.",
        source: "Player Core pg. 260",
        url: "https://2e.aonprd.com/Feats.aspx?ID=829",
        traits: ["General", "Skill"],
        skill: "Athletics"
      },
      planarSurvival: {
        name: "Planar Survival",
        level: 7,
        type: "Skill (Survival)",
        prerequisites: ["master in Survival"],
        description: "You can Subsist using Survival on different planes, even those without resources or natural phenomena you normally need. For instance, you can forage for food even if the plane lacks food that could normally sustain you. A successful Survival check to Subsist on a plane prevents you and the creatures you care for from taking damage from the plane's environment, unless that plane lacks the default surface, air, and gravity or there's a specific hazard or trap that deals this damage.",
        source: "Player Core pg. 259",
        url: "https://2e.aonprd.com/Feats.aspx?ID=819",
        traits: ["General", "Skill"],
        skill: "Survival"
      },
      legendaryMedic: {
        name: "Legendary Medic",
        level: 15,
        type: "Skill (Medicine)",
        prerequisites: ["legendary in Medicine"],
        description: "You've discovered medical breakthroughs or techniques that achieve miraculous results. Once per day for each target, you can spend 1 hour treating that target and attempt a Medicine check to remove a disease or the blinded, deafened, doomed, or drained condition. Use the DC of the disease or of the spell or effect that created the condition. If the effect's source is an artifact, above 20th level, or similarly powerful, increase the DC by 10.",
        source: "Player Core pg. 257",
        url: "https://2e.aonprd.com/Feats.aspx?ID=803",
        traits: ["General", "Skill"],
        skill: "Medicine"
      },
      cloudJump: {
        name: "Cloud Jump",
        level: 15,
        type: "Skill (Athletics)",
        prerequisites: ["legendary in Athletics"],
        description: "Your unparalleled athletic skill allows you to jump impossible distances. Triple the distance you Long Jump (so you could jump 90 feet on a successful DC 30 check). When you High Jump, use the calculation for a Long Jump but don't triple the distance. You can jump a distance greater than your Speed by spending additional actions when you Long Jump or High Jump. For every extra action spent, add your Speed to the limit on how far you can jump.",
        source: "Player Core pg. 253",
        url: "https://2e.aonprd.com/Feats.aspx?ID=767",
        traits: ["General", "Skill"],
        skill: "Athletics"
      },
      legendarySurvivalist: {
        name: "Legendary Survivalist",
        level: 15,
        type: "Skill (Survival)",
        prerequisites: ["legendary in Survival"],
        description: "You can survive indefinitely without food or water and can endure severe, extreme, and incredible cold and heat without taking damage from doing so.",
        source: "Player Core pg. 258",
        url: "https://2e.aonprd.com/Feats.aspx?ID=808",
        traits: ["General", "Skill"],
        skill: "Survival"
      }
    },
    cleric: {
      deadlySimplicity: {
        name: "Deadly Simplicity",
        level: 1,
        type: "Cleric (Warpriest)",
        prerequisites: ["Warpriest Doctrine"],
        description: "Your deity's weapon is especially deadly in your hands. When you are wielding your deity's favored weapon, increase its damage die size by one step. If the weapon has the two-hand trait, increase its damage when wielded in two hands by one step instead. (This increases from 1d4 to 1d6, 1d6 to 1d8, 1d8 to 1d10, 1d10 to 1d12, and 1d12 to 2d6.) The extra damage doesn't stack with the bonus damage from using the weapon in two hands if the weapon has the versatile or two-hand trait; you choose only one benefit.",
        source: "Player Core pg. 112",
        url: "https://2e.aonprd.com/Classes.aspx?ID=5",
        traits: ["Cleric"],
        granted: "Warpriest Doctrine (Level 1)"
      },
      communalHealing: {
        name: "Communal Healing",
        level: 2,
        type: "Cleric",
        prerequisites: ["Healing Font"],
        description: "You can direct excess healing energy to another creature. When you cast heal targeting a single creature and restore more Hit Points than necessary to bring the target to their maximum HP, you can grant a different creature within 30 feet of the target the excess healing.",
        source: "Player Core pg. 121",
        url: "https://2e.aonprd.com/Feats.aspx?ID=1925",
        traits: ["Cleric"]
      },
      harmfulFont: {
        name: "Harmful Font",
        level: 2,
        type: "Cleric",
        prerequisites: [],
        description: "You gain additional divine spellcasting slots, all of which must be used to prepare harm spells. At 1st level, you can prepare an additional 1st-rank spell, plus one additional spell for each spell rank you can cast.",
        source: "Player Core pg. 121",
        url: "https://2e.aonprd.com/Feats.aspx?ID=1926",
        traits: ["Cleric"]
      },
      versatileFont: {
        name: "Versatile Font",
        level: 2,
        type: "Cleric",
        prerequisites: ["harmful font or healing font", "deity that allows clerics to have both fonts"],
        description: "As you explore your deity's aspects, you move beyond restrictions on healing or harming. You can prepare either harm or heal in the spell slots gained from the harmful font or healing font.",
        source: "Player Core pg. 115",
        url: "https://2e.aonprd.com/Feats.aspx?ID=275",
        traits: ["Cleric"]
      },
      channelSmite: {
        name: "Channel Smite",
        level: 4,
        type: "Cleric",
        prerequisites: ["Divine Font (Harm or Heal)"],
        description: "Cost: Expend a harm or heal spell. You siphon the destructive energies of harm or the healing energies of heal through your attack and smite your foe. Make a melee Strike and add the spell's damage to the Strike's damage. This is negative damage if you expended harm, or positive damage if you expended heal. The spell is expended with no effect if your Strike fails or hits a creature that isn't damaged by that energy type.",
        source: "Player Core pg. 121",
        url: "https://2e.aonprd.com/Feats.aspx?ID=1927",
        traits: ["Cleric", "Concentrate"],
        actions: "2 actions"
      },
      divineInfusion: {
        name: "Divine Infusion",
        level: 4,
        type: "Cleric",
        prerequisites: [],
        description: "You pour energy into the subject of your healing to empower its attacks. If the next action you use is to cast harm or heal to restore Hit Points to a single creature, the target deals an additional 1d6 damage of the spell's type (void for harm, vitality for heal) with its melee weapons and unarmed attacks until the end of its next turn. If the spell's rank is 5th or higher, increase this to 2d6, and if the spell is 8th rank or higher, increase it to 3d6.",
        source: "Player Core pg. 116",
        url: "https://2e.aonprd.com/Feats.aspx?ID=4657",
        traits: ["Cleric", "Concentrate", "Spellshape"],
        actions: "1 action"
      },
      selectiveEnergy: {
        name: "Selective Energy",
        level: 6,
        type: "Cleric",
        prerequisites: [],
        description: "When you cast a version of harm or heal that has an area, you can designate up to 5 creatures in the area that are not targeted by the spell.",
        source: "Player Core pg. 117",
        url: "https://2e.aonprd.com/Feats.aspx?ID=283",
        traits: ["Cleric"]
      },
      zealousRush: {
        name: "Zealous Rush",
        level: 8,
        type: "Cleric",
        prerequisites: [],
        description: "You bless yourself on the move. Stride up to 10 feet. If the spell took 2 or more actions, you can Stride up to your full Speed instead.",
        source: "Player Core pg. 118",
        url: "https://2e.aonprd.com/Feats.aspx?ID=4674",
        traits: ["Cleric"],
        actions: "reaction",
        trigger: "You cast a divine spell that takes 1 action or more to cast and that affects only you or your equipment"
      },
      replenishmentOfWar: {
        name: "Replenishment of War",
        level: 10,
        type: "Cleric",
        prerequisites: ["expert proficiency in your deity's favored weapon"],
        description: "Striking out against your enemies draws praise and protection from your deity. When you damage a creature with a Strike using your deity's favored weapon, you gain a number of temporary Hit Points equal to half your level, or equal to your level if the Strike was a critical hit. These temporary Hit Points last until the start of your next turn.",
        source: "Player Core pg. 118",
        url: "https://2e.aonprd.com/Feats.aspx?ID=293",
        traits: ["Cleric"]
      },
      defensiveRecovery: {
        name: "Defensive Recovery",
        level: 12,
        type: "Cleric",
        prerequisites: [],
        description: "Your faith provides temporary protection in addition to healing. If the next action you use is to cast harm or heal on a single target and the target regains Hit Points from the spell, it also gains a +2 status bonus to AC and saving throws for 1 round.",
        source: "Player Core pg. 119",
        url: "https://2e.aonprd.com/Feats.aspx?ID=294",
        traits: ["Cleric", "Concentrate", "Spellshape"],
        actions: "1 action"
      },
      fastChannel: {
        name: "Fast Channel",
        level: 14,
        type: "Cleric",
        prerequisites: ["harmful font or healing font"],
        description: "Divine power is always at your fingertips, swiftly responding to your call. When you cast harm or heal by spending 2 actions, you can get the effects of the 3-action version instead. You can do this with harm if you have harmful font or heal if you have healing font (or both if you have Versatile Font).",
        source: "Player Core pg. 119",
        url: "https://2e.aonprd.com/Feats.aspx?ID=300",
        traits: ["Cleric"]
      },
      eternalBlessing: {
        name: "Eternal Blessing",
        level: 16,
        type: "Cleric",
        prerequisites: ["holy"],
        description: "You are perpetually surrounded by a bless spell. The spell has a spell rank equal to half your level rounded up and a 15-foot radius, which you can't increase. You can Dismiss the spell; if you do, it returns automatically after 1 minute.",
        source: "Player Core pg. 120",
        url: "https://2e.aonprd.com/Feats.aspx?ID=303",
        traits: ["Cleric"]
      },
      inviolable: {
        name: "Inviolable",
        level: 18,
        type: "Cleric",
        prerequisites: [],
        description: "The divine grace that surrounds you makes you difficult to harm. You gain resistance 3 to all damage. At 20th level, this increases to resistance 5.",
        source: "Player Core pg. 120",
        url: "https://2e.aonprd.com/Feats.aspx?ID=2002",
        traits: ["Cleric"]
      },
      makerOfMiracles: {
        name: "Maker of Miracles",
        level: 20,
        type: "Cleric",
        prerequisites: ["miraculous spell"],
        description: "You are a conduit for truly deific power. You gain an additional 10th-rank spell slot.",
        source: "Player Core pg. 121",
        url: "https://2e.aonprd.com/Feats.aspx?ID=309",
        traits: ["Cleric"]
      }
    },
    minotaur: {
      gouginghorn: {
        name: "Gouging Horn",
        level: 1,
        type: "Minotaur",
        prerequisites: ["Minotaur"],
        description: "Your horns are particularly sharp. Your horn unarmed attack gains the deadly d8 trait.",
        source: "Howl of the Wild",
        url: "https://2e.aonprd.com/Feats.aspx?ID=4673",
        traits: ["Minotaur"]
      },
      poundingRush: {
        name: "Pounding Rush",
        level: 5,
        type: "Minotaur",
        prerequisites: ["Minotaur"],
        description: "You Stride up to your Speed. If you end your movement within melee reach of at least one enemy, you can make a horn Strike against that enemy. If you moved at least 10 feet, your horn deals an extra 1d6 damage on this Strike. A creature that takes damage from this Strike must succeed at a Fortitude save against your class DC or spell DC (whichever is higher) or become stunned 1.",
        source: "Howl of the Wild",
        url: "https://2e.aonprd.com/Feats.aspx?ID=4674",
        traits: ["Minotaur"],
        actions: "2 actions"
      },
      unstoppableBull: {
        name: "Unstoppable Bull",
        level: 9,
        type: "Minotaur",
        prerequisites: ["Minotaur"],
        description: "Your sheer mass makes you difficult to stop. When you succeed at an Athletics check to Shove, you can push the target up to 10 feet away instead of 5 feet. When you critically succeed, you can push the target up to 20 feet instead of 10 feet.",
        source: "Howl of the Wild",
        url: "https://2e.aonprd.com/Feats.aspx?ID=4675",
        traits: ["Minotaur"]
      }
    },
    dragonblood: {
      breathOfTheDragon: {
        name: "Breath of the Dragon",
        level: 1,
        type: "Ancestry (Dragonblood)",
        prerequisites: ["Dragonblood versatile heritage"],
        description: "You tap into your draconic physiology to exhale a torrent of energy in either a 15-foot cone or a 30-foot line, dealing 1d4 damage. Each creature in the area must attempt a basic saving throw against the higher of your class DC or spell DC. You can't use Breath of the Dragon again for 1d4 rounds. At 3rd level and every 2 levels thereafter, the damage increases by 1d4. The shape of the breath, the damage type, and the saving throw match those of your draconic exemplar.",
        source: "Player Core 2 pg. 45",
        url: "https://2e.aonprd.com/Feats.aspx?ID=5730",
        traits: ["Dragonblood", "Magical"],
        actions: "2 actions"
      },
      dragonbloodParagon: {
        name: "Dragonblood Paragon",
        level: 3,
        type: "Dragonblood",
        prerequisites: ["Dragonblood Heritage"],
        description: "Your draconic heritage manifests in powerful ways. Choose one type of chromatic or metallic dragon. You gain resistance equal to half your level to the damage type associated with that dragon (see below). Special: You can take this feat only if you have the dragonblood trait.",
        source: "Howl of the Wild pg. 39",
        url: "https://2e.aonprd.com/Feats.aspx?ID=2387",
        traits: ["Dragonblood"]
      },
      dragonsFlight: {
        name: "Dragon's Flight",
        level: 5,
        type: "Ancestry (Dragonblood)",
        prerequisites: ["Dragonblood versatile heritage"],
        description: "You have grown a small pair of draconic wings or have honed your use of the wings you've had since birth. You can Fly, and if you don't normally have a fly Speed, you gain a fly Speed of 20 feet for this movement. However, if you aren't on solid ground at the end of this movement, you fall.",
        source: "Player Core 2 pg. 46",
        url: "https://2e.aonprd.com/Feats.aspx?ID=5738",
        traits: ["Dragonblood"],
        actions: "1 action",
        frequency: "once per round"
      },
      wyrmscaledKobold: {
        name: "Wyrmscaled",
        level: 5,
        type: "Dragonblood",
        prerequisites: ["Dragonblood Heritage"],
        description: "Draconic scales cover parts of your body. You gain a +1 circumstance bonus to AC against attacks from dragons, and if you're also unarmored, you gain a +1 circumstance bonus to AC against all other attacks as well.",
        source: "Howl of the Wild pg. 39",
        url: "https://2e.aonprd.com/Feats.aspx?ID=2390",
        traits: ["Dragonblood"]
      },
      trueDragonsFlight: {
        name: "True Dragon's Flight",
        level: 9,
        type: "Ancestry (Dragonblood)",
        prerequisites: ["Dragon's Flight"],
        description: "Your draconic wings have grown more powerful, capable of keeping you aloft at all times. You gain a fly Speed of 20 feet at all times.",
        source: "Player Core 2 pg. 47",
        url: "https://2e.aonprd.com/Feats.aspx?ID=5741",
        traits: ["Dragonblood"]
      },
      formidableBreath: {
        name: "Formidable Breath",
        level: 13,
        type: "Ancestry (Dragonblood)",
        prerequisites: ["Breath of the Dragon"],
        description: "Thanks to rigorous breathing exercises and a diet similar to that of your lineage, your magical breath is more powerful. The area of your Breath of the Dragon increases to 30 feet for a cone or 60 feet for a line, and the damage dice are d6s instead of d4s.",
        source: "Player Core 2 pg. 47",
        url: "https://2e.aonprd.com/Feats.aspx?ID=5740",
        traits: ["Dragonblood"]
      },
      lingeringBreath: {
        name: "Lingering Breath",
        level: 17,
        type: "Ancestry (Dragonblood)",
        prerequisites: ["Breath of the Dragon"],
        description: "Your draconic breath destroys the environment and leaves enemies in pain. When you use Breath of the Dragon, the area becomes difficult terrain for 1 minute. Creatures who fail or critically fail their saving throw against your Breath of the Dragon take 2d6 persistent damage of the same type as the breath weapon.",
        source: "Player Core 2 pg. 47",
        url: "https://2e.aonprd.com/Feats.aspx?ID=5746",
        traits: ["Dragonblood"]
      }
    }
  },

  // ==================== FEAT PROGRESSION ====================
  // When characters gain feats by level
  featProgression: {
    ancestry: [1, 5, 9, 13, 17], // Ancestry feat levels
    class: [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20], // Class feat levels
    skill: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20], // Skill feat levels (every even level)
    general: [3, 7, 11, 15, 19] // General feat levels
  },

  // ==================== SKILL TRAINING ====================
  // When characters gain skill increases
  skillProgression: {
    // At level 1: Background (2 skills), Class (Religion + INT mod skills)
    // At level 2: 1 skill increase
    // At level 3+: 1 skill increase every odd level
    increases: [2, 3, 5, 7, 9, 11, 13, 15, 17, 19], // Levels when you gain skill increases
    // Each increase lets you:
    // - Become trained in a new skill
    // - Increase a trained skill to expert
    // - Increase an expert skill to master
    // - Increase a master skill to legendary
    maxRank: {
      trained: 1,
      expert: 7, // Can reach expert at level 7
      master: 15, // Can reach master at level 15
      legendary: 20 // Can reach legendary only at level 20 (for most characters)
    }
  }
};

export default pathfinderRules;
