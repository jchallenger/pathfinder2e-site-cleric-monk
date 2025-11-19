import React, { useState } from 'react';
import { Sword, Heart, Shield, Zap, Sparkles, Info, ExternalLink, Package, Coins, Plus, Trash2, Check, X } from 'lucide-react';
import pathfinderRules from './pathfinderRules.js';
import { EQUIPMENT_DATABASE } from './characterConfig.js';

/**
 * NEW GEAR TAB - Comprehensive Equipment Management System
 *
 * Features:
 * - Equipment slots (weapon, armor, shield)
 * - Rune management (add/remove/upgrade)
 * - Equipment browser by category
 * - Real-time stat impact display
 * - Level-appropriate filtering
 *
 * This component demonstrates the pattern for a centralized, rules-compliant tab:
 * 1. All data sourced from pathfinderRules.js and characterConfig.js
 * 2. Real-time validation against official rules
 * 3. Tooltips with source attribution
 * 4. Dynamic updates based on character level
 */

// Reusable Tooltip component (should be extracted to shared components)
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

// Equipment Slot Component
function EquipmentSlot({ slot, equippedItem, level, onSelectSlot, onManageRunes, onUnequip, equipmentMods }) {
  const getSlotIcon = () => {
    switch(slot.id) {
      case 'weapon': return Sword;
      case 'armor': return Shield;
      case 'shield': return Shield;
      default: return Package;
    }
  };

  const Icon = getSlotIcon();

  // Get rune summary for equipped item
  const getRuneSummary = (item) => {
    if (!item?.runes) return null;
    const runes = [];
    if (item.runes.potency) runes.push(`+${item.runes.potency}`);
    if (item.runes.striking) runes.push(item.runes.striking);
    if (item.runes.resilient) runes.push(item.runes.resilient);
    return runes.length > 0 ? runes.join(' ') : null;
  };

  const runeSummary = equippedItem ? getRuneSummary(equippedItem) : null;

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-purple-400" />
          <div>
            <h4 className="font-semibold text-slate-200">{slot.name}</h4>
            <p className="text-xs text-slate-400">{slot.description}</p>
          </div>
        </div>
      </div>

      {equippedItem ? (
        <div className="space-y-3">
          <div className="bg-slate-700/50 rounded p-3 border border-purple-500/30">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="font-semibold text-purple-300">{equippedItem.name}</div>
                {runeSummary && (
                  <div className="text-xs text-green-400 mt-1">Runes: {runeSummary}</div>
                )}
              </div>
              <button
                onClick={() => onUnequip(slot.id)}
                className="text-red-400 hover:text-red-300 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Show item stats */}
            {equippedItem.stats && (
              <div className="text-xs text-slate-300 space-y-1 mb-2">
                {equippedItem.stats.acBonus && (
                  <div>AC Bonus: <span className="text-green-400">+{equippedItem.stats.acBonus}</span></div>
                )}
                {equippedItem.stats.damage && (
                  <div>Damage: <span className="text-red-400">{equippedItem.stats.damage} {equippedItem.stats.damageType}</span></div>
                )}
                {equippedItem.stats.hardness && (
                  <div>Hardness: <span className="text-blue-400">{equippedItem.stats.hardness}</span></div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => onManageRunes(equippedItem)}
                className="flex-1 bg-purple-600/50 hover:bg-purple-600/70 text-white px-3 py-1 rounded text-sm transition-all"
              >
                <Sparkles className="w-3 h-3 inline mr-1" />
                Manage Runes
              </button>
              <button
                onClick={() => onSelectSlot(slot.id)}
                className="flex-1 bg-blue-600/50 hover:bg-blue-600/70 text-white px-3 py-1 rounded text-sm transition-all"
              >
                Replace
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="text-slate-500 mb-3">No {slot.name.toLowerCase()} equipped</div>
          <button
            onClick={() => onSelectSlot(slot.id)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2 mx-auto transition-all"
          >
            <Plus className="w-4 h-4" />
            Equip {slot.name}
          </button>
        </div>
      )}
    </div>
  );
}

// Equipment Browser Component
function EquipmentBrowser({ slot, level, onEquip, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getAvailableEquipment = () => {
    const db = EQUIPMENT_DATABASE;
    let items = [];

    if (slot === 'weapon') {
      items = Object.values(db.weapons).filter(item => item.level <= level);
    } else if (slot === 'armor') {
      items = Object.values(db.armor).filter(item =>
        item.level <= level && (item.armorType === 'medium' || item.armorType === 'light')
      );
    } else if (slot === 'shield') {
      items = Object.values(db.shields).filter(item => item.level <= level);
    }

    return items.sort((a, b) => b.level - a.level);
  };

  const items = getAvailableEquipment();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg border border-purple-500 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-xl font-bold text-purple-300">Select {slot}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No {slot} available at level {level}
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/70 rounded-lg p-4 border border-slate-600 hover:border-purple-500 transition-all cursor-pointer"
                  onClick={() => onEquip(item, slot)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-slate-200">{item.name}</div>
                      <div className="text-xs text-slate-400 mt-1">{item.description}</div>
                    </div>
                    <div className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                      Lvl {item.level}
                    </div>
                  </div>

                  {/* Item Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-3">
                    {item.acBonus !== undefined && (
                      <div className="bg-slate-700/50 rounded px-2 py-1">
                        <div className="text-slate-400">AC</div>
                        <div className="text-green-400 font-semibold">+{item.acBonus}</div>
                      </div>
                    )}
                    {item.damage && (
                      <div className="bg-slate-700/50 rounded px-2 py-1">
                        <div className="text-slate-400">Damage</div>
                        <div className="text-red-400 font-semibold">{item.damage}</div>
                      </div>
                    )}
                    {item.hardness !== undefined && (
                      <div className="bg-slate-700/50 rounded px-2 py-1">
                        <div className="text-slate-400">Hardness</div>
                        <div className="text-blue-400 font-semibold">{item.hardness}</div>
                      </div>
                    )}
                    {item.bulk !== undefined && (
                      <div className="bg-slate-700/50 rounded px-2 py-1">
                        <div className="text-slate-400">Bulk</div>
                        <div className="text-slate-300 font-semibold">{item.bulk}</div>
                      </div>
                    )}
                  </div>

                  {/* Traits */}
                  {item.traits && item.traits.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.traits.map((trait, i) => (
                        <span key={i} className="bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded text-xs">
                          {trait}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Rune Manager Component
function RuneManager({ item, level, onAddRune, onRemoveRune, onClose }) {
  const [selectedRuneType, setSelectedRuneType] = useState('potency');

  const getAvailableRunes = (runeType) => {
    const runes = [];
    const fundamentalRunes = pathfinderRules.fundamentalRunes;

    if (item.type === 'weapon') {
      if (runeType === 'potency') {
        Object.entries(fundamentalRunes.weapon.potency.tiers).forEach(([tier, data]) => {
          if (data.level <= level) {
            runes.push({
              id: `weapon-potency-${tier}`,
              name: `Weapon Potency ${tier}`,
              tier: tier,
              level: data.level,
              price: data.price,
              effect: data.bonus,
              category: 'potency',
              url: fundamentalRunes.weapon.potency.url
            });
          }
        });
      } else if (runeType === 'striking') {
        Object.entries(fundamentalRunes.weapon.striking.tiers).forEach(([tier, data]) => {
          if (data.level <= level) {
            runes.push({
              id: `striking-${tier}`,
              name: tier.charAt(0).toUpperCase() + tier.slice(1),
              tier: tier,
              level: data.level,
              price: data.price,
              effect: data.bonus,
              category: 'striking',
              url: fundamentalRunes.weapon.striking.url
            });
          }
        });
      }
    } else if (item.type === 'armor') {
      if (runeType === 'potency') {
        Object.entries(fundamentalRunes.armor.potency.tiers).forEach(([tier, data]) => {
          if (data.level <= level) {
            runes.push({
              id: `armor-potency-${tier}`,
              name: `Armor Potency ${tier}`,
              tier: tier,
              level: data.level,
              price: data.price,
              effect: data.bonus,
              category: 'potency',
              url: fundamentalRunes.armor.potency.url
            });
          }
        });
      } else if (runeType === 'resilient') {
        Object.entries(fundamentalRunes.armor.resilient.tiers).forEach(([tier, data]) => {
          if (data.level <= level) {
            runes.push({
              id: `resilient-${tier}`,
              name: tier.charAt(0).toUpperCase() + tier.slice(1),
              tier: tier,
              level: data.level,
              price: data.price,
              effect: data.bonus,
              category: 'resilient',
              url: fundamentalRunes.armor.resilient.url
            });
          }
        });
      }
    }

    return runes.sort((a, b) => a.level - b.level);
  };

  const runeTypes = item.type === 'weapon'
    ? ['potency', 'striking']
    : item.type === 'armor'
    ? ['potency', 'resilient']
    : [];

  const availableRunes = getAvailableRunes(selectedRuneType);
  const currentRune = item.runes?.[selectedRuneType];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg border border-purple-500 max-w-xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-purple-300">Manage Runes</h3>
            <p className="text-sm text-slate-400">{item.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Rune Type</div>
          <div className="flex gap-2">
            {runeTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedRuneType(type)}
                className={`px-4 py-2 rounded transition-all ${
                  selectedRuneType === type
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          {currentRune && (
            <div className="mt-3 bg-green-900/30 border border-green-500/50 rounded p-2 flex items-center justify-between">
              <div className="text-sm">
                <span className="text-slate-400">Current: </span>
                <span className="text-green-400 font-semibold">{currentRune}</span>
              </div>
              <button
                onClick={() => onRemoveRune(item.id, selectedRuneType)}
                className="text-red-400 hover:text-red-300 text-xs px-2 py-1"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {availableRunes.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No {selectedRuneType} runes available at level {level}
              </div>
            ) : (
              availableRunes.map((rune) => (
                <div
                  key={rune.id}
                  className={`bg-slate-800/70 rounded-lg p-3 border transition-all cursor-pointer ${
                    currentRune === rune.tier
                      ? 'border-green-500 bg-green-900/20'
                      : 'border-slate-600 hover:border-purple-500'
                  }`}
                  onClick={() => onAddRune(item.id, rune)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold text-slate-200">{rune.name}</div>
                    <div className="flex items-center gap-2">
                      <span className="bg-purple-600 text-white px-2 py-0.5 rounded text-xs">
                        Lvl {rune.level}
                      </span>
                      {currentRune === rune.tier && (
                        <Check className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-green-400 mb-1">{rune.effect}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{rune.price}</span>
                    <a
                      href={rune.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-xs inline-flex items-center gap-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main GearTab Component
export default function NewGearTab({ gear, setGear, level, calculateTotalBulk, getEquipmentModifiers, getAbilityScore, getModifier, BASE_ABILITY_SCORES }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [runeTargetItem, setRuneTargetItem] = useState(null);

  // Equipment slots definition
  const slots = [
    { id: 'weapon', name: 'Weapon', description: 'Primary weapon or Handwraps of Mighty Blows' },
    { id: 'armor', name: 'Armor', description: 'Body armor (light/medium for Warpriest)' },
    { id: 'shield', name: 'Shield', description: 'Shield for defense' }
  ];

  // Get equipped item for a slot
  const getEquippedItem = (slotId) => {
    return gear.find(item => item.equipped && item.slot === slotId);
  };

  // Equipment management functions
  const equipItem = (itemData, slot) => {
    // Unequip any item in the same slot
    const newGear = gear.map(item => {
      if (item.slot === slot && item.equipped) {
        return { ...item, equipped: false };
      }
      return item;
    });

    // Check if item already exists in inventory
    const existingItem = newGear.find(item => item.name === itemData.name);
    if (existingItem) {
      // Equip existing item
      const updatedGear = newGear.map(item =>
        item.id === existingItem.id ? { ...item, equipped: true, slot } : item
      );
      setGear(updatedGear);
    } else {
      // Add new item to gear and equip it
      const newItem = {
        id: Date.now(),
        name: itemData.name,
        equipped: true,
        slot: slot,
        type: itemData.category,
        stats: itemData,
        runes: { potency: null, striking: null, resilient: null, property: [] },
        source: 'Equipment Database',
        url: itemData.url || ''
      };
      setGear([...newGear, newItem]);
    }
    setSelectedSlot(null);
  };

  const unequipItem = (slot) => {
    const updatedGear = gear.map(item =>
      item.slot === slot && item.equipped ? { ...item, equipped: false } : item
    );
    setGear(updatedGear);
  };

  const addRuneToItem = (itemId, runeData) => {
    const updatedGear = gear.map(item => {
      if (item.id === itemId) {
        const newRunes = { ...item.runes };
        if (runeData.category === 'potency') {
          newRunes.potency = runeData.tier;
        } else if (runeData.category === 'striking') {
          newRunes.striking = runeData.tier;
        } else if (runeData.category === 'resilient') {
          newRunes.resilient = runeData.tier;
        }
        return { ...item, runes: newRunes };
      }
      return item;
    });
    setGear(updatedGear);
  };

  const removeRuneFromItem = (itemId, runeCategory) => {
    const updatedGear = gear.map(item => {
      if (item.id === itemId) {
        const newRunes = { ...item.runes };
        newRunes[runeCategory] = null;
        return { ...item, runes: newRunes };
      }
      return item;
    });
    setGear(updatedGear);
  };

  // Calculate stats
  const totalBulk = calculateTotalBulk(gear);
  const strScore = getAbilityScore(BASE_ABILITY_SCORES.STR, 'STR', level);
  const strModifier = getModifier(strScore);
  const bulkLimit = 5 + strModifier;
  const encumbered = totalBulk > bulkLimit;
  const overloaded = totalBulk > bulkLimit + 5;

  const equipmentMods = getEquipmentModifiers(gear);
  const wealthForLevel = pathfinderRules.wealthByLevel.table[level] || pathfinderRules.wealthByLevel.table[1];

  // Get inventory items (not equipped)
  const inventory = gear.filter(item => !item.equipped);

  return (
    <div className="space-y-6">
      {/* Equipment Stat Bonuses Summary */}
      {(equipmentMods.ac.sources.length > 0 || equipmentMods.attackBonus.sources.length > 0 || equipmentMods.savingThrows.sources.length > 0 || equipmentMods.damageDice.value > 1) && (
        <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-lg p-4 border border-purple-500/50">
          <h3 className="text-lg font-bold mb-3 text-purple-300 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Active Equipment Bonuses
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {equipmentMods.attackBonus.value > 0 && (
              <div className="bg-slate-800/70 rounded p-3 border border-green-500/30">
                <div className="text-sm text-slate-400 mb-1">Attack Rolls</div>
                <div className="text-2xl font-bold text-green-400">+{equipmentMods.attackBonus.value}</div>
                <div className="text-xs text-slate-400 mt-1">Item bonus</div>
              </div>
            )}
            {equipmentMods.ac.value > 0 && (
              <div className="bg-slate-800/70 rounded p-3 border border-blue-500/30">
                <div className="text-sm text-slate-400 mb-1">Armor Class</div>
                <div className="text-2xl font-bold text-blue-400">+{equipmentMods.ac.value}</div>
                <div className="text-xs text-slate-400 mt-1">Item bonus to AC</div>
              </div>
            )}
            {equipmentMods.savingThrows.value > 0 && (
              <div className="bg-slate-800/70 rounded p-3 border border-purple-500/30">
                <div className="text-sm text-slate-400 mb-1">All Saves</div>
                <div className="text-2xl font-bold text-purple-400">+{equipmentMods.savingThrows.value}</div>
                <div className="text-xs text-slate-400 mt-1">Item bonus</div>
              </div>
            )}
            {equipmentMods.damageDice.value > 1 && (
              <div className="bg-slate-800/70 rounded p-3 border border-red-500/30">
                <div className="text-sm text-slate-400 mb-1">Damage Dice</div>
                <div className="text-2xl font-bold text-red-400">{equipmentMods.damageDice.value}d</div>
                <div className="text-xs text-slate-400 mt-1">Weapon dice</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Equipment Slots */}
      <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
        <h3 className="text-lg font-bold mb-4 text-purple-300 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Equipment Slots
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {slots.map(slot => (
            <EquipmentSlot
              key={slot.id}
              slot={slot}
              equippedItem={getEquippedItem(slot.id)}
              level={level}
              onSelectSlot={setSelectedSlot}
              onManageRunes={setRuneTargetItem}
              onUnequip={unequipItem}
              equipmentMods={equipmentMods}
            />
          ))}
        </div>
      </div>

      {/* Bulk Tracking */}
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-300">Carrying Capacity</h3>
          <div className="text-sm text-slate-400">STR {strScore} ({strModifier >= 0 ? '+' : ''}{strModifier})</div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Current Bulk:</span>
            <span className={`font-bold ${overloaded ? 'text-red-400' : encumbered ? 'text-yellow-400' : 'text-green-400'}`}>
              {totalBulk.toFixed(1)} / {bulkLimit}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                overloaded ? 'bg-red-500' : encumbered ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(100, (totalBulk / bulkLimit) * 100)}%` }}
            />
          </div>
          {encumbered && (
            <div className="text-xs text-yellow-400 flex items-center gap-1">
              <Info className="w-3 h-3" />
              {overloaded ? 'Overloaded: -10ft speed, max Dex +0' : 'Encumbered: -5ft speed, max Dex +2'}
            </div>
          )}
        </div>
      </div>

      {/* Wealth by Level Guide */}
      <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
        <h3 className="text-lg font-bold mb-3 text-purple-300 flex items-center gap-2">
          <Coins className="w-5 h-5" />
          Wealth Guidance for Level {level}
          <Tooltip content={
            <>
              <div className="font-semibold text-purple-300 mb-2">Wealth by Level</div>
              <div className="space-y-2 text-slate-300 text-sm">
                <div className="bg-slate-700/50 p-2 rounded">
                  <p className="mb-2">The Character Wealth table provides guidance for equipping characters starting at higher levels.</p>
                  <p className="text-xs text-slate-400 italic">
                    A single item on this table is always a baseline item. Property runes and precious materials must be purchased separately.
                  </p>
                </div>
                <div className="bg-purple-900/50 p-2 rounded border border-purple-600">
                  <div className="text-xs text-slate-400">
                    Source: <a href={pathfinderRules.wealthByLevel.url} target="_blank" rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5">
                      {pathfinderRules.wealthByLevel.source}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </>
          }>
            <Info className="w-4 h-4 text-purple-400 hover:text-purple-300" />
          </Tooltip>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded p-3">
            <div className="text-sm text-slate-400 mb-1">Permanent Items</div>
            {wealthForLevel.permanentItems.length > 0 ? (
              <div className="space-y-1">
                {wealthForLevel.permanentItems.map((item, idx) => (
                  <div key={idx} className="text-slate-200 flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 italic">None recommended at level 1</div>
            )}
          </div>
          <div className="bg-slate-800/50 rounded p-3">
            <div className="text-sm text-slate-400 mb-1">Currency</div>
            <div className="text-2xl font-bold text-green-400">{wealthForLevel.currency}</div>
            <div className="text-xs text-slate-400 mt-1">
              Or lump sum: <span className="text-green-400">{wealthForLevel.lumpSum}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory */}
      {inventory.length > 0 && (
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
          <h3 className="text-lg font-bold mb-3 text-slate-300 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Inventory ({inventory.length} items)
          </h3>
          <div className="space-y-2">
            {inventory.map((item) => (
              <div key={item.id} className="bg-slate-800/70 rounded-lg p-3 border border-slate-600 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">{item.name}</div>
                  {item.stats?.bulk && (
                    <div className="text-xs text-slate-400 mt-1">Bulk: {item.stats.bulk}</div>
                  )}
                </div>
                <button
                  onClick={() => {
                    const updatedGear = gear.filter(g => g.id !== item.id);
                    setGear(updatedGear);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Equipment Browser Modal */}
      {selectedSlot && (
        <EquipmentBrowser
          slot={selectedSlot}
          level={level}
          onEquip={equipItem}
          onClose={() => setSelectedSlot(null)}
        />
      )}

      {/* Rune Manager Modal */}
      {runeTargetItem && (
        <RuneManager
          item={runeTargetItem}
          level={level}
          onAddRune={addRuneToItem}
          onRemoveRune={removeRuneFromItem}
          onClose={() => setRuneTargetItem(null)}
        />
      )}
    </div>
  );
}
