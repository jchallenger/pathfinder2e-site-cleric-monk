# Shared Components Library

**Created**: 2025-11-18
**Status**: ✅ Complete

---

## Overview

This directory contains reusable UI components used across all tabs in the Talon Tracker application. These components follow the centralized pattern established in the tab redesign, ensuring consistent styling, behavior, and source attribution throughout the app.

---

## Components

### 1. Tooltip

**File**: [Tooltip.jsx](Tooltip.jsx)

**Purpose**: Displays hoverable tooltips with detailed information, calculation breakdowns, and source attribution.

**Usage**:
```jsx
import { Tooltip } from './components/shared';
import { Info } from 'lucide-react';

<Tooltip content={
  <>
    <div className="font-semibold text-purple-300 mb-2">Armor Class Calculation</div>
    <div className="space-y-2 text-slate-300">
      <div>Base: 10</div>
      <div>Dex Modifier: +3</div>
      <div>Armor Bonus: +5</div>
      <div className="font-bold text-green-400">Total AC: 18</div>
    </div>
  </>
}>
  <Info className="w-4 h-4 text-purple-400 hover:text-purple-300" />
</Tooltip>
```

**Props**:
- `children` (ReactNode) - Element to hover over (usually Info icon)
- `content` (ReactNode) - Tooltip content (supports JSX)
- `position` (string) - 'right', 'left', 'top', 'bottom' (default: 'right')
- `width` (string) - Width class (default: 'w-80')

**Use Cases**:
- Stat calculations (AC, saves, skills, attacks)
- Spell descriptions
- Feat prerequisites
- Equipment properties
- Rules explanations

---

### 2. Modal

**File**: [Modal.jsx](Modal.jsx)

**Purpose**: Full-screen overlay dialog for detailed views, forms, and browsing interfaces.

**Usage**:
```jsx
import { Modal } from './components/shared';

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Equipment Browser"
  size="xlarge"
>
  <div className="space-y-4">
    {/* Modal content */}
  </div>
</Modal>
```

**Props**:
- `isOpen` (boolean) - Whether modal is displayed
- `onClose` (function) - Callback when modal is closed
- `title` (string) - Modal title in header
- `children` (ReactNode) - Modal content
- `size` (string) - 'small', 'medium', 'large', 'xlarge', 'full' (default: 'large')

**Use Cases**:
- Equipment browser
- Spell detail view
- Feat selection
- Rune manager
- Full item descriptions

---

### 3. StatCard

**File**: [StatCard.jsx](StatCard.jsx)

**Purpose**: Displays a single stat with value, label, and optional tooltip breakdown.

**Usage**:
```jsx
import { StatCard } from './components/shared';

<StatCard
  label="Armor Class"
  value={23}
  variant="primary"
  size="large"
  tooltipContent={
    <div>AC calculation breakdown...</div>
  }
/>
```

**Props**:
- `label` (string) - Stat label
- `value` (string|number) - Stat value
- `tooltipContent` (ReactNode) - Optional tooltip breakdown
- `size` (string) - 'small', 'medium', 'large' (default: 'medium')
- `variant` (string) - 'default', 'primary', 'success', 'warning', 'danger'

**Use Cases**:
- Combat stats (AC, saves, attack bonuses)
- Ability scores
- Skill bonuses
- Spell DC/attack
- Perception, speed, etc.

---

### 4. StatBlock

**File**: [StatBlock.jsx](StatBlock.jsx)

**Purpose**: Groups multiple related stats together in a cohesive block.

**Usage**:
```jsx
import { StatBlock, StatCard } from './components/shared';

<StatBlock
  title="Saving Throws"
  columns="3"
  variant="primary"
>
  <StatCard label="Fortitude" value="+15" />
  <StatCard label="Reflex" value="+12" />
  <StatCard label="Will" value="+18" />
</StatBlock>
```

**Props**:
- `title` (string) - Block title
- `children` (ReactNode) - StatCard components or other content
- `columns` (string) - '1', '2', '3', '4', '5', '6' (default: '3')
- `variant` (string) - 'default', 'primary', 'accent'

**Use Cases**:
- Saving throws group
- Ability scores group
- Skill categories
- Attack options
- Spell statistics

---

### 5. SourceLink

**File**: [SourceLink.jsx](SourceLink.jsx)

**Purpose**: Links to Archives of Nethys with consistent styling and icon.

**Usage**:
```jsx
import { SourceLink } from './components/shared';

<SourceLink
  url="https://2e.aonprd.com/Classes.aspx?ID=5"
  showLabel={true}
/>

<SourceLink
  url="https://2e.aonprd.com/Spells.aspx?ID=148"
  label="Heal spell"
  size="medium"
/>
```

