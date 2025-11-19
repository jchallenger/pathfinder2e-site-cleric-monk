# Tab Redesign Integration Roadmap

**Created**: 2025-11-18
**Status**: 📋 Phase 1 Complete - Ready for Phase 2 Integration
**Strategy**: Option B - All boilerplates created, integrate and test one at a time

---

## 🎯 Current Status

### ✅ Phase 1: Boilerplate Creation - COMPLETE

All new tab files have been created following the centralized pattern:

| Component | File | Lines | Status |
|-----------|------|-------|--------|
| **GearTab** | [src/NewGearTab.jsx](src/NewGearTab.jsx) | 780 | ✅ **Integrated & Tested** (12/12 tests) |
| **CombatTab** | [src/NewCombatTab.jsx](src/NewCombatTab.jsx) | 650 | ✅ Boilerplate Complete |
| **SpellsTab** | [src/NewSpellsTab.jsx](src/NewSpellsTab.jsx) | 850 | ✅ Boilerplate Complete |
| **FeatsSkillsTab** | [src/NewFeatsSkillsTab.jsx](src/NewFeatsSkillsTab.jsx) | 770 | ✅ Boilerplate Complete |
| **ProgressionTab** | [src/NewProgressionTab.jsx](src/NewProgressionTab.jsx) | 600 | ✅ Boilerplate Complete |
| **Shared Components** | [src/components/shared/](src/components/shared/) | ~550 | ✅ Library Complete |

**Total New Code**: ~4,200 lines of centralized, rules-driven components

---

## 📋 Phase 2: Systematic Integration

Integrate and test each tab one at a time, ensuring no regressions.

### Integration Order (Priority):

1. 🔜 **NewCombatTab** - Core combat stats (AC, saves, attacks)
2. 🔜 **NewSpellsTab** - Spell management and divine font
3. 🔜 **NewFeatsSkillsTab** - Skills and feat selection
4. 🔜 **NewProgressionTab** - Level timeline and progression

---

## 🔧 Integration Workflow (Per Tab)

For each tab, follow these steps in order:

### Step 1: Preparation
- [ ] Review the boilerplate file
- [ ] Identify all required props
- [ ] Check for any state structure changes needed
- [ ] Read current implementation in App.jsx

### Step 2: Import Addition
- [ ] Add import statement to App.jsx
```javascript
// Example for NewCombatTab
import NewCombatTab from './NewCombatTab.jsx';
```

### Step 3: State Structure Updates
- [ ] Update any state that needs restructuring
- [ ] Ensure localStorage keys are compatible
- [ ] Add any new state variables required
- [ ] Preserve existing data where possible

### Step 4: Replace Tab Render
- [ ] Locate old tab render in App.jsx
- [ ] Replace with new tab component
- [ ] Pass all required props
- [ ] Remove old tab component code

### Step 5: Cleanup
- [ ] Remove unused state variables
- [ ] Remove old helper functions (if no longer used)
- [ ] Clean up any orphaned code
- [ ] Verify no console errors

### Step 6: Testing
- [ ] Create test file: `test-[tab]-tab.cjs`
- [ ] Write minimum 10 comprehensive tests
- [ ] Run test suite
- [ ] Verify all tests pass
- [ ] Test manually in browser

### Step 7: Documentation
- [ ] Update integration status document
- [ ] Document any issues encountered
- [ ] Update CLAUDE.md if workflow changes
- [ ] Commit changes with descriptive message

---

## 🧪 Tab 1: NewCombatTab Integration

**Priority**: 🔥 High (Core combat mechanics)
**Estimated Time**: 30-45 minutes
**Complexity**: ⭐⭐ Medium

### Required Props:
```javascript
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

### Integration Steps:

#### 1. Add Import (App.jsx)
```javascript
// Around line 13
import NewCombatTab from './NewCombatTab.jsx';
```

#### 2. State Updates
No state changes required - all props already exist in App.jsx

#### 3. Replace Old CombatTab
Find around line 1427 in App.jsx:
```javascript
// REPLACE THIS:
{activeTab === 'combat' && (
  <div className="space-y-6">
    {/* Old combat tab content */}
  </div>
)}

