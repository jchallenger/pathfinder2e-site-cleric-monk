# Equipment Tab Redesign - Integration Guide

**Created**: 2025-11-18
**Version**: 1.0
**Status**: Ready for Integration

---

## Overview

The new `NewGearTab.jsx` implements a comprehensive equipment management system with:
- **Equipment Slots** (weapon, armor, shield)
- **Rune Management** (add/remove/upgrade runes)
- **Equipment Browser** (level-filtered, category-based)
- **Real-time Stat Display** (shows bonuses from equipped gear)
- **Rules Compliance** (all data from `pathfinderRules.js` and `characterConfig.js`)

---

## Integration Steps

### 1. Update Main App Component

In `App.jsx`, update the GearTab integration:

**Find** (around line 700-800 where tabs are rendered):
```jsx
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
```

**Replace with**:
```jsx
{activeTab === 'gear' && (
  <NewGearTab
    gear={gear}
    setGear={setGear}
    level={level}
    calculateTotalBulk={calculateTotalBulk}
    getEquipmentModifiers={getEquipmentModifiers}
    getAbilityScore={getAbilityScore}
    getModifier={getModifier}
    BASE_ABILITY_SCORES={BASE_ABILITY_SCORES}
  />
)}
```

**Add import** at top of `App.jsx`:
```jsx
import NewGearTab from './NewGearTab.jsx';
```

### 2. Update Gear State Structure

The new system expects gear items to have a `slot` property. Update initial gear state:

**Find** `const [gear, setGear] = useState(...)` in `App.jsx`:

```jsx
const [gear, setGear] = useState(() => {
  const saved = localStorage.getItem('gear-inventory');
  if (saved) return JSON.parse(saved);

  // Default starting equipment
  return [
    {
      id: 1,
      name: 'Handwraps of Mighty Blows',
      equipped: true,
      slot: 'weapon',  // ADD THIS
      type: 'weapon',
      stats: {
        name: 'Handwraps of Mighty Blows',
        category: 'weapon',
        weaponType: 'unarmed',
        hands: 0,
        damage: '1d6',
        damageType: 'bludgeoning',
        bulk: 'L',
        level: 2
      },
      runes: {
        potency: null,
        striking: null,
        resilient: null,
        property: []
      }
    },
    {
      id: 2,
      name: 'Breastplate',
      equipped: true,
      slot: 'armor',  // ADD THIS
      type: 'armor',
      stats: {
        name: 'Breastplate',
        category: 'armor',
        armorType: 'medium',
        acBonus: 4,
        dexCap: 1,
        bulk: 2,
        level: 0
      },
      runes: {
        potency: null,
        resilient: null,
        property: []
      }
    }
  ];
});
```

### 3. Remove Old GearTab-related Functions

You can now remove these functions from `App.jsx` as they're handled internally by NewGearTab:
- `addGear()`
- `deleteGear()`
- `toggleEquipped()`
- `gearInput` state
- `setGearInput` state
- `gearQuantity` state
- `setGearQuantity` state

### 4. Test the Integration

1. Start dev server: `npm run dev`
2. Navigate to Gear tab
3. Test equipment slot functionality:
   - Equip/unequip items
   - Add/remove runes
   - Check stat bonuses update correctly
4. Test level changes (use level +/- buttons)
5. Verify runes filter by level correctly

---

## Pattern for Other Tabs

The `NewGearTab` demonstrates a **centralized, rules-driven pattern** that should be applied to ALL tabs:

### Core Principles

1. **Single Source of Truth**
   - All rules from `pathfinderRules.js`
   - All character data from `characterConfig.js`
   - No hardcoded stats or calculations

2. **Prop-based Utilities**
   - Pass helper functions as props (e.g., `getAbilityScore`, `getProficiencyBonus`)
   - Tab components don't duplicate logic
   - Consistent calculations across tabs

3. **Real-time Validation**
   - Filter options by character level
   - Show only legal/available choices
   - Validate against official rules

4. **Source Attribution**
   - Every stat has a tooltip showing:
     - Calculation breakdown
     - Official source
     - Archive of Nethys URL

5. **Modular Components**
   - Break complex UIs into sub-components
   - Reusable components (Tooltip, Modal, etc.)
   - Easy to test and maintain

### Recommended Tab Redesign Order

Apply this pattern in this order for maximum impact:

#### 1. **CombatTab** (High Priority)
**Current Issues**:
- Attack bonuses hardcoded
- Doesn't show rune contribution clearly
- Missing tooltips for stat calculations

**New Pattern**:
```jsx
<NewCombatTab
  level={level}
  gear={gear}
  getAbilityScore={getAbilityScore}
  getModifier={getModifier}
  getProficiencyBonus={getProficiencyBonus}
  getEquipmentModifiers={getEquipmentModifiers}
  BASE_ABILITY_SCORES={BASE_ABILITY_SCORES}
/>
```

**Features**:
- Attack calculator with breakdown tooltips
- AC calculator showing armor + runes + Dex
- Saves with proficiency progression
- Damage calculator with striking runes
- Click-to-roll functionality (future)

