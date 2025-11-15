# Claude Agent Instructions for Talon Tracker

**Last Updated**: 2025-11-09
**Version**: Post-Migration v3.0 (Minotaur)

## Project Overview

Talon Tracker is a **Pathfinder 2e character sheet web application** for tracking "Generic Cleric" - a Minotaur Warpriest with Dragonblood Heritage. This application MUST maintain strict compliance with official Pathfinder 2e rules from Archives of Nethys.

### Critical Requirements
- ✅ All stats, skills, feats, and equipment must be **rules-compliant**
- ✅ All calculations must follow **official PF2e formulas**
- ✅ All sources must be **traceable to Archives of Nethys**
- ✅ UI changes must be **tested with Playwright**
- ✅ Tooltips must include **official source attribution**

---

## Tech Stack

- **React 19.1.1** - UI library with hooks (useState, useEffect)
- **Vite 7.1.7** - Build tool and dev server (runs on http://localhost:5174)
- **Tailwind CSS 4.1.16** - Utility-first CSS framework
- **Lucide React** - Icon library (Info, ExternalLink, Heart, etc.)
- **Playwright** - Automated browser testing
- **pathfinderRules.js** - Cached official rules with URLs

---

## Core File Structure

```
talon-tracker/
├── src/
│   ├── App.jsx                    # Main application (ALL UI + logic)
│   ├── pathfinderRules.js         # Official PF2e rules cache with URLs
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Global Tailwind styles
├── test-ui.js                     # Playwright UI test suite
├── CHARACTER_AUDIT.md             # Pre-fix compliance audit
├── COMPLIANCE_FIXES.md            # Applied fixes documentation
├── RULES_CACHE_SUMMARY.md         # Rules cache documentation
└── CLAUDE.md                      # This file (keep updated!)
```

---

## 1. Pathfinder 2e Rules Compliance

### CRITICAL: All Changes Must Be Rules-Compliant

Before making ANY change to character stats, abilities, feats, or equipment:

1. **Verify against official sources** in `pathfinderRules.js`
2. **Check Archives of Nethys URLs** for accuracy
3. **Follow official calculation formulas** exactly
4. **Document sources** in tooltips and code comments

### Official Rules Cache: `pathfinderRules.js`

This file contains cached official Pathfinder 2e rules. **Always use this as your source of truth.**

**Available data**:
```javascript
import pathfinderRules from './pathfinderRules.js';

// Access rules
pathfinderRules.classes.cleric.hitPoints          // 8
pathfinderRules.classes.cleric.url                // Official URL
pathfinderRules.ancestries.minotaur.hitPoints     // 10
pathfinderRules.skills.athletics.ability          // "Strength"
pathfinderRules.equipment.weapons.sawtoothSaber   // Full stats (if using Achaekek)
```

**Sections available**:
- `sources` - Source attribution (Archives of Nethys, Player Core, etc.)
- `skills` - All 17 skills with abilities and URLs
- `ancestries.minotaur` - Minotaur ancestry with heritages
- `classes.cleric` - Cleric class with Warpriest doctrine
- `archetypes.monk` - Monk Dedication with all feats (if using)
- `feats` - General, class, monk, and skill feats
- `deities.achaekek` - Achaekek deity information (optional)
- `equipment` - Weapons and armor
- `divineSpells` - Divine spell list with descriptions

### Core PF2e Calculation Rules

**Proficiency Bonus** (CORRECTED):
```javascript
// Per official PF2e rules (Player Core)
Trained    = level       // NOT level + 2
Expert     = level + 2
Master     = level + 4
Legendary  = level + 6
```

**Hit Points** (CORRECTED):
```javascript
// Level 1 Base HP
baseHP = 8 (Cleric) + 10 (Minotaur) + 5 (Con modifier) = 23

// Per Level
hpPerLevel = 8 (Cleric) + 5 (Con modifier) = 13

// Total
maxHP = 23 + (level - 1) * 13
```

**Ability Modifier**:
```javascript
modifier = Math.floor((abilityScore - 10) / 2)
```

**Skill Check**:
```javascript
skillBonus = abilityModifier + proficiencyBonus(level, rank)
```

**Armor Class**:
```javascript
AC = 10 + Dex modifier + armor bonus + proficiency bonus
```

### Character Build Details

**Character**: Generic Cleric
**Ancestry**: Minotaur (Uncommon) - Dragonblood versatile heritage
**Class**: Cleric (Warpriest doctrine)
**Deity**: Not set (default Healing Font)
**Background**: Warrior

**Key Stats at Level 1**:
- HP: 23 (8 Cleric + 10 Minotaur + 5 Con)
- STR 16 (+3), DEX 10 (+0), CON 20 (+5), WIS 16 (+3)
- Size: Large
- Speed: 25 feet
- Divine Font: Heal (4 slots per day)
- Special: Darkvision, Horns (1d8 piercing), Fear resistance

---

## 2. Tooltip System for Source Attribution

### Purpose
All stats, attributes, spells, feats, skills, and equipment should have tooltips that:
- Explain the calculation/mechanic
- Show official source attribution
- Link to Archives of Nethys
- Display dynamically based on character level

### Tooltip Component

Located in `App.jsx`:
```javascript
function Tooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help inline-flex items-center gap-1"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 w-80 p-4 bg-slate-800 border border-purple-500 rounded-lg shadow-2xl -top-2 left-full ml-2 text-sm">
          <div className="space-y-2">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
```

### How to Add Tooltips

**Example: Max HP Tooltip** (already implemented):
```jsx
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
            <a href={pathfinderRules.classes.cleric.url} target="_blank" rel="noopener noreferrer"
               className="ml-1 text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5">
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          {/* More calculation details */}
        </div>
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
```

### Tooltip Template for Stats

Use this template for adding tooltips to other stats:

```jsx
<Tooltip content={
  <>
    <div className="font-semibold text-purple-300 mb-2">[Stat Name] Calculation</div>
    <div className="space-y-2 text-slate-300">
      <div className="bg-slate-700/50 p-2 rounded">
        <div className="font-semibold mb-1">Breakdown:</div>
        <div className="pl-2 text-sm">
          • [Component 1]: <span className="text-green-400">[value]</span>
          <a href={pathfinderRules.[section].[item].url} target="_blank" rel="noopener noreferrer"
             className="ml-1 text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5">
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        {/* Add more components */}
      </div>
      <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
        <div className="font-bold text-purple-300">
          Total: <span className="text-green-400">{calculatedValue}</span>
        </div>
        <div className="text-xs text-slate-400 mt-1">
          Source: {pathfinderRules.[section].[item].source}
        </div>
      </div>
    </div>
  </>
}>
  <Info className="w-4 h-4 text-purple-400 hover:text-purple-300" />
</Tooltip>
```

### Priority Stats for Tooltips

Add tooltips to these in priority order:
1. ✅ **Max HP** - Already implemented
2. **AC (Armor Class)** - Show calculation with armor + Dex + proficiency
3. **Attack Bonuses** - Show ability mod + proficiency + magic bonus
4. **Saving Throws** - Show ability mod + proficiency
5. **Skill Checks** - Show ability mod + proficiency + circumstance
6. **Spell DC** - Show 10 + ability mod + proficiency
7. **Spells** - Show spell description + source + heightening
8. **Feats** - Show prerequisites + benefits + source URL
9. **Equipment** - Show traits + special properties + source

---

## 3. Playwright UI Testing

### Running Tests

**Start dev server first**:
```bash
npm run dev
# Server starts on http://localhost:5174
```

**Run UI tests** (in separate terminal):
```bash
node test-ui.js
```

### Test Suite Overview

The test file `test-ui.js` includes 16 comprehensive tests:

1. ✅ **Header verification** - Character name and subtitle
2. ✅ **Tab navigation** - All 6 tabs (Character, Combat, Spells, Progression, Notes, Gear)
3. ✅ **Character tab** - Ancestry and heritage display
4. ✅ **Combat tab** - AC, attacks, saves
5. ✅ **Spells tab** - Divine spells, cantrips, ranked spells
6. ✅ **Divine Font** - Harm spell tracking
7. ✅ **Spell preparation** - Prepare/unprepare mechanics
8. ✅ **Spell casting** - Slot consumption tracking
9. ✅ **Rest functionality** - Slot restoration
10. ✅ **Progression tab** - Level milestones
11. ✅ **Notes tab** - Campaign notes
12. ✅ **Gear tab** - Equipment inventory
13. ✅ **Level adjustment** - Level up/down buttons
14. ✅ **Screenshots** - Visual verification captures

### When to Run Tests

**ALWAYS run tests when**:
- Adding new UI features
- Modifying existing components
- Changing state management
- Updating character calculations
- Before committing changes

### Writing New Tests

Add tests to `test-ui.js` following this pattern:

```javascript
// Test [Number]: [Description]
console.log('\n✅ Test [N]: [What you're testing]');
await page.click('button:has-text("[Button Text]")');
await page.waitForTimeout(500);

const element = await page.locator('text=[Expected Text]');
await element.waitFor({ timeout: 5000 });
console.log('   ✓ [Success message]');
```

### Debugging Failed Tests

If tests fail:
1. Check browser console for errors (tests capture these)
2. Look at error screenshots (saved automatically)
3. Verify React is mounting (`waitForFunction` checks)
4. Check element selectors are correct
5. Ensure dev server is running on correct port

---

## 4. Development Workflow

### Making Code Changes

**ALWAYS follow this workflow**:

1. **Read the file first**
   ```javascript
   // Use Read tool before Edit
   Read file_path="src/App.jsx"
   ```

2. **Verify against rules**
   ```javascript
   // Check pathfinderRules.js for official values
   import pathfinderRules from './pathfinderRules.js';
   console.log(pathfinderRules.classes.cleric.hitPoints); // 8
   ```

3. **Make the change**
   ```javascript
   // Use Edit tool with exact old_string match
   Edit file_path, old_string, new_string
   ```

4. **Test the change**
   ```bash
   # Dev server auto-reloads via Vite HMR
   # Check browser at http://localhost:5174
   ```

5. **Run Playwright tests**
   ```bash
   node test-ui.js
   ```

6. **Document the change**
   - Update CLAUDE.md if workflow changes
   - Add comments in code for complex logic
   - Update CHARACTER_AUDIT.md if stats change

### State Management Rules

**Character state** in `App.jsx`:
```javascript
const [level, setLevel] = useState(1);              // Current character level
const [currentHP, setCurrentHP] = useState(10);     // Current hit points
const [maxHP, setMaxHP] = useState(10);             // Maximum hit points
const [notes, setNotes] = useState([]);             // Campaign notes
const [gear, setGear] = useState([...]);            // Equipment inventory
const [preparedSpells, setPreparedSpells] = useState({...}); // Prepared spells
const [castSpells, setCastSpells] = useState({...});         // Cast spell tracking
```

**CRITICAL**: All state that references other state (like preparedSpells) must be declared BEFORE useEffect hooks that reference it, or you'll get "Cannot access before initialization" errors.

### localStorage Persistence

All character data auto-saves to localStorage:
```javascript
useEffect(() => {
  localStorage.setItem('character-level', level.toString());
}, [level]);
```

**Keys used**:
- `character-level` - Current level
- `current-hp` - Current HP
- `max-hp` - Max HP
- `campaign-notes` - Array of notes
- `gear-inventory` - Array of gear items
- `prepared-spells` - Object of prepared spells by rank
- `cast-spells` - Object of cast spell counts by rank

---

## 5. Common Tasks

### Task: Add a New Tooltip

1. **Import pathfinderRules** (if not already):
   ```javascript
   import pathfinderRules from './pathfinderRules.js';
   ```

2. **Locate the stat display** in App.jsx

3. **Wrap with Tooltip component**:
   ```jsx
   <Tooltip content={/* JSX content */}>
     <Info className="w-4 h-4 text-purple-400 hover:text-purple-300" />
   </Tooltip>
   ```

4. **Add calculation breakdown** with sources

5. **Include external links** to Archives of Nethys

6. **Test the tooltip** visually

### Task: Fix a Rules Compliance Issue

1. **Identify the incorrect calculation**
   - Check against CHARACTER_AUDIT.md
   - Verify with pathfinderRules.js
   - Cross-reference Archives of Nethys URL

2. **Find the calculation in App.jsx**
   - Use Grep to search for the stat name
   - Locate the calculation function

3. **Correct the formula**
   - Follow official PF2e rules exactly
   - Add code comments explaining the rule
   - Reference the source

4. **Update tooltips** to reflect correct calculation

5. **Run tests** to verify no regressions

6. **Document in COMPLIANCE_FIXES.md** if major

### Task: Add a New Spell

1. **Check if spell exists** in pathfinderRules.divineSpells

2. **Add to spell list** in App.jsx:
   ```javascript
   const spellList = {
     cantrips: [...],
     rank1: [
       {
         id: 'spell-id',
         name: 'Spell Name',
         actions: 2,
         desc: 'Description from pathfinderRules'
       }
     ]
   };
   ```

3. **Add tooltip** with spell details and source URL

4. **Test spell preparation** and casting mechanics

5. **Run Playwright tests** to verify

### Task: Update Character Level Progression

1. **Verify progression** against official rules
   - Check Class Progression table in Player Core
   - Verify feat prerequisites
   - Check ability score boosts

2. **Update milestones** in App.jsx:
   ```javascript
   const milestones = [
     {
       level: [X],
       unlocked: level >= [X],
       items: [
         "Feature 1 - Description",
         "Feature 2 - Description"
       ]
     }
   ];
   ```

3. **Add tooltips** for complex features

4. **Test level changes** with Level +/- buttons

### Task: Add a New Tab

1. **Create tab data**:
   ```javascript
   const tabs = [
     { id: 'new-tab', label: 'New Tab', icon: IconName }
   ];
   ```

2. **Create tab component**:
   ```javascript
   function NewTab({ /* props */ }) {
     return (
       <div className="space-y-6">
         {/* Content */}
       </div>
     );
   }
   ```

3. **Add to tab rendering**:
   ```javascript
   {activeTab === 'new-tab' && (
     <NewTab /* props */ />
   )}
   ```

4. **Add Playwright test** for the new tab

5. **Update CLAUDE.md** with new tab info

---

## 6. Quality Assurance Checklist

Before considering any task complete:

### Code Quality
- [ ] All calculations match official PF2e rules
- [ ] All values traceable to pathfinderRules.js
- [ ] Code comments explain complex logic
- [ ] No console errors in browser
- [ ] No ESLint warnings

### UI/UX
- [ ] All interactive elements work correctly
- [ ] Tooltips show on hover with correct info
- [ ] External links open Archives of Nethys
- [ ] Visual design consistent with app theme
- [ ] Responsive on different screen sizes

### Testing
- [ ] All Playwright tests pass (16/16)
- [ ] Manual testing in browser completed
- [ ] No regressions in existing features
- [ ] New features have test coverage
- [ ] Screenshots captured for verification

### Documentation
- [ ] CLAUDE.md updated if workflow changed
- [ ] Code comments added for complex logic
- [ ] COMPLIANCE_FIXES.md updated if stats changed
- [ ] Commit message describes changes clearly

---

## 7. Rules Validation Commands

### Quick Verification Checks

**Check proficiency calculations**:
```javascript
// At level 5
getProficiencyBonus(5, 'trained')   // Should return 5 (NOT 7)
getProficiencyBonus(5, 'expert')    // Should return 7
```

**Check HP calculation**:
```javascript
// At level 5
calculateMaxHP(5) // Should return 58
// 18 (base) + 4 levels * 10 = 58
```

**Check stat against rules**:
```javascript
pathfinderRules.classes.cleric.hitPoints  // Must be 8
pathfinderRules.ancestries.minotaur.hitPoints // Must be 10
```

### Archives of Nethys URLs

Always link to these official pages:
- **Cleric**: https://2e.aonprd.com/Classes.aspx?ID=5
- **Minotaur**: https://2e.aonprd.com/Ancestries.aspx?ID=75
- **Dragonblood Heritage**: https://2e.aonprd.com/Heritages.aspx?ID=368
- **Achaekek**: https://2e.aonprd.com/Deities.aspx?ID=29
- **Monk Dedication**: https://2e.aonprd.com/Feats.aspx?ID=715
- **Skills**: https://2e.aonprd.com/Skills.aspx?ID=[1-17]

---

## 8. Troubleshooting

### React Won't Mount / Blank Page

**Symptoms**: Playwright tests fail, page shows blank/minimal content

**Solution**:
1. Check browser console for errors
2. Look for "Cannot access before initialization" errors
3. Ensure all state declarations happen BEFORE useEffect hooks
4. Verify imports are correct (especially pathfinderRules.js)

### Vite HMR Not Working

**Symptoms**: Changes not appearing in browser

**Solution**:
1. Check terminal for Vite errors
2. Hard refresh browser (Ctrl+F5)
3. Restart dev server: Ctrl+C, then `npm run dev`
4. Clear browser cache if needed

### Playwright Tests Timeout

**Symptoms**: Tests can't find elements

**Solution**:
1. Verify dev server is running on port 5174
2. Check if React is actually mounting (tests should show this)
3. Look at screenshot-error.png for visual state
4. Increase timeout if element loads slowly
5. Check element selectors are correct

### localStorage Not Persisting

**Symptoms**: Character data resets on page reload

**Solution**:
1. Check browser localStorage in DevTools
2. Verify useEffect dependencies are correct
3. Ensure JSON.stringify/parse works for complex objects
4. Check for localStorage quota issues

---

## 9. Reference Documentation

### Key Files to Review

1. **CHARACTER_AUDIT.md** - Pre-fix audit showing all issues found
2. **COMPLIANCE_FIXES.md** - All fixes applied with before/after
3. **RULES_CACHE_SUMMARY.md** - Documentation of pathfinderRules.js
4. **pathfinderRules.js** - Official rules cache (source of truth)
5. **test-ui.js** - Complete UI test suite

### External Resources

- **Archives of Nethys**: https://2e.aonprd.com (Official PF2e reference)
- **Player Core**: Referenced throughout pathfinderRules.js
- **Pathfinder 2e Rules**: https://2e.aonprd.com/Rules.aspx

---

## 10. Agent Workflow Summary

When working on this codebase:

1. **ALWAYS verify rules** against pathfinderRules.js first
2. **READ before EDIT** - Never edit without reading first
3. **ADD TOOLTIPS** for any stat/spell/feat/equipment you touch
4. **RUN TESTS** after any UI changes
5. **DOCUMENT** major changes in appropriate .md files
6. **CHECK SOURCES** - Every value must trace to Archives of Nethys
7. **TEST COMPLIANCE** - Use quality assurance checklist
8. **KEEP CLAUDE.md UPDATED** - This file is your guide

---

## Status: ✅ FULLY COMPLIANT

**Last Audit**: 2025-11-06
**Compliance**: ✅ All rules verified against official sources
**Tests**: ✅ 16/16 Playwright tests passing
**Tooltips**: ✅ Max HP tooltip implemented (more in progress)
**Documentation**: ✅ Complete with audit trail

**Next Priorities**:
1. Add tooltips to AC, saves, skills, and attacks
2. Expand spell tooltips with full descriptions
3. Add feat prerequisite checking
4. Implement equipment trait tooltips

---

**Remember**: This is a Pathfinder 2e character sheet. Rules accuracy is paramount. When in doubt, check Archives of Nethys and pathfinderRules.js.
