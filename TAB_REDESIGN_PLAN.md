# Complete Tab Redesign Plan

**Created**: 2025-11-18
**Status**: Planning Phase
**Pattern**: Based on successful NewGearTab implementation

---

## 🎯 Overview

Redesign all character tabs following the centralized, rules-driven pattern established by NewGearTab. Each tab will:
- Source all data from `pathfinderRules.js` and `characterConfig.js`
- Include comprehensive tooltips with source attribution
- Validate against official PF2e rules
- Use modular, reusable components
- Be fully tested with Playwright

---

## 📊 Tab Priority & Dependencies

### Phase 1: Core Combat Features (Week 1-2)
1. **✅ GearTab** - COMPLETE
2. **🔜 CombatTab** - Attack/AC/Saves calculator (depends on GearTab)

### Phase 2: Character Abilities (Week 3-4)
3. **🔜 SpellsTab** - Spell browser and management
4. **🔜 FeatsSkillsTab** - Feat selection and skill proficiency

### Phase 3: Character Development (Week 5-6)
5. **🔜 ProgressionTab** - Level-up features and milestones
6. **🔜 OverviewTab** - Enhanced character summary

### Phase 4: Polish & Integration (Week 7)
7. **🔜 Shared Components** - Extract reusable components
8. **🔜 Utility Library** - Centralized calculation functions
9. **🔜 Testing Suite** - Comprehensive test coverage

---

## 🏗️ Architecture Pattern

### Tab Structure Template

```jsx
import React, { useState } from 'react';
import { /* icons */ } from 'lucide-react';
import pathfinderRules from './pathfinderRules.js';
import { /* configs */ } from './characterConfig.js';
import { Tooltip, Modal, StatCard } from './components/shared';

/**
 * NEW [TAB NAME] - [Description]
 *
 * Features:
 * - [Feature 1]
 * - [Feature 2]
 * - [Feature 3]
 *
 * Pattern:
 * 1. All data from pathfinderRules.js and characterConfig.js
 * 2. Real-time validation against official rules
 * 3. Tooltips with source attribution
 * 4. Dynamic updates based on character level
 */

// Sub-components
function ComponentA({ props }) { /* ... */ }
function ComponentB({ props }) { /* ... */ }

// Main component
export default function New[TabName]Tab({
  level,
  /* other state */,
  /* helper functions */,
  /* constants */
}) {
  // Local state
  const [localState, setLocalState] = useState(null);

  // Calculations using helper functions
  const calculatedValue = helperFunction(level, otherParams);

  // Data from centralized sources
  const rulesData = pathfinderRules.section.data;

  // Render
  return (
    <div className="space-y-6">
      {/* Tab content */}
    </div>
  );
}
```

---

## 📋 Detailed Tab Plans

---

## 1. ✅ GearTab - COMPLETE

**Status**: ✅ Fully integrated and tested (12/12 tests passing)

**Features**:
- Equipment slots (weapon, armor, shield)
- Rune management system
- Equipment browser by category
- Real-time stat impact display
- Bulk tracking
- Wealth by level guidance

**File**: `src/NewGearTab.jsx` (780 lines)

---

## 2. 🔜 CombatTab - Attack/AC/Saves Calculator

**Priority**: HIGH (most used in gameplay)
**Estimated Size**: ~600 lines
**Dependencies**: GearTab (for equipment bonuses)

### Features to Implement

#### Armor Class Calculator
- Base AC (10)
- Dex modifier (with armor cap)
- Armor bonus (from equipped armor)
- Proficiency bonus (Trained → Expert → Master → Legendary)
- Item bonus (from armor potency rune)
- Shield bonus when raised (+2)
- Breakdown tooltip showing all components

#### Attack Calculator
- **Unarmed Strikes** (primary for Warpriest of Irori):
  - Fist (1d6 + STR, enhanced by Handwraps)
  - Horns (1d8 + STR, Deadly d8)
- **Attack Bonus**:
  - Ability modifier (STR)
  - Proficiency (weapon proficiency progression)
  - Item bonus (from weapon potency rune)
- **Damage**:
  - Base dice (modified by Striking runes)
  - Ability modifier
  - Weapon Specialization (level 13+)
  - Property runes effects

#### Saving Throws
- **Fortitude**: CON + proficiency + resilient rune
- **Reflex**: DEX + proficiency + resilient rune
- **Will**: WIS + proficiency + resilient rune
- Proficiency progression per save type
- Breakdown tooltips

