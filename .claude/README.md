# Claude Code Configuration

This directory contains Claude Code configuration for optimal development of the Talon Tracker (Pathfinder 2e character sheet).

## Configuration Files

### `settings.local.json`
Main configuration file with permissions, hooks, context docs, and custom instructions.

## Permissions

**Auto-Approved Operations:**
- Running test suites (`node test-ui.js`, `node src/characterFunctions.test.js`)
- NPM commands (`npm run:*`)
- Git operations (add, commit, push, status, diff)
- Reading/editing source files and markdown documentation

**Denied Operations:**
- Destructive file operations (`rm -rf`)
- Sudo commands (security)
- Writing to `.env` files (prevent accidental secret commits)

## Hooks

### PostToolUse Hooks

**JavaScript File Changes** (src/\*.js, src/\*.jsx)
- Reminds to run tests after code modifications
- Timeout: 5 seconds

**Character Logic Changes** (characterFunctions.js, characterConfig.js)
- **Automatically runs unit tests** to verify calculations
- Ensures PF2e rules compliance before continuing
- Timeout: 30 seconds

**Rules Cache Changes** (pathfinderRules.js)
- Reminds to verify all sources link to Archives of Nethys
- Ensures official PF2e reference URLs are accurate
- Timeout: 5 seconds

### SessionStart Hook

Displays project context reminder on every new session:
```
📋 Pathfinder 2e Character Tracker | Review CLAUDE.md for project guidelines
```

## Context Documentation

Claude Code has quick access to these project docs to reduce token usage:

1. **CLAUDE.md** - Complete project guidelines, PF2e rules, testing requirements, and development workflow
2. **BUILD_ANALYSIS.md** - Level 20 character build with all 33 feats and ability scores
3. **EQUIPMENT_PROGRESSION.md** - Equipment and rune recommendations by level (1-20)
4. **Archives of Nethys** - Official Pathfinder 2e reference for rules verification

## Custom Instructions

Every Claude Code session includes:
- Verify rules against pathfinderRules.js and Archives of Nethys
- Run tests after modifying character calculation logic
- Add tooltips with source attribution for new stats
- Follow quality checklist in CLAUDE.md before completing tasks

## MCP Servers

No MCP servers are currently configured. This project is self-contained and doesn't require external service integrations.

Potential future MCP servers:
- Git MCP server for advanced repository operations
- Memory MCP server for cross-session context retention

## Benefits

This configuration provides:
- ✅ **Reduced Token Usage** - Context docs prevent re-reading large files
- ✅ **Automatic Testing** - PostToolUse hooks catch calculation errors immediately
- ✅ **Rules Compliance** - Reminders ensure PF2e official sources are verified
- ✅ **Consistent Quality** - Custom instructions enforce project standards
- ✅ **Faster Development** - Pre-approved permissions streamline git workflows

## Customization

To add new hooks, update `settings.local.json` following the pattern:

```json
{
  "matcher": "Write(path/pattern)|Edit(path/pattern)",
  "hooks": [
    {
      "type": "command",
      "command": "your-command-here",
      "timeout": 30
    }
  ]
}
```

Matchers support regex patterns and can target specific files or directories.

## Testing Hooks

To test if hooks are working:

1. **Edit a character file**: Modify `src/characterConfig.js` and save
2. **Check hook output**: Should automatically run unit tests
3. **View results**: Tests pass/fail output appears in terminal

## Troubleshooting

**Hook not triggering?**
- Check matcher pattern syntax
- Verify file path matches pattern
- Ensure timeout is sufficient for command execution

**Tests failing on hook?**
- Review test output for specific errors
- Check if character calculations follow PF2e rules
- Verify pathfinderRules.js has correct values

**Permission denied?**
- Check if operation matches "allow" patterns
- Ensure no "deny" patterns are blocking it
- Add specific permission to "allow" list if needed

---

**Last Updated**: 2025-11-15
**Project**: Talon Tracker (Pathfinder 2e Character Sheet)
**Claude Code Version**: Compatible with latest release