#### 2. **SpellsTab** (High Priority)
**Current Issues**:
- Spell list partially hardcoded
- Missing spell heightening rules
- No divine font slot management for higher levels

**New Pattern**:
```jsx
<NewSpellsTab
  level={level}
  preparedSpells={preparedSpells}
  setPreparedSpells={setPreparedSpells}
  castSpells={castSpells}
  setCastSpells={setCastSpells}
  divineFontChoice={divineFontChoice}
  setDivineFontChoice={setDivineFontChoice}
  getAbilityScore={getAbilityScore}
  getModifier={getModifier}
  getProficiencyBonus={getProficiencyBonus}
  CHARACTER_IDENTITY={CHARACTER_IDENTITY}
/>
```

**Features**:
- Spell browser from `pathfinderRules.divineSpells`
- Spell slot calculator (includes divine font scaling at 5/15)
- Heightening calculator
- Spell preparation workflow
- Focus spells section

#### 3. **ProgressionTab** (Medium Priority)
**Current Issues**:
- Milestone features partially hardcoded
- Missing feat prerequisites validation
- No ability score boost tracking

**New Pattern**:
```jsx
<NewProgressionTab
  level={level}
  selectedFeats={selectedFeats}
  setSelectedFeats={setSelectedFeats}
  BASE_ABILITY_SCORES={BASE_ABILITY_SCORES}
  ABILITY_BOOST_PROGRESSION={ABILITY_BOOST_PROGRESSION}
/>
```

**Features**:
- Feat browser with prerequisite validation
- Ability score boost tracker (4 boosts at 5/10/15/20)
- Class feature progression timeline
- Proficiency increase tracker

#### 4. **FeatsSkillsTab** (Medium Priority)
**Current Issues**:
- Feat selection not validated
- Skill proficiency progression manual
- Missing skill action tooltips

**New Pattern**:
```jsx
<NewFeatsSkillsTab
  level={level}
  selectedFeats={selectedFeats}
  setSelectedFeats={setSelectedFeats}
  skillProficiencies={skillProficiencies}
  setSkillProficiencies={setSkillProficiencies}
  getAbilityScore={getAbilityScore}
  getModifier={getModifier}
  getProficiencyBonus={getProficiencyBonus}
/>
```

**Features**:
- Feat browser by type (ancestry, class, skill, general)
- Feat prerequisite checker
- Skill proficiency manager
- Skill action tooltips

---

## Benefits of Centralized Configuration

### 1. **Rules Accuracy**
- ✅ All calculations sourced from `pathfinderRules.js`
- ✅ Easy to verify against Archives of Nethys
- ✅ Update rules in one place, affects all tabs

### 2. **Consistency**
- ✅ Same calculation logic everywhere
- ✅ No discrepancies between tabs
- ✅ Proficiency bonuses always correct

### 3. **Maintainability**
- ✅ Easy to add new equipment/spells/feats
- ✅ Clear separation of data and UI
- ✅ Testable logic (can unit test calculations)

### 4. **Scalability**
- ✅ Add new character classes easily
- ✅ Support multiple characters
- ✅ Export/import character data

### 5. **User Experience**
- ✅ Tooltips explain every calculation
- ✅ Links to official sources
- ✅ Real-time feedback on choices

---

## Proposed Architecture Improvements

### 1. Create Shared Utilities Module

**File**: `src/utils/characterCalculations.js`

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

// ... more utilities
```

### 2. Create Shared Components Module

**File**: `src/components/shared/`

```
components/
├── shared/
│   ├── Tooltip.jsx          // Reusable tooltip
│   ├── Modal.jsx            // Reusable modal
│   ├── StatBlock.jsx        // Stat display component
│   ├── SourceAttribution.jsx // Official source links
│   └── RulesReference.jsx   // Rules explanation tooltips
```

### 3. Enhance Character Config

**Add to `characterConfig.js`**:

```javascript
// Character progression state
export const CHARACTER_PROGRESSION = {
  currentLevel: 1,
  experience: 0,

  // Track ability score increases
  abilityBoosts: {
    1: ['STR', 'DEX', 'CON', 'WIS'],  // Already applied
    5: ['STR', 'DEX', 'CON', 'WIS'],
    10: [],  // Not yet applied
    15: [],
    20: []
  },

  // Track selected feats
  feats: {
    ancestry: {
      1: 'Gouging Horn',
      5: null,
      9: null,
      13: null,
      17: null
    },
    class: {
      1: 'Shield Block',
      2: null,
      // ... etc
    },
    skill: { /* ... */ },
    general: { /* ... */ }
  },

  // Track skill proficiency increases
  skillIncreases: {
    2: 'athletics',  // Increased to expert
    3: null,
    // ... etc
  }
};
```

### 4. Add Validation Layer

**File**: `src/utils/validation.js`

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

export function validateEquipmentChoice(item, character) {
  // Check proficiency
  // Check level
  // Check other requirements
  return { valid: true };
}
```

---

## Recommended Next Steps

