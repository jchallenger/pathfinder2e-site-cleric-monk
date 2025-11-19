import React, { useState } from 'react';
import { Sparkles, Heart, Zap, BookOpen, Info, ExternalLink, X, Plus, Check } from 'lucide-react';
import pathfinderRules from './pathfinderRules.js';
import { CHARACTER_IDENTITY } from './characterConfig.js';

/**
 * NEW SPELLS TAB - PF2e-Compliant Spell Management System
 *
 * ⚠️ IMPORTANT: This implements OFFICIAL Pathfinder 2e prepared spellcasting rules
 *
 * How PF2e Prepared Spellcasting Works:
 * - Each spell slot is filled with a SPECIFIC SPELL during daily preparation
 * - Preparing the same spell multiple times uses multiple slots (e.g., 3 slots = 3 Bless instances)
 * - When you CAST a spell, that specific prepared instance is CONSUMED
 * - You can only cast what you specifically prepared
 * - After rest, you must RE-PREPARE spells for the new day
 *
 * Data Structure:
 * preparedSpells: {
 *   rank1: [
 *     { instanceId: 'uuid-1', spellId: 'bless' },
 *     { instanceId: 'uuid-2', spellId: 'bless' },
 *     { instanceId: 'uuid-3', spellId: 'command' }
 *   ]
 * }
 *
 * Source: https://2e.aonprd.com/Rules.aspx?ID=271
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

// Spell Slot Tracker Component
function SpellSlotTracker({ rank, maxSlots, castSlots, onRest }) {
  const availableSlots = maxSlots - castSlots;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[...Array(maxSlots)].map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full border-2 transition-all ${
              idx < availableSlots
                ? 'bg-purple-500 border-purple-500 shadow-lg shadow-purple-500/50'
                : 'bg-slate-700 border-slate-600'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-slate-400">
        {availableSlots}/{maxSlots}
      </span>
    </div>
  );
}

// Spell Card Component - For available spells library
function SpellCard({ spell, rank, preparedCount, onTogglePrepare, canPrepare }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className="bg-slate-800/70 rounded-lg p-3 border border-slate-600 hover:border-purple-500/50 transition-all">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-200">{spell.name}</h4>
              {spell.actions && (
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                  {spell.actions} {spell.actions === 1 ? 'action' : 'actions'}
                </span>
              )}
              {preparedCount > 0 && rank !== 'cantrips' && (
                <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                  ×{preparedCount}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{spell.desc}</p>
          </div>

          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={() => setShowDetails(true)}
              className="text-purple-400 hover:text-purple-300 p-1"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          {rank !== 'cantrips' && (
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={() => onTogglePrepare(spell.id)}
                disabled={!canPrepare && preparedCount === 0}
                className={`flex-1 px-3 py-1 rounded text-sm transition-all ${
                  canPrepare
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center gap-1 justify-center">
                  <Plus className="w-3 h-3" /> Prepare
                </span>
              </button>
              {preparedCount > 0 && (
                <button
                  onClick={() => onTogglePrepare(spell.id)}
                  className="px-3 py-1 bg-red-600/50 hover:bg-red-600/70 text-white text-sm rounded transition-all"
                  title="Remove one prepared instance"
                >
                  <span className="flex items-center gap-1 justify-center">
                    <X className="w-3 h-3" /> Remove
                  </span>
                </button>
              )}
            </div>
          )}

          {rank === 'cantrips' && (
            <div className="text-sm text-purple-400">Always available</div>
          )}
        </div>
      </div>

      {/* Spell Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg border border-purple-500 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-purple-300">{spell.name}</h3>
                <div className="text-sm text-slate-400 mt-1">
                  {spell.actions && `${spell.actions} actions`}
                </div>
              </div>
              <button onClick={() => setShowDetails(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded p-3">
                  <div className="font-semibold text-slate-200 mb-2">Description</div>
                  <p className="text-slate-300">{spell.desc}</p>
                </div>

                {spell.heightening && (
                  <div className="bg-blue-900/30 rounded p-3 border border-blue-700">
                    <div className="font-semibold text-blue-300 mb-2">Heightening</div>
                    <p className="text-slate-300">{spell.heightening}</p>
                  </div>
                )}

                {spell.url && (
                  <div className="bg-purple-900/30 rounded p-3 border border-purple-700">
                    <a
                      href={spell.url}
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

// Divine Font Manager Component
function DivineFontManager({ level, fontChoice, setFontChoice, castFontSlots, maxFontSlots, onCastFont }) {
  const availableSlots = maxFontSlots - castFontSlots;

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-lg p-4 border border-purple-500/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-400" />
          <h3 className="text-lg font-semibold text-purple-300">Divine Font</h3>
          <Tooltip content={
            <>
              <div className="font-semibold text-purple-300 mb-2">Divine Font</div>
              <div className="space-y-2 text-slate-300 text-sm">
                <div className="bg-slate-700/50 p-2 rounded">
                  <p>Your deity grants you additional spell slots for either Heal or Harm spells.</p>
                  <p className="mt-2">Font slots per day:</p>
                  <ul className="pl-4 mt-1 space-y-1">
                    <li>• Level 1-4: 4 slots</li>
                    <li>• Level 5-14: 5 slots</li>
                    <li>• Level 15-20: 6 slots</li>
                  </ul>
                </div>
              </div>
            </>
          }>
            <Info className="w-4 h-4 text-purple-400 hover:text-purple-300" />
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <button
          onClick={() => setFontChoice('heal')}
          className={`p-3 rounded-lg border-2 transition-all ${
            fontChoice === 'heal'
              ? 'border-green-500 bg-green-900/30'
              : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
          }`}
        >
          <div className="font-semibold text-slate-200">Heal</div>
          <div className="text-xs text-slate-400 mt-1">Restore hit points</div>
        </button>

        <button
          onClick={() => setFontChoice('harm')}
          className={`p-3 rounded-lg border-2 transition-all ${
            fontChoice === 'harm'
              ? 'border-red-500 bg-red-900/30'
              : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
          }`}
        >
          <div className="font-semibold text-slate-200">Harm</div>
          <div className="text-xs text-slate-400 mt-1">Deal void damage</div>
        </button>
      </div>

      <div className="bg-slate-800/50 rounded p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-300">Available Slots</span>
          <SpellSlotTracker
            rank="font"
            maxSlots={maxFontSlots}
            castSlots={castFontSlots}
          />
        </div>
        <button
          onClick={onCastFont}
          disabled={availableSlots === 0}
          className={`w-full px-4 py-2 rounded transition-all ${
            availableSlots > 0
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          Cast {fontChoice === 'heal' ? 'Heal' : 'Harm'}
        </button>
      </div>
    </div>
  );
}

// Main SpellsTab Component
export default function NewSpellsTab({
  level,
  preparedSpells,
  castSpell,
  unprepareSpell,
  togglePreparedSpell,
  castFontSpells,
  setCastFontSpells,
  divineFontChoice,
  setDivineFontChoice,
  onRest,
  getAbilityScore,
  getModifier,
  getProficiencyBonus,
  BASE_ABILITY_SCORES
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRank, setFilterRank] = useState('all');

  // Calculate WIS modifier and spell stats
  const wisScore = getAbilityScore(BASE_ABILITY_SCORES.WIS, 'WIS', level);
  const wisMod = getModifier(wisScore);

  // Spell proficiency: Trained (1) → Expert (7) → Master (15) → Legendary (19)
  const spellRank = level >= 19 ? 'legendary' : level >= 15 ? 'master' : level >= 7 ? 'expert' : 'trained';
  const spellProf = getProficiencyBonus(level, spellRank);

  const spellDC = 10 + wisMod + spellProf;
  const spellAttack = wisMod + spellProf;

  // Calculate max spell slots per rank based on level
  // Source: Player Core - Cleric Spell Slots table
  const getMaxSpellSlots = (rank) => {
    if (rank === 'cantrips') return 5; // Cantrips are always available

    const slotTable = {
      1: { 1: 2 },
      2: { 1: 3 },
      3: { 1: 3, 2: 2 },
      4: { 1: 3, 2: 3 },
      5: { 1: 3, 2: 3, 3: 2 },
      6: { 1: 3, 2: 3, 3: 3 },
      7: { 1: 3, 2: 3, 3: 3, 4: 2 },
      8: { 1: 3, 2: 3, 3: 3, 4: 3 },
      9: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 2 },
      10: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3 },
      11: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2 },
      12: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3 },
      13: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 2 },
      14: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3 },
      15: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 2 },
      16: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3 },
      17: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 2 },
      18: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3 },
      19: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 1 },
      20: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 1 }
    };

    return slotTable[level]?.[rank] || 0;
  };

  // Divine Font slots
  // Level 1-4: 4 slots, Level 5-14: 5 slots, Level 15-20: 6 slots
  const maxFontSlots = level >= 15 ? 6 : level >= 5 ? 5 : 4;

  // Get divine spells from rules and transform to array format
  const rawSpells = pathfinderRules.divineSpells || {};

  // Helper function to convert spell object to array with id field
  const spellsToArray = (spellsObj) => {
    if (!spellsObj) return [];
    return Object.entries(spellsObj).map(([id, spell]) => ({
      ...spell,
      id: id,
      desc: spell.description || '',
      url: spell.url || `https://2e.aonprd.com/Spells.aspx`
    }));
  };

  const divineSpells = {
    cantrips: spellsToArray(rawSpells.cantrips),
    rank1: spellsToArray(rawSpells.level1),
    rank2: spellsToArray(rawSpells.level2),
    rank3: spellsToArray(rawSpells.level3),
    rank4: spellsToArray(rawSpells.level4),
    rank5: spellsToArray(rawSpells.level5),
    rank6: spellsToArray(rawSpells.level6),
    rank7: spellsToArray(rawSpells.level7),
    rank8: spellsToArray(rawSpells.level8),
    rank9: spellsToArray(rawSpells.level9),
    rank10: spellsToArray(rawSpells.level10)
  };

  // Filter spells
  const getFilteredSpells = (rankSpells) => {
    if (!searchTerm) return rankSpells;
    return rankSpells.filter(spell =>
      spell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spell.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Cast divine font spell
  const castFontSpell = () => {
    if (castFontSpells < maxFontSlots) {
      setCastFontSpells(castFontSpells + 1);
    }
  };

  // Spell ranks to display
  const spellRanks = [
    { key: 'cantrips', label: 'Cantrips', spells: divineSpells.cantrips },
    { key: 'rank1', label: 'Rank 1', spells: divineSpells.rank1, rank: 1 },
    { key: 'rank2', label: 'Rank 2', spells: divineSpells.rank2, rank: 2 },
    { key: 'rank3', label: 'Rank 3', spells: divineSpells.rank3, rank: 3 },
    { key: 'rank4', label: 'Rank 4', spells: divineSpells.rank4, rank: 4 },
    { key: 'rank5', label: 'Rank 5', spells: divineSpells.rank5, rank: 5 },
    { key: 'rank6', label: 'Rank 6', spells: divineSpells.rank6, rank: 6 },
    { key: 'rank7', label: 'Rank 7', spells: divineSpells.rank7, rank: 7 },
    { key: 'rank8', label: 'Rank 8', spells: divineSpells.rank8, rank: 8 },
    { key: 'rank9', label: 'Rank 9', spells: divineSpells.rank9, rank: 9 },
    { key: 'rank10', label: 'Rank 10', spells: divineSpells.rank10, rank: 10 }
  ].filter(r => r.key === 'cantrips' || (r.rank && r.rank <= Math.ceil(level / 2)));

  return (
    <div className="space-y-6">
      {/* Spell DC and Attack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-lg p-4 border border-purple-500/50">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-purple-300">Spell DC</span>
          </div>
          <div className="text-4xl font-bold text-purple-400">{spellDC}</div>
          <div className="text-xs text-slate-400 mt-1">{spellRank} proficiency</div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-lg p-4 border border-blue-500/50">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-blue-300">Spell Attack</span>
          </div>
          <div className="text-4xl font-bold text-blue-400">+{spellAttack}</div>
          <div className="text-xs text-slate-400 mt-1">For attack rolls</div>
        </div>

        <button
          onClick={onRest}
          className="bg-gradient-to-br from-green-900/40 to-green-800/40 rounded-lg p-4 border border-green-500/50 hover:border-green-400 transition-all"
        >
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-green-400" />
            <span className="text-sm text-green-300">Rest</span>
          </div>
          <div className="text-sm text-slate-300">Restore all spell slots</div>
        </button>
      </div>

      {/* Divine Font */}
      <DivineFontManager
        level={level}
        fontChoice={divineFontChoice}
        setFontChoice={setDivineFontChoice}
        castFontSlots={castFontSpells}
        maxFontSlots={maxFontSlots}
        onCastFont={castFontSpell}
      />

      {/* Search */}
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search spells..."
          className="w-full bg-slate-800 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
        />
      </div>

      {/* Spell Lists by Rank */}
      {spellRanks.map(({ key, label, spells, rank }) => {
        const maxSlots = getMaxSpellSlots(rank || 'cantrips');
        const preparedInstances = preparedSpells[key] || [];
        const preparedCount = preparedInstances.length;
        const availableSlots = maxSlots - preparedCount;
        const filteredSpells = getFilteredSpells(spells || []);

        if (filteredSpells.length === 0) return null;

        return (
          <div key={key} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-slate-300">{label}</h3>
              </div>
              {key !== 'cantrips' && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">
                    {preparedCount}/{maxSlots} prepared
                  </span>
                  <div className="flex gap-1">
                    {[...Array(maxSlots)].map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-3 h-3 rounded-full border-2 transition-all ${
                          idx < preparedCount
                            ? 'bg-purple-500 border-purple-500 shadow-lg shadow-purple-500/50'
                            : 'bg-slate-700 border-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Prepared Spell Instances */}
            {key !== 'cantrips' && preparedInstances.length > 0 && (
              <div className="mb-4 bg-slate-800/50 rounded-lg p-3 border border-purple-500/30">
                <h4 className="text-sm font-semibold text-purple-300 mb-2">Prepared & Ready to Cast</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {preparedInstances.map((instance) => {
                    const spellData = spells.find(s => s.id === instance.spellId);
                    if (!spellData) return null;

                    return (
                      <div key={instance.id} className="bg-slate-700/50 rounded p-2 border border-green-600/30">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-slate-200 text-sm">{spellData.name}</div>
                            {spellData.actions && (
                              <div className="text-xs text-slate-400">
                                {spellData.actions} {spellData.actions === 1 ? 'action' : 'actions'}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => castSpell(key, instance.id)}
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-all"
                            >
                              Cast
                            </button>
                            <button
                              onClick={() => unprepareSpell(key, instance.id)}
                              className="p-1 text-slate-400 hover:text-red-400 transition-all"
                              title="Unprepare"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Spells to Prepare */}
            <div>
              {key !== 'cantrips' && (
                <h4 className="text-sm font-semibold text-slate-400 mb-2">Available Spells</h4>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredSpells.map(spell => {
                  const preparedInstancesCount = preparedInstances.filter(
                    inst => inst.spellId === spell.id
                  ).length;

                  return (
                    <SpellCard
                      key={spell.id}
                      spell={spell}
                      rank={key}
                      preparedCount={preparedInstancesCount}
                      onTogglePrepare={(id) => togglePreparedSpell(key, id)}
                      canPrepare={key === 'cantrips' || availableSlots > 0}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