// WITH THIS:
{activeTab === 'combat' && (
  <NewCombatTab
    level={level}
    gear={gear}
    getAbilityScore={getAbilityScore}
    getModifier={getModifier}
    getProficiencyBonus={getProficiencyBonus}
    getEquipmentModifiers={getEquipmentModifiers}
    BASE_ABILITY_SCORES={BASE_ABILITY_SCORES}
  />
)}
```

#### 4. Test Plan
Create `test-combat-tab.cjs`:

```javascript
// Minimum 12 tests:
✅ Test 1: Navigate to Combat Tab
✅ Test 2: Verify Armor Class displays
✅ Test 3: Verify AC tooltip shows breakdown
✅ Test 4: Verify Fist attack displays
✅ Test 5: Verify Horns attack displays
✅ Test 6: Verify Fortitude save
✅ Test 7: Verify Reflex save
✅ Test 8: Verify Will save
✅ Test 9: Verify Perception stat
✅ Test 10: Verify Speed calculation
✅ Test 11: Verify Spell DC
✅ Test 12: Verify level changes update stats
```

#### 5. Expected Results
- AC displays correctly with shield bonus
- Attacks show proper bonuses from handwraps runes
- Saves calculate with correct proficiency progression
- All tooltips show detailed breakdowns
- Stats update dynamically when level changes

### Potential Issues:
- None expected - all calculations already centralized
- Gear prop structure compatible (already updated for NewGearTab)

---

## 🧪 Tab 2: NewSpellsTab Integration

**Priority**: 🔥 High (Cleric primary feature)
**Estimated Time**: 45-60 minutes
**Complexity**: ⭐⭐⭐ High

### Required Props:
```javascript
<NewSpellsTab
  level={level}
  divineFontChoice={divineFontChoice}
  setDivineFontChoice={setDivineFontChoice}
  preparedSpells={preparedSpells}
  setPreparedSpells={setPreparedSpells}
  castSpells={castSpells}
  setCastSpells={setCastSpells}
  handleRest={handleRest}
  getAbilityScore={getAbilityScore}
  getModifier={getModifier}
  getProficiencyBonus={getProficiencyBonus}
  BASE_ABILITY_SCORES={BASE_ABILITY_SCORES}
/>
```

### Integration Steps:

#### 1. Add Import (App.jsx)
```javascript
import NewSpellsTab from './NewSpellsTab.jsx';
```

#### 2. State Updates
**Check if these exist** (they should already be in App.jsx):
- `divineFontChoice` - String ('heal' or 'harm')
- `preparedSpells` - Object with spell IDs by rank
- `castSpells` - Object with cast counts by rank
- `handleRest` - Function to reset spell slots

**If any missing, add them:**
```javascript
const [divineFontChoice, setDivineFontChoice] = useState(() => {
  const saved = localStorage.getItem('divine-font-choice');
  return saved || 'heal';
});

useEffect(() => {
  localStorage.setItem('divine-font-choice', divineFontChoice);
}, [divineFontChoice]);
```

#### 3. Replace Old SpellsTab
Find in App.jsx where SpellsTab is rendered and replace entire section.

#### 4. Test Plan
Create `test-spells-tab.cjs`:

```javascript
// Minimum 15 tests:
✅ Test 1: Navigate to Spells Tab
✅ Test 2: Verify Spell DC displays
✅ Test 3: Verify Spell Attack displays
✅ Test 4: Verify Divine Font choice (Heal)
✅ Test 5: Verify Divine Font slots
✅ Test 6: Verify Cantrips section
✅ Test 7: Verify Rank 1 slots
✅ Test 8: Verify Rank 2 slots (level 3+)
✅ Test 9: Open Spell Browser
✅ Test 10: Filter spells by rank
✅ Test 11: Prepare a spell
✅ Test 12: Cast a prepared spell
✅ Test 13: Verify slot consumption
✅ Test 14: Rest to restore slots
✅ Test 15: Verify spell detail modal
```

#### 5. Expected Results
- Spell slots show correct counts for level
- Divine font slots calculate correctly (4/5/6 based on level)
- Spell browser filters work
- Preparation mechanic functions
- Casting consumes slots
- Rest restores all slots

### Potential Issues:
- May need to migrate spell data format
- Divine font state might need initialization
- Prepared spells structure might differ

**Solution**: Check existing state structure and adapt NewSpellsTab if needed, or migrate data.

---

## 🧪 Tab 3: NewFeatsSkillsTab Integration

**Priority**: 🔶 Medium (Character building features)
**Estimated Time**: 45-60 minutes
**Complexity**: ⭐⭐⭐ High

### Required Props:
```javascript
<NewFeatsSkillsTab
  level={level}
  skillProficiencies={skillProficiencies}
  setSkillProficiencies={setSkillProficiencies}
  selectedFeats={selectedFeats}
  setSelectedFeats={setSelectedFeats}
  getAbilityScore={getAbilityScore}
  getModifier={getModifier}
  getProficiencyBonus={getProficiencyBonus}
  BASE_ABILITY_SCORES={BASE_ABILITY_SCORES}
