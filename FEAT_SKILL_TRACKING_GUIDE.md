# Feat & Skill Tracking System
## Talon Tracker - Pathfinder 2e Character Advancement

**Created**: 2025-11-09
**Purpose**: Track feat selections and skill proficiencies with full PF2e rules compliance and source citations

---

## Overview

The Talon Tracker now includes a comprehensive **Feats & Skills** tracking system that:

✅ **Remembers your choices** - All feat and skill selections are saved to localStorage
✅ **Rules-compliant** - Follows official PF2e feat progression and skill increase schedules
✅ **Source citations** - Every feat and skill links to Archives of Nethys
✅ **Level traceability** - Shows when each feat/skill was gained
✅ **Auto-persists** - No manual saving required

---

## Features

### 1. Feat Tracking

**What's Tracked**:
- Ancestry feats (Minotaur, Dragonblood)
- Class feats (Cleric/Warpriest)
- Skill feats
- General feats
- Heritage feat (Dragonblood)

**Information Stored**:
```javascript
{
  levelGained: 1,
  type: 'class',
  category: 'cleric',
  featKey: 'deadlySimplicity',
  name: 'Deadly Simplicity',
  source: 'Player Core pg. 112',
  url: 'https://2e.aonprd.com/Classes.aspx?ID=5',
  granted: true // If automatically granted
}
```

### 2. Skill Proficiency Tracking

**What's Tracked**:
- Skill name
- Proficiency rank (Trained/Expert/Master/Legendary)
- Level gained
- Source (Background, Class, Skill Increase)

**Information Stored**:
```javascript
{
  athletics: {
    rank: 'trained',
    levelGained: 1,
    source: 'Background (Warrior)'
  }
}
```

---

## Feat Progression (Official Rules)

### By Level

| Level | Feat Types Available |
|-------|---------------------|
| 1 | Ancestry, Class, Heritage |
| 2 | Class, Skill |
| 3 | General |
| 4 | Class, Skill |
| 5 | Ancestry |
| 6 | Class, Skill |
| 7 | General |
| 8 | Class, Skill |
| 9 | Ancestry |
| 10 | Class, Skill |
| 11 | General |
| 12 | Class, Skill |
| 13 | Ancestry |
| 14 | Class, Skill |
| 15 | General |
| 16 | Class, Skill |
| 17 | Ancestry |
| 18 | Class, Skill |
| 19 | General |
| 20 | Class, Skill |

**Source**: Player Core pg. 33

### Feat Type Schedules

**Ancestry Feats**: Levels 1, 5, 9, 13, 17 (5 total at level 20)
**Class Feats**: Levels 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 (11 total at level 20)
**Skill Feats**: Every even level (2, 4, 6, 8, 10, 12, 14, 16, 18, 20) (10 total at level 20)
**General Feats**: Levels 3, 7, 11, 15, 19 (5 total at level 20)

**Total Feats at Level 20**: 31 feats (plus heritage)

---

## Skill Progression (Official Rules)

### Skill Increases

You gain skill increases at these levels:
- **Level 2**: 1 skill increase
- **Level 3+**: 1 skill increase every odd level (3, 5, 7, 9, 11, 13, 15, 17, 19)

**Total Skill Increases**: 10 (from levels 2-19)

**Source**: Player Core pg. 33

### Initial Skills (Level 1)

**Background (Warrior)**:
- Athletics (Trained)
- Warfare Lore (Trained)

**Class (Cleric)**:
- Religion (Trained) - automatically granted
- INT modifier additional skills (Trained)
  - At INT 10 (+0): 0 additional skills
  - Can train in: Intimidation, Medicine, Survival (chosen)

**Total at Level 1**: 5 trained skills

### Proficiency Ranks

| Rank | Minimum Level | Bonus | Requirements |
|------|---------------|-------|--------------|
| **Trained** | 1 | +Level | Any untrained skill |
| **Expert** | 7 | +Level+2 | Must be Trained first |
| **Master** | 15 | +Level+4 | Must be Expert first |
| **Legendary** | 20 | +Level+6 | Must be Master first (special cases only) |

**Source**: Player Core pg. 225

### Skill Increase Options

Each skill increase lets you:
1. **Become Trained** in a new skill
2. **Upgrade Trained → Expert** (if level 7+)
3. **Upgrade Expert → Master** (if level 15+)
4. **Upgrade Master → Legendary** (if level 20, rare)

---

## Feat Database (Available in pathfinderRules.js)

### General Feats