### Immediate (This Week)
1. ✅ **Integrate NewGearTab** into main app
2. ✅ **Test thoroughly** with level changes
3. 🔄 **Update CombatTab** using same pattern
4. 🔄 **Create shared Tooltip component**

### Short Term (Next 2 Weeks)
5. 🔄 **Redesign SpellsTab** with spell browser
6. 🔄 **Create shared utility functions**
7. 🔄 **Add validation layer**
8. 🔄 **Update ProgressionTab**

### Medium Term (Next Month)
9. 🔄 **Redesign FeatsSkillsTab**
10. 🔄 **Add character export/import**
11. 🔄 **Create shared component library**
12. 🔄 **Add automated testing**

### Long Term (Future)
13. 🔄 **Multi-character support**
14. 🔄 **Online sync/cloud save**
15. 🔄 **Campaign management**
16. 🔄 **Party tracker**

---

## Example: CombatTab Redesign Outline

Here's what a redesigned CombatTab would look like:

```jsx
export default function NewCombatTab({ level, gear, getAbilityScore, getModifier, getProficiencyBonus, getEquipmentModifiers, BASE_ABILITY_SCORES }) {
  // Calculate ability modifiers
  const strMod = getModifier(getAbilityScore(BASE_ABILITY_SCORES.STR, 'STR', level));
  const dexMod = getModifier(getAbilityScore(BASE_ABILITY_SCORES.DEX, 'DEX', level));
  const wisMod = getModifier(getAbilityScore(BASE_ABILITY_SCORES.WIS, 'WIS', level));
  const conMod = getModifier(getAbilityScore(BASE_ABILITY_SCORES.CON, 'CON', level));

  // Get equipment bonuses
  const equipmentMods = getEquipmentModifiers(gear);

  // Calculate AC (with tooltip showing breakdown)
  const armorClass = calculateAC({
    level,
    dexMod,
    armor: gear.find(g => g.slot === 'armor' && g.equipped),
    proficiencyRank: getArmorProficiency(level),  // From CHARACTER_IDENTITY
    equipmentBonus: equipmentMods.ac.value
  });

  // Calculate attacks
  const attacks = [
    {
      name: 'Fist (Handwraps)',
      attackBonus: calculateAttackBonus({
        level,
        abilityMod: strMod,
        proficiencyRank: getWeaponProficiency(level),
        equipmentBonus: equipmentMods.attackBonus.value
      }),
      damage: calculateDamage({
        baseDice: '1d6',
        numDice: equipmentMods.damageDice.value,
        abilityMod: strMod,
        specialization: getSpecializationBonus(level),
        equipmentBonus: equipmentMods.damageBonus.value
      }),
      traits: ['Unarmed', 'Nonlethal', 'Agile', 'Finesse']
    },
    {
      name: 'Horns',
      attackBonus: calculateAttackBonus({
        level,
        abilityMod: strMod,
        proficiencyRank: getWeaponProficiency(level),
        equipmentBonus: equipmentMods.attackBonus.value
      }),
      damage: calculateDamage({
        baseDice: '1d8',
        numDice: equipmentMods.damageDice.value,
        abilityMod: strMod,
        specialization: getSpecializationBonus(level),
        equipmentBonus: equipmentMods.damageBonus.value
      }),
      traits: ['Unarmed', 'Deadly d8']
    }
  ];

  // Render with tooltips for each stat
  return (
    <div className="space-y-6">
      {/* AC Section with breakdown tooltip */}
      <StatCard
        title="Armor Class"
        value={armorClass}
        tooltip={<ACBreakdownTooltip {...acCalculation} />}
      />

      {/* Attacks Section */}
      {attacks.map(attack => (
        <AttackCard
          key={attack.name}
          attack={attack}
          tooltip={<AttackBreakdownTooltip {...attack} />}
        />
      ))}

      {/* Saves Section */}
      {/* Perception Section */}
      {/* Spell DC Section */}
    </div>
  );
}
```

---

## Testing Checklist

Before deploying any tab redesign:

- [ ] All calculations match Archives of Nethys
- [ ] Tooltips show correct source attribution
- [ ] Level changes update stats correctly
- [ ] Equipment changes affect stats in real-time
- [ ] No console errors
- [ ] Playwright tests pass (update as needed)
- [ ] Data persists to localStorage correctly
- [ ] Mobile responsive design works
- [ ] All links to Archives of Nethys work

---

## Questions or Issues?

If you encounter any issues during integration:

1. Check browser console for errors
2. Verify gear state has `slot` property
3. Ensure all helper functions are passed as props
4. Check that `pathfinderRules.js` has required data
5. Review `EQUIPMENT_DATABASE` in `characterConfig.js`

---

## Summary

The new equipment tab demonstrates a **scalable, maintainable pattern** for building PF2e-compliant character management features. By centralizing rules and calculations, we ensure:

✅ **Accuracy** - All stats traceable to official sources
✅ **Consistency** - Same logic across all tabs
✅ **Transparency** - Users see how calculations work
✅ **Maintainability** - Easy to update and extend
✅ **Testability** - Logic can be unit tested

This pattern should be applied to **all tabs** for a cohesive, rules-compliant application.
