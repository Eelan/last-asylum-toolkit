import { GAME_DATA } from '../data.js';

function normalizeLevel(row) {
  const [level, power, grain, timber, herb, stars, antitoxinReward, seconds, prerequisites] = row;
  return { level, power, grain, timber, herb, stars, antitoxinReward, seconds, prerequisites };
}

/** Calculates cumulative Sanctuary costs, rewards, time and power for a level range. */
export function calculateSanctuaryProgression(current, target) {
  if (target <= current) return { valid: false, levels: [] };

  const allLevels = GAME_DATA.sanctuary.map(normalizeLevel);
  const levels = allLevels.filter(row => row.level > current && row.level <= target);
  const currentPower = allLevels.find(row => row.level === current)?.power || 0;
  const targetPower = allLevels.find(row => row.level === target)?.power || currentPower;
  const totals = levels.reduce((sum, row) => ({
    grain: sum.grain + row.grain,
    timber: sum.timber + row.timber,
    herb: sum.herb + row.herb,
    stars: sum.stars + row.stars,
    antitoxinReward: sum.antitoxinReward + row.antitoxinReward,
    seconds: sum.seconds + row.seconds
  }), { grain: 0, timber: 0, herb: 0, stars: 0, antitoxinReward: 0, seconds: 0 });

  return {
    valid: true,
    levels,
    totals,
    powerGain: targetPower - currentPower,
    heroLevelCap: target * 5
  };
}