#### Other Combat Stats
- **Perception**: WIS + proficiency
- **Spell DC**: 10 + WIS + proficiency
- **Spell Attack**: WIS + proficiency
- **Speed**: Base (25 for Minotaur) + armor penalty + bonuses

### Data Sources
```javascript
// From pathfinderRules.js
- fundamentalRunes (for rune bonuses)
- proficiencyProgression (for level-based increases)

// From characterConfig.js
- CHARACTER_IDENTITY.proficiencies (starting ranks)
- BASE_ABILITY_SCORES (for modifiers)

// From App.jsx helpers
- getAbilityScore(base, ability, level)
- getModifier(score)
- getProficiencyBonus(level, rank)
- getEquipmentModifiers(gear)
```

### Components

```jsx
// Sub-components
- ACBreakdown - Detailed AC calculation display
- AttackCard - Individual attack display with to-hit and damage
- SaveCard - Saving throw display with breakdown
- CombatStatCard - Reusable stat display component

// Main sections
1. Quick Stats (AC, Perception, Speed)
2. Attacks (Fist, Horns, any equipped weapons)
3. Saving Throws (Fort, Ref, Will)
4. Spell Stats (DC, Attack)
```

### Props Interface
```typescript
interface NewCombatTabProps {
  level: number;
  gear: GearItem[];
  getAbilityScore: (base: number, ability: string, level: number) => number;
  getModifier: (score: number) => number;
  getProficiencyBonus: (level: number, rank: string) => number;
  getEquipmentModifiers: (gear: GearItem[]) => EquipmentMods;
  BASE_ABILITY_SCORES: AbilityScores;
}
```

---

## 3. 🔜 SpellsTab - Spell Browser & Management

**Priority**: HIGH (core class feature for Cleric)
**Estimated Size**: ~800 lines
**Dependencies**: None (self-contained)

### Features to Implement

#### Spell Slot Management
- **Spell slots per rank** (1-10):
  - Calculate based on level
  - Track prepared spells
  - Track cast spells
  - Visual slot indicators
- **Divine Font slots**:
  - Heal/Harm choice
  - Slots scale with level (4 at 1, +1 at 5/15)
  - Separate from regular slots

#### Spell Browser
- **Filter by**:
  - Spell rank (cantrips, 1-10)
  - Tradition (Divine)
  - School (Abjuration, Conjuration, etc.)
  - Available to prepare
- **Sort by**:
  - Name (A-Z)
  - Level required
  - Actions required
- **Search**: Text search by spell name

#### Spell Cards
- **Display**:
  - Name, actions, range, targets
  - Description (from pathfinderRules.divineSpells)
  - Heightening effects by rank
  - Source attribution with URL
- **Actions**:
  - Prepare/unprepare
  - Cast (consume slot)
  - View full details in modal

#### Spell DC & Attack
- Calculate from WIS + proficiency
- Show progression by level
- Breakdown tooltip

### Data Sources
```javascript
// From pathfinderRules.js
- divineSpells (complete spell list)
- spellSlotProgression (slots per level)
- divineFontProgression (font slots per level)

// From characterConfig.js
- CHARACTER_IDENTITY.class.spellcasting
- CHARACTER_IDENTITY.divineFont

// Calculated
- Spell DC: 10 + WIS mod + proficiency
- Spell Attack: WIS mod + proficiency
```

### Components

```jsx
// Sub-components
- SpellCard - Individual spell display
- SpellSlotTracker - Visual slot indicators
- SpellBrowser - Filterable spell list
- SpellModal - Full spell details popup
- DivineFontManager - Heal/Harm choice and tracking

// Main sections
1. Spell DC & Attack Stats
2. Divine Font (Heal/Harm slots)
3. Cantrips (always available)
4. Ranked Spells (1-10) with preparation
5. Spell Browser/Search
```

### Props Interface
```typescript
interface NewSpellsTabProps {
  level: number;
  preparedSpells: PreparedSpells;
  setPreparedSpells: (spells: PreparedSpells) => void;
  castSpells: CastSpells;
  setCastSpells: (spells: CastSpells) => void;
  divineFontChoice: 'heal' | 'harm';
  setDivineFontChoice: (choice: 'heal' | 'harm') => void;
  getAbilityScore: (base: number, ability: string, level: number) => number;
  getModifier: (score: number) => number;
  getProficiencyBonus: (level: number, rank: string) => number;
  CHARACTER_IDENTITY: CharacterIdentity;
}
```

---

## 4. 🔜 FeatsSkillsTab - Feat Selection & Skill Proficiency

**Priority**: MEDIUM (character customization)
**Estimated Size**: ~700 lines
**Dependencies**: None