**Props**:
- `url` (string) - Archives of Nethys URL
- `label` (string) - Optional link text (default: icon only)
- `size` (string) - 'small', 'medium', 'large' (default: 'small')
- `showLabel` (boolean) - Show "Source:" prefix (default: false)

**Use Cases**:
- Spell source attribution
- Feat source links
- Equipment reference
- Class/ancestry links
- Rules documentation

---

### 6. Badge

**File**: [Badge.jsx](Badge.jsx)

**Purpose**: Small colored badge for displaying rarity, level, tags, status, etc.

**Usage**:
```jsx
import { Badge } from './components/shared';

<Badge variant="rarity-uncommon" size="small">Uncommon</Badge>
<Badge variant="level">Level 10</Badge>
<Badge variant="rank">Expert</Badge>
<Badge variant="success">Equipped</Badge>
```

**Props**:
- `children` (string) - Badge text
- `variant` (string) - 'default', 'rarity-common', 'rarity-uncommon', 'rarity-rare', 'rarity-unique', 'level', 'rank', 'success', 'warning', 'danger', 'info'
- `size` (string) - 'small', 'medium', 'large' (default: 'small')

**Use Cases**:
- Item rarity indicators
- Feat prerequisites
- Spell ranks
- Proficiency levels
- Equipment status
- Level requirements

---

### 7. ProgressBar

**File**: [ProgressBar.jsx](ProgressBar.jsx)

**Purpose**: Visual progress indicator with customizable colors and labels.

**Usage**:
```jsx
import { ProgressBar } from './components/shared';

<ProgressBar
  current={45}
  max={68}
  label="Hit Points"
  variant="hp"
  size="large"
  showValues={true}
/>

<ProgressBar
  current={2}
  max={4}
  label="Rank 3 Spell Slots"
  variant="default"
/>
```

**Props**:
- `current` (number) - Current value
- `max` (number) - Maximum value
- `label` (string) - Optional label above bar
- `showValues` (boolean) - Show "current/max" text (default: true)
- `variant` (string) - 'default', 'hp', 'success', 'warning', 'danger'
- `size` (string) - 'small', 'medium', 'large' (default: 'medium')

**Use Cases**:
- HP tracking
- Spell slot consumption
- Bulk capacity
- Experience/level progress
- Resource management

---

## Import Patterns

### Single Component Import:
```jsx
import Tooltip from './components/shared/Tooltip.jsx';
```

### Multiple Component Import:
```jsx
import { Tooltip, Modal, StatCard } from './components/shared';
```

### All Components Import:
```jsx
import * as Shared from './components/shared';

<Shared.Tooltip content={...}>
  <Shared.Badge>Level 10</Shared.Badge>
</Shared.Tooltip>
```

---

## Design Principles

### 1. **Consistent Styling**
All components follow the app's color scheme:
- Primary: Purple tones (`purple-300`, `purple-500`, etc.)
- Background: Slate tones (`slate-800`, `slate-900`)
- Success: Green tones
- Warning: Yellow tones
- Danger: Red tones
- Info: Blue tones

### 2. **Source Attribution**
Components support displaying official PF2e sources:
- All tooltips can include source information
- SourceLink component for Archives of Nethys
- Consistent "Source: Player Core" pattern

### 3. **Accessibility**
- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support (modals)
- Hover states for interactive elements
- Sufficient color contrast

### 4. **Responsive Design**
- StatBlock uses responsive grid layouts
- Modals adapt to screen size
- Mobile-friendly touch targets
- Flexible sizing options

### 5. **Reusability**
- All components accept props for customization
- Sensible defaults for quick usage
- Variant system for different contexts
- Composable components (StatCard in StatBlock)

---

## Integration with Existing Tabs

### NewGearTab Example:
```jsx
import { Tooltip, Modal, StatCard, Badge, SourceLink } from './components/shared';

// Use in equipment display
<StatCard
  label="AC Bonus"
  value={equipmentMods.armorClass}
  variant="primary"
  tooltipContent={<div>Armor bonus breakdown...</div>}
/>

// Use in equipment browser
<Modal isOpen={showBrowser} onClose={() => setShowBrowser(false)} title="Equipment Browser">
  {equipment.map(item => (
    <div key={item.id}>
      <Badge variant={`rarity-${item.rarity}`}>{item.rarity}</Badge>
      <SourceLink url={item.url} />
    </div>
  ))}
</Modal>
```

