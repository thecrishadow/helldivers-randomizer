function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * @param {Set<string>} ownedSet - set of owned item IDs
 * @param {Array} allItems - full item list (base items + custom items)
 * @returns {{ primary, secondary, grenade, stratagems } | { error: string }}
 */
const EXCLUDED_SUBTYPES = new Set(['mission', 'cqc'])

export function randomize(ownedSet, allItems) {
  const byCategory = cat => allItems.filter(i => i.category === cat && ownedSet.has(i.id) && !EXCLUDED_SUBTYPES.has(i.subtype))

  const primaries   = byCategory('primary')
  const secondaries = byCategory('secondary')
  const grenades    = byCategory('grenade')
  const stratagems  = byCategory('stratagem')
 
  const errors = []
  if (primaries.length < 1)   errors.push('necesitas al menos 1 arma primaria')
  if (secondaries.length < 1) errors.push('necesitas al menos 1 arma secundaria')
  if (grenades.length < 1)    errors.push('necesitas al menos 1 granada')
  if (stratagems.length < 4)  errors.push(`necesitas al menos 4 estratagemas (tienes ${stratagems.length})`)

  if (errors.length > 0) {
    return { error: 'No tienes suficientes objetos desbloqueados: ' + errors.join(', ') + '.' }
  }

  return {
    primary:    shuffle(primaries)[0],
    secondary:  shuffle(secondaries)[0],
    grenade:    shuffle(grenades)[0],
    stratagems: shuffle(stratagems).slice(0, 4),
  }
}
