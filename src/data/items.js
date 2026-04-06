// El catálogo de ítems vive en Firestore (colección "catalog").
// Este archivo solo contiene constantes estructurales usadas en la UI.

// ─── WARBONDS ────────────────────────────────────────────────────────────────
export const WARBONDS = [
  { id: 'helldivers_mobilize',    name: 'Helldivers Mobilize!' },
  { id: 'steeled_veterans',       name: 'Steeled Veterans' },
  { id: 'cutting_edge',           name: 'Cutting Edge' },
  { id: 'democratic_detonation',  name: 'Democratic Detonation' },
  { id: 'polar_patriots',         name: 'Polar Patriots' },
  { id: 'viper_commandos',        name: 'Viper Commandos' },
  { id: 'freedoms_flame',         name: "Freedom's Flame" },
  { id: 'chemical_agents',        name: 'Chemical Agents' },
  { id: 'urban_legends',          name: 'Urban Legends' },
  { id: 'borderline_justice',     name: 'Borderline Justice' },
  { id: 'dust_devils',            name: 'Dust Devils' },
  { id: 'python_commandos',       name: 'Python Commandos' },
  { id: 'control_group',          name: 'Control Group' },
  { id: 'halo_reach',             name: 'Halo: Reach Warbond' },
  { id: 'entrenched_division',    name: 'Entrenched Division' },
  { id: 'masters_of_ceremony',    name: 'Masters of Ceremony' },
  { id: 'siege_breakers',         name: 'Siege Breakers' },
  { id: 'super_citizen',          name: 'Super Citizen Edition' },
]

// ─── CATEGORÍAS ───────────────────────────────────────────────────────────────
export const CATEGORIES = ['primary', 'secondary', 'grenade', 'armor', 'stratagem', 'booster']

export const CATEGORY_LABELS = {
  primary:   'Primaria',
  secondary: 'Secundaria',
  grenade:   'Granada',
  armor:     'Armadura',
  stratagem: 'Estratagema',
  booster:   'Booster',
}

export const CATEGORY_SUBTYPES = {
  primary:   ['assault_rifle', 'shotgun', 'marksman_rifle', 'smg', 'energy', 'explosive', 'flamethrower', 'volley_gun'],
  secondary: ['pistol', 'explosive', 'energy', 'melee'],
  grenade:   ['standard', 'special', 'incendiary'],
  armor:     ['light', 'medium', 'heavy'],
  stratagem: ['eagle', 'orbital', 'support', 'backpack', 'sentry', 'emplacement', 'mines', 'mech', 'mission', 'cqc'],
  booster:   ['supply', 'survival', 'mobility', 'recon', 'reinforcement', 'extraction', 'stealth', 'hellpod', 'combat'],
}

export const SUBTYPE_LABELS = {
  // Primary
  assault_rifle:  'Assault Rifle',
  shotgun:        'Shotgun',
  marksman_rifle: 'Marksman Rifle',
  smg:            'Submachine Gun',
  energy:         'Energy Based',
  explosive:      'Explosive',
  flamethrower:   'Flamethrower',
  volley_gun:     'Volley Gun',
  // Secondary
  pistol:         'Pistol',
  melee:          'Melee',
  // Grenade
  standard:       'Standard',
  special:        'Special',
  incendiary:     'Incendiary',
  // Armor
  light:          'Light',
  medium:         'Medium',
  heavy:          'Heavy',
  // Stratagem
  eagle:          'Eagle',
  orbital:        'Orbital',
  support:        'Support Weapon',
  backpack:       'Backpack',
  sentry:         'Sentry',
  emplacement:    'Emplacement',
  mines:          'Mines',
  mech:           'Mech',
  mission:        'Mission',
  cqc:            'CQC Especial',
  // Booster
  supply:         'Supply',
  survival:       'Survival',
  mobility:       'Mobility',
  recon:          'Recon',
  reinforcement:  'Reinforcement',
  extraction:     'Extraction',
  stealth:        'Stealth',
  hellpod:        'Hellpod',
  combat:         'Combat',
}

// Categorías que se agrupan por subtipo en el inventario
export const GROUPED_CATEGORIES = new Set(['stratagem', 'armor', 'primary', 'secondary', 'grenade', 'booster'])

export function getItemInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('')
}
