# Talon Tracker - Function Documentation

**Last Updated**: 2025-11-11
**Version**: 3.1.0
**Test Coverage**: 100 tests passing

---

## Table of Contents

1. [Core Calculation Functions](#core-calculation-functions)
2. [AI & Story Generation](#ai--story-generation)
3. [React Components](#react-components)
4. [UI Helper Components](#ui-helper-components)
5. [Type Signatures](#type-signatures)

---

## Core Calculation Functions

These functions implement official Pathfinder 2e rules and are fully unit tested.

### `calculateMaxHP(level: number): number`

**Purpose**: Calculate maximum HP based on character level
**Formula**: `Base HP + (HP per level × (level - 1))`
**Base HP**: Cleric (8) + Minotaur (10) + CON modifier (+5) = 23
**HP per level**: Cleric (8) + CON modifier (+5) = 13

**Source**: Player Core pg. 112 (Cleric), Howl of the Wild pg. 38 (Minotaur)

**Examples**:
```javascript
calculateMaxHP(1)  // 23
calculateMaxHP(5)  // 75
calculateMaxHP(10) // 140
calculateMaxHP(20) // 270
```

**Tests**: ✅ 7 tests passing

---

### `getProficiencyBonus(level: number, rank: string): number`

**Purpose**: Calculate proficiency bonus based on level and proficiency rank
**PF2e Rules**:
- Untrained: 0
- Trained: level + 0
- Expert: level + 2
- Master: level + 4
- Legendary: level + 6

**Source**: Player Core pg. 27

**Examples**:
```javascript
getProficiencyBonus(5, 'trained')    // 5
getProficiencyBonus(10, 'expert')    // 12
getProficiencyBonus(20, 'legendary') // 26
```

**Tests**: ✅ 15 tests passing

**Note**: This was corrected during compliance audit. Previously added +2 to all ranks, which was incorrect.

---

### `getAbilityScore(baseScore: number, ability: string, level: number): number`

**Purpose**: Calculate ability score at a given level with 18+ cap rule
**18+ Cap Rule**: Ability boosts give +2 to score, or +1 if score is already 18 or higher
**Source**: Player Core pg. 27

**Boost Progression** (for this character):
- Level 5: STR, DEX, CON, WIS
- Level 10: STR, DEX, CON, WIS
- Level 15: STR, DEX, CON, WIS
- Level 20: INT, CON, CHA, WIS

**Examples**:
```javascript
// WIS starts at 18, so cap applies immediately
getAbilityScore(18, 'WIS', 1)  // 18
getAbilityScore(18, 'WIS', 5)  // 19 (18+1, cap applied)
getAbilityScore(18, 'WIS', 10) // 20 (19+1, cap applied)
getAbilityScore(18, 'WIS', 20) // 22 (21+1, cap applied)

// STR starts at 16, cap applies after level 5
getAbilityScore(16, 'STR', 5)  // 18 (16+2, normal boost)
getAbilityScore(16, 'STR', 10) // 19 (18+1, cap applied)
```

**Tests**: ✅ 26 tests passing (including official character sheet validation)

**Implementation Details**:
```javascript
const applyBoost = (score) => {
  if (score >= 18) return score + 1;  // Cap applied
  return score + 2;  // Normal boost
};
```

---

### `getModifier(score: number): number`

**Purpose**: Calculate ability modifier from ability score
**Formula**: `Math.floor((score - 10) / 2)`
**Source**: Player Core pg. 27

**Examples**:
```javascript
getModifier(8)  // -1
getModifier(10) // 0
getModifier(18) // +4
getModifier(22) // +6
```

**Tests**: ✅ 17 tests passing

---

### `getMaxSpellSlots(level: number, rank: number): number`

**Purpose**: Get maximum spell slots for a given character level and spell rank
**Source**: Player Core pg. 112 - Cleric Spell Slots table

**Examples**:
```javascript
getMaxSpellSlots(1, 1)  // 2 (Level 1 has 2 rank-1 slots)
getMaxSpellSlots(5, 3)  // 2 (Level 5 has 2 rank-3 slots)
getMaxSpellSlots(20, 9) // 3 (Level 20 has 3 rank-9 slots)
```

**Spell Slot Progression**:
- Rank 1-9 slots unlock at levels 1, 3, 5, 7, 9, 11, 13, 15, 17
- Most slots cap at 3 per rank
- New rank slots start at 2, increase to 3 next level

**Tests**: ✅ 12 tests passing

---

### `getDivineFontSlots(level: number): number`

**Purpose**: Calculate divine font spell slots (Heal or Harm)
**Formula**: `1 + WIS modifier`
**Source**: Player Core pg. 112 (Cleric Divine Font)

**Examples**:
```javascript
// Level 1: WIS 18 (+4) = 5 slots
getDivineFontSlots(1)  // 5

// Level 10: WIS 20 (+5) = 6 slots
getDivineFontSlots(10) // 6

// Level 20: WIS 22 (+6) = 7 slots
getDivineFontSlots(20) // 7
```

**Tests**: ✅ 4 tests passing

---

## AI & Story Generation

### `generateStoryLog(prompt: string, characterContext: object): Promise<string>`

**Purpose**: Generate narrative story descriptions using Ollama AI
**API**: http://100.1.100.201:11434/v1/chat/completions
**Model**: llama3.2:3b

**Character Context Includes**:
- name: Character name
- gender: Character gender
- level: Current level
- ancestry: Minotaur
- heritage: Dragonblood
- class: Warpriest Cleric
- hp, maxHP: Current and max hit points
- abilityScores: All 6 ability scores (object)
- equippedItems: Comma-separated list of equipped gear

**Parameters**:
- temperature: 0.7 (balanced creativity)
- max_tokens: 100
- System prompt: "Write ONE vivid sentence describing this Pathfinder 2e character moment. Keep it under 20 words. Be concise and dramatic."

**Error Handling**: Returns fallback message if API unavailable

**Example Output**:
```
"Briggeld's horns gleamed as he channeled divine energy, healing wounds while his shield deflected incoming blows."
```

---

## React Components

### Main Application Component

#### `App()`

**Purpose**: Root component managing all application state and routing
**File**: src/App.jsx (lines 160-1223)

**State Management**:
- Character level (1-20)
- HP tracking (current/max)
- Spell preparation and casting
- Notes and gear inventory
- Story logs with AI generation
- Tab navigation

**Key Features**:
- localStorage persistence for all state
- Action batching for story generation (3-second window)
- Lazy loading with mounting animations
- Responsive tab system

---

### Tab Components

#### `OverviewTab({ level, avatarUrl, isGeneratingAvatar, generateAvatar })`

**Purpose**: Display character overview with ability scores, ancestry, and background
**File**: src/App.jsx (lines 1224-1557)

**Sections**:
1. Character Avatar (currently hidden)
2. Ancestry & Background - Minotaur stats, heritage, size, speed
3. Ability Scores - Interactive cards with detailed tooltips

**Features**:
- Ability score tooltips show boost progression and 18+ cap rule
- Primary abilities highlighted (STR, WIS for Warpriest)
- Dynamic calculations based on level

---

#### `CombatTab({ level })`

**Purpose**: Display combat statistics, attacks, and saving throws
**File**: src/App.jsx (lines 1558-2005)

**Sections**:
1. Combat Stats - AC, Perception, Speed
2. Saving Throws - Fortitude, Reflex, Will
3. Attacks - Horns (natural), Mace (weapon)
4. Divine Font - Heal spell tracking

**Calculations**:
- AC: 10 + Dex mod + armor bonus + proficiency
- Saves: Ability mod + proficiency bonus
- Attack: Ability mod + proficiency + weapon bonuses

---

#### `SpellsTab({ level, preparedSpells, castSpells, castSpell, uncastSpell, restSpells, togglePreparedSpell })`

**Purpose**: Divine spell management with preparation and casting
**File**: src/App.jsx (lines 2008-2687)

**Features**:
- Cantrips (always prepared)
- Spell slots by rank (1-9)
- Prepare/unprepare spells
- Cast/uncast tracking
- Rest to restore all slots
- Spell DC calculation

**Spell DC Formula**: `10 + WIS modifier + proficiency bonus`

---

#### `FeatsSkillsTab({ level, selectedFeats, setSelectedFeats, skillProficiencies, setSkillProficiencies })`

**Purpose**: Feat and skill management per level
**File**: src/App.jsx (lines 2492-2692)

**Features**:
- Skill proficiency tracking (trained, expert, master, legendary)
- Feat slots by type (ancestry, class, skill, general)
- Integration with pathfinderRules.js for official data
- Story log integration for feat/skill changes

---

#### `ProgressionTab({ level })`

**Purpose**: Display level progression milestones and class features
**File**: src/App.jsx (lines 2693-2982)

**Features**:
- Timeline visualization (1-20)
- Class features per level
- Spell rank unlocks
- Ability boost levels
- Feat slot indicators

---

#### `NotesTab({ notes, noteInput, setNoteInput, addNote, deleteNote, editingNote, startEditNote, saveEditNote, cancelEdit })`

**Purpose**: Campaign notes and session journal
**File**: src/App.jsx (lines 2983-3069)

**Features**:
- Add/edit/delete notes
- Timestamp tracking
- localStorage persistence
- Story log integration

---

#### `GearTab({ gear, gearInput, setGearInput, gearQuantity, setGearQuantity, addGear, deleteGear, toggleEquipped, level })`

**Purpose**: Equipment inventory management
**File**: src/App.jsx (lines 3070-3203)

**Features**:
- Add gear with quantity
- Toggle equipped status
- Delete items
- Equipped items included in story context

---

#### `StoryLogTab({ storyLogs, level, onClearLog })`

**Purpose**: View all AI-generated story logs
**File**: src/App.jsx (lines 3698-3766)

**Features**:
- Chronological story display
- Loading indicators
- Clear all logs button
- Timestamp and level tracking

---

## UI Helper Components

### `Tooltip({ children, content, placement })`

**Purpose**: Enhanced draggable tooltips with hover delay
**File**: src/App.jsx (lines 2247-2445)

**Features**:
- Drag and drop
- 100ms hover buffer
- Auto edge detection (left/right/top/bottom)
- Portal-like behavior for z-index

**Usage**:
```jsx
<Tooltip content={<div>Tooltip content here</div>}>
  <Info className="w-4 h-4" />
</Tooltip>
```

---

### `SpellCard({ spell, isCantrip, preparedCount, onTogglePrepare, onAddAnother })`

**Purpose**: Display spell information with prepare/cast controls
**File**: src/App.jsx (lines 2446-2491)

**Features**:
- Spell description
- Action cost icons
- Prepare/unprepare buttons
- Multiple preparation support

---

### `GearItem({ item, onToggle, onDelete, index })`

**Purpose**: Individual gear item with controls
**File**: src/App.jsx (lines 3204-3243)

**Features**:
- Equipped toggle
- Quantity display
- Delete button
- Stagger animation on mount

---

### `StatBlock({ title, icon, children })`

**Purpose**: Reusable stat block container
**File**: src/App.jsx (lines 3356-3367)

**Styling**: Purple gradient border, rounded, padding

---

### `StatItem({ label, value })`

**Purpose**: Label-value pair display
**File**: src/App.jsx (lines 3368-3376)

**Layout**: Flex row with label (slate) and value (white)

---

### `AbilityScore({ ability, score, modifier, primary, level })`

**Purpose**: Ability score card with comprehensive tooltip
**File**: src/App.jsx (lines 3377-3580)

**Features**:
- Base score + modifiers
- Step-by-step progression tooltip
- 18+ cap rule explanation
- Future boost preview
- Primary ability highlight

**Tooltip Sections**:
1. 18+ Cap Rule explanation
2. Level-by-level progression
3. Boost sources
4. Modifier calculation
5. Final summary

---

### `StatCard({ icon, label, value, subtitle, color })`

**Purpose**: Icon-labeled stat display
**File**: src/App.jsx (lines 3582-3600)

**Colors**: blue, purple, green gradients

---

### `AttackCard({ name, bonus, damage, damageType, traits, proficiency, abilityMod, weaponProf, level, weaponUrl, description })`

**Purpose**: Attack display with full calculation breakdown
**File**: src/App.jsx (lines 3601-3696)

**Features**:
- Attack bonus calculation
- Damage formula
- Weapon traits
- Detailed tooltip with sources
- Link to Archives of Nethys

---

## Type Signatures

### State Types

```typescript
// Character State
level: number (1-20)
currentHP: number
maxHP: number
characterName: string
characterGender: string

// Spell State
preparedSpells: { [rank: string]: string[] }
castSpells: { [rank: string]: number }

// Inventory State
notes: Array<{ id: number, text: string, timestamp: string }>
gear: Array<{ id: number, name: string, quantity: number, equipped: boolean }>

// Story State
storyLogs: Array<{
  id: number,
  timestamp: string,
  action: string,
  narrative: string,
  level: number,
  isGenerating?: boolean
}>

// Feat State
selectedFeats: Array<{
  levelGained: number,
  type: string,
  category: string,
  featKey: string,
  name: string,
  source: string,
  url: string,
  granted: boolean
}>

// Skill State
skillProficiencies: {
  [skillKey: string]: {
    rank: 'trained' | 'expert' | 'master' | 'legendary',
    levelGained: number,
    source: string,
    lore?: boolean
  }
}
```

### Function Signatures

```typescript
// Core calculations
calculateMaxHP(level: number): number
getProficiencyBonus(level: number, rank: string): number
getAbilityScore(baseScore: number, ability: string, level: number): number
getModifier(score: number): number
getMaxSpellSlots(level: number, rank: number): number
getDivineFontSlots(level: number): number

// AI generation
generateStoryLog(prompt: string, characterContext: CharacterContext): Promise<string>

interface CharacterContext {
  name: string
  gender: string
  level: number
  ancestry: string
  heritage: string
  class: string
  hp: number
  maxHP: number
  abilityScores: { STR: number, DEX: number, CON: number, INT: number, WIS: number, CHA: number }
  equippedItems: string
}
```

---

## Architecture Notes

### State Persistence

All state is automatically persisted to localStorage with useEffect hooks:
- character-level
- current-hp
- max-hp
- character-name
- character-gender
- campaign-notes
- gear-inventory
- prepared-spells
- cast-spells
- story-logs
- selected-feats
- skill-proficiencies

### Action Batching

Story generation uses a 3-second batching window to reduce API calls:
1. Actions accumulate in `batchedActions` array
2. Timer resets on each new action
3. Placeholder log entry shows latest action in real-time
4. After 3 seconds, batch processes showing initial→final state
5. Single API call for entire batch

### Calculation Flow

```
User changes level
  ↓
getAbilityScore() recalculates all abilities
  ↓
Ability modifiers update (getModifier)
  ↓
Dependent stats recalculate:
  - AC (uses DEX mod)
  - Saves (use ability mods)
  - Skills (use ability mods + proficiency)
  - Spell DC (uses WIS mod + proficiency)
  - Attack bonuses (use STR mod + proficiency)
  ↓
Story log triggered with new level
```

---

## Testing

**Test File**: src/characterFunctions.test.js
**Total Tests**: 100
**Status**: ✅ All passing

**Test Coverage**:
- calculateMaxHP: 7 tests
- getProficiencyBonus: 15 tests
- getAbilityScore: 26 tests (including 18+ cap validation)
- getModifier: 17 tests
- getMaxSpellSlots: 12 tests
- getDivineFontSlots: 4 tests
- Configuration validation: 13 tests
- Official character sheet validation: 6 tests

**Run Tests**:
```bash
node src/characterFunctions.test.js
```

---

## Centralized Configuration

**File**: src/characterConfig.js

Contains all character core data:
- CHARACTER_IDENTITY (ancestry, class, background, heritage)
- BASE_ABILITY_SCORES
- ABILITY_BOOST_PROGRESSION
- EXPECTED_SCORES_LEVEL_20
- INITIAL_SKILL_PROFICIENCIES
- SKILL_PROGRESSION
- INITIAL_FEATS
- FEAT_PROGRESSION
- INITIAL_EQUIPMENT
- LEVEL_MILESTONES
- PROFICIENCY_RANKS
- ABILITY_BOOST_RULES
- CHARACTER_META

**Benefits**:
- Single source of truth
- Easy to modify character build
- Testable against official rules
- Reusable across components

---

## Compliance

**Status**: ✅ Fully Compliant with Pathfinder 2e Remaster

All calculations verified against:
- Player Core
- Howl of the Wild
- Archives of Nethys (https://2e.aonprd.com)

**Key Compliance Fixes**:
1. Proficiency bonus (was adding +2 to all ranks)
2. Ability score 18+ cap (boosts give +1 not +2)
3. Base ability scores (CON 14, WIS 18)
4. HP calculation (includes CON modifier)

---

## Future Enhancements

Potential improvements identified:
1. Move more hardcoded values to characterConfig.js
2. Create reusable hooks for calculations
3. Add TypeScript for type safety
4. Separate concerns (UI vs logic)
5. Create character builder that generates config
6. Support multiple characters
7. Import/export character builds
8. Sync with Pathbuilder2e
9. Add more comprehensive error handling
10. Performance optimization for large story logs

---

**Documentation Maintained By**: Claude Code
**Last Review**: 2025-11-11
**Next Review**: When adding new functions or major refactors
