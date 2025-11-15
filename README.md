# Talon Tracker

A comprehensive **Pathfinder 2e Remaster character sheet web application** for tracking "Briggeld of Igoria" - a Minotaur Warpriest Cleric with Dragonblood Heritage.

![Version](https://img.shields.io/badge/version-3.0.0-purple)
![PF2e](https://img.shields.io/badge/Pathfinder-2e%20Remaster-red)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 📊 Character Management
- **Complete Character Sheet** - All stats, abilities, and attributes
- **Level Progression** - Track advancement from level 1-20
- **Ability Scores** - Automatic calculation with 18+ cap rule
- **Hit Points** - Dynamic HP tracking with damage/healing

### ⚔️ Combat System
- **Attack Rolls** - All weapon attacks with bonuses
- **Armor Class** - Complete AC calculation with equipment bonuses
- **Saving Throws** - Fortitude, Reflex, and Will saves
- **Equipment Bonuses** - Traceable stat modifiers from all gear

### 🎒 Equipment Tracking
- **Comprehensive Database** - 21+ items with full PF2e stats
- **Bulk System** - Visual carrying capacity with encumbrance warnings
- **Stat Modifiers** - All equipment bonuses displayed with sources
- **Enhanced Tooltips** - Hover for complete item details
- **Rune Support** - Weapon and armor enhancement runes

### ✨ Spell Management
- **Divine Spellcasting** - Full Cleric spell progression
- **Multiple Preparations** - Prepare same spell multiple times
- **Spell Slots** - Visual slot management per rank
- **Divine Font** - Heal/Harm font tracking (4-6 slots)
- **Cantrips** - Unlimited casting

### 🎯 Feats & Skills
- **Interactive Feat Picker** - Modal selection with search
- **Skill Progression** - Increase proficiency ranks
- **Story Integration** - AI narrator for feat/skill gains
- **Source Tracking** - Shows where each feat/skill came from

### 📖 AI Storytelling
- **Ollama Integration** - Uses Llama 3.2 for narrative generation
- **Action Batching** - Combines multiple actions into coherent narratives
- **Story Log** - Persistent campaign journal
- **Context Aware** - Includes character state, HP, equipment

### 📝 Notes & Progression
- **Campaign Notes** - Session tracking and campaign journal
- **Level Milestones** - Automatic feat/skill/ability unlocks
- **Character Avatar** - AI-generated character portraits (optional)

## 🚀 Live Demo

**[View Live Site](https://your-site-name.netlify.app)** (will be available after deployment)

## 🛠️ Tech Stack

- **React 19.1.1** - UI library with modern hooks
- **Vite 7.1.7** - Lightning-fast build tool and dev server
- **Tailwind CSS 4.1.16** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Playwright** - End-to-end testing framework
- **Ollama API** - Local AI for storytelling (optional)

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/talon-tracker.git
   cd talon-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5174
   ```

## 🧪 Testing

### Run all tests
```bash
# Unit tests
node src/characterFunctions.test.js

# UI tests (requires dev server running)
node test-ui.js
```

**Test Coverage**: 100/100 tests passing ✅
- HP calculations
- Ability score progression (with 18+ cap)
- Proficiency bonuses
- Spell slot progression
- Character configuration validation

## 🏗️ Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

Build output goes to `dist/` directory.

## 🌐 Deployment

### Netlify (Recommended)

**Automatic deployment from GitHub:**

1. Push code to GitHub
2. Import project in [Netlify](https://netlify.com)
3. Build settings are auto-configured from `netlify.toml`
4. Deploy! 🚀

**Manual deployment:**

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Other Platforms

- **Vercel**: Auto-detects Vite, zero config needed
- **GitHub Pages**: Use `vite build --base=/talon-tracker/`
- **Static hosting**: Upload `dist/` folder anywhere

## 📁 Project Structure

```
talon-tracker/
├── src/
│   ├── App.jsx                  # Main application (all components)
│   ├── pathfinderRules.js       # Official PF2e rules cache
│   ├── characterConfig.js       # Character configuration & data
│   ├── characterFunctions.test.js  # Unit tests (100 tests)
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global Tailwind styles
├── test-ui.js                   # Playwright UI tests
├── .continue/                   # Continue extension config
│   ├── config.json              # Ollama API configuration
│   ├── README.md                # Continue documentation
│   └── QUICK_START.md           # Quick start guide
├── CLAUDE.md                    # AI agent instructions
├── CHARACTER_AUDIT.md           # Rules compliance audit
├── COMPLIANCE_FIXES.md          # Applied fixes log
├── EQUIPMENT_AND_TRACKING_ENHANCEMENTS.md  # Equipment system docs
├── FUNCTION_DOCUMENTATION.md    # All function documentation
├── netlify.toml                 # Netlify configuration
└── package.json                 # Dependencies & scripts
```

## 🎮 Usage Guide

### Character Overview
- View all character stats, ancestry, and attributes
- Edit character name with inline editing
- Track current/max HP with +/- buttons

### Combat Tab
- See AC with full breakdown
- Roll attacks with bonuses
- Check saving throws

### Spells Tab
- Prepare spells (multiple times per day)
- Cast spells to consume slots
- Rest to restore all spell slots
- Divine Font separate from regular slots

### Feats & Skills Tab
- Click feat slots to open picker
- Search/filter available feats
- Increase skill proficiency ranks
- View feat sources and URLs

### Equipment Tab
- View carrying capacity and bulk
- See all equipment stat bonuses
- Equip/unequip items
- Hover items for detailed tooltips

### Story Log
- View AI-generated campaign narrative
- Clear log when starting new campaign
- Export log for session summaries

## 🔧 Configuration

### Ollama API (Optional)

To enable AI storytelling:

1. Install [Ollama](https://ollama.com)
2. Pull the model: `ollama pull llama3.2:3b`
3. Update API URL in `src/App.jsx` if needed:
   ```javascript
   const apiUrl = 'http://YOUR_OLLAMA_SERVER:11434/v1/chat/completions';
   ```

### Continue Extension (VS Code)

AI coding assistant configured for this project:

1. Install [Continue](https://continue.dev) extension
2. Restart VS Code
3. Configuration auto-loaded from `.continue/config.json`

See [.continue/QUICK_START.md](.continue/QUICK_START.md) for usage guide.

## 📖 Documentation

- **[CLAUDE.md](CLAUDE.md)** - AI agent instructions and project overview
- **[CHARACTER_AUDIT.md](CHARACTER_AUDIT.md)** - Rules compliance audit
- **[COMPLIANCE_FIXES.md](COMPLIANCE_FIXES.md)** - Bug fixes applied
- **[EQUIPMENT_AND_TRACKING_ENHANCEMENTS.md](EQUIPMENT_AND_TRACKING_ENHANCEMENTS.md)** - Equipment system documentation
- **[FUNCTION_DOCUMENTATION.md](FUNCTION_DOCUMENTATION.md)** - All function documentation
- **[.continue/README.md](.continue/README.md)** - Continue extension guide
- **[.continue/QUICK_START.md](.continue/QUICK_START.md)** - Quick start for Continue

## 🎯 Rules Compliance

All character calculations are **verified against official Pathfinder 2e Remaster sources**:

- ✅ Player Core (Classes, Ancestries, Equipment)
- ✅ Howl of the Wild (Minotaur, Dragonblood Heritage)
- ✅ [Archives of Nethys](https://2e.aonprd.com) (Official reference)

**100% test coverage** on all core calculation functions.

## 🐛 Known Issues

- AI storytelling requires external Ollama server
- Avatar generation requires OpenAI-compatible image API
- Some equipment needs manual entry (not in database)

## 🚀 Future Enhancements

- [ ] More equipment in database
- [ ] Wealth tracking (gold/silver/copper)
- [ ] Container items (backpacks, bags of holding)
- [ ] Shield damage tracking
- [ ] Dex cap enforcement in AC
- [ ] Equipment comparison tool
- [ ] Multiple character support
- [ ] Export character to PDF

## 📜 License

MIT License - See [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- **Paizo Inc.** - Pathfinder 2e Remaster
- **Archives of Nethys** - Official rules reference
- **Ollama** - Local LLM hosting
- **React Team** - React library
- **Vite Team** - Build tooling

## 📧 Contact

For questions, suggestions, or bug reports, please [open an issue](https://github.com/YOUR_USERNAME/talon-tracker/issues).

---

**Built with ⚔️ for Pathfinder 2e enthusiasts**

*Powered by React, Vite, and AI storytelling*
