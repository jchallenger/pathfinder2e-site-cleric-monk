# Continue Extension Configuration

This directory contains the configuration for the [Continue](https://continue.dev) VS Code extension, set up to use your local Ollama API.

## Configuration Overview

**Ollama API Base URL**: `http://100.1.100.201:11434`

### Models Configured

1. **Llama 3.2 3B** - Main chat model
   - Best for: Code generation, explanations, refactoring
   - Model: `llama3.2:3b`

2. **Llama 3.2 1B** - Fast autocomplete model
   - Best for: Quick completions, suggestions
   - Model: `llama3.2:1b`

3. **Nomic Embed Text** - Embeddings for codebase search
   - Best for: Semantic search across your codebase
   - Model: `nomic-embed-text`

## Features Enabled

### Context Providers
- **code**: Add code snippets to context
- **docs**: Reference documentation
- **diff**: Include git diffs
- **terminal**: Include terminal output
- **problems**: Include VS Code problems/errors
- **folder**: Add entire folders
- **codebase**: Semantic search across codebase

### Slash Commands
- `/edit` - Edit selected code
- `/comment` - Write comments
- `/share` - Export chat to markdown
- `/cmd` - Generate shell commands
- `/commit` - Generate commit messages

### Custom Commands
- `/test` - Generate comprehensive test suites

## Usage Tips

### 1. Tab Autocomplete
Press **Tab** while coding to get AI-powered completions using Llama 3.2 1B.

### 2. Chat with Context
- Select code → Open Continue chat → Ask questions
- Use `@code` to reference specific files
- Use `@codebase` to search your entire project

### 3. Quick Edits
1. Select code
2. Press `Ctrl+I` (or `Cmd+I` on Mac)
3. Type your edit request
4. AI will suggest changes

### 4. Generate Tests
1. Select a function/class
2. Type `/test` in Continue chat
3. Get a full test suite

## Switching Models

To use a different Ollama model:

1. Make sure the model is pulled on your Ollama server:
   ```bash
   curl http://100.1.100.201:11434/api/tags
   ```

2. Edit `.continue/config.json` and add a new model:
   ```json
   {
     "title": "Your Model Name",
     "provider": "ollama",
     "model": "model-name:tag",
     "apiBase": "http://100.1.100.201:11434"
   }
   ```

## Available Ollama Models

Common models you might want to use:
- `llama3.2:3b` (current) - Fast, good for coding
- `llama3.2:1b` (current) - Very fast, autocomplete
- `codellama:7b` - Specialized for code
- `codellama:13b` - More capable, slower
- `deepseek-coder:6.7b` - Excellent for code generation
- `mistral:7b` - General purpose, fast
- `mixtral:8x7b` - Very capable, slower

## Troubleshooting

### Models not responding
1. Check Ollama is running:
   ```bash
   curl http://100.1.100.201:11434/api/tags
   ```

2. Verify the model is pulled:
   ```bash
   ollama list
   ```

3. Pull missing models:
   ```bash
   ollama pull llama3.2:3b
   ollama pull llama3.2:1b
   ollama pull nomic-embed-text
   ```

### Slow completions
- Switch to a smaller model (1b instead of 3b)
- Reduce context window size in config
- Check network latency to Ollama server

### Autocomplete not working
1. Make sure `llama3.2:1b` is pulled
2. Check the `tabAutocompleteModel` setting in config.json
3. Restart VS Code

## Integration with Talon Tracker

This Continue configuration is set up to work seamlessly with your Pathfinder 2e Talon Tracker project:

- Use `/test` to generate unit tests for new functions
- Use `@codebase` to search for how features are implemented
- Use `/comment` to document complex PF2e calculations
- Use `/edit` to refactor components

Example queries:
- "How does ability score calculation work?" (with @codebase)
- "Add a tooltip explaining this calculation" (with code selected)
- "Generate tests for the equipment modifier function" (with /test)

## Configuration File Location

The main configuration file is:
```
.continue/config.json
```

Edit this file to:
- Add/remove models
- Change API endpoints
- Enable/disable features
- Customize slash commands

## Resources

- [Continue Documentation](https://docs.continue.dev)
- [Ollama Documentation](https://github.com/ollama/ollama)
- [Ollama Model Library](https://ollama.com/library)
