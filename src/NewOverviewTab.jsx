import React from 'react';
import { User, TrendingUp, Shield, Info, ExternalLink, Download, Upload, RotateCcw } from 'lucide-react';
import pathfinderRules from './pathfinderRules.js';
import {
  CHARACTER_IDENTITY,
  BASE_ABILITY_SCORES,
  INITIAL_SKILL_PROFICIENCIES,
  SKILL_PROGRESSION
} from './characterConfig.js';

/**
 * NewOverviewTab - Character overview with attributes and skills
 *
 * Displays character identity, ancestry, background, ability scores, and skills
 * Uses centralized config from characterConfig.js
 * Shows dynamic skill proficiencies based on level progression
 */
function NewOverviewTab({
  level,
  getAbilityScore,
  getModifier,
  getProficiencyBonus,
  BASE_ABILITY_SCORES,
  onExportToPathbuilder,
  onImportFromPathbuilder,
  onResetToLevel8
}) {
  // Calculate ability scores based on level
  const strScore = getAbilityScore(BASE_ABILITY_SCORES.STR, 'STR', level);
  const dexScore = getAbilityScore(BASE_ABILITY_SCORES.DEX, 'DEX', level);
  const conScore = getAbilityScore(BASE_ABILITY_SCORES.CON, 'CON', level);
  const intScore = getAbilityScore(BASE_ABILITY_SCORES.INT, 'INT', level);
  const wisScore = getAbilityScore(BASE_ABILITY_SCORES.WIS, 'WIS', level);
  const chaScore = getAbilityScore(BASE_ABILITY_SCORES.CHA, 'CHA', level);

  const strMod = getModifier(strScore);
  const dexMod = getModifier(dexScore);
  const conMod = getModifier(conScore);
  const intMod = getModifier(intScore);
  const wisMod = getModifier(wisScore);
  const chaMod = getModifier(chaScore);

  // Helper to get current proficiency rank for a skill based on level
  const getSkillRank = (skillKey) => {
    const progression = SKILL_PROGRESSION[skillKey];
    if (!progression) {
      // Check if skill is in initial proficiencies
      return INITIAL_SKILL_PROFICIENCIES[skillKey]?.rank || 'untrained';
    }

    // Find highest rank achieved at current level
    let currentRank = INITIAL_SKILL_PROFICIENCIES[skillKey]?.rank || 'trained';

    if (progression[15] && level >= 15) currentRank = progression[15];
    else if (progression[7] && level >= 7) currentRank = progression[7];
    else if (progression[2] && level >= 2) currentRank = progression[2];

    return currentRank;
  };

  // Get ability modifier for a skill
  const getSkillAbilityMod = (skillKey) => {
    const skillData = pathfinderRules.skills[skillKey];
    if (!skillData) return 0;

    const ability = skillData.ability.toLowerCase();
    switch (ability) {
      case 'strength': return strMod;
      case 'dexterity': return dexMod;
      case 'constitution': return conMod;
      case 'intelligence': return intMod;
      case 'wisdom': return wisMod;
      case 'charisma': return chaMod;
      default: return 0;
    }
  };

  // All trained skills for this character
  const trainedSkills = Object.keys(INITIAL_SKILL_PROFICIENCIES).filter(
    key => !INITIAL_SKILL_PROFICIENCIES[key].lore
  );

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Ancestry & Background */}
        <StatBlock title="Ancestry & Background" icon={User}>
          <div className="space-y-3">
            <StatItem
              label="Ancestry"
              value={`${CHARACTER_IDENTITY.ancestry.name} - ${CHARACTER_IDENTITY.heritage.name} Heritage (${CHARACTER_IDENTITY.ancestry.rarity})`}
            />
            <StatItem label="Gender" value={CHARACTER_IDENTITY.gender} />
            <StatItem label="Size" value={CHARACTER_IDENTITY.ancestry.size} />
            <StatItem label="Speed" value={`${CHARACTER_IDENTITY.ancestry.speed} ft`} />
            <StatItem
              label="Special"
              value="Darkvision, Horns (1d8 piercing), Fear Resistance"
            />
            <StatItem label="Background" value={CHARACTER_IDENTITY.background.name} />
          </div>
        </StatBlock>

        {/* Ability Scores */}
        <StatBlock title="Ability Scores" icon={TrendingUp}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <AbilityScore ability="STR" score={strScore} modifier={strMod} primary level={level} />
            <AbilityScore ability="DEX" score={dexScore} modifier={dexMod} level={level} />
            <AbilityScore ability="CON" score={conScore} modifier={conMod} level={level} />
            <AbilityScore ability="INT" score={intScore} modifier={intMod} level={level} />
            <AbilityScore ability="WIS" score={wisScore} modifier={wisMod} primary level={level} />
            <AbilityScore ability="CHA" score={chaScore} modifier={chaMod} level={level} />
          </div>
        </StatBlock>
      </div>

      {/* Skills */}
      <StatBlock title="Skills" icon={Shield}>
        <div className="grid md:grid-cols-2 gap-2">
          {trainedSkills.map(skillKey => {
            const skillData = pathfinderRules.skills[skillKey];
            if (!skillData) return null;

            const rank = getSkillRank(skillKey);
            const abilityMod = getSkillAbilityMod(skillKey);
            const profBonus = getProficiencyBonus(level, rank);
            const totalBonus = abilityMod + profBonus;

            return (
              <Tooltip
                key={skillKey}
                content={
                  <>
                    <div className="font-semibold text-purple-300 mb-2">{skillData.name}</div>
                    <div className="space-y-2 text-slate-300">
                      <div className="bg-slate-700/50 p-2 rounded">
                        <div className="font-semibold mb-1">Calculation:</div>
                        <div className="pl-2 text-sm">
                          • {skillData.ability} modifier: <span className="text-green-400">{abilityMod >= 0 ? '+' : ''}{abilityMod}</span>
                        </div>
                        <div className="pl-2 text-sm">
                          • Proficiency ({rank}): <span className="text-green-400">+{profBonus}</span>
                        </div>
                        <div className="pl-2 text-sm font-semibold border-t border-slate-600 mt-1 pt-1">
                          = <span className="text-green-400">{totalBonus >= 0 ? '+' : ''}{totalBonus}</span> total
                        </div>
                      </div>
                      <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
                        <div className="font-bold text-purple-300">
                          {skillData.name}: <span className="text-green-400">{totalBonus >= 0 ? '+' : ''}{totalBonus}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {skillData.description}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          <a
                            href={skillData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1"
                          >
                            View on Archives of Nethys <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </>
                }
              >
                <div className="cursor-help">
                  <StatItem
                    label={`${skillData.name} (${rank.charAt(0).toUpperCase() + rank.slice(1)})`}
                    value={`${totalBonus >= 0 ? '+' : ''}${totalBonus}`}
                  />
                </div>
              </Tooltip>
            );
          })}
        </div>
      </StatBlock>

      {/* Import/Export & Utilities */}
      <StatBlock title="Character Management" icon={Shield}>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-purple-300 mb-2">Pathbuilder 2e Integration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={onExportToPathbuilder}
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-all"
              >
                <Download className="w-5 h-5" />
                <span>Export to Pathbuilder JSON</span>
              </button>

              <label className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-all cursor-pointer">
                <Upload className="w-5 h-5" />
                <span>Import from Pathbuilder</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportFromPathbuilder}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Import/export character data to/from Pathbuilder 2e format. Export downloads a JSON file, import reads from a Pathbuilder JSON file.
            </p>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-sm font-semibold text-purple-300 mb-2">Quick Actions</h3>
            <button
              onClick={onResetToLevel8}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-all w-full"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset Character to Level 8</span>
            </button>
            <p className="text-xs text-slate-400 mt-2">
              Reset character to Level 8 with appropriate ability scores and HP. Clears prepared spells (must re-prepare).
            </p>
          </div>
        </div>
      </StatBlock>
    </div>
  );
}

// Helper components (reused pattern from App.jsx)
function StatBlock({ title, icon: Icon, children }) {
  return (
    <div className="bg-slate-800/50 border border-purple-900/50 rounded-xl p-6 backdrop-blur">
      <div className="flex items-center gap-3 mb-4 border-b border-purple-900/30 pb-3">
        <Icon className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-purple-200">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-slate-700/50 last:border-0">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="text-purple-100 font-semibold text-sm">{value}</span>
    </div>
  );
}

function AbilityScore({ ability, score, modifier, primary, level }) {
  return (
    <div className={`flex flex-col items-center p-3 rounded-lg border ${
      primary
        ? 'bg-purple-900/30 border-purple-600/50'
        : 'bg-slate-700/30 border-slate-600/50'
    }`}>
      <div className="text-xs text-slate-400 mb-1">{ability}</div>
      <div className="text-2xl font-bold text-purple-100">{score}</div>
      <div className={`text-sm font-semibold ${modifier >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {modifier >= 0 ? '+' : ''}{modifier}
      </div>
    </div>
  );
}

function Tooltip({ children, content }) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div className="relative inline-block w-full">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
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

export default NewOverviewTab;