### Features to Implement

#### Skill Proficiency Manager
- **All 17 Skills**:
  - Display with ability modifier
  - Show proficiency rank (Untrained → Legendary)
  - Calculate total bonus (ability + proficiency)
  - Highlight trained skills
- **Skill Increases**:
  - Track increases by level (2, 3, 7, 15)
  - Show available increases
  - Validate rank prerequisites
- **Skill Actions**:
  - Tooltip showing common skill actions
  - Link to Archives of Nethys

#### Feat Browser
- **Filter by type**:
  - Ancestry feats (level 1, 5, 9, 13, 17)
  - Class feats (every even level)
  - Skill feats (level 2, then every even)
  - General feats (level 3, then every 4)
- **Filter by level**: Show only available feats
- **Prerequisite validation**:
  - Check ability scores
  - Check proficiencies
  - Check other feats
  - Disable invalid choices

#### Feat Cards
- **Display**:
  - Name, type, level
  - Prerequisites (with validation status)
  - Benefits/description
  - Source with URL
- **Actions**:
  - Select/unselect feat
  - View full details
  - See feat chains (related feats)

### Data Sources
```javascript
// From pathfinderRules.js
- skills (all 17 skills with abilities)
- feats (by type: ancestry, class, skill, general)
- featPrerequisites (validation rules)

// From characterConfig.js
- INITIAL_SKILL_PROFICIENCIES
- SKILL_PROGRESSION (increases by level)
- INITIAL_FEATS (starting feats)

// Calculated
- Skill bonus: ability mod + proficiency
- Available feats by level and type
```

### Components

```jsx
// Sub-components
- SkillCard - Individual skill display with proficiency
- SkillIncreaseManager - Handle skill rank increases
- FeatCard - Individual feat display
- FeatBrowser - Filterable feat list
- FeatModal - Full feat details
- PrerequisiteChecker - Validates feat requirements

// Main sections
1. Skill List (all 17 skills)
2. Skill Increases (available by level)
3. Feat Selection by Type
4. Selected Feats Summary
```

### Props Interface
```typescript
interface NewFeatsSkillsTabProps {
  level: number;
  selectedFeats: SelectedFeats;
  setSelectedFeats: (feats: SelectedFeats) => void;
  skillProficiencies: SkillProficiencies;
  setSkillProficiencies: (skills: SkillProficiencies) => void;
  getAbilityScore: (base: number, ability: string, level: number) => number;
  getModifier: (score: number) => number;
  getProficiencyBonus: (level: number, rank: string) => number;
  BASE_ABILITY_SCORES: AbilityScores;
}
```

---

## 5. 🔜 ProgressionTab - Level Milestones & Features

**Priority**: MEDIUM (informational)
**Estimated Size**: ~500 lines
**Dependencies**: FeatsSkillsTab (for feat validation)

### Features to Implement

#### Level Timeline
- **Visual timeline** of levels 1-20
- **Highlight current level**
- **Show milestone levels** (5, 10, 15, 20)

#### Class Features by Level
- **Automatic features**:
  - Hit points gained
  - Proficiency increases
  - Class features unlocked
  - Ability score boosts (5, 10, 15, 20)
- **Choices required**:
  - Skill increases
  - Feat selections
  - Spell selections

#### Ability Score Tracker
- **Track boosts** at levels 1, 5, 10, 15, 20
- **Show current scores** with modifiers
- **Validate boost rules**:
  - 4 free boosts per level
  - +2 if score < 18
  - +1 if score ≥ 18
- **Visual boost allocation**

#### Proficiency Progression
- **Track proficiency increases**:
  - Weapons (Trained → Legendary at 19)
  - Armor (Trained → Legendary at 20)
  - Saves (different progressions)
  - Skills (character-dependent)
  - Spells (Trained → Legendary at 19)

### Data Sources
```javascript
// From pathfinderRules.js
- classProgression (features by level)
- proficiencyProgression (when ranks increase)
- abilityBoostLevels (5, 10, 15, 20)

// From characterConfig.js
- CHARACTER_IDENTITY (class features)
- ABILITY_BOOST_PROGRESSION (chosen boosts)
- BASE_ABILITY_SCORES (starting scores)

// Calculated
- Current ability scores (with boosts)
- Features unlocked at current level
```

### Components

```jsx
// Sub-components
- LevelTimeline - Visual progression track
- LevelCard - Individual level details
- AbilityBoostManager - Allocate ability boosts
- FeatureCard - Class feature display
- ProficiencyTracker - Track rank increases

// Main sections
1. Current Level Overview
2. Level Timeline (1-20)
3. Ability Score Boosts
4. Class Features
5. Proficiency Progression
```

