# Responsive Tooltip Testing Plan

**Created**: 2025-11-09
**Purpose**: Comprehensive testing strategy for enhanced Tooltip component with responsive positioning, mobile support, and accessibility features

---

## Overview

This document outlines the testing plan for the newly enhanced Tooltip component in Talon Tracker. The enhanced component includes:

✅ **Dynamic positioning** - Auto-detects best placement based on viewport
✅ **Mobile support** - Touch events and mobile-first responsive sizing
✅ **Keyboard accessibility** - Enter/Space to toggle, Escape to close
✅ **ARIA attributes** - Screen reader support with proper roles
✅ **Responsive breakpoints** - Different sizes for mobile, tablet, desktop

---

## 1. Viewport Size Testing

### Test 1.1: Mobile Portrait (375x667)
**Objective**: Verify tooltips display correctly on small mobile screens

**Steps**:
```javascript
await page.setViewportSize({ width: 375, height: 667 });
await page.goto('http://localhost:5174');
```

**Expected Behavior**:
- Tooltip width: `calc(100vw - 2rem)` (< 375px - 32px padding)
- Tooltip position: Prefer `top` or `bottom` placement
- Font size: `text-xs` (0.75rem)
- Padding: `p-3` (0.75rem)
- No horizontal overflow
- Tooltip visible and readable

**Test Cases**:
- [ ] HP tooltip on mobile
- [ ] External link icons visible
- [ ] Tooltip doesn't overflow screen edges
- [ ] Touch event opens tooltip
- [ ] Second touch closes tooltip

---

### Test 1.2: Mobile Landscape (667x375)
**Objective**: Verify tooltips work in landscape orientation

**Steps**:
```javascript
await page.setViewportSize({ width: 667, height: 375 });
```

**Expected Behavior**:
- Tooltip switches to `left` or `right` placement when space available
- Width: `max-w-xs` (320px) or smaller if needed
- No vertical overflow
- Content scrollable if needed

---

### Test 1.3: Tablet (768x1024)
**Objective**: Verify tooltips at `sm:` breakpoint

**Steps**:
```javascript
await page.setViewportSize({ width: 768, height: 1024 });
```

**Expected Behavior**:
- Tooltip width: `max-w-sm` (384px)
- Font size: `sm:text-sm` (0.875rem)
- Padding: `sm:p-4` (1rem)
- Prefer `right` or `left` placement
- Smooth transitions

---

### Test 1.4: Desktop (1920x1080)
**Objective**: Verify tooltips at `md:` breakpoint and larger

**Steps**:
```javascript
await page.setViewportSize({ width: 1920, height: 1080 });
```

**Expected Behavior**:
- Tooltip width: `md:w-80` (320px)
- Font size: `text-sm` (0.875rem)
- Padding: `p-4` (1rem)
- Prefer `right` placement
- All content visible without scrolling

---

## 2. Tooltip Positioning Tests

### Test 2.1: Auto-Positioning (Right)
**Objective**: Verify tooltip appears on right when space available

**Steps**:
```javascript
// HP tooltip in header (has space on right)
await page.hover('text=Hit Points >> .. >> [role="button"]');
await page.waitForSelector('[role="tooltip"]', { state: 'visible' });
const tooltip = await page.locator('[role="tooltip"]');
const box = await tooltip.boundingBox();
```

**Expected**:
- Tooltip positioned to right of trigger
- Classes include: `left-full ml-2`
- No overflow on right edge

---

### Test 2.2: Auto-Positioning (Left)
**Objective**: Verify tooltip appears on left when right space unavailable

**Steps**:
```javascript
// Tooltip near right edge of viewport
await page.setViewportSize({ width: 500, height: 800 });
// Find a tooltip trigger near right edge
```

**Expected**:
- Tooltip positioned to left of trigger
- Classes include: `right-full mr-2`
- No overflow on left edge

---

### Test 2.3: Auto-Positioning (Top)
**Objective**: Verify tooltip appears on top when needed

