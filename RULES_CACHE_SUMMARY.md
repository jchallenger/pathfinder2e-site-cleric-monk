# Pathfinder 2e Rules Cache Summary

This document summarizes the cached Pathfinder 2e rules stored in [src/pathfinderRules.js](src/pathfinderRules.js).

## Sources

All rules are sourced from official Paizo publications and licensed under the Open Game License (OGL):

- **Archives of Nethys** (https://2e.aonprd.com) - Official Pathfinder 2e Reference Document
- **Player Core** - Paizo Inc. core rulebook for character creation
- **Ancestry Guide** - Ancestry options and details
- **Gods & Magic** - Deity and faith options

## Cached Content

### 1. Skills (17 total)
All skills include:
- Name, key ability, description
- Source attribution (Player Core pg. 225)
- Official URL to Archives of Nethys

Skills cached:
- Acrobatics, Arcana, Athletics, Crafting, Deception
- Diplomacy, Intimidation, Lore, Medicine, Nature
- Occultism, Performance, Religion, Society, Stealth
- Survival, Thievery

**Source URLs**: https://2e.aonprd.com/Skills.aspx?ID=[1-17]

---

### 2. Ancestries

#### Minotaur
- **Source**: Howl of the Wild
- **URL**: https://2e.aonprd.com/Ancestries.aspx?ID=75
- **Details**: HP (10), size (Large), speed (25 ft), ability boosts (STR, CON, Free), ability flaw (CHA), traits, languages
- **Special Abilities**:
  - Darkvision
  - Horns (1d8 piercing, unarmed)
  - Adamantine (level 9 - resistance to physical damage)
- **Heritages**: Dragonblood (versatile heritage from Player Core 2)

---

### 3. Classes

#### Cleric
- **Source**: Player Core pg. 112
- **URL**: https://2e.aonprd.com/Classes.aspx?ID=5
- **Details**: Key ability, HP, proficiencies, spellcasting
- **Doctrine**: Warpriest (full progression levels 1-19)
- **Divine Font**: Harm/Heal spell slots

#### Monk (Full Class)
- **Source**: Player Core
- **URL**: https://2e.aonprd.com/Classes.aspx?ID=8
- **Details**: Unarmed damage progression, proficiencies, class features
- **Key Features**: Flurry of Blows, Powerful Fist, Mystic Strikes

---

### 4. Archetypes

#### Monk Dedication
- **Source**: Player Core
- **URL**: https://2e.aonprd.com/Archetypes.aspx?ID=8
- **Dedication Feat**: https://2e.aonprd.com/Feats.aspx?ID=715
- **Archetype Feats** (6 total):
  - Basic Kata (Level 4)
  - Monk Resiliency (Level 4)
  - Advanced Kata (Level 6)
  - Monk Moves (Level 8)
  - Monk's Flurry (Level 10)
  - Perfection's Path (Level 12)

All feats include official URLs.

---

### 5. Feats (20+ cached)

#### General Feats
- Toughness (https://2e.aonprd.com/Feats.aspx?ID=855)
- Fleet (https://2e.aonprd.com/Feats.aspx?ID=784)

#### Cleric Feats
- Shield Block (https://2e.aonprd.com/Feats.aspx?ID=839)
- Deadly Simplicity (https://2e.aonprd.com/Feats.aspx?ID=268)
- Harming Hands (https://2e.aonprd.com/Feats.aspx?ID=270)
- Channel Smite (https://2e.aonprd.com/Feats.aspx?ID=265)
- Command Undead (https://2e.aonprd.com/Feats.aspx?ID=267)

#### Monk Feats
- Ki Strike (https://2e.aonprd.com/Feats.aspx?ID=434)
- Ki Rush (https://2e.aonprd.com/Feats.aspx?ID=433)
- Stunning Fist (https://2e.aonprd.com/Feats.aspx?ID=448)
- Crane Stance (https://2e.aonprd.com/Feats.aspx?ID=427)

#### Skill Feats
- Assurance (https://2e.aonprd.com/Feats.aspx?ID=756)
- Battle Medicine (https://2e.aonprd.com/Feats.aspx?ID=760)
- Intimidating Glare (https://2e.aonprd.com/Feats.aspx?ID=796)
- Cat Fall (https://2e.aonprd.com/Feats.aspx?ID=765)

All feats include:
- Name, level, type, prerequisites
- Full mechanical benefit description
- Source attribution and official URL

---

### 6. Deities

#### Achaekek (He Who Walks in Blood)
- **Source**: Gods & Magic
- **URL**: https://2e.aonprd.com/Deities.aspx?ID=29
- **Details**:
  - Alignment: Lawful Evil
  - Divine Attribute: Strength or Dexterity
  - Divine Font: Harm
  - Divine Skill: Stealth
  - Favored Weapon: Sawtooth saber
  - Domains: Death, Might, Trickery, Zeal
  - Cleric Spells: Sure Strike (1st), Invisibility (2nd), Vision of Death (4th)
  - Divine Intercession: Boons and curses detailed

---

### 7. Equipment

#### Weapons

**Sawtooth Saber**
- **Source**: Player Core
- **URL**: https://2e.aonprd.com/Weapons.aspx?ID=65
- **Details**:
  - Category: Advanced melee weapon
  - Price: 5 gp
  - Damage: 1d6 slashing
  - Bulk: L
  - Traits: Uncommon, Agile, Finesse, Twin
  - Trait mechanics fully detailed

#### Armor

**Breastplate**
- **Source**: Player Core
- **URL**: https://2e.aonprd.com/Armor.aspx?ID=10
- **Details**:
  - Category: Medium armor
  - Price: 8 gp
  - AC Bonus: +4
  - Dex Cap: +1
  - Check Penalty: -2
  - Speed Penalty: -5 ft
  - Strength Requirement: 3
  - Bulk: 2

---

### 8. Spells

#### Divine Spells Cached
- **Cantrips**: Divine Light, Shield
- **Level 1**: Heal, Harm, Bless, Command, Sure Strike
- **Level 2**: Invisibility
- **Level 4**: Vision of Death

All spells include:
- Name, level, traditions, actions
- Full description and mechanical effects
- Heightening information where applicable
- Source attribution

---

### 9. Game Mechanics

#### Proficiency Levels
- Untrained, Trained, Expert, Master, Legendary
- Bonus calculations and descriptions

#### Ability Scores
- All 6 ability scores with abbreviations and descriptions

#### Saving Throws
- Fortitude, Reflex, Will
- Key abilities and descriptions

#### Actions
- Stride, Strike, Cast a Spell, Raise a Shield, Leap
- Action costs and descriptions

#### Damage Types
- All 13 damage types listed

#### Common Traits
- Definitions for Humanoid, Rare, Uncommon, Dedication

---

## Usage in Application

The rules cache is exported as a JavaScript module and can be imported into the application:

```javascript
import pathfinderRules from './pathfinderRules.js';

// Access skills
const athletics = pathfinderRules.skills.athletics;
console.log(athletics.url); // https://2e.aonprd.com/Skills.aspx?ID=3

// Access deity information
const achaekek = pathfinderRules.deities.achaekek;
console.log(achaekek.favoredWeapon); // "Sawtooth saber"

// Access equipment
const saber = pathfinderRules.equipment.weapons.sawtoothSaber;
console.log(saber.damage); // "1d6 slashing"

// Access feats
const monkDedication = pathfinderRules.archetypes.monk.dedication;
console.log(monkDedication.url); // Official URL
```

---

## Verification

Each stat, skill, feat, and equipment entry includes:
- ✅ **Name** - Official game name
- ✅ **Source** - Book/page reference
- ✅ **URL** - Direct link to Archives of Nethys
- ✅ **Mechanical Details** - Game statistics and rules
- ✅ **Description** - Explanation of effects

All URLs link to the official Archives of Nethys Pathfinder 2e Reference Document, ensuring accuracy and traceability to official sources.

---

## License Information

All game rules are sourced from official Paizo publications and are available under the Open Game License (OGL) via Archives of Nethys. This cache is for reference and educational purposes for the Talon Tracker character sheet application.

**Archives of Nethys**: https://2e.aonprd.com
**Paizo Publishing**: https://paizo.com