### Props Interface
```typescript
interface NewProgressionTabProps {
  level: number;
  abilityBoosts: AbilityBoosts;
  setAbilityBoosts: (boosts: AbilityBoosts) => void;
  BASE_ABILITY_SCORES: AbilityScores;
  CHARACTER_IDENTITY: CharacterIdentity;
}
```

---

## 6. 🔜 OverviewTab - Enhanced Character Summary

**Priority**: LOW (mostly informational)
**Estimated Size**: ~400 lines
**Dependencies**: All other tabs

### Features to Implement

#### Character Identity
- **Name, ancestry, class, level**
- **Background, deity**
- **Avatar/image**
- **Quick stats** (HP, AC, Speed)

#### Quick Reference
- **Top 5 attacks** (from CombatTab)
- **Top 5 spells** (from SpellsTab)
- **Key abilities** (from FeatsSkillsTab)
- **Recent story log** (from StoryLogTab)

#### Character Summary
- **Ability scores** with modifiers
- **Proficiency overview** (weapons, armor, saves, skills)
- **Active effects** (from equipment, spells, etc.)

### Components

```jsx
// Sub-components
- CharacterCard - Main character info
- QuickStatsCard - HP, AC, Speed, Perception
- TopAttacksCard - 5 most-used attacks
- TopSpellsCard - 5 most-used spells
- RecentActivityCard - Recent story log

// Main sections
1. Character Identity
2. Quick Stats
3. Quick Reference
4. Character Summary
```

---

## 🛠️ Shared Components Library

Create reusable components in `src/components/shared/`:

### Core Components

```jsx
// Tooltip.jsx - Reusable tooltip
export function Tooltip({ children, content }) { /* ... */ }

// Modal.jsx - Reusable modal dialog
export function Modal({ isOpen, onClose, title, children }) { /* ... */ }

// StatCard.jsx - Reusable stat display
export function StatCard({ title, value, breakdown, icon }) { /* ... */ }

// StatBlock.jsx - Grouped stats container
export function StatBlock({ title, icon, children }) { /* ... */ }

// SourceLink.jsx - Archives of Nethys link
export function SourceLink({ url, source }) { /* ... */ }

// Badge.jsx - Level/rarity badge
export function Badge({ text, color, icon }) { /* ... */ }

// ProgressBar.jsx - Visual progress indicator
export function ProgressBar({ current, max, label }) { /* ... */ }
```

---

## 📊 Utility Functions Library

Create centralized calculations in `src/utils/`:

### characterCalculations.js

```javascript
/**
 * Centralized character calculation utilities
 * Used by all tabs to ensure consistency
 */

export function calculateAC({ level, dexMod, armor, proficiencyRank, equipmentBonus }) {
  const baseAC = 10;
  const armorBonus = armor?.acBonus || 0;
  const dexCap = armor?.dexCap !== undefined ? Math.min(dexMod, armor.dexCap) : dexMod;
  const proficiencyBonus = getProficiencyBonus(level, proficiencyRank);
  return baseAC + dexCap + armorBonus + proficiencyBonus + equipmentBonus;
}

export function calculateAttackBonus({ level, abilityMod, proficiencyRank, equipmentBonus = 0 }) {
  const proficiencyBonus = getProficiencyBonus(level, proficiencyRank);
  return abilityMod + proficiencyBonus + equipmentBonus;
}

export function calculateSpellDC({ level, abilityMod, proficiencyRank }) {
  const proficiencyBonus = getProficiencyBonus(level, proficiencyRank);
  return 10 + abilityMod + proficiencyBonus;
}

export function calculateSave({ level, abilityMod, proficiencyRank, equipmentBonus = 0 }) {
  const proficiencyBonus = getProficiencyBonus(level, proficiencyRank);
  return abilityMod + proficiencyBonus + equipmentBonus;
}

export function calculateSkillBonus({ level, abilityMod, proficiencyRank, circumstanceBonus = 0 }) {
  const proficiencyBonus = getProficiencyBonus(level, proficiencyRank);
  return abilityMod + proficiencyBonus + circumstanceBonus;
}

// ... more utilities
```

### validation.js