**Steps**:
```javascript
// Scroll to bottom, trigger tooltip near bottom
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
// Trigger tooltip near bottom edge
```

**Expected**:
- Tooltip positioned above trigger
- Classes include: `bottom-full mb-2 left-1/2 -translate-x-1/2`
- Centered horizontally relative to trigger

---

### Test 2.4: Auto-Positioning (Bottom)
**Objective**: Verify tooltip appears on bottom when space available

**Steps**:
```javascript
// Mobile viewport, tooltip at top of page
await page.setViewportSize({ width: 375, height: 667 });
await page.goto('http://localhost:5174');
```

**Expected**:
- Tooltip positioned below trigger on mobile
- Classes include: `top-full mt-2 left-1/2 -translate-x-1/2`
- Centered horizontally

---

## 3. Interaction Testing

### Test 3.1: Mouse Hover (Desktop)
**Objective**: Verify mouse enter/leave events work

**Steps**:
```javascript
const trigger = await page.locator('text=Hit Points >> .. >> [role="button"]');
await trigger.hover();
await page.waitForSelector('[role="tooltip"]', { state: 'visible', timeout: 1000 });

// Move mouse away
await page.mouse.move(0, 0);
await page.waitForSelector('[role="tooltip"]', { state: 'hidden', timeout: 1000 });
```

**Expected**:
- [ ] Tooltip appears on hover
- [ ] Tooltip disappears when mouse leaves
- [ ] No flickering
- [ ] Smooth transitions

---

### Test 3.2: Touch Events (Mobile)
**Objective**: Verify touch tap toggles tooltip

**Steps**:
```javascript
await page.setViewportSize({ width: 375, height: 667 });
const trigger = await page.locator('text=Hit Points >> .. >> [role="button"]');

// First tap - open
await trigger.tap();
await page.waitForSelector('[role="tooltip"]', { state: 'visible' });

// Second tap - close
await trigger.tap();
await page.waitForSelector('[role="tooltip"]', { state: 'hidden' });
```

**Expected**:
- [ ] First tap opens tooltip
- [ ] Second tap closes tooltip
- [ ] Toggle behavior consistent
- [ ] No accidental double-triggers

---

### Test 3.3: Keyboard Navigation (Enter)
**Objective**: Verify Enter key toggles tooltip

**Steps**:
```javascript
const trigger = await page.locator('text=Hit Points >> .. >> [role="button"]');

// Focus trigger
await trigger.focus();
await page.keyboard.press('Tab'); // Ensure focus
await page.keyboard.press('Shift+Tab'); // Back to trigger

// Press Enter
await page.keyboard.press('Enter');
await page.waitForSelector('[role="tooltip"]', { state: 'visible' });

// Press Enter again
await page.keyboard.press('Enter');
await page.waitForSelector('[role="tooltip"]', { state: 'hidden' });
```

**Expected**:
- [ ] Enter opens tooltip
- [ ] Enter closes tooltip
- [ ] Focus visible on trigger
- [ ] Tooltip toggles correctly

---

### Test 3.4: Keyboard Navigation (Space)
**Objective**: Verify Space key toggles tooltip

**Steps**:
```javascript
const trigger = await page.locator('text=Hit Points >> .. >> [role="button"]');
await trigger.focus();

await page.keyboard.press('Space');
await page.waitForSelector('[role="tooltip"]', { state: 'visible' });

await page.keyboard.press('Space');
await page.waitForSelector('[role="tooltip"]', { state: 'hidden' });
```

**Expected**:
- [ ] Space opens tooltip
- [ ] Space closes tooltip
- [ ] No page scrolling on Space press

---

### Test 3.5: Keyboard Navigation (Escape)
**Objective**: Verify Escape key closes tooltip

**Steps**:
```javascript
const trigger = await page.locator('text=Hit Points >> .. >> [role="button"]');
await trigger.click();
await page.waitForSelector('[role="tooltip"]', { state: 'visible' });

await page.keyboard.press('Escape');
await page.waitForSelector('[role="tooltip"]', { state: 'hidden' });
```

