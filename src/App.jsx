import React, { useState, useEffect } from 'react';
import { Sword, Heart, Shield, Zap, BookOpen, User, TrendingUp, Feather, Target, Plus, Trash2, Edit2, Check, X, Package, Sparkles, Info, ExternalLink, Award, GraduationCap } from 'lucide-react';
import pathfinderRules from './pathfinderRules.js';
import {
  CHARACTER_IDENTITY,
  BASE_ABILITY_SCORES,
  INITIAL_FEATS,
  INITIAL_SKILL_PROFICIENCIES,
  INITIAL_EQUIPMENT,
  EQUIPMENT_DATABASE,
  ATTRIBUTE_MODIFIERS
} from './characterConfig.js';

// Helper function to calculate max HP based on level
function calculateMaxHP(level) {
  // Base HP: Class HP + Ancestry HP + CON modifier
  // Per level: Class HP + CON modifier
  // Source: Player Core pg. 112 (Cleric), Howl of the Wild (Minotaur)
  const classHP = CHARACTER_IDENTITY.class.hitPoints; // 8 for Cleric
  const ancestryHP = CHARACTER_IDENTITY.ancestry.hitPoints; // 10 for Minotaur
  const conModifier = Math.floor((BASE_ABILITY_SCORES.CON - 10) / 2); // CON 14 = +2 modifier

  const baseHP = classHP + ancestryHP + conModifier; // 8 + 10 + 2 = 20
  const hpPerLevel = classHP + conModifier; // 8 + 2 = 10
  return baseHP + (level - 1) * hpPerLevel;
}

// Helper function to get proficiency bonus based on rank
// Per PF2e rules: Trained = level, Expert = level+2, Master = level+4, Legendary = level+6
function getProficiencyBonus(level, rank = 'trained') {
  const trained = level;
  const expert = level + 2;
  const master = level + 4;
  const legendary = level + 6;

  switch(rank) {
    case 'expert': return expert;
    case 'master': return master;
    case 'legendary': return legendary;
    default: return trained;
  }
}