**Shield Block** (Level 1)
- **Type**: General
- **Prerequisites**: None
- **Benefit**: Reduce damage by shield's Hardness when shield is raised
- **Source**: [Player Core pg. 267](https://2e.aonprd.com/Feats.aspx?ID=839)

**Toughness** (Level 1)
- **Type**: General
- **Prerequisites**: None
- **Benefit**: Increase maximum HP by your level
- **Source**: [Player Core pg. 268](https://2e.aonprd.com/Feats.aspx?ID=855)

**Incredible Initiative** (Level 1)
- **Type**: General
- **Prerequisites**: None
- **Benefit**: +2 circumstance bonus to initiative rolls
- **Source**: [Player Core pg. 264](https://2e.aonprd.com/Feats.aspx?ID=794)

### Skill Feats

**Intimidating Glare** (Level 1)
- **Type**: Skill
- **Prerequisites**: Trained in Intimidation
- **Benefit**: Demoralize with a glare (no speaking required)
- **Source**: [Player Core pg. 261](https://2e.aonprd.com/Feats.aspx?ID=796)

**Battle Medicine** (Level 1)
- **Type**: Skill
- **Prerequisites**: Trained in Medicine
- **Benefit**: Heal allies in combat using Medicine skill
- **Source**: [Player Core pg. 258](https://2e.aonprd.com/Feats.aspx?ID=760)

**Assurance** (Level 1)
- **Type**: Skill
- **Prerequisites**: Trained in any skill
- **Benefit**: Take 10 + proficiency bonus instead of rolling
- **Special**: Can select multiple times for different skills
- **Source**: [Player Core pg. 258](https://2e.aonprd.com/Feats.aspx?ID=756)

### Cleric Feats

**Deadly Simplicity** (Level 1)
- **Type**: Cleric (Warpriest)
- **Prerequisites**: Warpriest Doctrine
- **Benefit**: Increase deity's favored weapon damage die by one step
- **Source**: [Player Core pg. 112](https://2e.aonprd.com/Classes.aspx?ID=5)
- **Note**: Automatically granted by Warpriest doctrine

**Communal Healing** (Level 2)
- **Type**: Cleric
- **Prerequisites**: Healing Font
- **Benefit**: Redirect excess heal HP to another creature within 30 feet
- **Source**: [Player Core pg. 121](https://2e.aonprd.com/Feats.aspx?ID=1925)

**Harmful Font** (Level 2)
- **Type**: Cleric
- **Prerequisites**: None
- **Benefit**: Gain additional spell slots for harm spells
- **Source**: [Player Core pg. 121](https://2e.aonprd.com/Feats.aspx?ID=1926)

**Channel Smite** (Level 4)
- **Type**: Cleric
- **Prerequisites**: Divine Font (Harm or Heal)
- **Benefit**: Expend harm/heal spell to add damage to melee Strike
- **Actions**: 2 actions
- **Source**: [Player Core pg. 121](https://2e.aonprd.com/Feats.aspx?ID=1927)

### Minotaur Feats

**Gouging Horn** (Level 1)
- **Type**: Minotaur
- **Prerequisites**: Minotaur
- **Benefit**: Horn unarmed attack gains deadly d8 trait
- **Source**: [Howl of the Wild](https://2e.aonprd.com/Feats.aspx?ID=4673)

**Pounding Rush** (Level 5)
- **Type**: Minotaur
- **Prerequisites**: Minotaur
- **Benefit**: Stride + horn Strike, extra 1d6 damage if moved 10+ feet, target must save or be stunned 1
- **Actions**: 2 actions
- **Source**: [Howl of the Wild](https://2e.aonprd.com/Feats.aspx?ID=4674)

**Unstoppable Bull** (Level 9)
- **Type**: Minotaur
- **Prerequisites**: Minotaur
- **Benefit**: Shove targets 10 feet (success) or 20 feet (critical success)
- **Source**: [Howl of the Wild](https://2e.aonprd.com/Feats.aspx?ID=4675)

### Dragonblood Feats

**Dragonblood Paragon** (Level 3)
- **Type**: Dragonblood
- **Prerequisites**: Dragonblood Heritage
- **Benefit**: Choose dragon type, gain resistance = half level to associated damage type
- **Source**: [Howl of the Wild pg. 39](https://2e.aonprd.com/Feats.aspx?ID=2387)

**Wyrmscaled** (Level 5)
- **Type**: Dragonblood
- **Prerequisites**: Dragonblood Heritage
- **Benefit**: +1 circumstance bonus to AC vs dragons, +1 to AC if unarmored vs all attacks
- **Source**: [Howl of the Wild pg. 39](https://2e.aonprd.com/Feats.aspx?ID=2390)

---

## Using the Feats & Skills Tab

### Viewing Your Selections

1. Navigate to **"Feats & Skills"** tab
2. View **Feat Summary** showing totals by type
3. Scroll to **Selected Feats (by Level)** to see all feats with:
   - Level gained
   - Feat type (Ancestry/Class/Skill/General)
   - Feat name with external link
   - Source citation
   - "Granted" badge if automatically given

4. View **Skill Proficiencies** showing:
   - Skill name
   - Proficiency rank (color-coded)
   - Level gained
   - Source
   - Key ability
   - External link to Archives of Nethys

### Current Starting Feats (Level 1)

Your character starts with these feats:

1. **Shield Block** (General) - Player Core pg. 267
2. **Intimidating Glare** (Skill) - Player Core pg. 261
3. **Deadly Simplicity** (Class) - Player Core pg. 112 [Granted by Warpriest]
4. **Dragonblood** (Heritage) - Howl of the Wild pg. 38 [Heritage]

### Current Starting Skills (Level 1)

Your character has these trained skills:

1. **Athletics** (Trained) - Background (Warrior)
2. **Warfare Lore** (Trained) - Background (Warrior)
3. **Religion** (Trained) - Cleric Class
4. **Intimidation** (Trained) - Class (Cleric) additional skill
5. **Medicine** (Trained) - Class (Cleric) additional skill
6. **Survival** (Trained) - Class (Cleric) additional skill

---

## Data Persistence

All feat and skill selections are automatically saved to localStorage:

**Storage Keys**:
- `selected-feats`: Array of feat objects
- `skill-proficiencies`: Object of skill proficiency data

**Auto-Save**: Changes save immediately when you level up or modify selections

**Data Reset**: Clear browser localStorage to reset all selections

---

## Rules Validation (Future Enhancement)

Future versions will include:
- **Prerequisite checking**: Verify you meet feat prerequisites
- **Level gating**: Prevent selecting feats before required level
- **Skill rank validation**: Ensure proper progression (Trained → Expert → Master → Legendary)
- **Feat slot tracking**: Track used vs available feat slots per level
- **Duplicate prevention**: Warn when selecting non-repeatable feats multiple times

---

## Adding New Feats

To add more feats to the database, edit `src/pathfinderRules.js`:

```javascript
feats: {
  general: {
    yourFeatKey: {
      name: "Feat Name",
      level: 1,
      type: "General",
      prerequisites: ["Prerequisite 1", "Prerequisite 2"],
      description: "Full feat description",
      source: "Player Core pg. XXX",
      url: "https://2e.aonprd.com/Feats.aspx?ID=XXXX",
      traits: ["General"],
      actions: "1 action" // if applicable
    }
  }
}
```

---

## Exporting Character Data

The character sheet MD export ([MINOTAUR_CLERIC_CHARACTER_SHEET.md](MINOTAUR_CLERIC_CHARACTER_SHEET.md)) can be manually updated to include:
- All selected feats organized by level
- All skill proficiencies with ranks
- Source citations for each selection

---

## Technical Details

### State Management

**Feat State**:
```javascript
const [selectedFeats, setSelectedFeats] = useState([
  {
    levelGained: 1,
    type: 'general',
    category: 'general',
    featKey: 'shieldBlock',
    name: 'Shield Block',
    source: 'Player Core pg. 267',
    url: 'https://2e.aonprd.com/Feats.aspx?ID=839',
    granted: false
  }
]);
```

**Skill State**:
```javascript
const [skillProficiencies, setSkillProficiencies] = useState({
  athletics: {
    rank: 'trained',
    levelGained: 1,
    source: 'Background (Warrior)'
  }
});
```

### Feat Progression Arrays

From `pathfinderRules.js`:
```javascript
featProgression: {
  ancestry: [1, 5, 9, 13, 17],
  class: [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
  skill: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
  general: [3, 7, 11, 15, 19]
}
```

### Skill Progression Array

```javascript
skillProgression: {
  increases: [2, 3, 5, 7, 9, 11, 13, 15, 17, 19],
  maxRank: {
    trained: 1,
    expert: 7,
    master: 15,
    legendary: 20
  }
}
```

---

## References

### Official Sources

- **Player Core pg. 33** - Character Advancement
- **Player Core pg. 225** - Skills
- **Player Core pg. 258-268** - General & Skill Feats
- **Player Core pg. 112-121** - Cleric Class & Feats
- **Howl of the Wild** - Minotaur & Dragonblood
- **Archives of Nethys** - All feat/skill links

### Related Files

- [pathfinderRules.js](src/pathfinderRules.js) - Feat & skill database
- [App.jsx](src/App.jsx) - Feat & skill state management
- [MINOTAUR_CLERIC_CHARACTER_SHEET.md](MINOTAUR_CLERIC_CHARACTER_SHEET.md) - Full character sheet

---

## Future Enhancements

Planned features:
1. **Feat selection UI**: Modal/dropdown to select feats from available options
2. **Skill increase UI**: Button to increase skill ranks at appropriate levels
3. **Prerequisites validation**: Check if feat requirements are met
4. **Suggested feats**: Recommend feats based on character build
5. **Build templates**: Load pre-made feat selections
6. **Export to PDF**: Generate printable character sheet with feats/skills

---

**Status**: ✅ **IMPLEMENTED**
**Last Updated**: 2025-11-09
**Version**: 1.0

---

**Remember**: All feat and skill selections should follow official Pathfinder 2e rules. When in doubt, check Archives of Nethys!
