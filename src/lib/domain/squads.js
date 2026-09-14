/** Keeps five ordered slots; legacy three-slot formations retain their indices, clearing removed heroes and duplicate assignments. */
export function normalizeSlots(slots, heroes) {
  const available = new Set(heroes.map((hero) => hero.id));
  const seen = new Set();
  return Array.from({ length: 5 }, (_, index) => {
    const id = Array.isArray(slots) ? slots[index] : null;
    if (!available.has(id) || seen.has(id)) return null;
    seen.add(id);
    return id;
  });
}

/** Unknown power stays unknown; empty formations have no meaningful total. */
export function squadPower(slots, heroes) {
  const members = slots.filter(Boolean).map((id) => heroes.find((hero) => hero.id === id));
  if (!members.length || members.some((hero) => !hero || !Number.isFinite(hero.power) || hero.power < 0))
    return null;
  return members.reduce((total, hero) => total + hero.power, 0);
}