// Helper function to get ability modifier based on level
// Implements official PF2e ability boost rules with 18+ cap
// Source: Player Core pg. 27 - "Ability Boosts give +2 to score, or +1 if score is 18+"
// Character-specific boost progression from MINOTAUR_CLERIC_CHARACTER_SHEET.md:
// Level 1: STR, DEX, CON, WIS (already in baseScore)
// Level 5: STR, DEX, CON, WIS
// Level 10: STR, DEX, CON, WIS
// Level 15: STR, DEX, CON, WIS
// Level 20: INT, CON, CHA, WIS
function getAbilityScore(baseScore, ability, level) {
  let currentScore = baseScore;

  // Helper to apply a boost (respects 18+ cap)
  const applyBoost = (score) => {
    if (score >= 18) {
      return score + 1; // Only +1 if score is 18 or higher
    }
    return score + 2; // +2 if score is below 18
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

function getModifier(score) {
  return Math.floor((score - 10) / 2);
}

// Helper function to get max spell slots per day
function getMaxSpellSlots(level, rank) {
  // Cleric spell progression
  const spellSlots = {
    1: { rank1: 2 },
    2: { rank1: 3 },
    3: { rank1: 3, rank2: 2 },
    4: { rank1: 3, rank2: 3 },
    5: { rank1: 3, rank2: 3, rank3: 2 },
    6: { rank1: 3, rank2: 3, rank3: 3 },
    7: { rank1: 3, rank2: 3, rank3: 3, rank4: 2 },
    8: { rank1: 3, rank2: 3, rank3: 3, rank4: 3 },
    9: { rank1: 3, rank2: 3, rank3: 3, rank4: 3, rank5: 2 },
    10: { rank1: 3, rank2: 3, rank3: 3, rank4: 3, rank5: 3 },
    11: { rank1: 3, rank2: 3, rank3: 3, rank4: 3, rank5: 3, rank6: 2 },
    12: { rank1: 3, rank2: 3, rank3: 3, rank4: 3, rank5: 3, rank6: 3 },
    13: { rank1: 3, rank2: 3, rank3: 3, rank4: 3, rank5: 3, rank6: 3, rank7: 2 },
    14: { rank1: 3, rank2: 3, rank3: 3, rank4: 3, rank5: 3, rank6: 3, rank7: 3 },
    15: { rank1: 3, rank2: 3, rank3: 3, rank4: 3, rank5: 3, rank6: 3, rank7: 3, rank8: 2 },
    16: { rank1: 3, rank2: 3, rank3: 3, rank4: 3, rank5: 3, rank6: 3, rank7: 3, rank8: 3 },
    17: { rank1: 3, rank2: 3, rank3: 3, rank4: 3, rank5: 3, rank6: 3, rank7: 3, rank8: 3, rank9: 2 },
    18: { rank1: 3, rank2: 3, rank3: 3, rank4: 3, rank5: 3, rank6: 3, rank7: 3, rank8: 3, rank9: 3 },
    19: { rank1: 3, rank2: 3, rank3: 3, rank4: 3, rank5: 3, rank6: 3, rank7: 3, rank8: 3, rank9: 3, rank10: 1 },
    20: { rank1: 3, rank2: 3, rank3: 3, rank4: 3, rank5: 3, rank6: 3, rank7: 3, rank8: 3, rank9: 3, rank10: 1 }
  };

  return spellSlots[level]?.[rank] || 0;
}

// Helper function to get divine font slots
function getDivineFontSlots(level) {
  if (level >= 15) return 6;
  if (level >= 5) return 5;
  return 4;
}

// Helper function to calculate total bulk carried
function calculateTotalBulk(gear) {
  return gear.reduce((total, item) => {
    const bulk = item.bulk || 0;
    const quantity = item.quantity || 1;

    if (bulk === 'L') {
      // Light items: 10 light items = 1 bulk
      return total + (0.1 * quantity);
    }
    return total + (bulk * quantity);
  }, 0);
}

// Helper function to get equipment stat modifiers
// Returns object with all bonuses from equipped gear
function getEquipmentModifiers(gear) {
  const modifiers = {
    ac: { value: 0, sources: [] },
    attackBonus: { value: 0, sources: [] },
    damageBonus: { value: 0, sources: [] },
    savingThrows: { value: 0, sources: [] },
    speed: { value: 0, sources: [] }
  };

  gear.filter(item => item.equipped).forEach(item => {
    // Check if item has equipment database entry
    const dbKey = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    let equipData = null;

    // Search in all equipment categories
    if (EQUIPMENT_DATABASE.armor[dbKey]) {
      equipData = EQUIPMENT_DATABASE.armor[dbKey];
    } else if (EQUIPMENT_DATABASE.shields[dbKey]) {
      equipData = EQUIPMENT_DATABASE.shields[dbKey];
    } else if (EQUIPMENT_DATABASE.weapons[dbKey]) {
      equipData = EQUIPMENT_DATABASE.weapons[dbKey];
    } else if (EQUIPMENT_DATABASE.runes[dbKey]) {
      equipData = EQUIPMENT_DATABASE.runes[dbKey];
    } else if (EQUIPMENT_DATABASE.adventuringGear[dbKey]) {
      equipData = EQUIPMENT_DATABASE.adventuringGear[dbKey];
    }

    // Apply stat modifiers if found
    if (equipData) {
      // AC bonuses from armor/shields
      if (equipData.acBonus) {
        modifiers.ac.value += equipData.acBonus;
        modifiers.ac.sources.push({ name: equipData.name, bonus: equipData.acBonus, type: 'item' });
      }

      // Speed penalties from armor
      if (equipData.speedPenalty) {
        modifiers.speed.value += equipData.speedPenalty;
        modifiers.speed.sources.push({ name: equipData.name, penalty: equipData.speedPenalty, type: 'armor' });
      }

      // Rune bonuses
      if (equipData.statModifiers) {
        if (equipData.statModifiers.acBonus) {
          modifiers.ac.value += equipData.statModifiers.acBonus;
          modifiers.ac.sources.push({ name: equipData.name, bonus: equipData.statModifiers.acBonus, type: 'item' });
        }
        if (equipData.statModifiers.attackBonus) {
          modifiers.attackBonus.value += equipData.statModifiers.attackBonus;
          modifiers.attackBonus.sources.push({ name: equipData.name, bonus: equipData.statModifiers.attackBonus, type: 'item' });
        }
        if (equipData.statModifiers.savingThrowBonus) {
          modifiers.savingThrows.value += equipData.statModifiers.savingThrowBonus;
          modifiers.savingThrows.sources.push({ name: equipData.name, bonus: equipData.statModifiers.savingThrowBonus, type: 'item' });
        }
      }

      // Store equipment data on item for reference
      item.equipmentData = equipData;
    }
  });

  return modifiers;
}

// Helper function to search equipment database
function searchEquipmentDatabase(query) {
  const results = [];
  const searchTerm = query.toLowerCase();

  // Search all categories
  Object.values(EQUIPMENT_DATABASE.armor).forEach(item => {
    if (item.name.toLowerCase().includes(searchTerm)) {
      results.push(item);
    }
  });
  Object.values(EQUIPMENT_DATABASE.shields).forEach(item => {
    if (item.name.toLowerCase().includes(searchTerm)) {
      results.push(item);
    }
  });
  Object.values(EQUIPMENT_DATABASE.weapons).forEach(item => {
    if (item.name.toLowerCase().includes(searchTerm)) {
      results.push(item);
    }
  });
  Object.values(EQUIPMENT_DATABASE.runes).forEach(item => {
    if (item.name.toLowerCase().includes(searchTerm)) {
      results.push(item);
    }
  });
  Object.values(EQUIPMENT_DATABASE.adventuringGear).forEach(item => {
    if (item.name.toLowerCase().includes(searchTerm)) {
      results.push(item);
    }
  });

  return results;
}

// AI Storytelling API function
async function generateStoryLog(prompt, characterContext) {
  try {
    const apiUrl = `${import.meta.env.VITE_OLLAMA_API_URL || 'http://100.1.100.201:11434'}/v1/chat/completions`;

    console.log('Generating story log for:', prompt);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2:3b',
        messages: [
          {
            role: 'system',
            content: 'Write ONE vivid sentence describing this Pathfinder 2e character moment. Keep it under 20 words. Be concise and dramatic.'
          },
          {
            role: 'user',
            content: `Character: ${characterContext.name} (${characterContext.gender}, Lvl ${characterContext.level} ${characterContext.ancestry} ${characterContext.class})
HP: ${characterContext.hp}/${characterContext.maxHP}
Equipped: ${characterContext.equippedItems}
Action: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`API returned ${response.status}: ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();
    console.log('Story log generated successfully');
    return data.choices[0]?.message?.content || 'The story unfolds...';
  } catch (error) {
    console.error('Error generating story log:', error);

    // Return a fallback message that's still thematic
    return `${characterContext.name} continues their journey through the realm. [AI storytelling unavailable]`;
  }
}

export default function MinotaurCampaignTracker() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mounted, setMounted] = useState(false);
  
  // Character progression state
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('character-level');
    return saved ? parseInt(saved) : 1;
  });
  
  const [currentHP, setCurrentHP] = useState(() => {
    const saved = localStorage.getItem('current-hp');
    return saved ? parseInt(saved) : 10;
  });

  const [maxHP, setMaxHP] = useState(() => {
    const saved = localStorage.getItem('max-hp');
    return saved ? parseInt(saved) : 10;
  });

  // Auto-update max HP when level changes
  useEffect(() => {
    const newMaxHP = calculateMaxHP(level);
    setMaxHP(newMaxHP);
    // Don't let current HP exceed new max
    if (currentHP > newMaxHP) {
      setCurrentHP(newMaxHP);
    }
  }, [level]);

  // Notes state
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('campaign-notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [noteInput, setNoteInput] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  // Gear state - equipment scales with level
  const [gear, setGear] = useState(() => {
    const saved = localStorage.getItem('gear-inventory');
    if (saved) return JSON.parse(saved);

    // Default level 20 equipment from Pathbuilder
    return [
      {
        id: 1,
        name: 'Handwraps of Mighty Blows (+3 Major Striking)',
        equipped: true,
        type: 'weapon',
        description: 'These cloth strips wreathe your hands in powerful magic. Attack rolls with unarmed strikes gain +3 item bonus, and damage increases to 3 weapon dice.',
        source: 'Player Core pg. 581',
        url: 'https://2e.aonprd.com/Equipment.aspx?ID=1062',
        runes: {
          potency: '+3',
          striking: 'Major Striking (3 dice)',
          property: []
        }
      },
      {
        id: 2,
        name: 'Lattice Armor (+3 Major Resilient)',
        equipped: true,
        type: 'armor',
        description: 'Medium armor made of interlocking metal plates. AC bonus +6, Dex cap +1. Resilient rune grants +3 to all saves.',
        source: 'Player Core pg. 556',
        url: 'https://2e.aonprd.com/Armor.aspx?ID=38',
        stats: {
          acBonus: 6,
          dexCap: 1,
          checkPenalty: -2,
          speedPenalty: -5
        },
        runes: {
          potency: '+3',
          resilient: 'Major Resilient (+3 saves)'
        }
      },
      {
        id: 3,
        name: 'Salvo Shield (Reinforcing Supreme)',
        equipped: true,
        type: 'shield',
        description: 'Steel shield with Hardness 15, HP 120, BT 60. Can be used offensively. Reinforcing (Supreme) rune increases Hardness to 20.',
        source: 'Treasure Vault pg. 21',
        url: 'https://2e.aonprd.com/Shields.aspx?ID=53',
        stats: {
          acBonus: 2,
          hardness: 20,
          hp: 120,
          bt: 60
        },
        runes: ['Reinforcing (Supreme)']
      },
      {
        id: 4,
        name: 'Religious Symbol',
        equipped: true,
        type: 'equipment'
      },
      {
        id: 5,
        name: "Healer's Tools (Expanded)",
        equipped: false,
        quantity: 2,
        type: 'consumable'
      },
      {
        id: 6,
        name: 'Backpack',
        equipped: true,
        type: 'equipment'
      },
      {
        id: 7,
        name: 'Bedroll',
        equipped: false,
        type: 'equipment'
      },
      {
        id: 8,
        name: 'Rations',
        equipped: false,
        quantity: 7,
        type: 'consumable'
      }
    ];
  });
  const [gearInput, setGearInput] = useState('');
  const [gearQuantity, setGearQuantity] = useState(1);

  // Spell state
  const [preparedSpells, setPreparedSpells] = useState(() => {
    const saved = localStorage.getItem('prepared-spells');
    return saved ? JSON.parse(saved) : {
      cantrips: ['divine-lance', 'shield', 'guidance', 'detect-magic', 'light'],
      rank1: ['bless', 'command'],
      rank2: [],
      rank3: [],
      rank4: [],
      rank5: [],
      rank6: []
    };
  });

  const [castSpells, setCastSpells] = useState(() => {
    const saved = localStorage.getItem('cast-spells');
    return saved ? JSON.parse(saved) : {
      rank1: 0,
      rank2: 0,
      rank3: 0,
      rank4: 0,
      rank5: 0,
      rank6: 0,
      divineFont: 0
    };
  });

  // Divine font choice state (for Versatile Font feat)
  const [divineFontChoice, setDivineFontChoice] = useState(() => {
    const saved = localStorage.getItem('divine-font-choice');
    return saved || 'heal'; // Default to 'heal', can be 'heal' or 'harm'
  });

  // Character avatar state
  const [avatarUrl, setAvatarUrl] = useState(() => {
    const saved = localStorage.getItem('character-avatar');
    return saved || null;
  });
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  // Feat tracking state - stores feats by level
  // Structure: { levelGained, type: 'ancestry'|'class'|'skill'|'general', category, featKey, name, source, url }
  // Default feats from characterConfig.js - INITIAL_FEATS
  const [selectedFeats, setSelectedFeats] = useState(() => {
    const saved = localStorage.getItem('selected-feats');
    return saved ? JSON.parse(saved) : INITIAL_FEATS;
  });

  // Skill proficiencies state
  // Structure: { skillKey: { rank: 'trained'|'expert'|'master'|'legendary', levelGained: number } }
  // Default skills from characterConfig.js - INITIAL_SKILL_PROFICIENCIES
  const [skillProficiencies, setSkillProficiencies] = useState(() => {
    const saved = localStorage.getItem('skill-proficiencies');
    return saved ? JSON.parse(saved) : INITIAL_SKILL_PROFICIENCIES;
  });

  // Story logs state - AI-generated narrative descriptions of character actions
  // Structure: [{ id, timestamp, action, narrative, level }]
  const [storyLogs, setStoryLogs] = useState(() => {
    const saved = localStorage.getItem('story-logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Character name state - editable character name
  const [characterName, setCharacterName] = useState(() => {
    const saved = localStorage.getItem('character-name');
    return saved || CHARACTER_IDENTITY.name;
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  // Character gender state
  const [characterGender, setCharacterGender] = useState(() => {
    const saved = localStorage.getItem('character-gender');
    return saved || CHARACTER_IDENTITY.gender;
  });

  // Story generation loading state
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [pendingStoryAction, setPendingStoryAction] = useState('');

  // Batching state for story generation - collect actions over 3 seconds
  const [batchedActions, setBatchedActions] = useState([]);
  const batchTimerRef = React.useRef(null);
  const currentBatchLogId = React.useRef(null);
  const BATCH_DELAY = 3000; // 3 seconds

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize divine font choice in localStorage if not set
  useEffect(() => {
    if (!localStorage.getItem('divine-font-choice')) {
      localStorage.setItem('divine-font-choice', 'heal');
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('character-level', level.toString());
  }, [level]);

  useEffect(() => {
    localStorage.setItem('current-hp', currentHP.toString());
  }, [currentHP]);

  useEffect(() => {
    localStorage.setItem('max-hp', maxHP.toString());
  }, [maxHP]);

  useEffect(() => {
    localStorage.setItem('campaign-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('gear-inventory', JSON.stringify(gear));
  }, [gear]);

  useEffect(() => {
    localStorage.setItem('prepared-spells', JSON.stringify(preparedSpells));
  }, [preparedSpells]);

  useEffect(() => {
    localStorage.setItem('cast-spells', JSON.stringify(castSpells));
  }, [castSpells]);

  useEffect(() => {
    localStorage.setItem('divine-font-choice', divineFontChoice);
  }, [divineFontChoice]);

  useEffect(() => {
    localStorage.setItem('selected-feats', JSON.stringify(selectedFeats));
  }, [selectedFeats]);

  useEffect(() => {
    localStorage.setItem('skill-proficiencies', JSON.stringify(skillProficiencies));
  }, [skillProficiencies]);

  useEffect(() => {
    localStorage.setItem('story-logs', JSON.stringify(storyLogs));
  }, [storyLogs]);

  useEffect(() => {
    localStorage.setItem('character-name', characterName);
  }, [characterName]);

  useEffect(() => {
    localStorage.setItem('character-gender', characterGender);
  }, [characterGender]);

  useEffect(() => {
    if (avatarUrl) {
      localStorage.setItem('character-avatar', avatarUrl);
    }
  }, [avatarUrl]);

  // Avatar generation function
  const generateAvatar = async () => {
    setIsGeneratingAvatar(true);

    try {
      // Build dynamic character description based on current state
      const hpCondition = currentHP < maxHP * 0.3 ? 'bloodied and injured' :
                          currentHP < maxHP * 0.7 ? 'bearing some wounds' :
                          'in good condition';

      const equippedItems = gear.filter(g => g.equipped).map(g => g.name).join(', ');
      const preparedSpellCount = Object.values(preparedSpells).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);

      const prompt = `A fantasy character portrait of ${characterName}, a Minotaur Warpriest with Dragonblood heritage.
        Physical: Large bovine humanoid with horns, powerful muscular build, patches of draconic scales. Intimidating presence with draconic features mixed with minotaur strength.
        Condition: ${hpCondition} (${currentHP}/${maxHP} HP).
        Class: Level ${level} Cleric. Wearing ceremonial armor with divine symbols.
        Equipment: ${equippedItems || 'basic gear'}.
        Magic: ${preparedSpellCount} divine spells prepared, divine energy emanating.
        Style: Dark fantasy, detailed, cinematic lighting, powerful and divine presence.`;

      const response = await fetch('/api/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          size: '512x512',
          n: 1
        })
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();

      if (data.data && data.data[0] && data.data[0].url) {
        setAvatarUrl(data.data[0].url);
      } else {
        console.error('No image URL in response:', data);
        alert('Failed to generate avatar: No image URL returned');
      }
    } catch (error) {
      console.error('Error generating avatar:', error);
      alert('Failed to generate avatar: ' + error.message);
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  // Process batched actions and generate story
  const processBatchedStory = React.useCallback(async (actions, logId) => {
    if (actions.length === 0) return;

    // Combine actions into a summary
    let combinedAction;
    if (actions.length === 1) {
      combinedAction = actions[0];
    } else {
      // Summarize multiple actions by tracking state changes
      const hpChanges = actions.filter(a => a.includes('HP'));
      const levelChanges = actions.filter(a => a.includes('Level'));
      const other = actions.filter(a => !a.includes('HP') && !a.includes('Level'));

      const parts = [];

      // For HP changes, show initial -> final
      if (hpChanges.length > 0) {
        const firstHP = hpChanges[0].match(/HP.*?(\d+) to (\d+)/);
        const lastHP = hpChanges[hpChanges.length - 1].match(/HP.*?(\d+) to (\d+)/);
        if (firstHP && lastHP) {
          const initialHP = firstHP[1];
          const finalHP = lastHP[2];
          const change = parseInt(finalHP) - parseInt(initialHP);
          if (change > 0) {
            parts.push(`Healed ${change} HP (${initialHP} → ${finalHP})`);
          } else if (change < 0) {
            parts.push(`Took ${Math.abs(change)} damage (${initialHP} → ${finalHP})`);
          }
        }
      }

      // For level changes
      if (levelChanges.length > 0) {
        parts.push(levelChanges[levelChanges.length - 1]);
      }

      // For other actions
      if (other.length > 0) {
        parts.push(...other);
      }

      combinedAction = parts.join('; ');
    }

    // Generate narrative with enhanced character context
    try {
      // Calculate current ability scores from config
      const abilityScores = {
        STR: getAbilityScore(BASE_ABILITY_SCORES.STR, 'STR', level),
        DEX: getAbilityScore(BASE_ABILITY_SCORES.DEX, 'DEX', level),
        CON: getAbilityScore(BASE_ABILITY_SCORES.CON, 'CON', level),
        INT: getAbilityScore(BASE_ABILITY_SCORES.INT, 'INT', level),
        WIS: getAbilityScore(BASE_ABILITY_SCORES.WIS, 'WIS', level),
        CHA: getAbilityScore(BASE_ABILITY_SCORES.CHA, 'CHA', level)
      };

      // Get equipped items
      const equippedItems = gear
        .filter(item => item.equipped)
        .map(item => item.name)
        .join(', ') || 'no equipped items';

      const narrative = await generateStoryLog(combinedAction, {
        name: characterName,
        gender: characterGender,
        level: level,
        ancestry: CHARACTER_IDENTITY.ancestry.name,
        heritage: CHARACTER_IDENTITY.heritage.name,
        class: `${CHARACTER_IDENTITY.class.doctrine.name} ${CHARACTER_IDENTITY.class.name}`,
        hp: currentHP,
        maxHP: maxHP,
        abilityScores: abilityScores,
        equippedItems: equippedItems
      });

      // Update the placeholder with the actual narrative
      setStoryLogs(prevLogs =>
        prevLogs.map(log =>
          log.id === logId
            ? { ...log, action: combinedAction, narrative, isGenerating: false }
            : log
        )
      );
    } catch (error) {
      console.error('Error generating batched story:', error);
      setStoryLogs(prevLogs =>
        prevLogs.map(log =>
          log.id === logId
            ? { ...log, action: combinedAction, narrative: `${characterName} continues their journey.`, isGenerating: false }
            : log
        )
      );
    } finally {
      setIsGeneratingStory(false);
      setPendingStoryAction('');
    }
  }, [characterName, characterGender, level, currentHP, maxHP, gear]);

  // Story log function with batching
  const addStoryLog = React.useCallback((action) => {
    // Add to batched actions
    setBatchedActions(prev => {
      const newBatch = [...prev, action];

      // Update the placeholder's action description with the latest action
      if (currentBatchLogId.current !== null) {
        setStoryLogs(prevLogs =>
          prevLogs.map(log =>
            log.id === currentBatchLogId.current
              ? { ...log, action: action }
              : log
          )
        );
      }

      return newBatch;
    });

    // Clear existing timer
    if (batchTimerRef.current) {
      clearTimeout(batchTimerRef.current);
    }

    // If this is the first action in the batch, create placeholder
    if (batchedActions.length === 0 && !isGeneratingStory) {
      const logId = Date.now();
      currentBatchLogId.current = logId;

      const placeholderLog = {
        id: logId,
        timestamp: new Date().toLocaleString(),
        action: 'Collecting actions...',
        narrative: '✨ Generating story...',
        level: level,
        isGenerating: true
      };

      setStoryLogs(prevLogs => [placeholderLog, ...prevLogs]);
      setIsGeneratingStory(true);
      setPendingStoryAction(action);
    }

    // Set/reset timer to process batch after delay
    batchTimerRef.current = setTimeout(() => {
      setBatchedActions(currentBatch => {
        if (currentBatch.length > 0 && currentBatchLogId.current !== null) {
          processBatchedStory(currentBatch, currentBatchLogId.current);
          currentBatchLogId.current = null;
        }
        return [];
      });
    }, BATCH_DELAY);
  }, [batchedActions, isGeneratingStory, level, processBatchedStory, BATCH_DELAY]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (batchTimerRef.current) {
        clearTimeout(batchTimerRef.current);
        batchTimerRef.current = null;
      }
      currentBatchLogId.current = null;
    };
  }, []);

  // Clear story log function
  const clearStoryLog = () => {
    if (confirm('Are you sure you want to clear all story logs?')) {
      setStoryLogs([]);
      localStorage.removeItem('story-logs');
    }
  };

  // HP change handlers with story generation
  const handleHPDecrease = () => {
    const newHP = Math.max(0, currentHP - 1);
    setCurrentHP(newHP);
    addStoryLog(`Took damage, HP decreased from ${currentHP} to ${newHP}`);
  };

  const handleHPIncrease = () => {
    const newHP = Math.min(maxHP, currentHP + 1);
    setCurrentHP(newHP);
    addStoryLog(`Healed, HP increased from ${currentHP} to ${newHP}`);
  };

  // Level change handlers with story generation
  const handleLevelDecrease = () => {
    const newLevel = Math.max(1, level - 1);
    setLevel(newLevel);
    addStoryLog(`Level decreased from ${level} to ${newLevel}`);
  };

  const handleLevelIncrease = () => {
    const newLevel = level + 1;
    setLevel(newLevel);
    addStoryLog(`Leveled up from level ${level} to level ${newLevel}!`);
  };

  // Note functions
  const addNote = () => {
    if (noteInput.trim()) {
      const newNote = {
        id: Date.now(),
        text: noteInput,
        date: new Date().toLocaleDateString(),
        session: `Session ${notes.length + 1}`
      };
      setNotes([newNote, ...notes]);
      setNoteInput('');
      // Generate story log for campaign note
      addStoryLog(`Added campaign note: "${noteInput.trim().substring(0, 100)}${noteInput.trim().length > 100 ? '...' : ''}"`);
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const startEditNote = (note) => {
    setEditingNote(note);
    setNoteInput(note.text);
  };

  const saveEditNote = () => {
    setNotes(notes.map(note => 
      note.id === editingNote.id ? { ...note, text: noteInput } : note
    ));
    setEditingNote(null);
    setNoteInput('');
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setNoteInput('');
  };

  // Character name editing functions
  const startEditingName = () => {
    setNameInput(characterName);
    setIsEditingName(true);
  };

  const saveName = () => {
    if (nameInput.trim()) {
      setCharacterName(nameInput.trim());
      setIsEditingName(false);
      addStoryLog(`Changed name to ${nameInput.trim()}`);
    }
  };

  const cancelEditingName = () => {
    setIsEditingName(false);
    setNameInput('');
  };

  // Gear functions
  const addGear = () => {
    if (gearInput.trim()) {
      const newGear = {
        id: Date.now(),
        name: gearInput,
        equipped: false,
        quantity: gearQuantity > 1 ? gearQuantity : undefined
      };
      setGear([...gear, newGear]);
      setGearInput('');
      setGearQuantity(1);
    }
  };

  const deleteGear = (id) => {
    setGear(gear.filter(item => item.id !== id));
  };

  const toggleEquipped = (id) => {
    setGear(gear.map(item =>
      item.id === id ? { ...item, equipped: !item.equipped } : item
    ));
  };

  // Spell functions
  const castSpell = (rank) => {
    setCastSpells(prev => ({
      ...prev,
      [rank]: Math.min(prev[rank] + 1, getMaxSpellSlots(level, rank))
    }));
  };

  const uncastSpell = (rank) => {
    setCastSpells(prev => ({
      ...prev,
      [rank]: Math.max(prev[rank] - 1, 0)
    }));
  };

  const restSpells = () => {
    setCastSpells({
      rank1: 0,
      rank2: 0,
      rank3: 0,
      rank4: 0,
      rank5: 0,
      rank6: 0,
      divineFont: 0
    });
  };

  // Toggle spell preparation - PF2e allows preparing same spell multiple times
  // Source: Player Core pg. 206 "Prepared Spells"
  const togglePreparedSpell = (rank, spellId) => {
    setPreparedSpells(prev => {
      const current = prev[rank] || [];
      const maxSlots = getMaxSpellSlots(level, rank);

      // Check if spell is currently prepared
      const preparedCount = current.filter(id => id === spellId).length;

      if (preparedCount > 0) {
        // Unprepare ONE instance of this spell
        const index = current.indexOf(spellId);
        const newArray = [...current];
        newArray.splice(index, 1);
        return { ...prev, [rank]: newArray };
      } else {
        // Prepare spell if slots available
        if (current.length < maxSlots) {
          return { ...prev, [rank]: [...current, spellId] };
        }
        return prev; // No slots available
      }
    });
  };

  // Feat selection functions
  const addFeat = (levelGained, type, featKey, name, source, url) => {
    const newFeat = {
      levelGained,
      type,
      category: type,
      featKey,
      name,
      source,
      url,
      granted: false
    };

    setSelectedFeats(prev => [...prev, newFeat]);
    addStoryLog(`Gained feat: ${name} at level ${levelGained}`);
  };

  const removeFeat = (featKey, levelGained) => {
    const feat = selectedFeats.find(f => f.featKey === featKey && f.levelGained === levelGained);
    if (feat) {
      setSelectedFeats(prev => prev.filter(f => !(f.featKey === featKey && f.levelGained === levelGained)));
      addStoryLog(`Removed feat: ${feat.name}`);
    }
  };

  // Skill proficiency functions
  const increaseSkillProficiency = (skillKey, newRank, levelGained) => {
    const skillInfo = pathfinderRules.skills[skillKey];
    const skillName = skillInfo ? skillInfo.name : skillKey;

    setSkillProficiencies(prev => ({
      ...prev,
      [skillKey]: {
        rank: newRank,
        levelGained: levelGained,
        source: `Level ${levelGained} skill increase`
      }
    }));

    addStoryLog(`Increased ${skillName} proficiency to ${newRank} at level ${levelGained}`);
  };

  const removeSkillProficiency = (skillKey) => {
    const skill = skillProficiencies[skillKey];
    if (skill && !skill.source.includes('Background') && !skill.source.includes('Class')) {
      const skillInfo = pathfinderRules.skills[skillKey];
      const skillName = skillInfo ? skillInfo.name : skillKey;

      setSkillProficiencies(prev => {
        const updated = { ...prev };
        delete updated[skillKey];
        return updated;
      });

      addStoryLog(`Removed ${skillName} proficiency`);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Character', icon: User },
    { id: 'combat', label: 'Combat', icon: Sword },
    { id: 'spells', label: 'Spells', icon: Sparkles },
    { id: 'feats', label: 'Feats & Skills', icon: Award },
    { id: 'progression', label: 'Progression', icon: TrendingUp },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'gear', label: 'Gear', icon: Package },
    { id: 'story', label: 'Story Log', icon: Feather },
  ];

  return (
    <div className="relative min-h-screen w-full">
      {/* Background - absolutely positioned to fill screen */}
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 -z-10"></div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto p-4 md:p-8 text-white">
        {/* Header with HP Tracker */}
        <div className={`bg-gradient-to-r from-purple-800 to-indigo-900 rounded-lg shadow-2xl p-6 mb-6 border border-purple-500 transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Feather className="w-10 h-10 text-white animate-pulse" />
                <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-purple-400 animate-pulse" />
              </div>
              <div>
                {isEditingName ? (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveName();
                        if (e.key === 'Escape') cancelEditingName();
                      }}
                      className="text-4xl font-bold bg-slate-800 border border-purple-500 rounded px-3 py-1 text-white focus:outline-none focus:border-purple-400"
                      autoFocus
                    />
                    <button
                      onClick={saveName}
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transform hover:scale-105 transition-all"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={cancelEditingName}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transform hover:scale-105 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2 group">
                    {characterName}
                    <button
                      onClick={startEditingName}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 className="w-5 h-5 text-purple-400 hover:text-purple-300" />
                    </button>
                  </h1>
                )}
                <p className="text-purple-300 text-lg">{CHARACTER_IDENTITY.ancestry.name} {CHARACTER_IDENTITY.class.doctrine.name} ({CHARACTER_IDENTITY.heritage.name}) • Level {level}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-black/30 rounded-lg p-4 backdrop-blur border border-purple-500/30 hover:border-purple-400/50 transition-all">
                <div className="text-center mb-2">
                  <div className="text-sm text-purple-300 mb-1 flex items-center justify-center gap-1">
                    Hit Points
                    <Tooltip content={
                      <>
                        <div className="font-semibold text-purple-300 mb-2">Max HP Calculation (Level {level})</div>
                        <div className="space-y-2 text-slate-300">
                          <div className="bg-slate-700/50 p-2 rounded">
                            <div className="font-semibold mb-1">Base HP at Level 1:</div>
                            <div className="pl-2 text-sm">
                              • Cleric class: <span className="text-green-400">8 HP</span>
                              <a
                                href={pathfinderRules.classes.cleric.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-1 text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            <div className="pl-2 text-sm">
                              • Minotaur ancestry: <span className="text-green-400">10 HP</span>
                              <a
                                href={pathfinderRules.ancestries.minotaur.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-1 text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            <div className="pl-2 text-sm">
                              • Constitution modifier: <span className="text-green-400">+2</span>
                            </div>
                            <div className="pl-2 text-sm font-semibold border-t border-slate-600 mt-1 pt-1">
                              = <span className="text-green-400">20 HP</span> at level 1
                            </div>
                          </div>
                          {level > 1 && (
                            <div className="bg-slate-700/50 p-2 rounded">
                              <div className="font-semibold mb-1">Per Level (2-{level}):</div>
                              <div className="pl-2 text-sm">
                                • Cleric HP/level: <span className="text-green-400">8</span>
                              </div>
                              <div className="pl-2 text-sm">
                                • Constitution modifier: <span className="text-green-400">+2</span>
                              </div>
                              <div className="pl-2 text-sm">
                                • Levels gained: <span className="text-green-400">{level - 1}</span>
                              </div>
                              <div className="pl-2 text-sm font-semibold border-t border-slate-600 mt-1 pt-1">
                                = <span className="text-green-400">{(level - 1) * 10} HP</span> from leveling
                              </div>
                            </div>
                          )}
                          <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
                            <div className="font-bold text-purple-300">
                              Total Max HP: <span className="text-green-400">{maxHP}</span>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              Source: {pathfinderRules.classes.cleric.source}
                            </div>
                          </div>
                        </div>
                      </>
                    }>
                      <Info className="w-4 h-4 text-purple-400 hover:text-purple-300" />
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <button
                      onClick={handleHPDecrease}
                      className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded flex items-center justify-center transform hover:scale-110 transition-all active:scale-95"
                    >
                      -
                    </button>
                    <div>
                      <span className="text-3xl font-bold text-red-500">{currentHP}</span>
                      <span className="text-xl text-slate-300"> / {maxHP}</span>
                    </div>
                    <button
                      onClick={handleHPIncrease}
                      className="w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center transform hover:scale-110 transition-all active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-red-600 to-green-600 h-full transition-all duration-300 ease-out"
                    style={{ width: `${(currentHP / maxHP) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleLevelDecrease}
                  className="px-3 py-1 bg-purple-700 hover:bg-purple-600 rounded text-sm transform hover:scale-105 transition-all active:scale-95"
                >
                  Level -
                </button>
                <button
                  onClick={handleLevelIncrease}
                  className="px-3 py-1 bg-purple-700 hover:bg-purple-600 rounded text-sm transform hover:scale-105 transition-all active:scale-95"
                >
                  Level +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Story Log - Visible on all tabs */}
        {storyLogs.length > 0 && (
          <div className={`bg-slate-800/50 rounded-lg p-4 mb-6 backdrop-blur border border-purple-700/50 transform transition-all duration-700 delay-75 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-purple-300 flex items-center gap-2">
                <Feather className="w-5 h-5" />
                Recent Story Events
              </h3>
              <span className="text-xs text-slate-400">{storyLogs.length} event{storyLogs.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {storyLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className={`bg-slate-700/50 rounded p-3 border transition-all ${
                    log.isGenerating
                      ? 'border-purple-500/60 animate-pulse'
                      : 'border-purple-600/20 hover:border-purple-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {log.isGenerating ? (
                        <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3 text-purple-400" />
                      )}
                      <span className="text-xs text-slate-400">{log.timestamp}</span>
                    </div>
                    <span className="text-xs bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700 text-purple-300">
                      Lvl {log.level}
                    </span>
                  </div>
                  <div className={`text-sm italic leading-relaxed ${
                    log.isGenerating ? 'text-purple-300' : 'text-slate-200'
                  }`}>
                    {log.narrative}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className={`bg-slate-800/50 rounded-lg p-2 mb-6 backdrop-blur border border-slate-700 transform transition-all duration-700 delay-100 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className={`bg-slate-800/70 rounded-lg shadow-2xl p-6 backdrop-blur border border-slate-700 transform transition-all duration-700 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {activeTab === 'overview' && (
            <OverviewTab
              level={level}
              avatarUrl={avatarUrl}
              isGeneratingAvatar={isGeneratingAvatar}
              generateAvatar={generateAvatar}
            />
          )}
          {activeTab === 'combat' && <CombatTab level={level} />}
          {activeTab === 'spells' && (
            <SpellsTab
              level={level}
              preparedSpells={preparedSpells}
              setPreparedSpells={setPreparedSpells}
              castSpells={castSpells}
              castSpell={castSpell}
              uncastSpell={uncastSpell}
              restSpells={restSpells}
              togglePreparedSpell={togglePreparedSpell}
              divineFontChoice={divineFontChoice}
              setDivineFontChoice={setDivineFontChoice}
            />
          )}
          {activeTab === 'feats' && (
            <FeatsSkillsTab
              level={level}
              selectedFeats={selectedFeats}
              setSelectedFeats={setSelectedFeats}
              skillProficiencies={skillProficiencies}
              setSkillProficiencies={setSkillProficiencies}
              addFeat={addFeat}
              removeFeat={removeFeat}
              increaseSkillProficiency={increaseSkillProficiency}
              removeSkillProficiency={removeSkillProficiency}
              addStoryLog={addStoryLog}
            />
          )}
          {activeTab === 'progression' && <ProgressionTab level={level} />}
          {activeTab === 'notes' && (
            <NotesTab 
              notes={notes}
              noteInput={noteInput}
              setNoteInput={setNoteInput}
              addNote={addNote}
              deleteNote={deleteNote}
              editingNote={editingNote}
              startEditNote={startEditNote}
              saveEditNote={saveEditNote}
              cancelEdit={cancelEdit}
            />
          )}
          {activeTab === 'gear' && (
            <GearTab
              gear={gear}
              gearInput={gearInput}
              setGearInput={setGearInput}
              gearQuantity={gearQuantity}
              setGearQuantity={setGearQuantity}
              addGear={addGear}
              deleteGear={deleteGear}
              toggleEquipped={toggleEquipped}
              level={level}
            />
          )}
          {activeTab === 'story' && (
            <StoryLogTab
              storyLogs={storyLogs}
              level={level}
              onClearLog={clearStoryLog}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ level, avatarUrl, isGeneratingAvatar, generateAvatar }) {
  // Calculate ability scores based on level
  // Source: characterConfig.js - BASE_ABILITY_SCORES (includes Level 1 boosts)
  const strScore = getAbilityScore(BASE_ABILITY_SCORES.STR, 'STR', level);
  const dexScore = getAbilityScore(BASE_ABILITY_SCORES.DEX, 'DEX', level);
  const conScore = getAbilityScore(BASE_ABILITY_SCORES.CON, 'CON', level);
  const intScore = getAbilityScore(BASE_ABILITY_SCORES.INT, 'INT', level);
  const wisScore = getAbilityScore(BASE_ABILITY_SCORES.WIS, 'WIS', level);
  const chaScore = getAbilityScore(BASE_ABILITY_SCORES.CHA, 'CHA', level);

  const strMod = getModifier(strScore);
  const dexMod = getModifier(dexScore);
  const conMod = getModifier(conScore);
  const intMod = getModifier(intScore);
  const wisMod = getModifier(wisScore);
  const chaMod = getModifier(chaScore);

  // Skills with proper proficiency ranks (Pathbuilder progression)
  // At level 20: Athletics, Medicine, Survival are Legendary; Intimidation, Nature, Religion are Expert
  const athleticsRank = level >= 15 ? 'legendary' : level >= 7 ? 'master' : level >= 2 ? 'expert' : 'trained';
  const medicineRank = level >= 15 ? 'legendary' : level >= 7 ? 'master' : level >= 2 ? 'expert' : 'trained';
  const survivalRank = level >= 15 ? 'legendary' : level >= 7 ? 'master' : level >= 2 ? 'expert' : 'trained';
  const intimidationRank = level >= 2 ? 'expert' : 'trained';
  const religionRank = level >= 2 ? 'expert' : 'trained';
  const natureRank = level >= 2 ? 'expert' : 'trained';
  const athleticsProf = getProficiencyBonus(level, athleticsRank);
  const medicineProf = getProficiencyBonus(level, medicineRank);
  const survivalProf = getProficiencyBonus(level, survivalRank);
  const intimidationProf = getProficiencyBonus(level, intimidationRank);
  const religionProf = getProficiencyBonus(level, religionRank);
  const natureProf = getProficiencyBonus(level, natureRank);

  return (
    <div className="space-y-6">
      {/* Character Avatar - Hidden (image generation disabled) */}
      {false && (
        <StatBlock title="Character Avatar" icon={User}>
          <div className="flex flex-col items-center gap-4">
            {avatarUrl ? (
              <div className="relative group">
                <img
                  src={avatarUrl}
                  alt="Briggled"
                  className="w-64 h-64 rounded-lg border-2 border-purple-600 shadow-lg object-cover"
                />
                <button
                  onClick={generateAvatar}
                  disabled={isGeneratingAvatar}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold rounded-lg"
                >
                  {isGeneratingAvatar ? 'Generating...' : 'Regenerate'}
                </button>
              </div>
            ) : (
              <div className="w-64 h-64 rounded-lg border-2 border-dashed border-purple-600 bg-slate-700/30 flex items-center justify-center">
                <div className="text-center">
                  <Feather className="w-16 h-16 text-purple-400 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No avatar generated</p>
                </div>
              </div>
            )}
            <button
              onClick={generateAvatar}
              disabled={isGeneratingAvatar}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
            >
              {isGeneratingAvatar ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Avatar...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {avatarUrl ? 'Regenerate Avatar' : 'Generate Avatar'}
                </>
              )}
            </button>
            <p className="text-xs text-slate-400 text-center max-w-md">
              AI-generated portrait based on race, class, HP, deity, spells, and equipment
            </p>
          </div>
        </StatBlock>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <StatBlock title="Ancestry & Background" icon={User}>
          <div className="space-y-3">
            <StatItem label="Ancestry" value={`${CHARACTER_IDENTITY.ancestry.name} - ${CHARACTER_IDENTITY.heritage.name} Heritage (${CHARACTER_IDENTITY.ancestry.rarity})`} />
            <StatItem label="Gender" value={CHARACTER_IDENTITY.gender} />
            <StatItem label="Size" value={CHARACTER_IDENTITY.ancestry.size} />
            <StatItem label="Speed" value={`${CHARACTER_IDENTITY.ancestry.speed} ft`} />
            <StatItem label="Special" value="Darkvision, Horns (1d8 piercing), Fear Resistance" />
            <StatItem label="Background" value={CHARACTER_IDENTITY.background.name} />
          </div>
        </StatBlock>

        <StatBlock title="Ability Scores" icon={TrendingUp}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <AbilityScore ability="STR" score={strScore} modifier={strMod} primary level={level} />
            <AbilityScore ability="DEX" score={dexScore} modifier={dexMod} level={level} />
            <AbilityScore ability="CON" score={conScore} modifier={conMod} level={level} />
            <AbilityScore ability="INT" score={intScore} modifier={intMod} level={level} />
            <AbilityScore ability="WIS" score={wisScore} modifier={wisMod} primary level={level} />
            <AbilityScore ability="CHA" score={chaScore} modifier={chaMod} level={level} />
          </div>
        </StatBlock>
      </div>

      <StatBlock title="Skills" icon={Shield}>
        <div className="grid md:grid-cols-2 gap-2">
          <Tooltip content={
            <>
              <div className="font-semibold text-purple-300 mb-2">{pathfinderRules.skills.athletics.name}</div>
              <div className="space-y-2 text-slate-300">
                <div className="bg-slate-700/50 p-2 rounded">
                  <div className="font-semibold mb-1">Calculation:</div>
                  <div className="pl-2 text-sm">
                    • {pathfinderRules.skills.athletics.ability} modifier: <span className="text-green-400">+{strMod}</span>
                  </div>
                  <div className="pl-2 text-sm">
                    • Proficiency (trained): <span className="text-green-400">+{athleticsProf}</span>
                  </div>
                  <div className="pl-2 text-sm font-semibold border-t border-slate-600 mt-1 pt-1">
                    = <span className="text-green-400">+{strMod + athleticsProf}</span> total
                  </div>
                </div>
                <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
                  <div className="font-bold text-purple-300">
                    Athletics: <span className="text-green-400">+{strMod + athleticsProf}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {pathfinderRules.skills.athletics.description}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    <a href={pathfinderRules.skills.athletics.url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                      View on Archives of Nethys ↗
                    </a>
                  </div>
                </div>
              </div>
            </>
          }>
            <div className="cursor-help">
              <StatItem label={`Athletics (${athleticsRank.charAt(0).toUpperCase() + athleticsRank.slice(1)})`} value={`+${strMod + athleticsProf}`} />
            </div>
          </Tooltip>
          <Tooltip content={
            <>
              <div className="font-semibold text-purple-300 mb-2">{pathfinderRules.skills.intimidation.name}</div>
              <div className="space-y-2 text-slate-300">
                <div className="bg-slate-700/50 p-2 rounded">
                  <div className="font-semibold mb-1">Calculation:</div>
                  <div className="pl-2 text-sm">
                    • {pathfinderRules.skills.intimidation.ability} modifier: <span className="text-green-400">+{chaMod}</span>
                  </div>
                  <div className="pl-2 text-sm">
                    • Proficiency (trained): <span className="text-green-400">+{intimidationProf}</span>
                  </div>
                  <div className="pl-2 text-sm font-semibold border-t border-slate-600 mt-1 pt-1">
                    = <span className="text-green-400">+{chaMod + intimidationProf}</span> total
                  </div>
                </div>
                <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
                  <div className="font-bold text-purple-300">
                    Intimidation: <span className="text-green-400">+{chaMod + intimidationProf}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {pathfinderRules.skills.intimidation.description}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    <a href={pathfinderRules.skills.intimidation.url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                      View on Archives of Nethys ↗
                    </a>
                  </div>
                </div>
              </div>
            </>
          }>
            <div className="cursor-help">
              <StatItem label={`Intimidation (${intimidationRank.charAt(0).toUpperCase() + intimidationRank.slice(1)})`} value={`+${chaMod + intimidationProf}`} />
            </div>
          </Tooltip>
          <Tooltip content={
            <>
              <div className="font-semibold text-purple-300 mb-2">{pathfinderRules.skills.medicine.name}</div>
              <div className="space-y-2 text-slate-300">
                <div className="bg-slate-700/50 p-2 rounded">
                  <div className="font-semibold mb-1">Calculation:</div>
                  <div className="pl-2 text-sm">
                    • {pathfinderRules.skills.medicine.ability} modifier: <span className="text-green-400">+{wisMod}</span>
                  </div>
                  <div className="pl-2 text-sm">
                    • Proficiency (trained): <span className="text-green-400">+{medicineProf}</span>
                  </div>
                  <div className="pl-2 text-sm font-semibold border-t border-slate-600 mt-1 pt-1">
                    = <span className="text-green-400">+{wisMod + medicineProf}</span> total
                  </div>
                </div>
                <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
                  <div className="font-bold text-purple-300">
                    Medicine: <span className="text-green-400">+{wisMod + medicineProf}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {pathfinderRules.skills.medicine.description}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    <a href={pathfinderRules.skills.medicine.url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                      View on Archives of Nethys ↗
                    </a>
                  </div>
                </div>
              </div>
            </>
          }>
            <div className="cursor-help">
              <StatItem label={`Medicine (${medicineRank.charAt(0).toUpperCase() + medicineRank.slice(1)})`} value={`+${wisMod + medicineProf}`} />
            </div>
          </Tooltip>
          <Tooltip content={
            <>
              <div className="font-semibold text-purple-300 mb-2">{pathfinderRules.skills.religion.name}</div>
              <div className="space-y-2 text-slate-300">
                <div className="bg-slate-700/50 p-2 rounded">
                  <div className="font-semibold mb-1">Calculation:</div>
                  <div className="pl-2 text-sm">
                    • {pathfinderRules.skills.religion.ability} modifier: <span className="text-green-400">+{wisMod}</span>
                  </div>
                  <div className="pl-2 text-sm">
                    • Proficiency (trained): <span className="text-green-400">+{religionProf}</span>
                  </div>
                  <div className="pl-2 text-sm font-semibold border-t border-slate-600 mt-1 pt-1">
                    = <span className="text-green-400">+{wisMod + religionProf}</span> total
                  </div>
                </div>
                <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
                  <div className="font-bold text-purple-300">
                    Religion: <span className="text-green-400">+{wisMod + religionProf}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {pathfinderRules.skills.religion.description}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    <a href={pathfinderRules.skills.religion.url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                      View on Archives of Nethys ↗
                    </a>
                  </div>
                </div>
              </div>
            </>
          }>
            <div className="cursor-help">
              <StatItem label={`Religion (${religionRank.charAt(0).toUpperCase() + religionRank.slice(1)})`} value={`+${wisMod + religionProf}`} />
            </div>
          </Tooltip>
          <Tooltip content={
            <>
              <div className="font-semibold text-purple-300 mb-2">{pathfinderRules.skills.survival.name}</div>
              <div className="space-y-2 text-slate-300">
                <div className="bg-slate-700/50 p-2 rounded">
                  <div className="font-semibold mb-1">Calculation:</div>
                  <div className="pl-2 text-sm">
                    • {pathfinderRules.skills.survival.ability} modifier: <span className="text-green-400">+{wisMod}</span>
                  </div>
                  <div className="pl-2 text-sm">
                    • Proficiency ({survivalRank}): <span className="text-green-400">+{survivalProf}</span>
                  </div>
                  <div className="pl-2 text-sm font-semibold border-t border-slate-600 mt-1 pt-1">
                    = <span className="text-green-400">+{wisMod + survivalProf}</span> total
                  </div>
                </div>
                <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
                  <div className="font-bold text-purple-300">
                    Survival: <span className="text-green-400">+{wisMod + survivalProf}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {pathfinderRules.skills.survival.description}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    <a href={pathfinderRules.skills.survival.url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                      View on Archives of Nethys ↗
                    </a>
                  </div>
                </div>
              </div>
            </>
          }>
            <div className="cursor-help">
              <StatItem label={`Survival (${survivalRank.charAt(0).toUpperCase() + survivalRank.slice(1)})`} value={`+${wisMod + survivalProf}`} />
            </div>
          </Tooltip>
          <Tooltip content={
            <>
              <div className="font-semibold text-purple-300 mb-2">{pathfinderRules.skills.nature.name}</div>
              <div className="space-y-2 text-slate-300">
                <div className="bg-slate-700/50 p-2 rounded">
                  <div className="font-semibold mb-1">Calculation:</div>
                  <div className="pl-2 text-sm">
                    • {pathfinderRules.skills.nature.ability} modifier: <span className="text-green-400">+{wisMod}</span>
                  </div>
                  <div className="pl-2 text-sm">
                    • Proficiency ({natureRank}): <span className="text-green-400">+{natureProf}</span>
                  </div>
                  <div className="pl-2 text-sm font-semibold border-t border-slate-600 mt-1 pt-1">
                    = <span className="text-green-400">+{wisMod + natureProf}</span> total
                  </div>
                </div>
                <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
                  <div className="font-bold text-purple-300">
                    Nature: <span className="text-green-400">+{wisMod + natureProf}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {pathfinderRules.skills.nature.description}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    <a href={pathfinderRules.skills.nature.url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                      View on Archives of Nethys ↗
                    </a>
                  </div>
                </div>
              </div>
            </>
          }>
            <div className="cursor-help">
              <StatItem label={`Nature (${natureRank.charAt(0).toUpperCase() + natureRank.slice(1)})`} value={`+${wisMod + natureProf}`} />
            </div>
          </Tooltip>
        </div>
      </StatBlock>
    </div>
  );
}

function CombatTab({ level }) {
  // Calculate ability modifiers
  // Source: characterConfig.js - BASE_ABILITY_SCORES
  const strScore = getAbilityScore(BASE_ABILITY_SCORES.STR, 'STR', level);
  const dexScore = getAbilityScore(BASE_ABILITY_SCORES.DEX, 'DEX', level);
  const wisScore = getAbilityScore(BASE_ABILITY_SCORES.WIS, 'WIS', level);
  const conScore = getAbilityScore(BASE_ABILITY_SCORES.CON, 'CON', level);

  const strMod = getModifier(strScore);
  const dexMod = getModifier(dexScore);
  const wisMod = getModifier(wisScore);
  const conMod = getModifier(conScore);

  // Weapon proficiency progression (Warpriest Fifth Doctrine at 19)
  // Trained (1) → Expert (7) → Master (11) → Legendary (19)
  const weaponRank = level >= 19 ? 'legendary' : level >= 11 ? 'master' : level >= 7 ? 'expert' : 'trained';
  const weaponProf = getProficiencyBonus(level, weaponRank);

  // Equipment bonuses (from Handwraps of Mighty Blows +3)
  const itemBonus = level >= 16 ? 3 : level >= 10 ? 2 : level >= 4 ? 1 : 0;
  const strikingDice = level >= 19 ? 3 : level >= 12 ? 2 : level >= 4 ? 1 : 0; // Major Striking

  // Weapon Specialization (from Warpriest)
  const specializationBonus = level >= 19 ? 4 : level >= 15 ? 3 : level >= 13 ? 2 : 0;

  // Attack calculations with equipment
  const attackBonus = strMod + weaponProf + itemBonus;
  const numDice = 1 + strikingDice; // Base 1d8 + striking
  const fistDamage = `${numDice}d8+${strMod + specializationBonus}`;
  const hornDamage = `${numDice}d8+${strMod + specializationBonus}`;

  // AC: 10 + Dex + armor + proficiency + item bonus
  // Armor: Trained (1) → Expert (13) → Master (19) → Legendary (20)
  const armorRank = level >= 20 ? 'legendary' : level >= 19 ? 'master' : level >= 13 ? 'expert' : 'trained';
  const armorProf = getProficiencyBonus(level, armorRank);
  const armorItemBonus = level >= 16 ? 3 : level >= 10 ? 2 : level >= 5 ? 1 : 0;
  const latticeArmor = 6; // Medium armor AC bonus
  const dexCap = Math.min(dexMod, 1); // Lattice armor Dex cap +1
  const armorClass = 10 + dexCap + latticeArmor + armorProf + armorItemBonus;

  // Shield bonus (+2 when raised)
  const shieldBonus = 2;

  // Perception: Trained (1) → Expert (5) → Master (11) → Legendary (17)
  const perceptionRank = level >= 17 ? 'legendary' : level >= 11 ? 'master' : level >= 5 ? 'expert' : 'trained';
  const perceptionProf = getProficiencyBonus(level, perceptionRank);
  const perception = wisMod + perceptionProf;

  // Spell DC: 10 + Wis + proficiency (Trained at 1, Expert at 7, Master at 15, Legendary at 19)
  const spellRank = level >= 19 ? 'legendary' : level >= 15 ? 'master' : level >= 7 ? 'expert' : 'trained';
  const spellProf = getProficiencyBonus(level, spellRank);
  const spellDC = 10 + wisMod + spellProf;
  const spellAttack = wisMod + spellProf;

  // Saves with Resilient rune bonus (+3 at level 20)
  const resilientBonus = level >= 16 ? 3 : level >= 11 ? 2 : level >= 8 ? 1 : 0;

  // Fortitude: Expert at 1 (Warpriest), Master at 11, Legendary at 19
  const fortRank = level >= 19 ? 'legendary' : level >= 11 ? 'master' : 'expert';
  const fortProf = getProficiencyBonus(level, fortRank);

  // Reflex: Trained at 1, Expert at 13, Master at 17, Legendary at 19
  const refRank = level >= 19 ? 'legendary' : level >= 17 ? 'master' : level >= 13 ? 'expert' : 'trained';
  const refProf = getProficiencyBonus(level, refRank);

  // Will: Expert at 1, Master at 13, Legendary at 19
  const willRank = level >= 19 ? 'legendary' : level >= 13 ? 'master' : 'expert';
  const willProf = getProficiencyBonus(level, willRank);
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="relative">
          <Tooltip content={
            <>
              <div className="font-semibold text-purple-300 mb-2">Armor Class (AC)</div>
              <div className="space-y-2 text-slate-300">
                <div className="bg-slate-700/50 p-2 rounded">
                  <div className="font-semibold mb-1">AC Calculation:</div>
                  <div className="pl-2 text-sm">
                    • Base: <span className="text-green-400">10</span>
                  </div>
                  <div className="pl-2 text-sm">
                    • Dexterity modifier (capped): <span className="text-green-400">+{dexCap}</span>
                  </div>
                  <div className="pl-2 text-sm">
                    • Lattice Armor AC bonus: <span className="text-green-400">+{latticeArmor}</span>
                    <a
                      href="https://2e.aonprd.com/Armor.aspx?ID=38"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="pl-2 text-sm">
                    • Armor item bonus (+{armorRank}): <span className="text-green-400">+{armorItemBonus}</span>
                  </div>
                  <div className="pl-2 text-sm">
                    • Armor proficiency ({armorRank}): <span className="text-green-400">+{armorProf}</span>
                    <a
                      href={pathfinderRules.classes.cleric.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="pl-2 text-sm font-semibold border-t border-slate-600 mt-1 pt-1">
                    = <span className="text-green-400">{armorClass}</span> total AC
                  </div>
                </div>
                <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
                  <div className="font-bold text-purple-300">
                    Armor Class: <span className="text-green-400">{armorClass}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Warpriest proficiency: {armorRank === 'expert' ? 'Expert at 13' : 'Trained at 1'}
                  </div>
                </div>
              </div>
            </>
          }>
            <div className="cursor-help">
              <StatCard
                icon={Shield}
                label="Armor Class"
                value={`${armorClass}`}
                subtitle={level >= 13 ? "Expert" : "Trained"}
                color="blue"
              />
            </div>
          </Tooltip>
        </div>

        <div className="relative">
          <Tooltip content={
            <>
              <div className="font-semibold text-purple-300 mb-2">Perception</div>
              <div className="space-y-2 text-slate-300">
                <div className="bg-slate-700/50 p-2 rounded">
                  <div className="font-semibold mb-1">Perception Calculation:</div>
                  <div className="pl-2 text-sm">
                    • Wisdom modifier: <span className="text-green-400">+{wisMod}</span>
                  </div>
                  <div className="pl-2 text-sm">
                    • Proficiency ({perceptionRank}): <span className="text-green-400">+{perceptionProf}</span>
                    <a
                      href={pathfinderRules.classes.cleric.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="pl-2 text-sm font-semibold border-t border-slate-600 mt-1 pt-1">
                    = <span className="text-green-400">+{perception}</span> total
                  </div>
                </div>
                <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
                  <div className="font-bold text-purple-300">
                    Perception: <span className="text-green-400">+{perception}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {perceptionRank === 'expert' ? 'Expert at level 5' : 'Trained at level 1'}
                  </div>
                </div>
              </div>
            </>
          }>
            <div className="cursor-help">
              <StatCard
                icon={Target}
                label="Perception"
                value={`+${perception}`}
                subtitle={level >= 5 ? "Expert" : "Trained"}
                color="purple"
              />
            </div>
          </Tooltip>
        </div>

        <div className="relative">
          <Tooltip content={
            <>
              <div className="font-semibold text-purple-300 mb-2">Spell DC</div>
              <div className="space-y-2 text-slate-300">
                <div className="bg-slate-700/50 p-2 rounded">
                  <div className="font-semibold mb-1">Spell DC Calculation:</div>
                  <div className="pl-2 text-sm">
                    • Base: <span className="text-green-400">10</span>
                  </div>
                  <div className="pl-2 text-sm">
                    • Wisdom modifier: <span className="text-green-400">+{wisMod}</span>
                  </div>
                  <div className="pl-2 text-sm">
                    • Spell proficiency ({spellRank}): <span className="text-green-400">+{spellProf}</span>
                    <a
                      href={pathfinderRules.classes.cleric.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="pl-2 text-sm font-semibold border-t border-slate-600 mt-1 pt-1">
                    = <span className="text-green-400">{spellDC}</span> total DC
                  </div>
                </div>
                <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
                  <div className="font-bold text-purple-300">
                    Spell DC: <span className="text-green-400">{spellDC}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Warpriest: {spellRank === 'expert' ? 'Expert at 11' : 'Trained at 1'}
                  </div>
                </div>
              </div>
            </>
          }>
            <div className="cursor-help">
              <StatCard
                icon={Zap}
                label="Spell DC"
                value={`${spellDC}`}
                subtitle={level >= 11 ? "Expert" : "Trained"}
                color="green"
              />
            </div>
          </Tooltip>
        </div>
      </div>

      <StatBlock title="Attacks" icon={Sword}>
        <div className="space-y-4">
          <AttackCard
            name="Fist Strike (Unarmed)"
            bonus={`+${attackBonus}`}
            damage={fistDamage}
            damageType="bludgeoning"
            traits={["Agile", "Finesse", "Nonlethal", "Unarmed"]}
            proficiency={weaponRank.charAt(0).toUpperCase() + weaponRank.slice(1)}
            abilityMod={strMod}
            weaponProf={weaponProf}
            itemBonus={itemBonus}
            level={level}
            weaponUrl="https://2e.aonprd.com/Equipment.aspx?ID=1062"
            description={`Unarmed strike with Handwraps of Mighty Blows (+${itemBonus}, ${strikingDice > 0 ? 'Striking' : ''}). Deadly Simplicity makes base damage 1d8.`}
          />
          <AttackCard
            name="Horn Strike"
            bonus={`+${attackBonus}`}
            damage={hornDamage}
            damageType="piercing"
            traits={["Unarmed", "Brawling"]}
            proficiency={weaponRank.charAt(0).toUpperCase() + weaponRank.slice(1)}
            abilityMod={strMod}
            weaponProf={weaponProf}
            itemBonus={itemBonus}
            level={level}
            weaponUrl={pathfinderRules.ancestries.minotaur.url}
            description={`Natural horn attack from Minotaur ancestry, enhanced by Handwraps (+${itemBonus}, ${strikingDice > 0 ? 'Striking' : ''})`}
          />
          {level >= 13 && (
            <div className="bg-green-900/30 rounded-lg p-3 border border-green-700">
              <div className="text-sm text-green-300 font-semibold">Weapon Specialization</div>
              <div className="text-xs text-slate-300 mt-1">
                +{level >= 19 ? '4' : level >= 15 ? '3' : '2'} damage with all weapons (Expert or better)
              </div>
            </div>
          )}
        </div>
      </StatBlock>

      <StatBlock title="Saving Throws" icon={Shield}>
        <div className="grid md:grid-cols-3 gap-4">
          <Tooltip content={
            <>
              <div className="font-semibold text-purple-300 mb-2">Fortitude Save</div>
              <div className="space-y-2 text-slate-300">
                <div className="bg-slate-700/50 p-2 rounded">
                  <div className="font-semibold mb-1">Calculation:</div>
                  <div className="pl-2 text-sm">
                    • Constitution modifier: <span className="text-green-400">+{conMod}</span>
                  </div>
                  <div className="pl-2 text-sm">
                    • Proficiency ({fortRank}): <span className="text-green-400">+{fortProf}</span>
                    <a
                      href={pathfinderRules.classes.cleric.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  {resilientBonus > 0 && (
                    <div className="pl-2 text-sm">
                      • Resilient rune bonus: <span className="text-green-400">+{resilientBonus}</span>
                    </div>
                  )}
                  <div className="pl-2 text-sm font-semibold border-t border-slate-600 mt-1 pt-1">
                    = <span className="text-green-400">+{conMod + fortProf + resilientBonus}</span> total
                  </div>
                </div>
                <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
                  <div className="font-bold text-purple-300">
                    Fortitude: <span className="text-green-400">+{conMod + fortProf + resilientBonus}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {pathfinderRules.savingThrows.fortitude.description}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Warpriest: Expert at 1, Master at 11, Legendary at 19
                  </div>
                </div>
              </div>
            </>
          }>
            <div className="cursor-help">
              <StatItem
                label={`Fortitude (${fortRank.charAt(0).toUpperCase() + fortRank.slice(1)})`}
                value={`+${conMod + fortProf + resilientBonus}`}
              />
            </div>
          </Tooltip>
          <Tooltip content={
            <>
              <div className="font-semibold text-purple-300 mb-2">Reflex Save</div>
              <div className="space-y-2 text-slate-300">
                <div className="bg-slate-700/50 p-2 rounded">
                  <div className="font-semibold mb-1">Calculation:</div>
                  <div className="pl-2 text-sm">
                    • Dexterity modifier: <span className="text-green-400">+{dexMod}</span>
                  </div>
                  <div className="pl-2 text-sm">
                    • Proficiency ({refRank}): <span className="text-green-400">+{refProf}</span>
                    <a
                      href={pathfinderRules.classes.cleric.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  {resilientBonus > 0 && (
                    <div className="pl-2 text-sm">
                      • Resilient rune bonus: <span className="text-green-400">+{resilientBonus}</span>
                    </div>
                  )}
                  <div className="pl-2 text-sm font-semibold border-t border-slate-600 mt-1 pt-1">
                    = <span className="text-green-400">+{dexMod + refProf + resilientBonus}</span> total
                  </div>
                </div>
                <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
                  <div className="font-bold text-purple-300">
                    Reflex: <span className="text-green-400">+{dexMod + refProf}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {pathfinderRules.savingThrows.reflex.description}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Trained at 1, Expert at 11
                  </div>
                </div>
              </div>
            </>
          }>
            <div className="cursor-help">
              <StatItem
                label={`Reflex (${refRank.charAt(0).toUpperCase() + refRank.slice(1)})`}
                value={`+${dexMod + refProf}`}
              />
            </div>
          </Tooltip>
          <Tooltip content={
            <>
              <div className="font-semibold text-purple-300 mb-2">Will Save</div>
              <div className="space-y-2 text-slate-300">
                <div className="bg-slate-700/50 p-2 rounded">
                  <div className="font-semibold mb-1">Calculation:</div>
                  <div className="pl-2 text-sm">
                    • Wisdom modifier: <span className="text-green-400">+{wisMod}</span>
                  </div>
                  <div className="pl-2 text-sm">
                    • Proficiency ({willRank}): <span className="text-green-400">+{willProf}</span>
                    <a
                      href={pathfinderRules.classes.cleric.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  {resilientBonus > 0 && (
                    <div className="pl-2 text-sm">
                      • Resilient rune bonus: <span className="text-green-400">+{resilientBonus}</span>
                      <a
                        href="https://2e.aonprd.com/Equipment.aspx?ID=1209"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  <div className="pl-2 text-sm font-semibold border-t border-slate-600 mt-1 pt-1">
                    = <span className="text-green-400">+{wisMod + willProf + resilientBonus}</span> total
                  </div>
                </div>
                <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
                  <div className="font-bold text-purple-300">
                    Will: <span className="text-green-400">+{wisMod + willProf + resilientBonus}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {pathfinderRules.savingThrows.will.description}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Expert at 1, Master at 9 (with Resolute Faith){resilientBonus > 0 ? `, +${resilientBonus} from Major Resilient rune` : ''}
                  </div>
                </div>
              </div>
            </>
          }>
            <div className="cursor-help">
              <StatItem
                label={`Will (${willRank.charAt(0).toUpperCase() + willRank.slice(1)})`}
                value={`+${wisMod + willProf + resilientBonus}`}
              />
            </div>
          </Tooltip>
        </div>
        {level >= 9 && (
          <div className="mt-3 bg-purple-900/30 rounded-lg p-3 border border-purple-700">
            <div className="text-sm text-purple-300 font-semibold">Resolute Faith</div>
            <div className="text-xs text-slate-300">Success on Will saves becomes critical success</div>
          </div>
        )}
      </StatBlock>
    </div>
  );
}

function SpellsTab({ level, preparedSpells, castSpells, castSpell, uncastSpell, restSpells, togglePreparedSpell, divineFontChoice, setDivineFontChoice }) {
  const wisScore = getAbilityScore(BASE_ABILITY_SCORES.WIS, 'WIS', level);
  const wisMod = getModifier(wisScore);
  const spellRank = level >= 11 ? 'expert' : 'trained';
  const spellProf = getProficiencyBonus(level, spellRank);
  const spellDC = 10 + wisMod + spellProf;
  const spellAttack = wisMod + spellProf;
  // Divine spell list for Irori Warpriest
  const divineSpells = {
    cantrips: [
      { id: 'divine-lance', name: 'Divine Lance', actions: 2, desc: 'Ranged spell attack, 1d4+spellcasting mod damage (good, evil, lawful, or chaotic)' },
      { id: 'shield', name: 'Shield', actions: 1, desc: '+1 circumstance bonus to AC, can use Shield Block reaction' },
      { id: 'guidance', name: 'Guidance', actions: 2, desc: 'Target gains +1 status bonus to one check' },
      { id: 'detect-magic', name: 'Detect Magic', actions: 2, desc: 'Detect magical auras in 30-foot emanation' },
      { id: 'light', name: 'Light', actions: 2, desc: 'Make object shed bright light in 20-foot radius' },
      { id: 'stabilize', name: 'Stabilize', actions: 2, desc: 'Automatically stabilize dying creature' }
    ],
    rank1: [
      { id: 'bless', name: 'Bless', actions: 2, desc: '+1 status bonus to attack rolls for allies in 15-foot emanation' },
      { id: 'command', name: 'Command', actions: 2, desc: 'Force creature to follow one-word command (approach, drop, flee, grovel, halt)' },
      { id: 'fear', name: 'Fear', actions: 2, desc: 'Target becomes frightened 1 (frightened 2 on crit fail)' },
      { id: 'jump', name: 'Jump', actions: 2, desc: 'Target gains +10 foot status bonus to jump distance (Irori cleric spell)' },
      { id: 'sanctuary', name: 'Sanctuary', actions: 2, desc: 'Attackers must succeed Will save or choose different target' },
      { id: 'heal', name: 'Heal', actions: '1-3', desc: '1d8+8 HP (1 action: touch; 2 actions: 30 ft; 3 actions: 30-ft burst)' },
      { id: 'harm', name: 'Harm', actions: '1-3', desc: '1d8+8 void damage to living or heal undead (Versatile Font)' }
    ],
    rank2: [
      { id: 'invisibility', name: 'Invisibility', actions: 2, desc: 'Target becomes invisible until they attack' },
      { id: 'spiritual-weapon', name: 'Spiritual Weapon', actions: 2, desc: 'Summon floating weapon that Strikes each round' },
      { id: 'silence', name: 'Silence', actions: 2, desc: 'Create 10-foot burst of magical silence' },
      { id: 'see-invisibility', name: 'See Invisibility', actions: 2, desc: 'See invisible creatures and objects' }
    ],
    rank3: [
      { id: 'blindness', name: 'Blindness', actions: 2, desc: 'Make target blinded' },
      { id: 'crisis-of-faith', name: 'Crisis of Faith', actions: 2, desc: 'Target becomes confused or stupefied' },
      { id: 'heroism', name: 'Heroism', actions: 2, desc: '+1 status bonus to attack rolls, saves, and skill checks' },
      { id: 'haste', name: 'Haste', actions: 2, desc: 'Target is quickened and gains extra action (Irori cleric spell)' }
    ],
    rank4: [
      { id: 'stoneskin', name: 'Stoneskin', actions: 2, desc: 'Target gains resistance 5 to physical damage (Irori cleric spell)' },
      { id: 'freedom-of-movement', name: 'Freedom of Movement', actions: 2, desc: 'Target ignores difficult terrain and immobilization' },
      { id: 'air-walk', name: 'Air Walk', actions: 2, desc: 'Walk on air as if solid ground' }
    ],
    rank5: [
      { id: 'divine-wrath', name: 'Divine Wrath', actions: 2, desc: 'Deal 4d10 damage + enfeebled to enemies of chosen alignment' },
      { id: 'flame-strike', name: 'Flame Strike', actions: 2, desc: '8d6 damage (half fire, half divine) in 10-foot burst' }
    ],
    rank6: [
      { id: 'blade-barrier', name: 'Blade Barrier', actions: 2, desc: 'Create wall of spinning blades that deals 7d8 slashing' },
      { id: 'repulsion', name: 'Repulsion', actions: 2, desc: 'Push creatures away in 30-foot emanation' }
    ]
  };

  const maxRanks = Math.min(Math.ceil((level + 1) / 2), 10);
  const fontSlots = getDivineFontSlots(level);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold text-purple-300 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Divine Spells
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Warpriest of Irori • Spell DC {spellDC} • Spell Attack +{spellAttack}
            </p>
          </div>
          <button
            onClick={restSpells}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transform hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
          >
            <Heart className="w-4 h-4" />
            Rest (Restore All)
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div className="bg-slate-800/50 rounded p-2">
            <div className="text-slate-400">Tradition</div>
            <div className="text-white font-semibold">Divine</div>
          </div>
          <div className="bg-slate-800/50 rounded p-2">
            <div className="text-slate-400">Proficiency</div>
            <div className="text-white font-semibold capitalize">{spellRank}</div>
          </div>
          <div className="bg-slate-800/50 rounded p-2">
            <div className="text-slate-400">Key Ability</div>
            <div className="text-white font-semibold">Wisdom (+{wisMod})</div>
          </div>
          <div className="bg-slate-800/50 rounded p-2">
            <div className="text-slate-400">Max Spell Rank</div>
            <div className="text-white font-semibold">{maxRanks}</div>
          </div>
        </div>
      </div>

      {/* Divine Font - Healing/Harmful Font */}
      <div className={`${divineFontChoice === 'heal' ? 'bg-green-900/20 border-green-700' : 'bg-purple-900/20 border-purple-700'} rounded-lg p-4 border`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <h3 className={`text-lg font-bold ${divineFontChoice === 'heal' ? 'text-green-300' : 'text-purple-300'} flex items-center gap-2`}>
              Divine Font: {divineFontChoice === 'heal' ? 'Heal' : 'Harm'}
              <a
                href="https://2e.aonprd.com/Classes.aspx?ID=5"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300"
                title="Cleric Divine Font - Player Core pg. 112"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </h3>
            <p className="text-slate-300 text-xs">
              {CHARACTER_IDENTITY.deity.divineFont === 'Versatile' ? (
                <>
                  Versatile Font: Can prepare {fontSlots}× {divineFontChoice} spells per day
                  <br />
                  <span className="text-xs text-slate-400">Source: Versatile Font feat (Player Core pg. 115)</span>
                </>
              ) : (
                <>
                  Healing Font: Can cast heal {fontSlots}×/day at current spell rank
                  <br />
                  <span className="text-xs text-slate-400">Source: Player Core pg. 112</span>
                </>
              )}
            </p>
            {CHARACTER_IDENTITY.deity.divineFont === 'Versatile' && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setDivineFontChoice('heal')}
                  className={`px-3 py-1 rounded text-sm ${divineFontChoice === 'heal' ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                >
                  Heal
                </button>
                <button
                  onClick={() => setDivineFontChoice('harm')}
                  className={`px-3 py-1 rounded text-sm ${divineFontChoice === 'harm' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                >
                  Harm
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => uncastSpell('divineFont')}
              className={`px-2 py-1 ${divineFontChoice === 'heal' ? 'bg-green-700 hover:bg-green-800' : 'bg-purple-700 hover:bg-purple-800'} rounded text-sm`}
              disabled={castSpells.divineFont === 0}
            >
              -
            </button>
            <div className="text-lg font-bold">
              <span className={divineFontChoice === 'heal' ? 'text-green-400' : 'text-purple-400'}>{fontSlots - castSpells.divineFont}</span>
              <span className="text-slate-400"> / {fontSlots}</span>
            </div>
            <button
              onClick={() => castSpell('divineFont')}
              className={`px-2 py-1 ${divineFontChoice === 'heal' ? 'bg-green-700 hover:bg-green-800' : 'bg-purple-700 hover:bg-purple-800'} rounded text-sm`}
              disabled={castSpells.divineFont >= fontSlots}
            >
              Cast
            </button>
          </div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: fontSlots }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded ${i < fontSlots - castSpells.divineFont ? (divineFontChoice === 'heal' ? 'bg-green-500' : 'bg-purple-500') : 'bg-slate-700'}`}
            />
          ))}
        </div>
        <div className="mt-3 p-2 bg-slate-700/50 rounded text-xs text-slate-300">
          {divineFontChoice === 'heal' ? (
            <><strong>Heal Spell:</strong> Restore hit points to living creatures. Can be cast at your highest spell rank ({maxRanks > 0 ? `Rank ${Math.min(maxRanks, 10)}` : 'Rank 1'}).</>
          ) : (
            <><strong>Harm Spell:</strong> Deal void damage to living creatures or heal undead. Can be cast at your highest spell rank ({maxRanks > 0 ? `Rank ${Math.min(maxRanks, 10)}` : 'Rank 1'}).</>
          )}
        </div>
      </div>

      {/* Cantrips */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-bold text-slate-200 mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Cantrips (Unlimited)
        </h3>
        <div className="grid gap-2">
          {divineSpells.cantrips.map(spell => (
            <SpellCard
              key={spell.id}
              spell={spell}
              isCantrip
              preparedCount={preparedSpells.cantrips.filter(id => id === spell.id).length}
              onTogglePrepare={() => togglePreparedSpell('cantrips', spell.id)}
            />
          ))}
        </div>
      </div>

      {/* Leveled Spells */}
      {[1, 2, 3, 4, 5, 6].map(rank => {
        if (rank > maxRanks) return null;
        const maxSlots = getMaxSpellSlots(level, `rank${rank}`);
        if (maxSlots === 0) return null;

        const spellsForRank = divineSpells[`rank${rank}`] || [];
        const rankKey = `rank${rank}`;

        return (
          <div key={rank} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-200">
                Rank {rank} Spells
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => uncastSpell(rankKey)}
                  className="px-2 py-1 bg-purple-700 hover:bg-purple-800 rounded text-sm"
                  disabled={castSpells[rankKey] === 0}
                >
                  -
                </button>
                <div className="text-lg font-bold">
                  <span className="text-purple-400">{maxSlots - castSpells[rankKey]}</span>
                  <span className="text-slate-400"> / {maxSlots}</span>
                </div>
                <button
                  onClick={() => castSpell(rankKey)}
                  className="px-2 py-1 bg-purple-700 hover:bg-purple-800 rounded text-sm"
                  disabled={castSpells[rankKey] >= maxSlots}
                >
                  Cast
                </button>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {Array.from({ length: maxSlots }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded ${i < maxSlots - castSpells[rankKey] ? 'bg-purple-500' : 'bg-slate-700'}`}
                />
              ))}
            </div>
            <div className="space-y-2">
              {spellsForRank.map(spell => {
                const preparedCount = (preparedSpells[rankKey] || []).filter(id => id === spell.id).length;
                return (
                  <SpellCard
                    key={spell.id}
                    spell={spell}
                    preparedCount={preparedCount}
                    onTogglePrepare={() => togglePreparedSpell(rankKey, spell.id)}
                    onAddAnother={() => togglePreparedSpell(rankKey, spell.id)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Enhanced Tooltip component with responsive positioning, mobile support, and accessibility
function Tooltip({ children, content, placement = 'auto' }) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState(placement);
  const [tooltipId] = useState(() => `tooltip-${Math.random().toString(36).slice(2, 11)}`);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const triggerRef = React.useRef(null);
  const tooltipRef = React.useRef(null);
  const hideTimeoutRef = React.useRef(null);

  // Calculate best position based on viewport
  const calculatePosition = () => {
    if (placement !== 'auto' || !triggerRef.current) {
      return placement;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Estimated tooltip width (320px = w-80)
    const estimatedTooltipWidth = 320;
    const estimatedTooltipHeight = 200;

    // Check space on all sides
    const spaceRight = viewportWidth - triggerRect.right;
    const spaceLeft = triggerRect.left;
    const spaceTop = triggerRect.top;
    const spaceBottom = viewportHeight - triggerRect.bottom;

    // On mobile (< 640px), prefer top or bottom
    if (viewportWidth < 640) {
      return spaceBottom > spaceTop ? 'bottom' : 'top';
    }

    // On larger screens, prefer right/left, fallback to top/bottom
    // Add extra margin (32px) for safety
    if (spaceRight >= estimatedTooltipWidth + 32) return 'right';
    if (spaceLeft >= estimatedTooltipWidth + 32) return 'left';
    if (spaceBottom >= estimatedTooltipHeight + 32) return 'bottom';
    if (spaceTop >= estimatedTooltipHeight + 32) return 'top';

    // If all spaces are tight, choose the largest available space
    const maxSpace = Math.max(spaceRight, spaceLeft, spaceTop, spaceBottom);
    if (maxSpace === spaceLeft) return 'left';
    if (maxSpace === spaceTop) return 'top';
    if (maxSpace === spaceBottom) return 'bottom';

    // Default to right
    return 'right';
  };

  // Show tooltip with delay buffer
  const showTooltip = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsVisible(true);
    setIsDragging(false);
    setTooltipPos({ x: 0, y: 0 });
    // Calculate position after render
    setTimeout(() => {
      const newPos = calculatePosition();
      setPosition(newPos);
    }, 0);
  };

  // Hide tooltip with delay (100ms buffer for hover leeway)
  const hideTooltip = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  // Cancel hide when entering tooltip area
  const cancelHide = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  // Drag handlers
  const handleMouseDown = (e) => {
    if (!tooltipRef.current) return;
    setIsDragging(true);
    const rect = tooltipRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - tooltipPos.x,
      y: e.clientY - rect.top - tooltipPos.y
    });
    e.preventDefault();
  };

  const handleMouseMove = React.useCallback((e) => {
    if (!isDragging || !tooltipRef.current) return;
    const rect = tooltipRef.current.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left - dragOffset.x,
      y: e.clientY - rect.top - dragOffset.y
    });
  }, [isDragging, dragOffset]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse handlers for dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove]);

  // Toggle for keyboard/touch
  const toggleTooltip = () => {
    if (isVisible) {
      setIsVisible(false);
    } else {
      showTooltip();
    }
  };

  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTooltip();
    } else if (e.key === 'Escape' && isVisible) {
      setIsVisible(false);
    }
  };

  // Get position classes based on calculated position
  const getPositionClasses = () => {
    const baseClasses = "absolute z-[9999] p-3 sm:p-4 bg-slate-800 border-2 border-purple-500 rounded-lg shadow-2xl text-xs sm:text-sm cursor-move";
    const widthClasses = "w-[calc(100vw-2rem)] max-w-xs sm:max-w-sm md:w-80";

    switch (position) {
      case 'right':
        return `${baseClasses} ${widthClasses} -top-2 left-full ml-2`;
      case 'left':
        return `${baseClasses} ${widthClasses} -top-2 right-full mr-2`;
      case 'top':
        return `${baseClasses} ${widthClasses} bottom-full mb-2 left-1/2 -translate-x-1/2`;
      case 'bottom':
        return `${baseClasses} ${widthClasses} top-full mt-2 left-1/2 -translate-x-1/2`;
      default:
        return `${baseClasses} ${widthClasses} -top-2 left-full ml-2`;
    }
  };

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onTouchStart={toggleTooltip}
        onKeyDown={handleKeyDown}
        onClick={toggleTooltip}
        className="cursor-help items-center gap-1 touch-manipulation"
        role="button"
        tabIndex={0}
        aria-describedby={isVisible ? tooltipId : undefined}
        aria-expanded={isVisible}
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className={getPositionClasses()}
          onMouseEnter={cancelHide}
          onMouseLeave={hideTooltip}
          onMouseDown={handleMouseDown}
          style={{
            transform: `translate(${tooltipPos.x}px, ${tooltipPos.y}px)`,
            userSelect: isDragging ? 'none' : 'auto'
          }}
        >
          <div className="space-y-2">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}

function SpellCard({ spell, isCantrip, preparedCount, onTogglePrepare, onAddAnother }) {
  const isPrepared = preparedCount > 0;

  return (
    <div className={`rounded-lg border transition-all ${isPrepared ? 'bg-purple-900/30 border-purple-600' : 'bg-slate-700/30 border-slate-600'}`}>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Tooltip content={
                <>
                  <div className="font-semibold text-purple-300 mb-2">{spell.name}</div>
                  <div className="space-y-2 text-slate-300">
                    <div className="bg-slate-700/50 p-2 rounded">
                      <div className="text-sm">
                        <strong>Actions:</strong> {spell.actions} {spell.actions === 1 ? 'action' : 'actions'}
                      </div>
                      {spell.rank && (
                        <div className="text-sm mt-1">
                          <strong>Rank:</strong> {spell.rank}
                        </div>
                      )}
                      {spell.traditions && (
                        <div className="text-sm mt-1">
                          <strong>Traditions:</strong> {spell.traditions}
                        </div>
                      )}
                    </div>
                    <div className="bg-slate-700/50 p-2 rounded">
                      <div className="text-sm">
                        <strong>Description:</strong> {spell.desc}
                      </div>
                      {spell.heightening && (
                        <div className="text-sm mt-2">
                          <strong>Heightening:</strong> {spell.heightening}
                        </div>
                      )}
                    </div>
                    <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
                      <div className="text-xs text-slate-400">
                        Source: Player Core
                      </div>
                    </div>
                  </div>
                </>
              }>
                <div className="cursor-help inline-flex items-center gap-1">
                  <h4 className="font-semibold text-white">{spell.name}</h4>
                  <Info className="w-3.5 h-3.5 text-purple-400 hover:text-purple-300" />
                </div>
              </Tooltip>
              <span className="text-xs bg-slate-600 px-2 py-0.5 rounded">{spell.actions} {spell.actions === 1 ? 'action' : 'actions'}</span>
              {isPrepared && (
                <span className="text-xs bg-purple-600 px-2 py-0.5 rounded">
                  Prepared {preparedCount > 1 ? `×${preparedCount}` : ''}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-300">{spell.desc}</p>
          </div>
          {!isCantrip && (
            <div className="flex gap-1">
              {isPrepared && (
                <button
                  onClick={onTogglePrepare}
                  className="px-3 py-1 rounded text-sm transition-all bg-red-600 hover:bg-red-700"
                  title="Remove one prepared instance"
                >
                  -
                </button>
              )}
              <button
                onClick={isPrepared ? onAddAnother : onTogglePrepare}
                className="px-3 py-1 rounded text-sm transition-all bg-purple-600 hover:bg-purple-700"
                title={isPrepared ? "Prepare another instance" : "Prepare spell"}
              >
                {isPrepared ? '+' : 'Prepare'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Feats & Skills Tab - Track character advancement choices
function FeatsSkillsTab({ level, selectedFeats, setSelectedFeats, skillProficiencies, setSkillProficiencies, addStoryLog }) {
  // Feat picker modal state
  const [showFeatPicker, setShowFeatPicker] = useState(false);
  const [featPickerSlot, setFeatPickerSlot] = useState(null); // { level, type, label }
  const [featSearch, setFeatSearch] = useState('');

  // Helper to get feat slots available at current level
  const getFeatSlotsByLevel = () => {
    const slots = [];
    for (let lvl = 1; lvl <= level; lvl++) {
      if (pathfinderRules.featProgression.ancestry.includes(lvl)) {
        slots.push({ level: lvl, type: 'ancestry', label: 'Ancestry Feat' });
      }
      if (pathfinderRules.featProgression.class.includes(lvl)) {
        slots.push({ level: lvl, type: 'class', label: 'Class Feat' });
      }
      if (pathfinderRules.featProgression.skill.includes(lvl)) {
        slots.push({ level: lvl, type: 'skill', label: 'Skill Feat' });
      }
      if (pathfinderRules.featProgression.general.includes(lvl)) {
        slots.push({ level: lvl, type: 'general', label: 'General Feat' });
      }
    }
    return slots;
  };

  // Get available skill increases at current level
  const getSkillIncreases = () => {
    return pathfinderRules.skillProgression.increases.filter(lvl => lvl <= level);
  };

  const featSlots = getFeatSlotsByLevel();
  const skillIncreases = getSkillIncreases();

  // Group feats by level
  const featsByLevel = {};
  selectedFeats.forEach(feat => {
    if (!featsByLevel[feat.levelGained]) {
      featsByLevel[feat.levelGained] = [];
    }
    featsByLevel[feat.levelGained].push(feat);
  });

  // Get available feats for a given type
  const getAvailableFeats = (type, slotLevel) => {
    const allFeats = [];

    if (type === 'ancestry') {
      Object.values(pathfinderRules.feats.minotaur || {}).forEach(feat => {
        if (feat.level <= slotLevel) {
          allFeats.push({ ...feat, featKey: feat.name.toLowerCase().replace(/\s+/g, ''), category: 'minotaur' });
        }
      });
      Object.values(pathfinderRules.feats.dragonblood || {}).forEach(feat => {
        if (feat.level <= slotLevel) {
          allFeats.push({ ...feat, featKey: feat.name.toLowerCase().replace(/\s+/g, ''), category: 'dragonblood' });
        }
      });
    } else if (type === 'class') {
      Object.values(pathfinderRules.feats.cleric || {}).forEach(feat => {
        if (feat.level <= slotLevel) {
          allFeats.push({ ...feat, featKey: feat.name.toLowerCase().replace(/\s+/g, ''), category: 'cleric' });
        }
      });
    } else if (type === 'skill') {
      Object.values(pathfinderRules.feats.skill || {}).forEach(feat => {
        if (feat.level <= slotLevel) {
          allFeats.push({ ...feat, featKey: feat.name.toLowerCase().replace(/\s+/g, ''), category: 'skill' });
        }
      });
    } else if (type === 'general') {
      Object.values(pathfinderRules.feats.general || {}).forEach(feat => {
        if (feat.level <= slotLevel) {
          allFeats.push({ ...feat, featKey: feat.name.toLowerCase().replace(/\s+/g, ''), category: 'general' });
        }
      });
    }

    return allFeats;
  };

  // Open feat picker modal
  const openFeatPicker = (slot) => {
    setFeatPickerSlot(slot);
    setFeatSearch('');
    setShowFeatPicker(true);
  };

  // Select a feat
  const selectFeat = (feat) => {
    if (!featPickerSlot) return;

    // Check if replacing an existing feat
    const existingFeat = selectedFeats.find(f =>
      f.levelGained === featPickerSlot.level && f.type === featPickerSlot.type
    );

    // Remove any existing feat in this slot
    const updatedFeats = selectedFeats.filter(f =>
      !(f.levelGained === featPickerSlot.level && f.type === featPickerSlot.type)
    );

    // Add new feat
    const newFeat = {
      levelGained: featPickerSlot.level,
      type: featPickerSlot.type,
      category: feat.category,
      featKey: feat.featKey,
      name: feat.name,
      source: feat.source,
      url: feat.url,
      granted: false
    };

    setSelectedFeats([...updatedFeats, newFeat]);
    setShowFeatPicker(false);

    // Add story log
    if (existingFeat) {
      addStoryLog(`Changed ${featPickerSlot.label} at level ${featPickerSlot.level} from ${existingFeat.name} to ${feat.name}`);
    } else {
      addStoryLog(`Gained ${featPickerSlot.label} at level ${featPickerSlot.level}: ${feat.name}`);
    }
  };

  // Remove a feat
  const removeFeatLocal = (levelGained, type) => {
    const featToRemove = selectedFeats.find(f =>
      f.levelGained === levelGained && f.type === type
    );

    if (featToRemove) {
      setSelectedFeats(selectedFeats.filter(f =>
        !(f.levelGained === levelGained && f.type === type)
      ));

      // Add story log
      const featTypeName = type === 'ancestry' ? 'Ancestry Feat' :
                          type === 'class' ? 'Class Feat' :
                          type === 'skill' ? 'Skill Feat' : 'General Feat';
      addStoryLog(`Removed ${featTypeName} at level ${levelGained}: ${featToRemove.name}`);
    }
  };

  // Filter feats by search
  const filterFeats = (feats) => {
    if (!featSearch) return feats;
    const search = featSearch.toLowerCase();
    return feats.filter(feat =>
      feat.name.toLowerCase().includes(search) ||
      feat.description?.toLowerCase().includes(search) ||
      feat.prerequisites?.some(p => p.toLowerCase().includes(search))
    );
  };

  // Get next skill rank
  const getNextRank = (currentRank) => {
    const ranks = ['trained', 'expert', 'master', 'legendary'];
    const currentIndex = ranks.indexOf(currentRank);
    return currentIndex < ranks.length - 1 ? ranks[currentIndex + 1] : null;
  };

  // Increase skill proficiency
  const increaseSkill = (skillKey, currentRank, skillName) => {
    const nextRank = getNextRank(currentRank);
    if (!nextRank) return;

    setSkillProficiencies(prev => ({
      ...prev,
      [skillKey]: {
        ...prev[skillKey],
        rank: nextRank,
        levelGained: level,
        source: `Level ${level} skill increase`
      }
    }));

    addStoryLog(`Increased ${skillName} proficiency from ${currentRank} to ${nextRank} at level ${level}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
        <h2 className="text-2xl font-bold text-purple-300 flex items-center gap-2">
          <Award className="w-6 h-6" />
          Feats & Skills
        </h2>
        <p className="text-slate-300 text-sm mt-2">
          Track your character's feat selections and skill proficiencies. All choices are saved automatically with source citations.
        </p>
      </div>

      {/* Feat Summary */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
        <h3 className="text-xl font-bold text-slate-200 mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          Feats Summary (Level {level})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-green-900/30 rounded p-2 border border-green-700">
            <div className="text-2xl font-bold text-green-400">{selectedFeats.filter(f => f.type === 'ancestry' || f.type === 'heritage').length}</div>
            <div className="text-xs text-slate-300">Ancestry Feats</div>
          </div>
          <div className="bg-blue-900/30 rounded p-2 border border-blue-700">
            <div className="text-2xl font-bold text-blue-400">{selectedFeats.filter(f => f.type === 'class').length}</div>
            <div className="text-xs text-slate-300">Class Feats</div>
          </div>
          <div className="bg-purple-900/30 rounded p-2 border border-purple-700">
            <div className="text-2xl font-bold text-purple-400">{selectedFeats.filter(f => f.type === 'skill').length}</div>
            <div className="text-xs text-slate-300">Skill Feats</div>
          </div>
          <div className="bg-orange-900/30 rounded p-2 border border-orange-700">
            <div className="text-2xl font-bold text-orange-400">{selectedFeats.filter(f => f.type === 'general').length}</div>
            <div className="text-xs text-slate-300">General Feats</div>
          </div>
        </div>
      </div>

      {/* Feats by Level */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-bold text-slate-200 mb-3">Selected Feats (by Level)</h3>
        <div className="space-y-3">
          {Array.from({ length: level }, (_, i) => i + 1).map(lvl => {
            const featsAtLevel = featsByLevel[lvl] || [];
            const slotsAtLevel = featSlots.filter(s => s.level === lvl);

            if (slotsAtLevel.length === 0) return null;

            return (
              <div key={lvl} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                <div className="font-semibold text-purple-300 mb-2">Level {lvl}</div>
                <div className="space-y-2">
                  {slotsAtLevel.map((slot, idx) => {
                    const featInSlot = featsAtLevel.find(f => f.type === slot.type);
                    return (
                      <div key={`${lvl}-${slot.type}-${idx}`} className="flex items-center justify-between bg-slate-800 rounded p-2">
                        <div className="flex-1">
                          <div className="text-xs text-slate-400">{slot.label}</div>
                          {featInSlot ? (
                            <div className="flex items-center gap-2">
                              <div className="font-semibold text-white">{featInSlot.name}</div>
                              {featInSlot.granted && (
                                <span className="text-xs bg-blue-700 px-2 py-0.5 rounded">Granted</span>
                              )}
                              <a
                                href={featInSlot.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300"
                                title={featInSlot.source}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          ) : (
                            <div className="text-slate-500 italic">Not selected</div>
                          )}
                          {featInSlot && (
                            <div className="text-xs text-slate-400 mt-1">{featInSlot.source}</div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {featInSlot && !featInSlot.granted && (
                            <button
                              onClick={() => removeFeatLocal(lvl, slot.type)}
                              className="px-2 py-1 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded text-xs border border-red-700 transition-colors"
                            >
                              Remove
                            </button>
                          )}
                          {!featInSlot && (
                            <button
                              onClick={() => openFeatPicker(slot)}
                              className="px-3 py-1 bg-purple-900/50 hover:bg-purple-900/70 text-purple-300 rounded text-xs border border-purple-700 transition-colors flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              Select
                            </button>
                          )}
                          {featInSlot && !featInSlot.granted && (
                            <button
                              onClick={() => openFeatPicker(slot)}
                              className="px-2 py-1 bg-blue-900/50 hover:bg-blue-900/70 text-blue-300 rounded text-xs border border-blue-700 transition-colors"
                            >
                              Change
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skills Summary */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
        <h3 className="text-xl font-bold text-slate-200 mb-3 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-400" />
          Skill Proficiencies
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(skillProficiencies).map(([skillKey, data]) => {
            const skillInfo = pathfinderRules.skills[skillKey];
            const rankColor = {
              trained: 'text-green-400',
              expert: 'text-blue-400',
              master: 'text-purple-400',
              legendary: 'text-yellow-400'
            }[data.rank];

            const nextRank = getNextRank(data.rank);
            const skillDisplayName = skillInfo ? skillInfo.name : (data.lore ? `${skillKey} Lore` : skillKey);

            return (
              <div key={skillKey} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-white">
                        {skillDisplayName}
                      </div>
                      <span className={`text-xs font-bold ${rankColor} uppercase`}>
                        {data.rank}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Gained at Level {data.levelGained} • {data.source}
                    </div>
                    {skillInfo && (
                      <div className="text-xs text-slate-500 mt-1">
                        Key Ability: {skillInfo.ability}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {nextRank && (
                      <button
                        onClick={() => increaseSkill(skillKey, data.rank, skillDisplayName)}
                        className="px-2 py-1 bg-green-900/50 hover:bg-green-900/70 text-green-300 rounded text-xs border border-green-700 transition-colors flex items-center gap-1"
                        title={`Increase to ${nextRank}`}
                      >
                        <TrendingUp className="w-3 h-3" />
                        {nextRank}
                      </button>
                    )}
                    {skillInfo && (
                      <a
                        href={skillInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300"
                        title={skillInfo.source}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700">
        <h4 className="font-semibold text-blue-300 mb-2">Rules Reference</h4>
        <div className="text-sm text-slate-300 space-y-1">
          <div>• <strong>Ancestry Feats</strong>: Levels 1, 5, 9, 13, 17</div>
          <div>• <strong>Class Feats</strong>: Levels 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20</div>
          <div>• <strong>Skill Feats</strong>: Every even level (2, 4, 6, 8, 10, 12, 14, 16, 18, 20)</div>
          <div>• <strong>General Feats</strong>: Levels 3, 7, 11, 15, 19</div>
          <div>• <strong>Skill Increases</strong>: Levels 2, 3, 5, 7, 9, 11, 13, 15, 17, 19</div>
          <div className="text-xs text-slate-400 mt-2">Source: Player Core pg. 33</div>
        </div>
      </div>

      {/* Feat Picker Modal */}
      {showFeatPicker && featPickerSlot && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg border-2 border-purple-600 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-purple-500/20">
            {/* Modal Header */}
            <div className="bg-purple-900/50 border-b border-purple-700 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-purple-300 flex items-center gap-2">
                  <Award className="w-6 h-6" />
                  Select {featPickerSlot.label}
                </h3>
                <p className="text-sm text-slate-400 mt-1">Level {featPickerSlot.level} • {featPickerSlot.type.charAt(0).toUpperCase() + featPickerSlot.type.slice(1)}</p>
              </div>
              <button
                onClick={() => setShowFeatPicker(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-slate-700">
              <input
                type="text"
                placeholder="Search feats by name, description, or prerequisites..."
                value={featSearch}
                onChange={(e) => setFeatSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                autoFocus
              />
            </div>

            {/* Feats List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {filterFeats(getAvailableFeats(featPickerSlot.type, featPickerSlot.level)).map((feat, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/50 rounded-lg p-4 border border-slate-600 hover:border-purple-500 transition-all cursor-pointer group"
                  onClick={() => selectFeat(feat)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">{feat.name}</h4>
                        <span className="text-xs bg-purple-900/50 px-2 py-1 rounded border border-purple-700 text-purple-300">
                          Level {feat.level}
                        </span>
                        {feat.actions && (
                          <span className="text-xs bg-blue-900/50 px-2 py-1 rounded border border-blue-700 text-blue-300">
                            {feat.actions}
                          </span>
                        )}
                      </div>

                      {feat.prerequisites && feat.prerequisites.length > 0 && (
                        <div className="text-sm text-yellow-400 mb-2">
                          <strong>Prerequisites:</strong> {Array.isArray(feat.prerequisites) ? feat.prerequisites.join(', ') : feat.prerequisites}
                        </div>
                      )}

                      <p className="text-sm text-slate-300 mb-2">{feat.description}</p>

                      {feat.traits && feat.traits.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {feat.traits.map((trait, i) => (
                            <span key={i} className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                              {trait}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{feat.source}</span>
                        <a
                          href={feat.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View on Archives of Nethys
                        </a>
                      </div>
                    </div>

                    <button
                      className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded border border-purple-600 transition-colors flex items-center gap-2 shrink-0"
                      onClick={() => selectFeat(feat)}
                    >
                      <Check className="w-4 h-4" />
                      Select
                    </button>
                  </div>
                </div>
              ))}

              {filterFeats(getAvailableFeats(featPickerSlot.type, featPickerSlot.level)).length === 0 && (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No feats found matching your search.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-800/50 border-t border-slate-700 p-4 flex justify-between items-center">
              <p className="text-sm text-slate-400">
                {filterFeats(getAvailableFeats(featPickerSlot.type, featPickerSlot.level)).length} feats available
              </p>
              <button
                onClick={() => setShowFeatPicker(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded border border-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressionTab({ level }) {
  const milestones = [
    {
      level: 1,
      unlocked: true,
      feats: [
        { name: "Shield Block", type: "General", source: "Player Core pg. 266", url: "https://2e.aonprd.com/Feats.aspx?ID=839" },
        { name: "Deadly Simplicity", type: "Doctrine", source: "Player Core pg. 118", url: "https://2e.aonprd.com/Feats.aspx?ID=4642" },
        { name: "Intimidating Glare", type: "Background", source: "Player Core pg. 260", url: "https://2e.aonprd.com/Feats.aspx?ID=796" },
        { name: "Dragonblood", type: "Heritage", source: "Player Core 2 pg. 44", url: "https://2e.aonprd.com/Heritages.aspx?ID=368" },
        { name: "Breath of the Dragon", type: "Ancestry", source: "Player Core 2 pg. 44", url: "https://2e.aonprd.com/Feats.aspx?ID=4365" }
      ],
      features: [
        "Darkvision (Minotaur)",
        "Horns - 1d8 piercing unarmed attack",
        "Adamantine - Physical resistance at level 9",
        "Divine Font: Healing (4 slots/day)",
        "Warpriest Doctrine - Trained in medium armor"
      ]
    },
    {
      level: 2,
      unlocked: level >= 2,
      feats: [
        { name: "Quick Jump", type: "Skill", source: "Player Core pg. 263", url: "https://2e.aonprd.com/Feats.aspx?ID=809" },
        { name: "Healing Hands", type: "Class", source: "Player Core pg. 123", url: "https://2e.aonprd.com/Feats.aspx?ID=271" }
      ],
      features: ["Rank 1 spells", "Skill Increase"]
    },
    {
      level: 3,
      unlocked: level >= 3,
      feats: [
        { name: "Untrained Improvisation", type: "General", source: "Player Core pg. 268", url: "https://2e.aonprd.com/Feats.aspx?ID=850" }
      ],
      features: ["Rank 2 spells", "Skill Increase"]
    },
    {
      level: 4,
      unlocked: level >= 4,
      feats: [
        { name: "Battle Medicine", type: "Skill", source: "Player Core pg. 258", url: "https://2e.aonprd.com/Feats.aspx?ID=760" },
        { name: "Divine Infusion", type: "Class", source: "Player Core pg. 122", url: "https://2e.aonprd.com/Feats.aspx?ID=2943" }
      ],
      features: ["Skill Increase"]
    },
    {
      level: 5,
      unlocked: level >= 5,
      feats: [
        { name: "Dragon's Flight", type: "Ancestry", source: "Player Core 2 pg. 45", url: "https://2e.aonprd.com/Feats.aspx?ID=4366" }
      ],
      features: ["Rank 3 spells", "Ability Boosts (STR, DEX, CON, WIS)", "Perception Expert", "Divine Font: 5 slots", "Skill Increase"]
    },
    {
      level: 6,
      unlocked: level >= 6,
      feats: [
        { name: "Continual Recovery", type: "Skill", source: "Player Core pg. 259", url: "https://2e.aonprd.com/Feats.aspx?ID=771" },
        { name: "Magic Hands", type: "Class", source: "Player Core pg. 124", url: "https://2e.aonprd.com/Feats.aspx?ID=2948" }
      ],
      features: ["Skill Increase"]
    },
    {
      level: 7,
      unlocked: level >= 7,
      feats: [
        { name: "Robust Health", type: "General", source: "Player Core pg. 266", url: "https://2e.aonprd.com/Feats.aspx?ID=843" }
      ],
      features: ["Rank 4 spells", "Skill Increase", "Expert with simple/martial/unarmed/favored weapon (Warpriest)", "Critical Specialization with favored weapon (Warpriest)"]
    },
    {
      level: 8,
      unlocked: level >= 8,
      feats: [
        { name: "Risky Surgery", type: "Skill", source: "Player Core pg. 264", url: "https://2e.aonprd.com/Feats.aspx?ID=813" },
        { name: "Zealous Rush", type: "Class", source: "Player Core pg. 126", url: "https://2e.aonprd.com/Feats.aspx?ID=2958" }
      ],
      features: ["Skill Increase"]
    },
    {
      level: 9,
      unlocked: level >= 9,
      feats: [
        { name: "True Dragon's Flight", type: "Ancestry", source: "Player Core 2 pg. 45", url: "https://2e.aonprd.com/Feats.aspx?ID=4369" }
      ],
      features: [
        "Rank 5 spells",
        "Resolute Faith - Will saves become Master, success→crit success",
        "Skill Increase"
      ]
    },
    {
      level: 10,
      unlocked: level >= 10,
      feats: [
        { name: "Advanced First Aid", type: "Skill", source: "Player Core pg. 257", url: "https://2e.aonprd.com/Feats.aspx?ID=755" },
        { name: "Replenishment of War", type: "Class", source: "Player Core pg. 125", url: "https://2e.aonprd.com/Feats.aspx?ID=293" }
      ],
      features: ["Ability Boosts (STR, DEX, CON, WIS)", "Skill Increase"]
    },
    {
      level: 11,
      unlocked: level >= 11,
      feats: [
        { name: "Toughness", type: "General", source: "Player Core pg. 267", url: "https://2e.aonprd.com/Feats.aspx?ID=848" }
      ],
      features: ["Rank 6 spells", "Reflex Save Expert", "Spell attack/DC becomes Expert (Warpriest)", "Skill Increase"]
    },
    {
      level: 12,
      unlocked: level >= 12,
      feats: [
        { name: "Quick Swim", type: "Skill", source: "Player Core pg. 263", url: "https://2e.aonprd.com/Feats.aspx?ID=810" },
        { name: "Defensive Recovery", type: "Class", source: "Player Core pg. 122", url: "https://2e.aonprd.com/Feats.aspx?ID=265" }
      ],
      features: ["Skill Increase"]
    },
    {
      level: 13,
      unlocked: level >= 13,
      feats: [
        { name: "Goring Charge", type: "Ancestry", source: "Howl of the Wild", url: "https://2e.aonprd.com/Feats.aspx?ID=5372" }
      ],
      features: ["Rank 7 spells", "Armor Expert (medium/light) - Warpriest", "Weapon Specialization (+2 damage)", "Skill Increase"]
    },
    {
      level: 14,
      unlocked: level >= 14,
      feats: [
        { name: "Planar Survival", type: "Skill", source: "Player Core pg. 263", url: "https://2e.aonprd.com/Feats.aspx?ID=806" },
        { name: "Fast Channel", type: "Class", source: "Player Core pg. 122", url: "https://2e.aonprd.com/Feats.aspx?ID=267" }
      ],
      features: ["Skill Increase"]
    },
    {
      level: 15,
      unlocked: level >= 15,
      feats: [
        { name: "Fleet", type: "General", source: "Player Core pg. 260", url: "https://2e.aonprd.com/Feats.aspx?ID=784" }
      ],
      features: ["Rank 8 spells", "Ability Boosts (STR, DEX, CON, WIS)", "Divine Spellcasting Master", "Fortitude Save Master - success→crit success (Warpriest)", "Skill Increase"]
    },
    {
      level: 16,
      unlocked: level >= 16,
      feats: [
        { name: "Legendary Medic", type: "Skill", source: "Player Core pg. 261", url: "https://2e.aonprd.com/Feats.aspx?ID=798" },
        { name: "Eternal Blessing", type: "Class", source: "Player Core pg. 122", url: "https://2e.aonprd.com/Feats.aspx?ID=266" }
      ],
      features: ["Skill Increase"]
    },
    {
      level: 17,
      unlocked: level >= 17,
      feats: [
        { name: "Lingering Breath", type: "Ancestry", source: "Player Core 2 pg. 45", url: "https://2e.aonprd.com/Feats.aspx?ID=4370" }
      ],
      features: ["Rank 9 spells", "Skill Increase"]
    },
    {
      level: 18,
      unlocked: level >= 18,
      feats: [
        { name: "Cloud Jump", type: "Skill", source: "Player Core pg. 259", url: "https://2e.aonprd.com/Feats.aspx?ID=769" },
        { name: "Inviolable", type: "Class", source: "Player Core pg. 124", url: "https://2e.aonprd.com/Feats.aspx?ID=2947" }
      ],
      features: ["Skill Increase"]
    },
    {
      level: 19,
      unlocked: level >= 19,
      feats: [
        { name: "Incredible Initiative", type: "General", source: "Player Core pg. 260", url: "https://2e.aonprd.com/Feats.aspx?ID=791" }
      ],
      features: ["Miraculous Spell (single 10th-rank slot)", "Master with favored weapon/spell attack/spell DC (Warpriest)", "Greater Weapon Specialization (+4 damage)", "Skill Increase"]
    },
    {
      level: 20,
      unlocked: level >= 20,
      feats: [
        { name: "Legendary Survivalist", type: "Skill", source: "Player Core pg. 265", url: "https://2e.aonprd.com/Feats.aspx?ID=833" },
        { name: "Maker of Miracles", type: "Class", source: "Player Core pg. 124", url: "https://2e.aonprd.com/Feats.aspx?ID=281" }
      ],
      features: ["Ability Boosts (STR, DEX, CON, WIS)", "Skill Increase"]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
        <h2 className="text-xl font-bold mb-2 text-purple-300">Character Progression</h2>
        <p className="text-slate-300 mb-2">
          Track your level-up milestones and unlocked abilities. Current Level: <span className="text-purple-400 font-bold">{level}</span>
        </p>
        <p className="text-sm text-slate-400">
          Cleric (Warpriest Doctrine) with Monk Dedication archetype. Proficiencies and abilities scale automatically based on official PF2e rules.
        </p>
      </div>

      <div className="grid gap-3">
        {milestones.map((milestone, index) => (
          <div 
            key={milestone.level}
            className={`rounded-lg p-4 border transition-all duration-500 transform hover:scale-[1.01] ${
              milestone.unlocked 
                ? 'bg-purple-900/50 border-purple-600 shadow-lg shadow-purple-500/20' 
                : 'bg-slate-800/30 border-slate-700 opacity-60'
            }`}
            style={{
              animationDelay: `${index * 50}ms`
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                milestone.unlocked ? 'bg-purple-600 shadow-lg shadow-purple-500/50' : 'bg-slate-700'
              }`}>
                {milestone.level}
              </div>
              <h3 className="text-lg font-bold">Level {milestone.level}</h3>
              {milestone.unlocked && (
                <Check className="w-5 h-5 text-green-400 ml-auto animate-pulse" />
              )}
              {!milestone.unlocked && milestone.level === level + 1 && (
                <span className="ml-auto text-sm bg-purple-700 text-purple-200 px-2 py-1 rounded">
                  Next Level
                </span>
              )}
            </div>
            <div className="space-y-3 ml-13">
              {milestone.feats && milestone.feats.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-purple-400">Feats Gained:</div>
                  {milestone.feats.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <Tooltip content={
                        <>
                          <div className="font-semibold text-purple-300 mb-2">{feat.name}</div>
                          <div className="space-y-2 text-slate-300">
                            <div className="bg-slate-700/50 p-2 rounded">
                              <div className="text-sm">
                                <strong>Type:</strong> {feat.type} Feat
                              </div>
                              <div className="text-sm mt-1">
                                <strong>Source:</strong> {feat.source}
                              </div>
                            </div>
                            <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
                              <a
                                href={feat.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                              >
                                View on Archives of Nethys
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </>
                      }>
                        <span className={`cursor-help ${milestone.unlocked ? 'text-slate-300' : 'text-slate-500'}`}>
                          <strong>{feat.name}</strong> <span className="text-xs text-slate-400">({feat.type})</span>
                        </span>
                      </Tooltip>
                    </div>
                  ))}
                </div>
              )}
              {milestone.features && milestone.features.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-purple-400">Class Features:</div>
                  {milestone.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                      <span className={milestone.unlocked ? 'text-slate-300' : 'text-slate-500'}>{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotesTab({ notes, noteInput, setNoteInput, addNote, deleteNote, editingNote, startEditNote, saveEditNote, cancelEdit }) {
  return (
    <div className="space-y-6">
      <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
        <h2 className="text-xl font-bold mb-3 text-purple-300">Campaign Notes</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (editingNote ? saveEditNote() : addNote())}
            placeholder="Add a note about your adventure..."
            className="flex-1 bg-slate-800 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
          />
          {editingNote ? (
            <>
              <button
                onClick={saveEditNote}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transform hover:scale-105 transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={cancelEdit}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 transform hover:scale-105 transition-all active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={addNote}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2 transform hover:scale-105 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No notes yet. Start documenting your adventure!</p>
          </div>
        ) : (
          notes.map((note, index) => (
            <div 
              key={note.id} 
              className="bg-slate-800/70 rounded-lg p-4 border border-slate-600 transform hover:scale-[1.01] transition-all hover:shadow-lg hover:shadow-purple-500/10"
              style={{
                animation: 'slideIn 0.3s ease-out',
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both'
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="text-sm text-purple-300 font-semibold">{note.session}</div>
                  <div className="text-xs text-slate-400">{note.date}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditNote(note)}
                    className="text-blue-400 hover:text-blue-300 transform hover:scale-110 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-red-400 hover:text-red-300 transform hover:scale-110 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-slate-300">{note.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function GearTab({ gear, gearInput, setGearInput, gearQuantity, setGearQuantity, addGear, deleteGear, toggleEquipped, level }) {
  const equipped = gear.filter(item => item.equipped);
  const inventory = gear.filter(item => !item.equipped);

  // Calculate total bulk
  const totalBulk = calculateTotalBulk(gear);
  const strScore = getAbilityScore(BASE_ABILITY_SCORES.STR, 'STR', level);
  const strModifier = getModifier(strScore);
  const bulkLimit = 5 + strModifier; // Base 5 + STR modifier
  const encumbered = totalBulk > bulkLimit;
  const overloaded = totalBulk > bulkLimit + 5;

  // Get equipment modifiers from equipped gear
  const equipmentMods = getEquipmentModifiers(gear);

  // Equipment upgrade suggestions based on level
  const getEquipmentSuggestions = () => {
    const suggestions = [];

    // Armor upgrades
    const hasHideArmor = gear.some(item => item.name === 'Hide Armor');
    const hasBreastplate = gear.some(item => item.name === 'Breastplate');

    if (level >= 3 && hasHideArmor && !hasBreastplate) {
      suggestions.push({
        type: 'upgrade',
        item: 'Breastplate',
        reason: 'Higher AC bonus (+4 vs +3) - Consider upgrading armor',
        level: 3
      });
    }

    // Weapon upgrades (runes)
    if (level >= 2) {
      suggestions.push({
        type: 'enhancement',
        item: '+1 Potency Rune',
        reason: 'Add +1 to attack and damage rolls',
        level: 2
      });
    }

    if (level >= 4) {
      suggestions.push({
        type: 'enhancement',
        item: 'Striking Rune',
        reason: 'Increase weapon damage dice (doubles base damage)',
        level: 4
      });
    }

    if (level >= 10) {
      suggestions.push({
        type: 'enhancement',
        item: '+2 Potency Rune',
        reason: 'Upgrade to +2 for better attack bonus',
        level: 10
      });
    }

    return suggestions.filter(s => s.level <= level);
  };

  const suggestions = getEquipmentSuggestions();

  return (
    <div className="space-y-6">
      {/* Bulk Tracking */}
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-300">Carrying Capacity</h3>
          <div className="text-sm text-slate-400">STR {strScore} ({strModifier >= 0 ? '+' : ''}{strModifier})</div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Current Bulk:</span>
            <span className={`font-bold ${overloaded ? 'text-red-400' : encumbered ? 'text-yellow-400' : 'text-green-400'}`}>
              {totalBulk.toFixed(1)} / {bulkLimit}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                overloaded ? 'bg-red-500' : encumbered ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(100, (totalBulk / bulkLimit) * 100)}%` }}
            />
          </div>
          {encumbered && (
            <div className="text-xs text-yellow-400 flex items-center gap-1">
              <Info className="w-3 h-3" />
              {overloaded ? 'Overloaded: -10ft speed, max Dex +0' : 'Encumbered: -5ft speed, max Dex +2'}
            </div>
          )}
        </div>
      </div>

      {/* Equipment Stat Bonuses */}
      {(equipmentMods.ac.sources.length > 0 || equipmentMods.attackBonus.sources.length > 0 || equipmentMods.savingThrows.sources.length > 0) && (
        <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
          <h3 className="text-lg font-bold mb-3 text-purple-300 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Equipment Bonuses
          </h3>
          <div className="space-y-3">
            {equipmentMods.ac.sources.length > 0 && (
              <div className="bg-slate-800/50 rounded p-3">
                <div className="font-semibold text-slate-200 mb-1">
                  Armor Class: <span className="text-green-400">+{equipmentMods.ac.value}</span>
                </div>
                <div className="space-y-1 text-sm text-slate-300">
                  {equipmentMods.ac.sources.map((source, idx) => (
                    <div key={idx} className="flex items-center gap-2 pl-2">
                      <div className="w-1 h-1 bg-purple-400 rounded-full" />
                      <span>{source.name}: +{source.bonus} ({source.type})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {equipmentMods.attackBonus.sources.length > 0 && (
              <div className="bg-slate-800/50 rounded p-3">
                <div className="font-semibold text-slate-200 mb-1">
                  Attack Rolls: <span className="text-green-400">+{equipmentMods.attackBonus.value}</span>
                </div>
                <div className="space-y-1 text-sm text-slate-300">
                  {equipmentMods.attackBonus.sources.map((source, idx) => (
                    <div key={idx} className="flex items-center gap-2 pl-2">
                      <div className="w-1 h-1 bg-purple-400 rounded-full" />
                      <span>{source.name}: +{source.bonus} ({source.type})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {equipmentMods.savingThrows.sources.length > 0 && (
              <div className="bg-slate-800/50 rounded p-3">
                <div className="font-semibold text-slate-200 mb-1">
                  Saving Throws: <span className="text-green-400">+{equipmentMods.savingThrows.value}</span>
                </div>
                <div className="space-y-1 text-sm text-slate-300">
                  {equipmentMods.savingThrows.sources.map((source, idx) => (
                    <div key={idx} className="flex items-center gap-2 pl-2">
                      <div className="w-1 h-1 bg-purple-400 rounded-full" />
                      <span>{source.name}: +{source.bonus} (all saves)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {equipmentMods.speed.sources.length > 0 && (
              <div className="bg-slate-800/50 rounded p-3">
                <div className="font-semibold text-slate-200 mb-1">
                  Speed: <span className="text-yellow-400">{equipmentMods.speed.value}ft</span>
                </div>
                <div className="space-y-1 text-sm text-slate-300">
                  {equipmentMods.speed.sources.map((source, idx) => (
                    <div key={idx} className="flex items-center gap-2 pl-2">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full" />
                      <span>{source.name}: {source.penalty}ft (armor penalty)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
        <h2 className="text-xl font-bold mb-3 text-purple-300">Add Gear</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={gearInput}
            onChange={(e) => setGearInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addGear()}
            placeholder="Item name..."
            className="flex-1 bg-slate-800 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
          />
          <input
            type="number"
            min="1"
            value={gearQuantity}
            onChange={(e) => setGearQuantity(parseInt(e.target.value) || 1)}
            className="w-20 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-all"
          />
          <button
            onClick={addGear}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2 transform hover:scale-105 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-700">
          <h3 className="text-lg font-bold mb-3 text-yellow-300 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Equipment Suggestions (Level {level})
          </h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded p-3 border border-yellow-600/30">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2" />
                  <div>
                    <div className="font-semibold text-yellow-300">{suggestion.item}</div>
                    <div className="text-sm text-slate-300">{suggestion.reason}</div>
                    <div className="text-xs text-slate-400 mt-1">Available at level {suggestion.level}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <StatBlock title="Equipped" icon={Shield}>
        {equipped.length === 0 ? (
          <p className="text-slate-400 text-center py-4">No equipped items</p>
        ) : (
          <div className="space-y-2">
            {equipped.map((item, index) => (
              <GearItem key={item.id} item={item} onToggle={toggleEquipped} onDelete={deleteGear} index={index} />
            ))}
          </div>
        )}
      </StatBlock>

      <StatBlock title="Inventory" icon={Package}>
        {inventory.length === 0 ? (
          <p className="text-slate-400 text-center py-4">No items in inventory</p>
        ) : (
          <div className="space-y-2">
            {inventory.map((item, index) => (
              <GearItem key={item.id} item={item} onToggle={toggleEquipped} onDelete={deleteGear} index={index} />
            ))}
          </div>
        )}
      </StatBlock>
    </div>
  );
}

function GearItem({ item, onToggle, onDelete, index }) {
  // Get equipment details from database
  const getEquipmentDetails = () => {
    const dbKey = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // Search in all equipment categories
    if (EQUIPMENT_DATABASE.armor[dbKey]) {
      return EQUIPMENT_DATABASE.armor[dbKey];
    } else if (EQUIPMENT_DATABASE.shields[dbKey]) {
      return EQUIPMENT_DATABASE.shields[dbKey];
    } else if (EQUIPMENT_DATABASE.weapons[dbKey]) {
      return EQUIPMENT_DATABASE.weapons[dbKey];
    } else if (EQUIPMENT_DATABASE.runes[dbKey]) {
      return EQUIPMENT_DATABASE.runes[dbKey];
    } else if (EQUIPMENT_DATABASE.adventuringGear[dbKey]) {
      return EQUIPMENT_DATABASE.adventuringGear[dbKey];
    }

    return null;
  };

  const equipmentDetails = getEquipmentDetails();

  const itemContent = (
    <div
      className="bg-slate-800/70 rounded-lg p-3 border border-slate-600 flex items-center justify-between transform hover:scale-[1.01] transition-all hover:shadow-lg hover:shadow-purple-500/10"
      style={{
        animation: 'slideIn 0.3s ease-out',
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'both'
      }}
    >
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={() => onToggle(item.id)}
          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all transform hover:scale-110 ${
            item.equipped
              ? 'bg-purple-600 border-purple-600 shadow-lg shadow-purple-500/50'
              : 'border-slate-500'
          }`}
        >
          {item.equipped && <Check className="w-4 h-4" />}
        </button>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-slate-200">{item.name}</span>
          {equipmentDetails && <Info className="w-3 h-3 text-purple-400" />}
          {item.quantity && (
            <span className="ml-2 text-sm text-slate-400">×{item.quantity}</span>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(item.id)}
        className="text-red-400 hover:text-red-300 transform hover:scale-110 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  if (!equipmentDetails) {
    return itemContent;
  }

  return (
    <Tooltip content={
      <>
        <div className="font-semibold text-purple-300 mb-2">{equipmentDetails.name}</div>
        <div className="space-y-2 text-slate-300">
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-xs text-slate-400 mb-1 capitalize">{equipmentDetails.category}</div>
            <div className="text-sm">{equipmentDetails.description}</div>
            {equipmentDetails.bulk && (
              <div className="text-xs text-slate-400 mt-1">Bulk: {equipmentDetails.bulk}</div>
            )}
          </div>

          {/* Armor Details */}
          {equipmentDetails.category === 'armor' && (
            <div className="bg-slate-700/50 p-2 rounded">
              <div className="font-semibold mb-1">Armor Stats:</div>
              <div className="pl-2 text-sm space-y-1">
                <div>• AC Bonus: <span className="text-green-400">+{equipmentDetails.acBonus}</span></div>
                <div>• Dex Cap: <span className="text-green-400">+{equipmentDetails.dexCap}</span></div>
                <div>• Check Penalty: <span className="text-red-400">{equipmentDetails.checkPenalty}</span></div>
                <div>• Speed Penalty: <span className="text-red-400">{equipmentDetails.speedPenalty} ft</span></div>
                <div>• Strength: <span className="text-green-400">{equipmentDetails.strength}</span></div>
                <div>• Group: <span className="text-slate-400">{equipmentDetails.group}</span></div>
              </div>
            </div>
          )}

          {/* Shield Details */}
          {equipmentDetails.category === 'shield' && (
            <div className="bg-slate-700/50 p-2 rounded">
              <div className="font-semibold mb-1">Shield Stats:</div>
              <div className="pl-2 text-sm space-y-1">
                <div>• AC Bonus: <span className="text-green-400">+{equipmentDetails.acBonus}</span></div>
                <div>• Hardness: <span className="text-blue-400">{equipmentDetails.hardness}</span></div>
                <div>• HP: <span className="text-green-400">{equipmentDetails.hp}</span></div>
                <div>• BT: <span className="text-yellow-400">{equipmentDetails.bt}</span></div>
              </div>
            </div>
          )}

          {/* Weapon Details */}
          {equipmentDetails.category === 'weapon' && (
            <>
              <div className="bg-slate-700/50 p-2 rounded">
                <div className="font-semibold mb-1">Weapon Stats:</div>
                <div className="pl-2 text-sm space-y-1">
                  <div>• Damage: <span className="text-red-400">{equipmentDetails.damage} {equipmentDetails.damageType}</span></div>
                  <div>• Hands: <span className="text-green-400">{equipmentDetails.hands}</span></div>
                  <div>• Type: <span className="text-slate-400">{equipmentDetails.weaponType}</span></div>
                  <div>• Group: <span className="text-slate-400">{equipmentDetails.group}</span></div>
                  {equipmentDetails.range && (
                    <div>• Range: <span className="text-blue-400">{equipmentDetails.range} ft</span></div>
                  )}
                </div>
              </div>
              {equipmentDetails.traits && equipmentDetails.traits.length > 0 && (
                <div className="bg-slate-700/50 p-2 rounded">
                  <div className="font-semibold mb-1">Traits:</div>
                  <div className="pl-2 text-xs space-y-1">
                    {equipmentDetails.traits.map((trait, idx) => (
                      <div key={idx} className="text-purple-300">• {trait}</div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Rune Details */}
          {equipmentDetails.category === 'rune' && equipmentDetails.statModifiers && (
            <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
              <div className="font-semibold mb-1 text-purple-300">Rune Effects:</div>
              <div className="pl-2 text-sm space-y-1">
                {equipmentDetails.statModifiers.acBonus && (
                  <div>• AC Bonus: <span className="text-green-400">+{equipmentDetails.statModifiers.acBonus}</span></div>
                )}
                {equipmentDetails.statModifiers.attackBonus && (
                  <div>• Attack Bonus: <span className="text-green-400">+{equipmentDetails.statModifiers.attackBonus}</span></div>
                )}
                {equipmentDetails.statModifiers.savingThrowBonus && (
                  <div>• Save Bonus: <span className="text-green-400">+{equipmentDetails.statModifiers.savingThrowBonus}</span></div>
                )}
                {equipmentDetails.statModifiers.damageDice && (
                  <div>• Damage Dice: <span className="text-red-400">{equipmentDetails.statModifiers.damageDice}</span></div>
                )}
              </div>
              <div className="text-xs text-slate-400 mt-2">
                Applies to: {equipmentDetails.appliesTo}
              </div>
            </div>
          )}

          {/* Price and Level */}
          {(equipmentDetails.price || equipmentDetails.level !== undefined) && (
            <div className="bg-slate-700/50 p-2 rounded">
              <div className="text-sm space-y-1">
                {equipmentDetails.price && (
                  <div>
                    Price: <span className="text-yellow-400">
                      {equipmentDetails.price.gp ? `${equipmentDetails.price.gp} gp` : ''}
                      {equipmentDetails.price.sp ? `${equipmentDetails.price.sp} sp` : ''}
                    </span>
                  </div>
                )}
                {equipmentDetails.level !== undefined && (
                  <div>Level: <span className="text-purple-400">{equipmentDetails.level}</span></div>
                )}
              </div>
            </div>
          )}
        </div>
      </>
    }>
      <div className="cursor-help">
        {itemContent}
      </div>
    </Tooltip>
  );
}

// Helper Components
function StatBlock({ title, icon: Icon, children }) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700 hover:border-slate-600 transition-all">
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="w-5 h-5 text-purple-400" />}
        <h3 className="text-xl font-bold text-purple-300">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="font-semibold text-slate-200">{value}</span>
    </div>
  );
}

function AbilityScore({ ability, score, modifier, primary, level }) {
  const abilityNames = {
    STR: 'Strength',
    DEX: 'Dexterity',
    CON: 'Constitution',
    INT: 'Intelligence',
    WIS: 'Wisdom',
    CHA: 'Charisma'
  };

  const abilityKeys = {
    STR: 'strength',
    DEX: 'dexterity',
    CON: 'constitution',
    INT: 'intelligence',
    WIS: 'wisdom',
    CHA: 'charisma'
  };

  // Base scores at Level 1 from characterConfig.js - BASE_ABILITY_SCORES
  // Includes all Level 1 boosts and ancestry/background/class bonuses
  const baseScore = BASE_ABILITY_SCORES[ability] || 10;

  // Calculate step-by-step progression showing 18+ cap application
  const calculateProgression = () => {
    const progression = [];
    let currentScore = baseScore;

    // Which abilities get boosts at each level
    const boostLevels = ['STR', 'DEX', 'CON', 'WIS'].includes(ability)
      ? [5, 10, 15, 20]
      : (ability === 'INT' || ability === 'CHA' ? [20] : []);

    progression.push({
      level: 1,
      score: baseScore,
      description: 'Base score (includes Level 1 boosts)',
      isBase: true
    });

    for (const boostLevel of boostLevels) {
      if (boostLevel <= level) {
        const oldScore = currentScore;
        const boost = currentScore >= 18 ? 1 : 2;
        currentScore += boost;

        progression.push({
          level: boostLevel,
          score: currentScore,
          boost: boost,
          oldScore: oldScore,
          cappedBoost: boost === 1,
          description: boost === 1
            ? `+1 boost (18+ cap applied)`
            : `+2 boost`
        });
      }
    }

    return progression;
  };

  const progression = calculateProgression();
  const isPrimaryAbility = ['STR', 'DEX', 'CON', 'WIS'].includes(ability);

  return (
    <Tooltip content={
      <>
        <div className="font-semibold text-purple-300 mb-2">
          {abilityNames[ability]} ({ability})
          {primary && <span className="ml-2 text-xs bg-purple-700 px-2 py-0.5 rounded">Primary</span>}
        </div>

        <div className="space-y-2 text-slate-300">
          {/* 18+ Cap Rule Explanation */}
          <div className="bg-blue-900/30 border border-blue-600/50 p-2 rounded">
            <div className="font-semibold text-blue-300 mb-1 flex items-center gap-1">
              <Info className="w-3 h-3" />
              18+ Cap Rule
            </div>
            <div className="text-xs text-slate-300">
              Ability boosts give <span className="text-green-400">+2</span> to the score, or <span className="text-yellow-400">+1</span> if the score is already 18 or higher.
              <a
                href="https://2e.aonprd.com/Rules.aspx?ID=74"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Source: Player Core pg. 27
            </div>
          </div>

          {/* Level-by-Level Progression */}
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="font-semibold mb-1">Score Progression (Level {level}):</div>
            <div className="space-y-1 text-xs">
              {progression.map((step, idx) => (
                <div
                  key={idx}
                  className={`pl-2 py-0.5 ${step.cappedBoost ? 'text-yellow-300' : 'text-slate-300'} ${
                    step.level === level ? 'font-bold bg-purple-800/30 -ml-1 pl-3 rounded' : ''
                  }`}
                >
                  {step.isBase ? (
                    <>
                      <span className="text-slate-400">Level {step.level}:</span> <span className="text-green-400">{step.score}</span> ({step.description})
                    </>
                  ) : (
                    <>
                      <span className="text-slate-400">Level {step.level}:</span> {step.oldScore} → <span className="text-green-400">{step.score}</span>
                      {step.cappedBoost && <span className="ml-1 text-yellow-400">⚠ ({step.description})</span>}
                      {!step.cappedBoost && <span className="ml-1 text-slate-400">({step.description})</span>}
                    </>
                  )}
                </div>
              ))}

              {/* Show future boosts if not at max level */}
              {level < 20 && isPrimaryAbility && (
                <>
                  {[5, 10, 15, 20].filter(l => l > level).map(futureLevel => {
                    const futureScore = score + (score >= 18 ? 1 : 2);
                    return (
                      <div key={futureLevel} className="pl-2 py-0.5 text-slate-500 italic">
                        <span className="text-slate-500">Level {futureLevel}:</span> {score} → {futureScore} (future boost)
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Boost Sources */}
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="font-semibold mb-1">Boost Sources:</div>
            <div className="pl-2 text-xs space-y-0.5">
              <div>• <span className="text-purple-300">Level 1:</span> Ancestry, Background, Class, and Free boosts</div>
              {isPrimaryAbility && (
                <>
                  <div>• <span className="text-purple-300">Levels 5, 10, 15, 20:</span> Four free ability boosts each</div>
                  <div className="text-slate-400 text-xs mt-1 italic">
                    ({abilityNames[ability]} receives boosts at {progression.filter(p => !p.isBase).map(p => p.level).join(', ')})
                  </div>
                </>
              )}
              {!isPrimaryAbility && ability !== 'INT' && ability !== 'CHA' && (
                <div className="text-slate-400 text-xs mt-1 italic">
                  (No additional boosts for this ability)
                </div>
              )}
              {(ability === 'INT' || ability === 'CHA') && (
                <div className="text-slate-400 text-xs mt-1 italic">
                  ({abilityNames[ability]} receives boost at level 20 only)
                </div>
              )}
            </div>
          </div>

          {/* Modifier Calculation */}
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="font-semibold mb-1">Modifier Calculation:</div>
            <div className="pl-2 text-sm">
              ({score} - 10) ÷ 2 = <span className="text-green-400">{modifier >= 0 ? '+' : ''}{modifier}</span>
            </div>
          </div>

          {/* Final Summary */}
          <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
            <div className="font-bold text-purple-300">
              Final: <span className="text-green-400">{score} ({modifier >= 0 ? '+' : ''}{modifier})</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {pathfinderRules.abilityScores[abilityKeys[ability]].description}
            </div>
          </div>
        </div>
      </>
    }>
      <div className={`rounded-lg p-3 text-center transition-all transform hover:scale-105 cursor-help ${
        primary ? 'bg-purple-900/50 border border-purple-600 shadow-lg shadow-purple-500/20' : 'bg-slate-800/50 hover:bg-slate-800/70'
      }`}>
        <div className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
          {ability}
          <Info className="w-3 h-3 text-purple-400" />
        </div>
        <div className="text-2xl font-bold">{score}</div>
        <div className="text-sm text-purple-300">
          {modifier >= 0 ? '+' : ''}{modifier}
        </div>
      </div>
    </Tooltip>
  );
}

function StatCard({ icon: Icon, label, value, subtitle, color }) {
  const colors = {
    blue: 'from-blue-900/50 to-blue-800/50 border-blue-700',
    purple: 'from-purple-900/50 to-purple-800/50 border-purple-700',
    green: 'from-green-900/50 to-green-800/50 border-green-700'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-lg p-4 border transform hover:scale-105 transition-all`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 text-${color}-400`} />
        <div className={`text-sm text-${color}-200`}>{label}</div>
      </div>
      <div className="text-3xl font-bold">{value}</div>
      {subtitle && <div className="text-xs text-slate-300 mt-1">{subtitle}</div>}
    </div>
  );
}

function AttackCard({ name, bonus, damage, damageType, traits, proficiency, abilityMod, weaponProf, level, weaponUrl, description }) {
  return (
    <Tooltip content={
      <>
        <div className="font-semibold text-purple-300 mb-2">{name}</div>
        <div className="space-y-2 text-slate-300">
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="font-semibold mb-1">Attack Bonus Calculation:</div>
            <div className="pl-2 text-sm">
              • Ability modifier: <span className="text-green-400">+{abilityMod}</span>
            </div>
            <div className="pl-2 text-sm">
              • Proficiency ({proficiency}): <span className="text-green-400">+{weaponProf}</span>
              <a
                href={pathfinderRules.classes.cleric.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="pl-2 text-sm font-semibold border-t border-slate-600 mt-1 pt-1">
              = <span className="text-green-400">{bonus}</span> to hit
            </div>
          </div>
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="font-semibold mb-1">Damage:</div>
            <div className="pl-2 text-sm">
              <span className="text-red-400">{damage}</span> {damageType}
            </div>
            {description && (
              <div className="pl-2 text-xs text-slate-400 mt-1">{description}</div>
            )}
          </div>
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="font-semibold mb-1">Traits:</div>
            <div className="pl-2 text-xs space-y-1">
              {traits.map((trait, idx) => (
                <div key={idx}>
                  • <span className="text-purple-300">{trait}</span>
                  {weaponUrl && (
                    <a
                      href={weaponUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
            <div className="font-bold text-purple-300">
              {name}: <span className="text-green-400">{bonus}</span> to hit, <span className="text-red-400">{damage}</span> damage
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Level {level} Warpriest attack
            </div>
          </div>
        </div>
      </>
    }>
      <div className="bg-slate-800/70 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-all transform hover:scale-[1.01] cursor-help">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="text-lg font-bold text-purple-300 flex items-center gap-1">
              {name}
              <Info className="w-4 h-4 text-purple-400" />
            </h4>
            {proficiency && <div className="text-xs text-slate-400">{proficiency}</div>}
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-green-400">{bonus}</div>
            <div className="text-sm text-slate-400">to hit</div>
          </div>
        </div>
        <div className="mb-2">
          <span className="text-2xl font-bold text-red-400">{damage}</span>
          <span className="text-slate-400 ml-2">{damageType}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {traits.map((trait, idx) => (
            <span key={idx} className="bg-purple-900/50 text-purple-200 text-xs px-2 py-1 rounded">
              {trait}
            </span>
          ))}
        </div>
      </div>
    </Tooltip>
  );
}

// Story Log Tab - AI-generated narratives of character actions
function StoryLogTab({ storyLogs, level, onClearLog }) {
  return (
    <div className="space-y-6">
      <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-purple-300 flex items-center gap-2">
            <Feather className="w-5 h-5" />
            Story Log
          </h2>
          {storyLogs.length > 0 && (
            <button
              onClick={onClearLog}
              className="px-3 py-1 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded text-sm border border-red-700 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear Log
            </button>
          )}
        </div>
        <p className="text-sm text-slate-400 mb-4">
          AI-generated narrative descriptions of your character's journey through the campaign.
        </p>
      </div>

      {storyLogs.length === 0 ? (
        <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700 text-center">
          <Feather className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No story entries yet.</p>
          <p className="text-sm text-slate-500 mt-2">
            Story logs will be automatically generated as you make changes to your character (HP, level, notes, etc.)
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {storyLogs.map((log, index) => (
            <div
              key={log.id}
              className={`bg-slate-800/50 rounded-lg p-5 border transform transition-all hover:shadow-lg hover:shadow-purple-500/10 ${
                log.isGenerating
                  ? 'border-purple-500/60 animate-pulse'
                  : 'border-purple-600/30 hover:border-purple-500/50'
              }`}
              style={{
                animation: 'slideIn 0.5s ease-out',
                animationDelay: `${index * 0.05}s`,
                animationFillMode: 'both'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {log.isGenerating ? (
                    <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Feather className="w-4 h-4 text-purple-400" />
                  )}
                  <span className="text-xs text-slate-400">{log.timestamp}</span>
                  <span className="text-xs bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700 text-purple-300">
                    Level {log.level}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-sm font-semibold text-purple-300 mb-1">Action:</div>
                <div className="text-slate-300 text-sm bg-slate-700/30 rounded p-2">
                  {log.action}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-purple-300 mb-1 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  Narrative:
                </div>
                <div className={`leading-relaxed italic bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded p-3 border-l-4 ${
                  log.isGenerating
                    ? 'border-purple-400 text-purple-300'
                    : 'border-purple-500 text-slate-200'
                }`}>
                  {log.narrative}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Add keyframe animations and custom scrollbar styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Custom scrollbar for story log */
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(51, 65, 85, 0.3);
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(168, 85, 247, 0.5);
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(168, 85, 247, 0.7);
  }
`;
document.head.appendChild(style);