/>
```

### Integration Steps:

#### 1. Add Import (App.jsx)
```javascript
import NewFeatsSkillsTab from './NewFeatsSkillsTab.jsx';
```

#### 2. State Updates
**Check for these state variables**:

```javascript
// Skill proficiencies state
const [skillProficiencies, setSkillProficiencies] = useState(() => {
  const saved = localStorage.getItem('skill-proficiencies');
  return saved ? JSON.parse(saved) : {
    acrobatics: { rank: 'trained' },
    athletics: { rank: 'trained' },
    // ... all 17 skills
  };
});

// Selected feats state
const [selectedFeats, setSelectedFeats] = useState(() => {
  const saved = localStorage.getItem('selected-feats');
  return saved ? JSON.parse(saved) : [];
});

// localStorage persistence
useEffect(() => {
  localStorage.setItem('skill-proficiencies', JSON.stringify(skillProficiencies));
}, [skillProficiencies]);

useEffect(() => {
  localStorage.setItem('selected-feats', JSON.stringify(selectedFeats));
}, [selectedFeats]);
```

#### 3. Replace Old Tab
Replace the feats/skills tab section in App.jsx.

#### 4. Test Plan
Create `test-feats-skills-tab.cjs`:

```javascript
// Minimum 15 tests:
✅ Test 1: Navigate to Feats & Skills Tab
✅ Test 2: Verify all 17 skills display
✅ Test 3: Verify Athletics bonus calculation
✅ Test 4: Verify Religion bonus (trained)
✅ Test 5: Verify skill proficiency indicators
✅ Test 6: Open skill detail tooltip
✅ Test 7: Verify class feats section
✅ Test 8: Verify ancestry feats section
✅ Test 9: Verify general feats section
✅ Test 10: Verify skill feats section
✅ Test 11: Open feat browser
✅ Test 12: Filter feats by type
✅ Test 13: View feat prerequisites
✅ Test 14: Select a feat
✅ Test 15: Verify feat appears in selected list
```

#### 5. Expected Results
- All 17 skills display with correct bonuses
- Proficiency ranks affect bonuses correctly
- Feat browser shows all feat types
- Prerequisite validation works
- Feat selection persists

### Potential Issues:
- Skill proficiency state might not exist
- Feat state structure might differ
- Need to handle skill increases by level

**Solution**: Initialize state if missing, migrate data format if needed.

---

## 🧪 Tab 4: NewProgressionTab Integration

**Priority**: 🔷 Low (Informational, not interactive)
**Estimated Time**: 20-30 minutes
**Complexity**: ⭐ Low

### Required Props:
```javascript
<NewProgressionTab
  level={level}
  abilityBoosts={abilityBoosts}
  getAbilityScore={getAbilityScore}
  BASE_ABILITY_SCORES={BASE_ABILITY_SCORES}