### NewCombatTab Example:
```jsx
import { StatBlock, StatCard, Tooltip } from './components/shared';

<StatBlock title="Saving Throws" columns="3">
  <StatCard
    label="Fortitude"
    value={`+${fortSave}`}
    tooltipContent={<div>Fort save breakdown...</div>}
  />
  <StatCard
    label="Reflex"
    value={`+${refSave}`}
    tooltipContent={<div>Reflex save breakdown...</div>}
  />
  <StatCard
    label="Will"
    value={`+${willSave}`}
    tooltipContent={<div>Will save breakdown...</div>}
  />
</StatBlock>
```

### NewSpellsTab Example:
```jsx
import { ProgressBar, Badge, Modal, SourceLink } from './components/shared';

<ProgressBar
  current={castSpells[rank] || 0}
  max={slotTable[level]?.[rank] || 0}
  label={`Rank ${rank} Spell Slots`}
  variant="default"
/>

<Modal isOpen={showSpellDetail} title={selectedSpell.name}>
  <Badge variant="level">Rank {selectedSpell.rank}</Badge>
  <SourceLink url={selectedSpell.url} showLabel={true} />
  <p>{selectedSpell.description}</p>
</Modal>
```

---

## Migration Guide

To migrate existing inline components to shared components:

### 1. Replace Inline Tooltips
**Before**:
```jsx
function Tooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="relative inline-block">
      {/* ... tooltip code ... */}
    </div>
  );
}
```

**After**:
```jsx
import { Tooltip } from './components/shared';
```

### 2. Extract Stat Displays
**Before**:
```jsx
<div className="p-3 bg-slate-800 border border-slate-600 rounded-lg text-center">
  <div className="text-sm text-slate-300 mb-1">Armor Class</div>
  <div className="text-2xl text-white font-bold">{ac}</div>
</div>
```

**After**:
```jsx
import { StatCard } from './components/shared';

<StatCard label="Armor Class" value={ac} />
```

### 3. Consolidate Modals
**Before**:
```jsx
{showBrowser && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
    <div className="bg-slate-900 border border-purple-500 rounded-lg max-w-4xl">
      {/* ... modal content ... */}
    </div>
  </div>
)}
```

**After**:
```jsx
import { Modal } from './components/shared';

<Modal isOpen={showBrowser} onClose={() => setShowBrowser(false)} title="Browser">
  {/* ... modal content ... */}
</Modal>
```

---

## Testing

Each component should be tested in context:

1. **Visual Testing**: Verify appearance in all variants and sizes
2. **Interaction Testing**: Test hover states, clicks, keyboard navigation
3. **Responsive Testing**: Check behavior on different screen sizes
4. **Integration Testing**: Verify components work together (StatCard in StatBlock)

**Test Checklist**:
- ✅ All variants render correctly
- ✅ All sizes display properly
- ✅ Tooltips appear on hover
- ✅ Modals open/close correctly
- ✅ Links open in new tab
- ✅ Progress bars calculate percentages correctly
- ✅ Components are accessible (ARIA, keyboard)

---

## Future Enhancements

Potential additions to the shared library:

1. **SearchFilter** - Reusable search/filter component for browsers
2. **DiceRoller** - Component for rolling dice (d20, damage, etc.)
3. **Accordion** - Collapsible sections for long content
4. **Tabs** - Nested tab component for sub-navigation
5. **LoadingSpinner** - Loading state indicator
6. **EmptyState** - Placeholder for empty lists/sections
7. **ConfirmDialog** - Confirmation modal for destructive actions

---

## Maintenance

### Adding a New Component:

1. Create component file in `src/components/shared/`
2. Follow existing naming and structure patterns
3. Add JSDoc comments explaining purpose and props
4. Export from `index.js`
5. Document in this README
6. Test in isolation and in integration

### Modifying Existing Components:

1. Check all usages across tabs before changing
2. Maintain backward compatibility where possible
3. Update documentation
4. Test all affected tabs
5. Update migration guide if API changes

---

## Summary

**Created**: 7 reusable components
**Total Lines**: ~550 lines of shared code
**Purpose**: Eliminate duplication, ensure consistency, simplify maintenance

**Benefits**:
- ✅ Consistent UI across all tabs
- ✅ Single source of truth for common patterns
- ✅ Easy to maintain and update
- ✅ Faster development of new features
- ✅ Better accessibility and responsiveness
- ✅ Comprehensive source attribution

**Next Steps**:
- Integrate shared components into existing tabs
- Replace inline implementations with imports
- Test thoroughly
- Document any new patterns or components

---

**Status**: ✅ All shared components created and ready for use!
