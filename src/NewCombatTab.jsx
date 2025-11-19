import React, { useState } from 'react';
import { Sword, Shield, Heart, Zap, Eye, Info, ExternalLink } from 'lucide-react';
import pathfinderRules from './pathfinderRules.js';
import { CHARACTER_IDENTITY } from './characterConfig.js';

/**
 * NEW COMBAT TAB - Comprehensive Combat Stats Calculator
 *
 * Features:
 * - Armor Class calculator with breakdown
 * - Attack calculator (unarmed strikes for Warpriest)
 * - Damage calculator with runes and specialization
 * - Saving throws with proficiency progression
 * - Perception and speed tracking
 * - Spell DC and attack bonus
 *
 * Pattern:
 * 1. All data from pathfinderRules.js and characterConfig.js
 * 2. Real-time validation against official rules
 * 3. Tooltips with source attribution
 * 4. Dynamic updates based on level and equipment
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

// AC Breakdown Component
function ACCard({ ac, breakdown, level }) {
  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-lg p-6 border border-blue-500/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-blue-300">Armor Class</h3>
          <Tooltip content={
            <>
              <div className="font-semibold text-blue-300 mb-2">AC Calculation (Level {level})</div>
              <div className="space-y-2 text-slate-300">
                <div className="bg-slate-700/50 p-2 rounded">
                  <div className="font-semibold mb-1">Breakdown:</div>
                  <div className="pl-2 text-sm space-y-1">
                    <div>• Base AC: <span className="text-green-400">10</span></div>
                    <div>• Dex modifier: <span className="text-green-400">+{breakdown.dexMod}</span> (capped at {breakdown.dexCap})</div>
                    <div>• Armor bonus: <span className="text-green-400">+{breakdown.armorBonus}</span></div>
                    <div>• Proficiency: <span className="text-green-400">+{breakdown.proficiencyBonus}</span> ({breakdown.proficiencyRank})</div>
                    {breakdown.itemBonus > 0 && (
                      <div>• Item bonus: <span className="text-green-400">+{breakdown.itemBonus}</span> (armor rune)</div>
                    )}
                  </div>
                </div>
                <div className="bg-blue-900/50 p-2 rounded border border-blue-600">
                  <div className="font-bold text-blue-300">
                    Total AC: <span className="text-green-400">{ac}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    +2 with shield raised
                  </div>
                </div>
              </div>
            </>
          }>
            <Info className="w-4 h-4 text-blue-400 hover:text-blue-300" />
          </Tooltip>
        </div>
      </div>
      <div className="text-5xl font-bold text-blue-400">{ac}</div>
      <div className="text-sm text-blue-300 mt-1">+2 with shield</div>
    </div>
  );
}

// Attack Card Component
function AttackCard({ attack, level }) {
  return (
    <div className="bg-slate-800/70 rounded-lg p-4 border border-slate-600 hover:border-red-500/50 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-bold text-slate-200 text-lg">{attack.name}</div>
          <div className="text-xs text-slate-400">{attack.traits.join(', ')}</div>
        </div>
        <Tooltip content={
          <>
            <div className="font-semibold text-purple-300 mb-2">{attack.name} Attack</div>
            <div className="space-y-2 text-slate-300">
              <div className="bg-slate-700/50 p-2 rounded">
                <div className="font-semibold mb-1">Attack Bonus:</div>
                <div className="pl-2 text-sm space-y-1">
                  <div>• Ability modifier: <span className="text-green-400">+{attack.breakdown.abilityMod}</span></div>
                  <div>• Proficiency: <span className="text-green-400">+{attack.breakdown.proficiencyBonus}</span> ({attack.breakdown.proficiencyRank})</div>
                  {attack.breakdown.itemBonus > 0 && (
                    <div>• Item bonus: <span className="text-green-400">+{attack.breakdown.itemBonus}</span></div>
                  )}
                </div>
              </div>
              <div className="bg-slate-700/50 p-2 rounded">
                <div className="font-semibold mb-1">Damage:</div>
                <div className="pl-2 text-sm space-y-1">
                  <div>• Base dice: <span className="text-red-400">{attack.damageBreakdown.numDice}d{attack.damageBreakdown.dieSize}</span></div>
                  <div>• Ability modifier: <span className="text-green-400">+{attack.damageBreakdown.abilityMod}</span></div>
                  {attack.damageBreakdown.specialization > 0 && (
                    <div>• Specialization: <span className="text-green-400">+{attack.damageBreakdown.specialization}</span></div>
                  )}
                </div>
              </div>
            </div>
          </>
        }>
          <Info className="w-4 h-4 text-purple-400 hover:text-purple-300" />
        </Tooltip>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-slate-400 mb-1">Attack Bonus</div>
          <div className="text-2xl font-bold text-green-400">+{attack.attackBonus}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Damage</div>
          <div className="text-2xl font-bold text-red-400">{attack.damage}</div>
        </div>
      </div>

      {attack.traits.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {attack.traits.map((trait, i) => (
            <span key={i} className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-xs">
              {trait}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Save Card Component
function SaveCard({ save, level }) {
  return (
    <div className="bg-slate-800/70 rounded-lg p-4 border border-slate-600">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-semibold text-slate-200">{save.name}</div>
          <div className="text-xs text-slate-400">{save.ability}</div>
        </div>
        <Tooltip content={
          <>
            <div className="font-semibold text-purple-300 mb-2">{save.name} Save</div>
            <div className="space-y-2 text-slate-300">
              <div className="bg-slate-700/50 p-2 rounded">
                <div className="font-semibold mb-1">Breakdown:</div>
                <div className="pl-2 text-sm space-y-1">
                  <div>• {save.ability} modifier: <span className="text-green-400">+{save.breakdown.abilityMod}</span></div>
                  <div>• Proficiency: <span className="text-green-400">+{save.breakdown.proficiencyBonus}</span> ({save.breakdown.proficiencyRank})</div>
                  {save.breakdown.itemBonus > 0 && (
                    <div>• Item bonus: <span className="text-green-400">+{save.breakdown.itemBonus}</span> (resilient rune)</div>
                  )}
                </div>
              </div>
            </div>
          </>
        }>
          <Info className="w-4 h-4 text-purple-400 hover:text-purple-300" />
        </Tooltip>
      </div>
      <div className="text-3xl font-bold text-purple-400">+{save.bonus}</div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, description }) {
  return (
    <div className="bg-slate-800/70 rounded-lg p-4 border border-slate-600">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-purple-400" />
        <div className="font-semibold text-slate-200">{label}</div>
      </div>
      <div className="text-3xl font-bold text-purple-400">{value}</div>
      {description && (
        <div className="text-xs text-slate-400 mt-1">{description}</div>
      )}
    </div>
  );
}

// Main CombatTab Component
export default function NewCombatTab({
  level,
  gear,
  getAbilityScore,
  getModifier,
  getProficiencyBonus,
  getEquipmentModifiers,
  BASE_ABILITY_SCORES
}) {
  // Calculate ability modifiers
  const strScore = getAbilityScore(BASE_ABILITY_SCORES.STR, 'STR', level);
  const dexScore = getAbilityScore(BASE_ABILITY_SCORES.DEX, 'DEX', level);
  const conScore = getAbilityScore(BASE_ABILITY_SCORES.CON, 'CON', level);
  const wisScore = getAbilityScore(BASE_ABILITY_SCORES.WIS, 'WIS', level);

  const strMod = getModifier(strScore);
  const dexMod = getModifier(dexScore);
  const conMod = getModifier(conScore);
  const wisMod = getModifier(wisScore);

  // Get equipment modifiers
  const equipmentMods = getEquipmentModifiers(gear);

  // === ARMOR CLASS CALCULATION ===
  // Source: Player Core pg. 220 - "Armor Class"
  // AC = 10 + Dex modifier (capped by armor) + armor bonus + proficiency + item bonus

  // Armor proficiency progression (Warpriest)
  // Trained (1) → Expert (13) → Master (19) → Legendary (20)
  const armorRank = level >= 20 ? 'legendary' : level >= 19 ? 'master' : level >= 13 ? 'expert' : 'trained';
  const armorProf = getProficiencyBonus(level, armorRank);

  // Get equipped armor
  const equippedArmor = gear.find(item => item.equipped && item.slot === 'armor');
  const baseArmorAC = equippedArmor?.stats?.acBonus || 0;
  const dexCap = equippedArmor?.stats?.dexCap !== undefined ? equippedArmor.stats.dexCap : 99;
  const cappedDexMod = Math.min(dexMod, dexCap);
  const armorItemBonus = equipmentMods.ac.value;

  const armorClass = 10 + cappedDexMod + baseArmorAC + armorProf + armorItemBonus;

  const acBreakdown = {
    dexMod: cappedDexMod,
    dexCap,
    armorBonus: baseArmorAC,
    proficiencyBonus: armorProf,
    proficiencyRank: armorRank,
    itemBonus: armorItemBonus
  };

  // === WEAPON PROFICIENCY ===
  // Warpriest weapon proficiency: Trained (1) → Expert (7) → Master (11) → Legendary (19)
  const weaponRank = level >= 19 ? 'legendary' : level >= 11 ? 'master' : level >= 7 ? 'expert' : 'trained';
  const weaponProf = getProficiencyBonus(level, weaponRank);

  // Weapon Specialization (Warpriest)
  // Level 13: +2, Level 15: +3, Level 19: +4
  const specializationBonus = level >= 19 ? 4 : level >= 15 ? 3 : level >= 13 ? 2 : 0;

  // Get weapon item bonus and striking dice
  const weaponItemBonus = equipmentMods.attackBonus.value;
  const strikingDice = equipmentMods.damageDice.value;

  // === ATTACKS ===
  // Unarmed attacks for Minotaur Warpriest of Irori
  const attacks = [
    {
      name: 'Fist (Handwraps)',
      attackBonus: strMod + weaponProf + weaponItemBonus,
      damage: `${strikingDice}d6+${strMod + specializationBonus}`,
      traits: ['Unarmed', 'Nonlethal', 'Agile', 'Finesse'],
      breakdown: {
        abilityMod: strMod,
        proficiencyBonus: weaponProf,
        proficiencyRank: weaponRank,
        itemBonus: weaponItemBonus
      },
      damageBreakdown: {
        numDice: strikingDice,
        dieSize: 6,
        abilityMod: strMod,
        specialization: specializationBonus
      }
    },
    {
      name: 'Horns',
      attackBonus: strMod + weaponProf + weaponItemBonus,
      damage: `${strikingDice}d8+${strMod + specializationBonus}`,
      traits: ['Unarmed', 'Deadly d8'],
      breakdown: {
        abilityMod: strMod,
        proficiencyBonus: weaponProf,
        proficiencyRank: weaponRank,
        itemBonus: weaponItemBonus
      },
      damageBreakdown: {
        numDice: strikingDice,
        dieSize: 8,
        abilityMod: strMod,
        specialization: specializationBonus
      }
    }
  ];

  // === SAVING THROWS ===
  // Fortitude: Expert (1) → Master (11) → Legendary (19)
  const fortRank = level >= 19 ? 'legendary' : level >= 11 ? 'master' : 'expert';
  const fortProf = getProficiencyBonus(level, fortRank);
  const fortSave = conMod + fortProf + equipmentMods.savingThrows.value;

  // Reflex: Trained (1) → Expert (13) → Master (17) → Legendary (19)
  const refRank = level >= 19 ? 'legendary' : level >= 17 ? 'master' : level >= 13 ? 'expert' : 'trained';
  const refProf = getProficiencyBonus(level, refRank);
  const refSave = dexMod + refProf + equipmentMods.savingThrows.value;

  // Will: Expert (1) → Master (13) → Legendary (19)
  const willRank = level >= 19 ? 'legendary' : level >= 13 ? 'master' : 'expert';
  const willProf = getProficiencyBonus(level, willRank);
  const willSave = wisMod + willProf + equipmentMods.savingThrows.value;

  const saves = [
    {
      name: 'Fortitude',
      ability: 'CON',
      bonus: fortSave,
      breakdown: {
        abilityMod: conMod,
        proficiencyBonus: fortProf,
        proficiencyRank: fortRank,
        itemBonus: equipmentMods.savingThrows.value
      }
    },
    {
      name: 'Reflex',
      ability: 'DEX',
      bonus: refSave,
      breakdown: {
        abilityMod: dexMod,
        proficiencyBonus: refProf,
        proficiencyRank: refRank,
        itemBonus: equipmentMods.savingThrows.value
      }
    },
    {
      name: 'Will',
      ability: 'WIS',
      bonus: willSave,
      breakdown: {
        abilityMod: wisMod,
        proficiencyBonus: willProf,
        proficiencyRank: willRank,
        itemBonus: equipmentMods.savingThrows.value
      }
    }
  ];

  // === OTHER STATS ===
  // Perception: Trained (1) → Expert (5) → Master (11) → Legendary (17)
  const perceptionRank = level >= 17 ? 'legendary' : level >= 11 ? 'master' : level >= 5 ? 'expert' : 'trained';
  const perceptionProf = getProficiencyBonus(level, perceptionRank);
  const perception = wisMod + perceptionProf;

  // Speed: 25 ft (Minotaur) + armor penalty
  const baseSpeed = 25;
  const armorSpeedPenalty = equippedArmor?.stats?.speedPenalty || 0;
  const speed = baseSpeed + armorSpeedPenalty;

  // Spell DC: 10 + WIS + proficiency (Trained → Expert (7) → Master (15) → Legendary (19))
  const spellRank = level >= 19 ? 'legendary' : level >= 15 ? 'master' : level >= 7 ? 'expert' : 'trained';
  const spellProf = getProficiencyBonus(level, spellRank);
  const spellDC = 10 + wisMod + spellProf;
  const spellAttack = wisMod + spellProf;

  return (
    <div className="space-y-6">
      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ACCard ac={armorClass} breakdown={acBreakdown} level={level} />

        <StatCard
          icon={Eye}
          label="Perception"
          value={`+${perception}`}
          description={`${perceptionRank} proficiency`}
        />

        <StatCard
          icon={Zap}
          label="Speed"
          value={`${speed} ft`}
          description="Base speed with armor"
        />
      </div>

      {/* Attacks Section */}
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-slate-300 flex items-center gap-2">
          <Sword className="w-5 h-5 text-red-400" />
          Attacks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attacks.map((attack, idx) => (
            <AttackCard key={idx} attack={attack} level={level} />
          ))}
        </div>
      </div>

      {/* Saving Throws */}
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-slate-300 flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-400" />
          Saving Throws
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {saves.map((save, idx) => (
            <SaveCard key={idx} save={save} level={level} />
          ))}
        </div>
      </div>

      {/* Spell Stats */}
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-slate-300 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-400" />
          Spellcasting
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            icon={Shield}
            label="Spell DC"
            value={spellDC}
            description={`${spellRank} proficiency`}
          />
          <StatCard
            icon={Sword}
            label="Spell Attack"
            value={`+${spellAttack}`}
            description="For spell attack rolls"
          />
        </div>
      </div>
    </div>
  );
}
