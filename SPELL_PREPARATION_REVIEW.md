# Spell Preparation Rules Review

**Date**: 2025-11-18
**Status**: ⚠️ **RULES COMPLIANCE ISSUE FOUND**

## Executive Summary

The current spell preparation and casting system **does not comply with official Pathfinder 2e rules**. The implementation treats prepared spells like a resource pool (similar to spontaneous casters), when PF2e prepared casters work fundamentally differently.

---

## Official Pathfinder 2e Rules

**Source**: [Archives of Nethys - Prepared Spells](https://2e.aonprd.com/Rules.aspx?ID=271)

### How Prepared Spellcasting Works:

1. **Daily Preparation**:
   - At the start of each day, select specific spells to fill your spell slots
   - You prepare individual instances of spells (not just "marking" spells as available)

2. **Preparing Same Spell Multiple Times**:
   - ✅ **You CAN prepare the same spell in multiple slots**
   - Example: A level 3 Cleric with 3 rank-1 slots could prepare "Bless" in all three slots

3. **Casting Prepared Spells**:
   - ❌ **Each prepared spell is EXPENDED after a single casting**
   - When you cast a spell, that specific prepared instance is consumed
   - You can only cast what you specifically prepared

4. **Cantrips Exception**:
   - ✅ Once prepared, cantrips can be cast unlimited times
   - Cantrips are NOT expended when cast

5. **Rest and Re-preparation**:
   - After resting (8 hours), you can prepare spells again
   - Takes ~1 hour of daily preparation
   - Can only prepare once per day

---

## Current Implementation Analysis

### File: `src/App.jsx`

#### State Management (Lines 580-605)
```javascript
const [preparedSpells, setPreparedSpells] = useState({
  cantrips: ['divine-lance', 'shield', ...],
  rank1: ['bless', 'command', 'harm'],
  // ... other ranks
});

const [castSpells, setCastSpells] = useState({
  rank1: 0,
  rank2: 0,
  // ... tracks COUNT of spells cast per rank
});
```

**Issue**: Uses two separate tracking mechanisms:
1. `preparedSpells` - List of spell IDs marked as "prepared"
2. `castSpells` - Counter of how many times spells were cast per rank

#### Toggle Preparation Function (Lines 1078-1093)
```javascript
const togglePreparedSpell = (rank, spellId) => {
  setPreparedSpells(prev => {
    const current = prev[rank] || [];
    const maxSlots = getMaxSpellSlots(level, rank);

    // Adds/removes spell ID from list
    if (current.includes(spellId)) {
      return { ...prev, [rank]: current.filter(id => id !== spellId) };
    } else if (current.length < maxSlots) {
      return { ...prev, [rank]: [...current, spellId] };
    }
  });
};
```

**Issue**:
- ❌ Stores spell IDs in an array, but doesn't track individual prepared instances
- ✅ Does allow same spell multiple times (adds ID multiple times to array)
- ❌ Doesn't properly represent "slots" filled with specific spells

#### Cast Spell Function (Lines 1050-1055)
```javascript
const castSpell = (rank) => {
  setCastSpells(prev => ({
    ...prev,
    [rank]: Math.min(prev[rank] + 1, getMaxSpellSlots(level, rank))
  }));
};
```

**❌ MAJOR ISSUE**:
- Only increments a counter
- **Does NOT remove the spell from prepared list**
- **Does NOT track WHICH spell was cast**
- Allows casting ANY prepared spell as long as counter hasn't reached max

**This is INCORRECT per PF2e rules!**

#### Rest Function (Lines 1062-1073)
```javascript
const restSpells = () => {
  setCastSpells({
    rank1: 0, rank2: 0, rank3: 0, // ... resets counters to 0
  });
};
```

**Issue**:
- ✅ Resets cast counters
- ❌ Doesn't trigger re-preparation (though UI might handle this separately)
- ❌ Doesn't clear `preparedSpells` state

---

### File: `src/NewSpellsTab.jsx`

#### Toggle Preparation (Lines 383-405)
```javascript
const togglePreparedSpell = (spellId, rank) => {
  setPreparedSpells(prev => {
    const rankSpells = prev[rank] || [];
    const isPrepared = rankSpells.includes(spellId);
    const maxPrepared = getMaxSpellSlots(rank);

    if (isPrepared) {
      return { ...prev, [rank]: rankSpells.filter(id => id !== spellId) };
    } else if (rankSpells.length >= maxPrepared) {
      return prev; // At max
    } else {
      return { ...prev, [rank]: [...rankSpells, spellId] };
    }
  });
};
```

**Same issues as App.jsx**

#### Cast Spell (Lines 408-418)
```javascript
const castSpell = (rank) => {
  const maxSlots = getMaxSpellSlots(rank);
  const current = castSpells[rank] || 0;

  if (current < maxSlots) {
    setCastSpells(prev => ({ ...prev, [rank]: current + 1 }));
  }
};
```

**❌ SAME MAJOR ISSUE**: Only tracks counters, doesn't consume prepared spells

---

## What the Implementation Actually Does (WRONG)

### Current Behavior:
1. **Preparation Phase**:
   - User clicks "Prepare" on spells to add them to a list
   - Limit: Can't prepare more spell IDs than available slots
   - Can prepare same spell multiple times (adds ID multiple times)

2. **Casting Phase**:
   - User clicks "Cast" button (not tied to specific spell)
   - Increments a generic counter for that rank
   - Can cast ANY prepared spell as long as counter < max slots
   - **Prepared spell list never changes**

3. **Rest**:
   - Resets cast counters to 0
   - Can cast prepared spells again without re-preparing

### Example of Current (Wrong) Behavior:
```
Level 3 Cleric with 3 Rank-1 slots

Prepare:
- Bless (slot 1)
- Bless (slot 2)
- Command (slot 3)

Cast:
- Cast Bless → counter becomes 1/3
- Cast Command → counter becomes 2/3
- Cast Heal (WAIT - Heal wasn't prepared, but system allows it!) ❌
- Cast Bless again → counter becomes 3/3 ❌ (should only have 2 Bless prepared!)

This is WRONG!
```

---

## What SHOULD Happen (Correct PF2e Rules)

### Correct Behavior:

1. **Preparation Phase**:
   - Each slot is filled with a specific spell instance
   - Data structure: Array of spell IDs (length = max slots)
   - Example: `rank1: ['bless', 'bless', 'command']`

2. **Casting Phase**:
   - User clicks "Cast" on a SPECIFIC prepared spell
   - That spell instance is REMOVED from the prepared array
   - Example: Cast first Bless → `rank1: ['bless', 'command']` (now 2 spells left)

3. **Rest**:
   - Prepared spell arrays are cleared
   - User must re-prepare spells for the new day

### Example of Correct Behavior:
```
Level 3 Cleric with 3 Rank-1 slots

Prepare:
- Slot 1: Bless
- Slot 2: Bless
- Slot 3: Command

Cast Bless:
- Removes one instance from prepared list
- Remaining: [Bless, Command]
- Available to cast: Bless (1×), Command (1×)

Cast Bless again:
- Removes the second Bless
- Remaining: [Command]
- Available to cast: Command (1×)

Try to cast Bless a third time:
- ❌ NOT ALLOWED - no Bless instances remaining

Rest → Re-prepare for new day
```

---

## Test Coverage Analysis

### Existing Tests (test-ui.js)

#### Test 9: Spell Preparation (Line 166)
```javascript
console.log('\n✅ Test 9: Test spell preparation');
const prepareButtons = await page.locator('button:has-text("Prepare")');
await prepareButtons.first().click();
const preparedBadge = await page.locator('text=Prepared').first();
await preparedBadge.waitFor({ timeout: 5000 });
console.log('   ✓ Successfully prepared a spell - "Prepared" badge appears');
```

**Coverage**: ✅ Basic preparation works
**Missing**:
- ❌ Doesn't test preparing same spell multiple times
- ❌ Doesn't test preparation limits
- ❌ Doesn't verify prepared spell count

#### Test 10: Spell Casting (Line 180)
```javascript
console.log('\n✅ Test 10: Test spell casting mechanics');
const rank1CastButton = await page.locator('text=Rank 1 Spells').locator('..').locator('button:has-text("Cast")');
const slotDisplay = await page.locator('text=Rank 1 Spells').locator('..').locator('text=/\\d+ \\/ \\d+/');
const initialSlots = await slotDisplay.textContent();
console.log(`   ✓ Initial Rank 1 slots: ${initialSlots}`);

await rank1CastButton.click();
const updatedSlots = await slotDisplay.textContent();
console.log(`   ✓ After casting: ${updatedSlots}`);
```

**Coverage**: ✅ Casting decrements slot counter
**Missing**:
- ❌ Doesn't verify WHICH spell was cast
- ❌ Doesn't verify prepared spell was removed
- ❌ Doesn't test casting unprepared spell (should fail!)
- ❌ Doesn't test casting when no slots remain

#### Test 11: Rest Functionality (Line 197)
```javascript
console.log('\n✅ Test 11: Test Rest functionality');
const restButton = await page.locator('button:has-text("Rest")');
await restButton.click();
const restoredSlots = await slotDisplay.textContent();
console.log(`   ✓ After rest: ${restoredSlots}`);
```

**Coverage**: ✅ Rest restores slot counters
**Missing**:
- ❌ Doesn't verify prepared spells were cleared
- ❌ Doesn't test re-preparation after rest

---

## Recommendations

### Option 1: Fix Implementation (Recommended)

**Make the system PF2e-compliant**:

1. **Change Data Structure**:
   ```javascript
   // BEFORE (wrong)
   preparedSpells: {
     rank1: ['bless', 'command', 'bless'] // just IDs
   }

   // AFTER (correct)
   preparedSpells: {
     rank1: [
       { id: 'bless-1', spellId: 'bless' },
       { id: 'bless-2', spellId: 'bless' },
       { id: 'command-1', spellId: 'command' }
     ]
   }
   ```

2. **Update Cast Function**:
   ```javascript
   const castSpell = (rank, preparedInstanceId) => {
     setPreparedSpells(prev => ({
       ...prev,
       [rank]: prev[rank].filter(spell => spell.id !== preparedInstanceId)
     }));
   };
   ```

3. **Remove `castSpells` State**:
   - No longer needed
   - Count of available spells = length of preparedSpells array

4. **Update UI**:
   - Show individual prepared spell instances
   - Each instance has its own "Cast" button
   - After casting, that specific instance disappears

### Option 2: Document Deviation (Not Recommended)

If you want to keep the current "pool" system:

1. **Add Disclaimer**:
   - Document that this is a simplified system
   - Explain it doesn't match official PF2e rules
   - Note: "This app uses a slot pool system for easier tracking"

2. **Update CLAUDE.md**:
   - Add section explaining the deviation
   - Remove claims of "strict PF2e compliance"

---

## Required Test Additions

If fixing to match PF2e rules, add these tests:

### Test 9A: Prepare Same Spell Multiple Times
```javascript
// Prepare Bless three times
// Verify all three instances appear
// Verify different instance IDs
```

### Test 9B: Preparation Limit
```javascript
// Try to prepare more spells than slots available
// Verify error or disabled state
```

### Test 10A: Cast Specific Prepared Spell
```javascript
// Prepare: Bless, Bless, Command
// Cast second Bless instance
// Verify that specific instance was removed
// Verify other Bless and Command still available
```

### Test 10B: Cannot Cast Unprepared Spell
```javascript
// Prepare: Bless, Command
// Try to cast Harm (not prepared)
// Verify it fails or is disabled
```

### Test 10C: Cast All Instances
```javascript
// Prepare: Bless, Bless, Command
// Cast Bless twice
// Try to cast Bless a third time
// Verify it fails (no more Bless instances)
```

### Test 11A: Rest Clears Preparations
```javascript
// Prepare spells
// Rest
// Verify prepared spells list is empty
// Verify can prepare new spells
```

---

## Priority Actions

1. **IMMEDIATE**: Document this issue in project files
2. **HIGH**: Decide on Option 1 (fix) vs Option 2 (document deviation)
3. **HIGH**: Update CLAUDE.md with chosen approach
4. **MEDIUM**: Implement fix or documentation
5. **MEDIUM**: Add missing tests
6. **LOW**: Add tooltips explaining preparation mechanics

---

## References

- **Official Rules**: [Archives of Nethys - Prepared Spells](https://2e.aonprd.com/Rules.aspx?ID=271)
- **Cleric Class**: [Archives of Nethys - Cleric](https://2e.aonprd.com/Classes.aspx?ID=5)
- **Player Core**: pg. 206 "Prepared Spells"
- **Current Code**: `src/App.jsx` lines 1050-1093, `src/NewSpellsTab.jsx` lines 383-418

---

**Status**: ⚠️ Awaiting decision on fix vs. documentation approach