```javascript
/**
 * Validates character choices against official PF2e rules
 */

export function validateFeatChoice(feat, character) {
  // Check level requirement
  if (feat.level > character.level) {
    return { valid: false, reason: `Requires level ${feat.level}` };
  }

  // Check prerequisites
  if (feat.prerequisites) {
    for (const prereq of feat.prerequisites) {
      if (!hasPrerequisite(character, prereq)) {
        return { valid: false, reason: `Missing prerequisite: ${prereq}` };
      }
    }
  }

  return { valid: true };
}

export function validateSkillIncrease(skill, currentRank, character) {
  // Untrained → Trained (always allowed with training)
  // Trained → Expert (level 3+)
  // Expert → Master (level 7+)
  // Master → Legendary (level 15+)

  const rankRequirements = {
    trained: 1,
    expert: 3,
    master: 7,
    legendary: 15
  };

  if (character.level < rankRequirements[currentRank]) {
    return { valid: false, reason: `Requires level ${rankRequirements[currentRank]}` };
  }

  return { valid: true };
}

// ... more validators
```

---

## 📅 Implementation Roadmap

### Week 1: CombatTab
- **Day 1-2**: Create boilerplate, implement AC calculator
- **Day 3-4**: Implement attack calculator and damage
- **Day 5**: Implement saves, perception, spell stats
- **Day 6**: Add tooltips and source attribution
- **Day 7**: Testing and integration

### Week 2: SpellsTab
- **Day 1-2**: Create boilerplate, implement spell slot tracker
- **Day 3-4**: Implement spell browser and filtering
- **Day 5**: Implement divine font management
- **Day 6**: Add spell cards and modals
- **Day 7**: Testing and integration

### Week 3: FeatsSkillsTab
- **Day 1-2**: Create boilerplate, implement skill proficiency
- **Day 3-4**: Implement feat browser and filtering
- **Day 5**: Implement prerequisite validation
- **Day 6**: Add feat selection UI
- **Day 7**: Testing and integration

### Week 4: ProgressionTab
- **Day 1-2**: Create boilerplate, implement level timeline
- **Day 3-4**: Implement ability score tracker
- **Day 5**: Implement class features display
- **Day 6**: Add proficiency progression
- **Day 7**: Testing and integration

### Week 5: Shared Components
- **Day 1-3**: Extract and create shared components
- **Day 4-5**: Create utility library
- **Day 6-7**: Refactor all tabs to use shared components

### Week 6: Polish & Testing
- **Day 1-3**: Comprehensive testing of all tabs
- **Day 4-5**: Bug fixes and refinements
- **Day 6-7**: Documentation and final integration

---

## 🧪 Testing Strategy

### Per-Tab Testing
- Create `test-[tab]-tab.cjs` for each tab
- Minimum 10 tests per tab
- Cover all major features
- Visual verification with screenshots

### Integration Testing
- Update main `test-ui.js` with all tabs
- Test tab switching
- Test data persistence
- Test cross-tab interactions

### Manual Testing Checklist
- [ ] All calculations match Archives of Nethys
- [ ] Tooltips show correct info
- [ ] Links work correctly
- [ ] Level changes update properly
- [ ] Data persists in localStorage
- [ ] No console errors
- [ ] Mobile responsive

---

## 📝 Documentation Requirements

For each tab, create:
1. **Inline code comments** explaining complex logic
2. **Props interface documentation**
3. **Component usage examples**
4. **Integration notes** in main README

Update these files:
- **CLAUDE.md** - Add tab-specific sections
- **README.md** - Update feature list
- **TESTING.md** - Add test coverage details

---

## ✅ Success Criteria

Each tab is considered complete when:
- [ ] All features implemented
- [ ] All data sourced from centralized config
- [ ] All tooltips include source attribution
- [ ] All calculations verified against official rules
- [ ] All tests passing (minimum 10 per tab)
- [ ] No console errors
- [ ] Data persists correctly
- [ ] Mobile responsive
- [ ] Documentation complete
- [ ] Integrated into main app

---

## 🎯 End Goal

A complete, rules-accurate, user-friendly Pathfinder 2e character sheet application with:
- ✅ Comprehensive equipment management (COMPLETE)
- ✅ Combat calculator with breakdowns
- ✅ Spell management and browser
- ✅ Feat selection with validation
- ✅ Skill proficiency tracker
- ✅ Level progression timeline
- ✅ Centralized rules and calculations
- ✅ Comprehensive tooltips and attribution
- ✅ Full test coverage
- ✅ Beautiful, responsive UI

**Total Estimated Development Time**: 6-7 weeks (part-time)
**Total Estimated Code**: ~4,000 lines across all new tabs
**Pattern**: Proven and tested (NewGearTab: 12/12 tests passing)

---

_Ready to begin implementation! 🚀_
