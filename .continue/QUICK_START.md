# Continue Extension - Quick Start Guide

## 🚀 Getting Started (5 minutes)

### 1. Verify Ollama is Running

```bash
curl http://100.1.100.201:11434/api/tags
```

Should return a list of available models.

### 2. Required Models

Make sure these models are available on your Ollama server:

```bash
# Check if models are installed
ollama list

# If missing, pull them:
ollama pull llama3.2:3b      # Main chat model
ollama pull llama3.2:1b      # Autocomplete model
ollama pull nomic-embed-text # Embeddings for search
```

### 3. Restart VS Code

After creating the config, restart VS Code to load the Continue extension with your Ollama settings.

---

## 💡 Quick Actions

### Tab Autocomplete
Just start typing → Press **Tab** to accept AI suggestions

**Example**:
```javascript
// Start typing: function calculateDamage...
// Press Tab → AI completes the function
```

### Inline Edit (Ctrl+I / Cmd+I)
1. Select code
2. Press `Ctrl+I` (Windows/Linux) or `Cmd+I` (Mac)
3. Type what you want to change
4. Accept or reject the suggestion

**Example**:
- Select a function
- Press `Ctrl+I`
- Type: "Add error handling and input validation"
- Review and accept changes

### Chat with Code Context
1. Open Continue sidebar (click Continue icon)
2. Select code you want to discuss
3. Type your question
4. AI responds with code-aware answers

**Example**:
```
Select getAbilityScore function → Ask:
"Explain how the 18+ cap rule works in this function"
```

---

## 🎯 Common Use Cases for Talon Tracker

### 1. Understanding Existing Code

**Select code** → Chat → Ask:
```
"What does this function do and how does it follow PF2e rules?"
```

### 2. Generating Tests

**Select function** → Type in chat:
```
/test
```

Gets you a full test suite with edge cases.

### 3. Adding Documentation

**Select function** → Type in chat:
```
/comment
```

Generates JSDoc comments with parameter descriptions and examples.

### 4. Refactoring Code

**Select code** → Press `Ctrl+I` → Type:
```
"Extract this logic into a reusable helper function"
```

### 5. Fixing Bugs

**Select problematic code** → Chat → Type:
```
@problems

"These are the current errors. How do I fix them?"
```

### 6. Finding Implementations

In chat, type:
```
@codebase

"How is bulk calculation implemented?"
```

AI searches your entire codebase semantically.

### 7. Git Commit Messages

In chat, type:
```
/commit
```

Generates a commit message based on your staged changes.

### 8. Shell Commands

In chat, type:
```
/cmd run all tests and show coverage
```

Gets you the exact command to run.

---

## 🔥 Power User Tips

### 1. Context Providers

Add context to your questions with `@`:

- `@code` - Reference specific files
- `@codebase` - Search entire project
- `@docs` - Include documentation
- `@terminal` - Include terminal output
- `@problems` - Include VS Code errors
- `@diff` - Include git changes

**Example**:
```
@codebase @problems

"I'm seeing these errors when I try to calculate equipment bonuses.
How is equipment handling implemented elsewhere?"
```

### 2. Multi-Step Edits

Select code → `Ctrl+I` → Use multiple instructions:
```
1. Add TypeScript types
2. Add error handling
3. Add JSDoc comments
4. Extract magic numbers to constants
```

### 3. Custom Prompts

Create project-specific prompts in `.continue/config.json`:

```json
{
  "customCommands": [
    {
      "name": "pf2e-validate",
      "prompt": "Review this code and verify it complies with Pathfinder 2e Remaster rules from Player Core. Check formulas and calculations.",
      "description": "Validate PF2e rules compliance"
    }
  ]
}
```

Then use: `/pf2e-validate`

### 4. Codebase Search Patterns

Use natural language to find code:

```
@codebase "functions that calculate proficiency bonuses"
@codebase "where ability scores are modified"
@codebase "how tooltips are implemented"
```

---

## 🎮 Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Inline Edit | `Ctrl+I` | `Cmd+I` |
| Tab Autocomplete | `Tab` | `Tab` |
| Open Continue | `Ctrl+L` | `Cmd+L` |
| New Chat | `Ctrl+Shift+L` | `Cmd+Shift+L` |

---

## 📝 Best Practices

### DO ✅
- Select specific code before asking questions
- Use `@codebase` for architectural questions
- Use `@problems` when debugging
- Review AI suggestions carefully
- Use `/test` for new functions
- Use `/comment` for complex calculations

### DON'T ❌
- Don't accept all suggestions blindly
- Don't ask vague questions without context
- Don't forget to verify PF2e rule compliance
- Don't use for sensitive code without review

---

## 🐛 Common Issues

### Autocomplete not working
**Fix**: Make sure `llama3.2:1b` is running:
```bash
ollama run llama3.2:1b
```

### Slow responses
**Fix**: Switch to a smaller model in config.json:
```json
{
  "model": "llama3.2:1b"
}
```

### "Model not found" error
**Fix**: Pull the model:
```bash
ollama pull llama3.2:3b
```

### Can't connect to Ollama
**Fix**: Check the server is accessible:
```bash
curl http://100.1.100.201:11434/api/tags
```

---

## 📚 Example Workflow

### Adding a New Feature: Wealth Tracking

1. **Plan the feature** (Chat):
   ```
   @codebase

   "I want to add wealth tracking (gold, silver, copper).
   How is similar state management implemented in this app?"
   ```

2. **Generate the state** (`Ctrl+I` on component):
   ```
   "Add state for tracking gold, silver, and copper pieces with localStorage persistence"
   ```

3. **Create helper functions** (Chat):
   ```
   /test

   "Generate a function to convert between coin types and calculate total wealth in gold pieces"
   ```

4. **Add UI** (Chat):
   ```
   "Generate a wealth display component similar to the HP display,
   showing GP, SP, CP with +/- buttons"
   ```

5. **Add tests** (Select function → Chat):
   ```
   /test
   ```

6. **Document** (Select code → Chat):
   ```
   /comment
   ```

7. **Commit** (After changes → Chat):
   ```
   /commit
   ```

---

## 🎯 Talon Tracker Specific Prompts

### For PF2e Calculations
```
"Verify this calculation follows Pathfinder 2e Remaster rules.
Check against Player Core formulas."
```

### For Equipment System
```
@codebase

"Show me how equipment bonuses are calculated and displayed.
I want to add a similar system for [feature]."
```

### For Testing
```
"Generate comprehensive tests for this PF2e calculation function.
Include edge cases for ability scores 1-30 and levels 1-20."
```

### For UI Components
```
"Create a tooltip component for this stat that shows the calculation
breakdown like the existing HP tooltip."
```

---

## 🚀 Next Steps

1. Try tab autocomplete while coding
2. Select a function and ask "What does this do?"
3. Use `/test` on a function
4. Try `@codebase "how is bulk calculated"`
5. Use `Ctrl+I` to refactor some code

**Have fun coding with AI assistance!** 🎉