**Expected**:
- [ ] Escape closes open tooltip
- [ ] Escape works from any interaction method (mouse, touch, keyboard)

---

## 4. Accessibility Testing

### Test 4.1: ARIA Attributes
**Objective**: Verify proper ARIA attributes present

**Steps**:
```javascript
const trigger = await page.locator('text=Hit Points >> .. >> [role="button"]');

// Check initial state (closed)
const ariaExpanded = await trigger.getAttribute('aria-expanded');
const ariaDescribedBy = await trigger.getAttribute('aria-describedby');
console.log('Closed - aria-expanded:', ariaExpanded);
console.log('Closed - aria-describedby:', ariaDescribedBy);

// Open tooltip
await trigger.click();
await page.waitForSelector('[role="tooltip"]', { state: 'visible' });

// Check open state
const ariaExpandedOpen = await trigger.getAttribute('aria-expanded');
const ariaDescribedByOpen = await trigger.getAttribute('aria-describedby');
const tooltipId = await page.locator('[role="tooltip"]').getAttribute('id');
console.log('Open - aria-expanded:', ariaExpandedOpen);
console.log('Open - aria-describedby:', ariaDescribedByOpen);
console.log('Tooltip ID:', tooltipId);
```

**Expected**:
- [ ] Trigger has `role="button"`
- [ ] Trigger has `tabIndex={0}`
- [ ] `aria-expanded="false"` when closed
- [ ] `aria-expanded="true"` when open
- [ ] `aria-describedby` matches tooltip `id` when open
- [ ] `aria-describedby` is `undefined` when closed
- [ ] Tooltip has `role="tooltip"`
- [ ] Tooltip has unique `id`

---

### Test 4.2: Focus Management
**Objective**: Verify focus states and visibility

**Steps**:
```javascript
// Tab through interactive elements
await page.keyboard.press('Tab');
// Check if trigger receives focus
const focused = await page.evaluate(() => document.activeElement.getAttribute('role'));
console.log('Focused element role:', focused);
```