/>
```

### Integration Steps:

#### 1. Add Import (App.jsx)
```javascript
import NewProgressionTab from './NewProgressionTab.jsx';
```

#### 2. State Updates
**Check for abilityBoosts state**:

```javascript
const [abilityBoosts, setAbilityBoosts] = useState(() => {
  const saved = localStorage.getItem('ability-boosts');
  return saved ? JSON.parse(saved) : {
    5: [],   // Level 5 boosts
    10: [],  // Level 10 boosts
    15: [],  // Level 15 boosts
    20: []   // Level 20 boosts
  };
});

useEffect(() => {
  localStorage.setItem('ability-boosts', JSON.stringify(abilityBoosts));
}, [abilityBoosts]);
```

#### 3. Replace Old Tab
Replace progression tab in App.jsx.

#### 4. Test Plan
Create `test-progression-tab.cjs`:

```javascript
// Minimum 10 tests:
✅ Test 1: Navigate to Progression Tab
✅ Test 2: Verify current level highlight
✅ Test 3: Verify level 1 features
✅ Test 4: Verify level 5 ability boost tracker
✅ Test 5: Verify level 7 expert proficiency
✅ Test 6: Verify level 10 features
✅ Test 7: Verify proficiency progression display
✅ Test 8: Verify all 20 levels render
✅ Test 9: Verify unlocked vs locked levels
✅ Test 10: Verify level changes update display
```

#### 5. Expected Results
- All 20 levels display
- Current level highlighted
- Ability boost tracker shows at levels 5, 10, 15, 20
- Proficiency progression displays correctly
- Level features show class-specific info

### Potential Issues:
- abilityBoosts state might not exist

**Solution**: Initialize with empty object if missing.

---

## 📊 Testing Matrix

After each integration, verify these cross-tab interactions:

| Feature | Tabs Affected | Test |
|---------|---------------|------|
| **Level Change** | All | Stats/slots/features update everywhere |
| **Equipment Change** | Gear → Combat | AC/attack bonuses update |
| **Rune Addition** | Gear → Combat | Attack/damage bonuses update |
| **Spell Preparation** | Spells | Slots consumed correctly |
| **Rest** | Spells | All slots restored |
| **Ability Boosts** | Progression → All | Stat changes propagate |
| **Skill Increases** | Feats & Skills | Bonuses recalculate |

---

## 🎯 Success Criteria

Each tab integration is considered complete when:

### Functionality:
- ✅ All features from old tab preserved or improved
- ✅ All calculations correct and rules-compliant
- ✅ All interactive elements work (buttons, modals, etc.)
- ✅ State persists to localStorage correctly
- ✅ No console errors or warnings

### Testing:
- ✅ Minimum 10 automated tests written
- ✅ All tests pass (100%)
- ✅ Manual testing completed
- ✅ Cross-tab interactions verified
- ✅ Screenshots captured for documentation

### Quality:
- ✅ All tooltips show calculation breakdowns
- ✅ All sources link to Archives of Nethys
- ✅ Component follows established pattern
- ✅ Code is clean and well-commented
- ✅ No duplicated logic or data

### Documentation:
- ✅ Integration documented in this file
- ✅ Any issues/solutions recorded
- ✅ Test results saved
- ✅ Commit message clear and descriptive

---

## 🚀 Integration Schedule

**Recommended Timeline** (assuming 1 tab per session):

| Day | Tab | Time | Complexity |
|-----|-----|------|------------|
| **Day 1** | NewCombatTab | 30-45 min | ⭐⭐ Medium |
| **Day 2** | NewSpellsTab | 45-60 min | ⭐⭐⭐ High |
| **Day 3** | NewFeatsSkillsTab | 45-60 min | ⭐⭐⭐ High |
| **Day 4** | NewProgressionTab | 20-30 min | ⭐ Low |
| **Day 5** | Cross-tab testing & polish | 30-45 min | ⭐⭐ Medium |

**Total Integration Time**: ~4-5 hours across 5 sessions

---

## 📝 Post-Integration Tasks

After all tabs are integrated:

### 1. Shared Component Migration
- Replace inline Tooltip implementations with shared Tooltip
- Replace inline stat displays with StatCard
- Replace inline modals with Modal component
- Update imports across all tabs

### 2. Code Cleanup
- Remove all old tab code from App.jsx
- Remove unused helper functions
- Remove unused state variables
- Clean up localStorage keys

### 3. Performance Optimization
- Check for unnecessary re-renders
- Optimize large lists (spell browser, feat browser)
- Add loading states if needed
- Consider code splitting for modals

### 4. Final Testing
- Run all test suites (5 total)
- Verify 60+ total tests pass
- Test on different screen sizes
- Test all tab transitions
- Test all cross-tab interactions

### 5. Documentation Update
- Update CLAUDE.md with new architecture
- Document all state variables
- Update testing documentation
- Create final completion summary

---

## 🐛 Common Integration Issues

### Issue 1: Props Not Found
**Symptom**: "undefined is not a function" or "cannot read property of undefined"

**Solution**: Verify all required props exist in App.jsx and are passed correctly

### Issue 2: State Structure Mismatch
**Symptom**: Component expects different data format

**Solution**: Either adapt component to existing format or migrate data with conversion function

### Issue 3: localStorage Conflicts
**Symptom**: Data not persisting or wrong data loading

**Solution**: Check localStorage keys are unique and useEffect dependencies are correct

### Issue 4: Calculation Differences
**Symptom**: Stats show different values than old tab

**Solution**: Verify calculations follow official PF2e rules in pathfinderRules.js

### Issue 5: Tooltip/Modal Not Appearing
**Symptom**: Hover/click doesn't show tooltip or modal

**Solution**: Check z-index, positioning classes, and state management

---

## 📈 Progress Tracking

Update this section after each tab integration:

### Integration Status:

- [x] ✅ **NewGearTab** - Integrated 2025-11-18 (12/12 tests passing)
- [ ] 🔜 **NewCombatTab** - Not yet integrated
- [ ] 🔜 **NewSpellsTab** - Not yet integrated
- [ ] 🔜 **NewFeatsSkillsTab** - Not yet integrated
- [ ] 🔜 **NewProgressionTab** - Not yet integrated

### Test Results:

| Tab | Tests | Passing | Status |
|-----|-------|---------|--------|
| GearTab | 12 | 12 | ✅ 100% |
| CombatTab | - | - | ⏳ Pending |
| SpellsTab | - | - | ⏳ Pending |
| FeatsSkillsTab | - | - | ⏳ Pending |
| ProgressionTab | - | - | ⏳ Pending |

**Total**: 12/60+ tests (20% complete)

---

## 🎉 Completion Criteria

The entire tab redesign project is complete when:

- ✅ All 5 tabs integrated and tested
- ✅ All 60+ tests passing (100%)
- ✅ Shared components library in use
- ✅ All old tab code removed from App.jsx
- ✅ Cross-tab interactions verified
- ✅ Documentation complete and up-to-date
- ✅ No console errors or warnings
- ✅ Performance is good (no lag or slow renders)
- ✅ All features rules-compliant
- ✅ All sources properly attributed

---

## 📚 Related Documentation

- **[TAB_REDESIGN_PLAN.md](TAB_REDESIGN_PLAN.md)** - Original comprehensive plan
- **[BOILERPLATE_CREATED.md](BOILERPLATE_CREATED.md)** - Boilerplate creation summary
- **[INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)** - NewGearTab integration report
- **[src/components/shared/README.md](src/components/shared/README.md)** - Shared components docs
- **[CLAUDE.md](CLAUDE.md)** - Development workflow and guidelines

---

## ✅ Current Phase Summary

**Phase 1 Status**: ✅ **COMPLETE**

**Deliverables**:
- ✅ 5 new tab boilerplates created (~3,650 lines)
- ✅ Shared components library created (~550 lines)
- ✅ 1 tab fully integrated and tested (NewGearTab)
- ✅ Comprehensive documentation
- ✅ Clear integration roadmap

**Phase 2 Status**: 📋 **READY TO BEGIN**

**Next Action**: Integrate NewCombatTab following the workflow above

**Estimated Completion**: 4-5 hours over 4-5 sessions

---

**Ready to proceed with integration!** 🚀
