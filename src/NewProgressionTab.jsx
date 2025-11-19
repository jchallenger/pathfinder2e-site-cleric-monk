import React, { useState } from 'react';
import { TrendingUp, Award, Zap, Shield, Sword, BookOpen, Info, ExternalLink, Check } from 'lucide-react';
import pathfinderRules from './pathfinderRules.js';
import { CHARACTER_IDENTITY, ABILITY_BOOST_PROGRESSION } from './characterConfig.js';

/**
 * NEW PROGRESSION TAB - Level Progression and Milestones
 *
 * Features:
 * - Level timeline (1-20) with current level highlight
 * - Class features unlocked by level
 * - Ability score boost tracker (levels 5, 10, 15, 20)
 * - Proficiency progression display
 * - Feat slots by level
 * - Milestone markers (5, 10, 15, 20)
 * - Source attribution for all features
 *
 * Pattern:
 * 1. All progression data from characterConfig and pathfinderRules
 * 2. Dynamic display based on current level
 * 3. Tooltips for complex features
 * 4. Visual timeline with milestones
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

// Level Card Component
function LevelCard({ levelNum, currentLevel, features, isMilestone }) {
  const [expanded, setExpanded] = useState(levelNum === currentLevel);
  const isUnlocked = levelNum <= currentLevel;
  const isCurrent = levelNum === currentLevel;

  return (
    <div className={`rounded-lg border-2 transition-all ${
      isCurrent
        ? 'border-purple-500 bg-purple-900/30 shadow-lg shadow-purple-500/20'
        : isUnlocked
        ? 'border-green-500/50 bg-green-900/20'
        : 'border-slate-700 bg-slate-800/30 opacity-60'
    }`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-700/20 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
            isCurrent
              ? 'bg-purple-600 text-white'
              : isUnlocked
              ? 'bg-green-600 text-white'
              : 'bg-slate-700 text-slate-400'
          }`}>
            {levelNum}
          </div>

          <div className="text-left">
            <div className="font-bold text-slate-200">
              Level {levelNum}
              {isCurrent && <span className="ml-2 text-sm text-purple-400">(Current)</span>}
              {isMilestone && <span className="ml-2 text-sm text-yellow-400">★ Milestone</span>}
            </div>
            <div className="text-xs text-slate-400">
              {features.length} {features.length === 1 ? 'feature' : 'features'}
            </div>
          </div>
        </div>

        {isUnlocked && <Check className="w-5 h-5 text-green-400" />}
      </button>

      {expanded && features.length > 0 && (
        <div className="px-4 pb-4 space-y-2">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-slate-700/30 rounded p-3">
              <div className="font-semibold text-slate-200 mb-1">{feature.name}</div>
              <div className="text-sm text-slate-300">{feature.description}</div>
              {feature.type && (
                <div className="mt-2">
                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                    {feature.type}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Ability Boost Tracker Component
function AbilityBoostTracker({ level, abilityBoosts, BASE_ABILITY_SCORES, getAbilityScore }) {
  const boostLevels = [5, 10, 15, 20];
  const availableBoosts = boostLevels.filter(l => l <= level);

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-lg p-4 border border-purple-500/50">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-purple-300">Ability Score Boosts</h3>
        <Tooltip content={
          <>
            <div className="font-semibold text-purple-300 mb-2">Ability Boosts</div>
            <div className="space-y-2 text-slate-300 text-sm">
              <div className="bg-slate-700/50 p-2 rounded">
                <p>You gain 4 ability boosts at levels 5, 10, 15, and 20.</p>
                <p className="mt-2">Boost rules:</p>
                <ul className="pl-4 mt-1 space-y-1">
                  <li>• If score &lt; 18: +2 to the score</li>
                  <li>• If score ≥ 18: +1 to the score</li>
                </ul>
              </div>
            </div>
          </>
        }>
          <Info className="w-4 h-4 text-purple-400 hover:text-purple-300" />
        </Tooltip>
      </div>

      <div className="space-y-3">
        {boostLevels.map(boostLevel => {
          const isAvailable = boostLevel <= level;
          const boosts = abilityBoosts[boostLevel] || [];

          return (
            <div key={boostLevel} className={`rounded p-3 ${
              isAvailable ? 'bg-green-900/20 border border-green-700' : 'bg-slate-800/30 border border-slate-700'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-200">Level {boostLevel}</span>
                {isAvailable && <Check className="w-4 h-4 text-green-400" />}
              </div>
              {isAvailable ? (
                <div className="text-sm text-slate-300">
                  {boosts.length > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                      {boosts.map((ability, idx) => (
                        <span key={idx} className="bg-purple-600 text-white px-2 py-1 rounded">
                          {ability}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">No boosts allocated yet</span>
                  )}
                </div>
              ) : (
                <div className="text-sm text-slate-500 italic">
                  Unlocked at level {boostLevel}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current Ability Scores */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="text-sm font-semibold text-slate-300 mb-2">Current Ability Scores</div>
        <div className="grid grid-cols-3 gap-2">
          {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(ability => {
            const score = getAbilityScore(BASE_ABILITY_SCORES[ability], ability, level);
            const modifier = Math.floor((score - 10) / 2);

            return (
              <div key={ability} className="bg-slate-800/50 rounded p-2 text-center">
                <div className="text-xs text-slate-400">{ability}</div>
                <div className="text-lg font-bold text-purple-400">{score}</div>
                <div className="text-xs text-slate-300">
                  {modifier >= 0 ? '+' : ''}{modifier}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Proficiency Progression Component
function ProficiencyProgression({ level }) {
  const getProficiencyRank = (progression) => {
    for (let i = progression.length - 1; i >= 0; i--) {
      if (level >= progression[i].level) {
        return progression[i];
      }
    }
    return progression[0];
  };

  const proficiencies = {
    'Weapons': [
      { level: 1, rank: 'Trained' },
      { level: 7, rank: 'Expert' },
      { level: 11, rank: 'Master' },
      { level: 19, rank: 'Legendary' }
    ],
    'Armor': [
      { level: 1, rank: 'Trained' },
      { level: 13, rank: 'Expert' },
      { level: 19, rank: 'Master' },
      { level: 20, rank: 'Legendary' }
    ],
    'Fortitude': [
      { level: 1, rank: 'Expert' },
      { level: 11, rank: 'Master' },
      { level: 19, rank: 'Legendary' }
    ],
    'Reflex': [
      { level: 1, rank: 'Trained' },
      { level: 13, rank: 'Expert' },
      { level: 17, rank: 'Master' },
      { level: 19, rank: 'Legendary' }
    ],
    'Will': [
      { level: 1, rank: 'Expert' },
      { level: 13, rank: 'Master' },
      { level: 19, rank: 'Legendary' }
    ],
    'Spells': [
      { level: 1, rank: 'Trained' },
      { level: 7, rank: 'Expert' },
      { level: 15, rank: 'Master' },
      { level: 19, rank: 'Legendary' }
    ],
    'Perception': [
      { level: 1, rank: 'Trained' },
      { level: 5, rank: 'Expert' },
      { level: 11, rank: 'Master' },
      { level: 17, rank: 'Legendary' }
    ]
  };

  const rankColors = {
    'Untrained': 'text-slate-500',
    'Trained': 'text-green-400',
    'Expert': 'text-blue-400',
    'Master': 'text-purple-400',
    'Legendary': 'text-yellow-400'
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-lg p-4 border border-blue-500/50">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-blue-300">Proficiency Progression</h3>
        <Tooltip content={
          <>
            <div className="font-semibold text-blue-300 mb-2">Proficiency Ranks</div>
            <div className="space-y-2 text-slate-300 text-sm">
              <div className="bg-slate-700/50 p-2 rounded">
                <p>Proficiencies increase automatically at specific levels:</p>
                <ul className="pl-4 mt-2 space-y-1">
                  <li>• Trained: +level</li>
                  <li>• Expert: +level+2</li>
                  <li>• Master: +level+4</li>
                  <li>• Legendary: +level+6</li>
                </ul>
              </div>
            </div>
          </>
        }>
          <Info className="w-4 h-4 text-blue-400 hover:text-blue-300" />
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(proficiencies).map(([name, progression]) => {
          const current = getProficiencyRank(progression);

          return (
            <div key={name} className="bg-slate-800/50 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-200">{name}</span>
                <span className={`text-sm font-bold ${rankColors[current.rank]}`}>
                  {current.rank}
                </span>
              </div>

              <div className="space-y-1">
                {progression.map((item, idx) => {
                  const isActive = item.level <= level;
                  const isCurrent = item === current;

                  return (
                    <div
                      key={idx}
                      className={`text-xs flex items-center justify-between px-2 py-1 rounded ${
                        isCurrent
                          ? 'bg-blue-600/30 text-blue-300'
                          : isActive
                          ? 'bg-green-900/20 text-green-400'
                          : 'text-slate-500'
                      }`}
                    >
                      <span>Lvl {item.level}</span>
                      <span>{item.rank}</span>
                      {isCurrent && <Check className="w-3 h-3" />}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Main ProgressionTab Component
export default function NewProgressionTab({
  level,
  abilityBoosts,
  getAbilityScore,
  BASE_ABILITY_SCORES
}) {
  // Generate features for each level
  const getLevelFeatures = (levelNum) => {
    const features = [];

    // Level 1 features
    if (levelNum === 1) {
      features.push(
        { name: 'Ancestry and Background', description: 'Choose your ancestry, heritage, and background', type: 'Character Creation' },
        { name: 'Initial Proficiencies', description: 'Gain proficiencies based on your class', type: 'Class Feature' },
        { name: 'Deity and Doctrine', description: 'Choose your deity and warpriest doctrine', type: 'Class Feature' },
        { name: 'Divine Font', description: 'Gain additional Heal or Harm spells', type: 'Class Feature' },
        { name: 'Divine Spellcasting', description: 'Can prepare and cast divine spells', type: 'Class Feature' }
      );
    }

    // Class Feats (every even level)
    if (levelNum % 2 === 0 && levelNum > 0) {
      features.push({ name: 'Class Feat', description: `Choose a cleric class feat of level ${levelNum} or lower`, type: 'Feat' });
    }

    // Ancestry Feats (1, 5, 9, 13, 17)
    if ([1, 5, 9, 13, 17].includes(levelNum)) {
      features.push({ name: 'Ancestry Feat', description: `Choose an ancestry feat of level ${levelNum} or lower`, type: 'Feat' });
    }

    // Skill Feats (2, then every even level)
    if (levelNum >= 2 && levelNum % 2 === 0) {
      features.push({ name: 'Skill Feat', description: 'Choose a skill feat', type: 'Feat' });
    }

    // General Feats (3, 7, 11, 15, 19)
    if ([3, 7, 11, 15, 19].includes(levelNum)) {
      features.push({ name: 'General Feat', description: 'Choose a general feat', type: 'Feat' });
    }

    // Ability Boosts (5, 10, 15, 20)
    if ([5, 10, 15, 20].includes(levelNum)) {
      features.push({ name: 'Ability Boosts', description: 'Increase four ability scores', type: 'Ability' });
    }

    // Skill Increases (3, 5, 7, 9, 11, 13, 15, 17, 19)
    if ([3, 5, 7, 9, 11, 13, 15, 17, 19].includes(levelNum)) {
      features.push({ name: 'Skill Increase', description: 'Increase one skill proficiency rank', type: 'Skill' });
    }

    // Warpriest specific features
    if (levelNum === 3) features.push({ name: 'Second Doctrine', description: 'Gain additional warpriest benefits', type: 'Class Feature' });
    if (levelNum === 7) features.push({ name: 'Third Doctrine', description: 'Weapon expertise, expert divine spellcasting', type: 'Class Feature' });
    if (levelNum === 11) features.push({ name: 'Fourth Doctrine', description: 'Divine defense, weapon mastery', type: 'Class Feature' });
    if (levelNum === 13) features.push({ name: 'Weapon Specialization', description: 'Deal extra damage with weapons', type: 'Class Feature' });
    if (levelNum === 15) features.push({ name: 'Fifth Doctrine', description: 'Master divine spellcasting', type: 'Class Feature' });
    if (levelNum === 19) features.push({ name: 'Sixth Doctrine', description: 'Legendary divine spellcasting, weapon legendary', type: 'Class Feature' });

    return features;
  };

  const milestones = [5, 10, 15, 20];

  return (
    <div className="space-y-6">
      {/* Current Level Summary */}
      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-lg p-6 border border-purple-500/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{level}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-purple-300">Level {level}</h2>
            <p className="text-slate-400">Minotaur Warpriest of Irori</p>
          </div>
        </div>
      </div>

      {/* Ability Boosts */}
      <AbilityBoostTracker
        level={level}
        abilityBoosts={ABILITY_BOOST_PROGRESSION}
        BASE_ABILITY_SCORES={BASE_ABILITY_SCORES}
        getAbilityScore={getAbilityScore}
      />

      {/* Proficiency Progression */}
      <ProficiencyProgression level={level} />

      {/* Level Timeline */}
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-slate-300 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Level Progression (1-20)
        </h3>

        <div className="space-y-3">
          {[...Array(20)].map((_, idx) => {
            const levelNum = idx + 1;
            const features = getLevelFeatures(levelNum);
            const isMilestone = milestones.includes(levelNum);

            return (
              <LevelCard
                key={levelNum}
                levelNum={levelNum}
                currentLevel={level}
                features={features}
                isMilestone={isMilestone}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