**Expected**:
- [ ] Trigger is keyboard focusable
- [ ] Focus ring visible (Tailwind's default focus styles)
- [ ] Tab order logical
- [ ] Can reach all tooltips via keyboard

---

### Test 4.3: Screen Reader Compatibility
**Objective**: Verify screen reader announces content correctly

**Manual Test** (requires screen reader):
- [ ] NVDA/JAWS announces "Hit Points button"
- [ ] When tooltip opens, announces tooltip content
- [ ] "Collapsed" announced when closed
- [ ] "Expanded" announced when open

**Automated Check**:
```javascript
// Verify proper semantic HTML
const trigger = await page.locator('text=Hit Points >> .. >> [role="button"]');
const role = await trigger.getAttribute('role');
console.log('Role:', role); // Should be "button"
```

---

## 5. Content Rendering Tests

### Test 5.1: HP Tooltip Content Verification
**Objective**: Verify all HP tooltip content displays correctly

**Steps**:
```javascript
await page.goto('http://localhost:5174');
const trigger = await page.locator('text=Hit Points >> .. >> [role="button"]');
await trigger.click();
await page.waitForSelector('[role="tooltip"]', { state: 'visible' });

// Check for specific content
const tooltipContent = await page.locator('[role="tooltip"]').textContent();
console.log('Tooltip content:', tooltipContent);
```

**Expected Content**:
- [ ] "Max HP Calculation (Level 1)" header
- [ ] "Cleric class: 8 HP" with external link
- [ ] "Strix ancestry: 8 HP" with external link
- [ ] "Constitution modifier: +2"
- [ ] "Total Max HP: 18" (at level 1)
- [ ] "Source: Player Core pg. 112"
- [ ] All external link icons visible

---

### Test 5.2: Dynamic Content at Different Levels
**Objective**: Verify tooltip updates when level changes

**Steps**:
```javascript
// At level 1
await page.goto('http://localhost:5174');
let trigger = await page.locator('text=Hit Points >> .. >> [role="button"]');
await trigger.click();
let tooltip = await page.locator('[role="tooltip"]');
let content = await tooltip.textContent();
expect(content).toContain('Total Max HP: 18');

// Level up to 5
await page.click('button:has-text("Level +")');
await page.click('button:has-text("Level +")');
await page.click('button:has-text("Level +")');
await page.click('button:has-text("Level +")');

// Check tooltip at level 5
await trigger.click(); // Close
await trigger.click(); // Reopen
tooltip = await page.locator('[role="tooltip"]');
content = await tooltip.textContent();
expect(content).toContain('Total Max HP: 58'); // 18 + (4 * 10)
expect(content).toContain('Per Level (2-5)');
```

**Expected**:
- [ ] Level 1: Shows 18 HP
- [ ] Level 5: Shows 58 HP (18 + 40)
- [ ] Level 5: Shows "Per Level (2-5)" section
- [ ] Calculations update correctly

---

## 6. Visual Regression Tests

### Test 6.1: Screenshot Comparison (Desktop)
**Objective**: Capture screenshots for visual verification

**Steps**:
```javascript
await page.setViewportSize({ width: 1920, height: 1080 });
await page.goto('http://localhost:5174');
const trigger = await page.locator('text=Hit Points >> .. >> [role="button"]');
await trigger.hover();
await page.waitForTimeout(500); // Wait for tooltip
await page.screenshot({
  path: 'screenshots/tooltip-hp-desktop.png',
  fullPage: false
});
```

**Verification**:
- [ ] Tooltip positioned correctly
- [ ] No visual glitches
- [ ] Colors correct (purple theme)
- [ ] Border and shadow visible
- [ ] Text readable

---

### Test 6.2: Screenshot Comparison (Mobile)
**Objective**: Capture mobile screenshots

**Steps**:
```javascript
await page.setViewportSize({ width: 375, height: 667 });
await page.goto('http://localhost:5174');
const trigger = await page.locator('text=Hit Points >> .. >> [role="button"]');
await trigger.tap();
await page.waitForTimeout(500);
await page.screenshot({
  path: 'screenshots/tooltip-hp-mobile.png',
  fullPage: false
});
```

**Verification**:
- [ ] Tooltip fits on screen
- [ ] Font size appropriate for mobile
- [ ] Touch targets adequate (44x44px minimum)
- [ ] Padding correct

---

## 7. Performance Tests

### Test 7.1: Tooltip Render Performance
**Objective**: Verify tooltip renders quickly

**Steps**:
```javascript
const startTime = Date.now();
const trigger = await page.locator('text=Hit Points >> .. >> [role="button"]');
await trigger.click();
await page.waitForSelector('[role="tooltip"]', { state: 'visible' });
const endTime = Date.now();
const renderTime = endTime - startTime;
console.log('Tooltip render time:', renderTime, 'ms');
```

**Expected**:
- [ ] Render time < 100ms
- [ ] No layout shift
- [ ] No performance warnings in console

---

### Test 7.2: Multiple Tooltips
**Objective**: Verify no performance issues with multiple tooltips

**Steps**:
```javascript
// TODO: Once more tooltips added
// Open and close 10 different tooltips rapidly
// Monitor memory usage
// Check for any memory leaks
```

**Expected**:
- [ ] No memory leaks
- [ ] All tooltips render correctly
- [ ] No performance degradation

---

## 8. Edge Case Tests

### Test 8.1: Very Long Content
**Objective**: Verify tooltip handles long content

**Steps**:
```javascript
// The HP tooltip at higher levels has more content
await page.goto('http://localhost:5174');
// Level up to 20
for (let i = 0; i < 19; i++) {
  await page.click('button:has-text("Level +")');
}

const trigger = await page.locator('text=Hit Points >> .. >> [role="button"]');
await trigger.click();
await page.waitForSelector('[role="tooltip"]', { state: 'visible' });
```

**Expected**:
- [ ] Tooltip expands vertically if needed
- [ ] Scrollable if content exceeds viewport
- [ ] No overflow issues
- [ ] All content readable

---

### Test 8.2: Rapid Toggle
**Objective**: Verify tooltip handles rapid open/close

**Steps**:
```javascript
const trigger = await page.locator('text=Hit Points >> .. >> [role="button"]');

// Rapidly toggle 10 times
for (let i = 0; i < 10; i++) {
  await trigger.click();
  await page.waitForTimeout(50);
}
```

**Expected**:
- [ ] No crashes
- [ ] Final state consistent
- [ ] No orphaned tooltips
- [ ] State management correct

---

### Test 8.3: Viewport Resize
**Objective**: Verify tooltip repositions on resize

**Steps**:
```javascript
await page.setViewportSize({ width: 1920, height: 1080 });
const trigger = await page.locator('text=Hit Points >> .. >> [role="button"]');
await trigger.click();
await page.waitForSelector('[role="tooltip"]', { state: 'visible' });

// Resize to mobile
await page.setViewportSize({ width: 375, height: 667 });
await page.waitForTimeout(500);

// Verify tooltip repositioned
const tooltip = await page.locator('[role="tooltip"]');
const box = await tooltip.boundingBox();
// Check position is appropriate for mobile
```

**Expected**:
- [ ] Tooltip repositions appropriately
- [ ] No overflow after resize
- [ ] Classes update to mobile breakpoints

---

## 9. Cross-Browser Testing

### Test 9.1: Chrome/Chromium
**Steps**: Run all tests in Chromium (Playwright default)

**Expected**: All tests pass ✅

---

### Test 9.2: Firefox
**Steps**:
```javascript
const { firefox } = require('playwright');
const browser = await firefox.launch();
// Run all tests
```

**Expected**: All tests pass ✅

---

### Test 9.3: WebKit (Safari)
**Steps**:
```javascript
const { webkit } = require('playwright');
const browser = await webkit.launch();
// Run all tests
```

**Expected**: All tests pass ✅

---

## 10. Integration with Existing Tests

### Test 10.1: Verify Existing Tests Still Pass
**Objective**: Ensure enhanced tooltip doesn't break existing functionality

**Steps**:
```bash
node test-ui.js
```

**Expected**:
- [ ] All 16 existing tests pass
- [ ] No regressions
- [ ] HP tooltip test works with new component

---

## Test Execution Plan

### Phase 1: Core Functionality (Priority: HIGH)
Run tests: 1.1, 1.4, 2.1, 3.1, 3.2, 4.1, 5.1

### Phase 2: Responsive Behavior (Priority: HIGH)
Run tests: 1.2, 1.3, 2.2, 2.3, 2.4, 8.3

### Phase 3: Accessibility (Priority: MEDIUM)
Run tests: 3.3, 3.4, 3.5, 4.2, 4.3

### Phase 4: Content & Performance (Priority: MEDIUM)
Run tests: 5.2, 7.1, 7.2, 8.1, 8.2

### Phase 5: Visual & Cross-Browser (Priority: LOW)
Run tests: 6.1, 6.2, 9.1, 9.2, 9.3

---

## Success Criteria

✅ **Core Functionality**: All positioning and interaction tests pass
✅ **Accessibility**: All ARIA and keyboard tests pass
✅ **Responsiveness**: Tooltips work on all viewport sizes
✅ **Performance**: Render time < 100ms, no memory leaks
✅ **Compatibility**: Works in Chrome, Firefox, Safari
✅ **Regression**: All existing tests still pass

---

## Next Steps

1. **Implement automated test suite** based on this plan
2. **Create test-responsive-tooltips.js** for Playwright
3. **Set up CI/CD** to run tests on every commit
4. **Add visual regression testing** with Percy or similar
5. **Manual accessibility audit** with screen readers
6. **Update CLAUDE.md** with testing procedures

---

**Status**: 📋 Testing plan complete - Ready for implementation
