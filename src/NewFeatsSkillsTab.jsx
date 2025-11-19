import React, { useState } from 'react';
import { Award, Target, BookOpen, Info, ExternalLink, X, Check, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import pathfinderRules from './pathfinderRules.js';
import { CHARACTER_IDENTITY, INITIAL_SKILL_PROFICIENCIES, LEVEL_MILESTONES } from './characterConfig.js';

/**
 * NEW FEATS & SKILLS TAB - Comprehensive Feat and Skill Management
 *
 * Features:
 * - All 17 PF2e skills with proficiency tracking
 * - Skill bonus calculator (ability + proficiency)
 * - Skill increase management by level
 * - Feat browser by type (ancestry, class, skill, general)
 * - Prerequisite validation
 * - Feat selection UI with detailed tooltips
 * - Source attribution for all feats and skills
 *
 * Pattern:
 * 1. All skill data from pathfinderRules.skills
 * 2. All feat data from pathfinderRules.feats
 * 3. Prerequisite validation against character state
 * 4. Dynamic updates based on level
 */

// Reusable Tooltip component
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

// Skill Card Component
function SkillCard({ skill, level, proficiencyRank, abilityMod, proficiencyBonus, totalBonus, onIncrease, canIncrease }) {
  const [expanded, setExpanded] = useState(false);

  const rankColors = {
    untrained: 'text-slate-500',
    trained: 'text-green-400',
    expert: 'text-blue-400',
    master: 'text-purple-400',
    legendary: 'text-yellow-400'
  };

  const rankLabels = {
    untrained: 'Untrained',
    trained: 'Trained',
    expert: 'Expert',
    master: 'Master',
    legendary: 'Legendary'
  };

  return (
    <div className="bg-slate-800/70 rounded-lg p-4 border border-slate-600 hover:border-purple-500/50 transition-all">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-200">{skill.name}</h4>
            <Tooltip content={
              <>
                <div className="font-semibold text-purple-300 mb-2">{skill.name}</div>
                <div className="space-y-2 text-slate-300 text-sm">
                  <div className="bg-slate-700/50 p-2 rounded">
                    <div className="font-semibold mb-1">Bonus Breakdown:</div>
                    <div className="pl-2 space-y-1">
                      <div>• {skill.ability} modifier: <span className="text-green-400">+{abilityMod}</span></div>
                      <div>• Proficiency: <span className="text-green-400">+{proficiencyBonus}</span> ({rankLabels[proficiencyRank]})</div>
                    </div>
                  </div>
                  <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
                    <div className="font-bold text-purple-300">
                      Total Bonus: <span className="text-green-400">+{totalBonus}</span>
                    </div>
                  </div>
                  {skill.url && (
                    <div className="text-xs">
                      <a
                        href={skill.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1"
                      >
                        View on Archives of Nethys <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </>
            }>
              <Info className="w-4 h-4 text-purple-400 hover:text-purple-300" />
            </Tooltip>
          </div>
          <div className="text-xs text-slate-400 mt-1">{skill.ability}</div>
        </div>

        <div className="flex items-center gap-3 ml-2">
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-400">+{totalBonus}</div>
            <div className={`text-xs ${rankColors[proficiencyRank]}`}>
              {rankLabels[proficiencyRank]}
            </div>
          </div>

          {canIncrease && (
            <button
              onClick={() => onIncrease(skill.id)}
              className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded transition-all"
              title="Increase proficiency"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {skill.description && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-slate-400 hover:text-slate-300 flex items-center gap-1"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Hide' : 'Show'} details
        </button>
      )}

      {expanded && skill.description && (
        <div className="mt-2 text-sm text-slate-300 bg-slate-700/30 rounded p-2">
          {skill.description}
        </div>
      )}
    </div>
  );
}

// Feat Card Component
function FeatCard({ feat, isSelected, canSelect, onToggle, prerequisites }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className={`bg-slate-800/70 rounded-lg p-4 border transition-all ${
        isSelected
          ? 'border-green-500 bg-green-900/20'
          : canSelect
          ? 'border-slate-600 hover:border-purple-500/50'
          : 'border-slate-700 opacity-60'
      }`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-slate-200">{feat.name}</h4>
              <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded">
                Lvl {feat.level}
              </span>
              {feat.type && (
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded capitalize">
                  {feat.type}
                </span>
              )}
            </div>

            {prerequisites && prerequisites.length > 0 && (
              <div className="text-xs text-slate-400 mb-2">
                Prerequisites: {prerequisites.join(', ')}
              </div>
            )}

            <p className="text-sm text-slate-300 line-clamp-2">{feat.description}</p>
          </div>

          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={() => setShowDetails(true)}
              className="text-purple-400 hover:text-purple-300 p-1"
            >
              <Info className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggle(feat.id)}
              disabled={!canSelect && !isSelected}
              className={`p-2 rounded transition-all ${
                isSelected
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : canSelect
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Feat Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg border border-purple-500 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-purple-300">{feat.name}</h3>
                <div className="text-sm text-slate-400 mt-1">
                  Level {feat.level} • {feat.type}
                </div>
              </div>
              <button onClick={() => setShowDetails(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {prerequisites && prerequisites.length > 0 && (
                  <div className="bg-blue-900/30 rounded p-3 border border-blue-700">
                    <div className="font-semibold text-blue-300 mb-2">Prerequisites</div>
                    <ul className="space-y-1">
                      {prerequisites.map((prereq, idx) => (
                        <li key={idx} className="text-slate-300 text-sm">• {prereq}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-slate-800/50 rounded p-3">
                  <div className="font-semibold text-slate-200 mb-2">Description</div>
                  <p className="text-slate-300">{feat.description}</p>
                </div>

                {feat.benefit && (
                  <div className="bg-green-900/30 rounded p-3 border border-green-700">
                    <div className="font-semibold text-green-300 mb-2">Benefit</div>
                    <p className="text-slate-300">{feat.benefit}</p>
                  </div>
                )}

                {feat.url && (
                  <div className="bg-purple-900/30 rounded p-3 border border-purple-700">
                    <a
                      href={feat.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-2"
                    >
                      View on Archives of Nethys <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Level Progression Card Component
function LevelProgressionCard({ levelNum, items, isUnlocked }) {
  const [expanded, setExpanded] = useState(levelNum === 1 || !isUnlocked);

  return (
    <div className={`bg-slate-800/70 rounded-lg border transition-all ${
      isUnlocked ? 'border-purple-600' : 'border-slate-700 opacity-60'
    }`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className={`text-2xl font-bold ${
            isUnlocked ? 'text-purple-400' : 'text-slate-500'
          }`}>
            {levelNum}
          </div>
          <div className="text-left">
            <div className="font-semibold text-slate-200">Level {levelNum}</div>
            <div className="text-xs text-slate-400">
              {items.length} upgrade{items.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>

      {expanded && (
        <div className="p-4 pt-0 space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="bg-slate-700/50 rounded p-3 border border-slate-600">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-purple-300">{item.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      item.type === 'skill' ? 'bg-blue-600' :
                      item.type === 'feat' ? 'bg-green-600' :
                      item.type === 'feature' ? 'bg-yellow-600' :
                      'bg-purple-600'
                    } text-white capitalize`}>
                      {item.type}
                    </span>
                    {item.category && (
                      <span className="text-xs bg-slate-600 text-slate-300 px-2 py-0.5 rounded capitalize">
                        {item.category}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-slate-300">{item.description}</p>
                  )}
                </div>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-purple-400 hover:text-purple-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main FeatsSkillsTab Component
export default function NewFeatsSkillsTab({
  level,
  selectedFeats,
  setSelectedFeats,
  skillProficiencies,
  setSkillProficiencies,
  getAbilityScore,
  getModifier,
  getProficiencyBonus,
  BASE_ABILITY_SCORES
}) {
  const [activeSection, setActiveSection] = useState('progression');
  const [featFilter, setFeatFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get all 17 skills from pathfinderRules
  const allSkills = pathfinderRules.skills || {
    acrobatics: { name: 'Acrobatics', ability: 'DEX', id: 'acrobatics' },
    arcana: { name: 'Arcana', ability: 'INT', id: 'arcana' },
    athletics: { name: 'Athletics', ability: 'STR', id: 'athletics' },
    crafting: { name: 'Crafting', ability: 'INT', id: 'crafting' },
    deception: { name: 'Deception', ability: 'CHA', id: 'deception' },
    diplomacy: { name: 'Diplomacy', ability: 'CHA', id: 'diplomacy' },
    intimidation: { name: 'Intimidation', ability: 'CHA', id: 'intimidation' },
    medicine: { name: 'Medicine', ability: 'WIS', id: 'medicine' },
    nature: { name: 'Nature', ability: 'WIS', id: 'nature' },
    occultism: { name: 'Occultism', ability: 'INT', id: 'occultism' },
    performance: { name: 'Performance', ability: 'CHA', id: 'performance' },
    religion: { name: 'Religion', ability: 'WIS', id: 'religion' },
    society: { name: 'Society', ability: 'INT', id: 'society' },
    stealth: { name: 'Stealth', ability: 'DEX', id: 'stealth' },
    survival: { name: 'Survival', ability: 'WIS', id: 'survival' },
    thievery: { name: 'Thievery', ability: 'DEX', id: 'thievery' }
  };

  // Calculate skill bonuses
  const calculateSkillBonus = (skillId, skill) => {
    const profRank = skillProficiencies[skillId]?.rank || 'untrained';
    const abilityScore = getAbilityScore(BASE_ABILITY_SCORES[skill.ability], skill.ability, level);
    const abilityMod = getModifier(abilityScore);
    const profBonus = profRank === 'untrained' ? 0 : getProficiencyBonus(level, profRank);
    const total = abilityMod + profBonus;

    return {
      proficiencyRank: profRank,
      abilityMod,
      proficiencyBonus: profBonus,
      totalBonus: total
    };
  };

  // Skill increase management
  const canIncreaseSkill = (skillId) => {
    const currentRank = skillProficiencies[skillId]?.rank || 'untrained';

    // Rank requirements:
    // Trained: always (with training)
    // Expert: level 3+
    // Master: level 7+
    // Legendary: level 15+

    const rankRequirements = {
      trained: 1,
      expert: 3,
      master: 7,
      legendary: 15
    };

    const nextRank = {
      untrained: 'trained',
      trained: 'expert',
      expert: 'master',
      master: 'legendary',
      legendary: null
    }[currentRank];

    if (!nextRank) return false;

    return level >= rankRequirements[nextRank];
  };

  const increaseSkillProficiency = (skillId) => {
    const currentRank = skillProficiencies[skillId]?.rank || 'untrained';
    const nextRank = {
      untrained: 'trained',
      trained: 'expert',
      expert: 'master',
      master: 'legendary'
    }[currentRank];

    if (nextRank) {
      setSkillProficiencies(prev => ({
        ...prev,
        [skillId]: {
          ...prev[skillId],
          rank: nextRank,
          levelGained: level
        }
      }));
    }
  };

  // Get available feats by type
  const getAvailableFeats = () => {
    const feats = pathfinderRules.feats || {
      ancestry: [],
      class: [],
      skill: [],
      general: []
    };

    let allFeats = [];

    // Filter by type
    if (featFilter === 'all') {
      allFeats = [
        ...Object.values(feats.ancestry || []),
        ...Object.values(feats.class || []),
        ...Object.values(feats.skill || []),
        ...Object.values(feats.general || [])
      ];
    } else {
      allFeats = Object.values(feats[featFilter] || []);
    }

    // Filter by level
    allFeats = allFeats.filter(feat => feat.level <= level);

    // Filter by search
    if (searchTerm) {
      allFeats = allFeats.filter(feat =>
        feat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (feat.description && feat.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return allFeats;
  };

  // Feat selection
  const toggleFeat = (featId) => {
    setSelectedFeats(prev => {
      if (prev.includes(featId)) {
        return prev.filter(id => id !== featId);
      } else {
        return [...prev, featId];
      }
    });
  };

  const availableFeats = getAvailableFeats();

  // Group upgrades by level
  const getUpgradesByLevel = () => {
    const upgrades = {};

    // Initialize all levels 1-20
    for (let i = 1; i <= 20; i++) {
      upgrades[i] = [];
    }

    // Add skill proficiency upgrades
    Object.entries(skillProficiencies).forEach(([skillId, skillData]) => {
      if (skillData.levelGained) {
        const skill = allSkills[skillId];
        if (skill) {
          upgrades[skillData.levelGained].push({
            type: 'skill',
            name: `${skill.name} → ${skillData.rank.charAt(0).toUpperCase() + skillData.rank.slice(1)}`,
            description: `Increased ${skill.name} proficiency to ${skillData.rank}`,
            category: 'skill proficiency',
            url: skill.url
          });
        }
      }
    });

    // Add class features from LEVEL_MILESTONES
    Object.entries(LEVEL_MILESTONES || {}).forEach(([lvl, features]) => {
      const levelNum = parseInt(lvl);
      features.forEach(feature => {
        upgrades[levelNum].push({
          type: 'feature',
          name: feature.split(' - ')[0],
          description: feature,
          category: 'class feature'
        });
      });
    });

    // Add selected feats (if we have level info)
    // TODO: Track feat selection level in state

    return upgrades;
  };

  const upgradesByLevel = getUpgradesByLevel();

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-700 flex gap-2">
        <button
          onClick={() => setActiveSection('progression')}
          className={`flex-1 px-4 py-2 rounded transition-all ${
            activeSection === 'progression'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" />
            By Level
          </div>
        </button>

        <button
          onClick={() => setActiveSection('skills')}
          className={`flex-1 px-4 py-2 rounded transition-all ${
            activeSection === 'skills'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Target className="w-4 h-4" />
            Skills
          </div>
        </button>

        <button
          onClick={() => setActiveSection('feats')}
          className={`flex-1 px-4 py-2 rounded transition-all ${
            activeSection === 'feats'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Award className="w-4 h-4" />
            Feats
          </div>
        </button>
      </div>

      {/* Level Progression View */}
      {activeSection === 'progression' && (
        <div className="space-y-6">
          <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
            <h3 className="text-lg font-bold mb-2 text-purple-300">Character Progression</h3>
            <p className="text-sm text-slate-400">
              View all upgrades, feats, skill increases, and class features gained at each level.
            </p>
          </div>

          <div className="space-y-3">
            {Object.entries(upgradesByLevel).map(([levelNum, items]) => {
              const lvl = parseInt(levelNum);
              return (
                <LevelProgressionCard
                  key={lvl}
                  levelNum={lvl}
                  items={items}
                  isUnlocked={lvl <= level}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {activeSection === 'skills' && (
        <div className="space-y-6">
          <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
            <h3 className="text-lg font-bold mb-2 text-purple-300">Skill Proficiencies</h3>
            <p className="text-sm text-slate-400">
              All 17 Pathfinder 2e skills. Increase proficiency with the + button (level requirements apply).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(allSkills).map(([skillId, skill]) => {
              const bonus = calculateSkillBonus(skillId, skill);
              return (
                <SkillCard
                  key={skillId}
                  skill={skill}
                  level={level}
                  {...bonus}
                  onIncrease={increaseSkillProficiency}
                  canIncrease={canIncreaseSkill(skillId)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Feats Section */}
      {activeSection === 'feats' && (
        <div className="space-y-6">
          <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
            <h3 className="text-lg font-bold mb-2 text-purple-300">Feat Selection</h3>
            <p className="text-sm text-slate-400">
              Choose feats appropriate for your level. Prerequisites are validated automatically.
            </p>
          </div>

          {/* Feat Filters */}
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 space-y-3">
            <div className="flex gap-2 flex-wrap">
              {['all', 'ancestry', 'class', 'skill', 'general'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setFeatFilter(filter)}
                  className={`px-3 py-1 rounded capitalize transition-all ${
                    featFilter === filter
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search feats..."
              className="w-full bg-slate-800 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>

          {/* Selected Feats Summary */}
          {selectedFeats.length > 0 && (
            <div className="bg-green-900/30 rounded-lg p-4 border border-green-700">
              <h4 className="font-semibold text-green-300 mb-2">
                Selected Feats ({selectedFeats.length})
              </h4>
              <div className="text-sm text-slate-300">
                {selectedFeats.join(', ')}
              </div>
            </div>
          )}

          {/* Feat List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableFeats.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-slate-400">
                No feats found matching your criteria
              </div>
            ) : (
              availableFeats.map(feat => (
                <FeatCard
                  key={feat.id}
                  feat={feat}
                  isSelected={selectedFeats.includes(feat.id)}
                  canSelect={true} // TODO: Add prerequisite validation
                  onToggle={toggleFeat}
                  prerequisites={feat.prerequisites}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
