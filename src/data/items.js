export const ITEMS = [
  // ─── PRIMARY WEAPONS ────────────────────────────────────────────────────────
  { id: 'primary_liberator',               category: 'primary',    name: 'AR-23 Liberator' },
  { id: 'primary_liberator_concussive',    category: 'primary',    name: 'AR-23C Liberator Concussive' },
  { id: 'primary_liberator_penetrator',    category: 'primary',    name: 'AR-23P Liberator Penetrator' },
  { id: 'primary_adjudicator',             category: 'primary',    name: 'BR-14 Adjudicator' },
  { id: 'primary_dominator',              category: 'primary',    name: 'JAR-5 Dominator' },
  { id: 'primary_diligence',              category: 'primary',    name: 'PLAS-1 Diligence' },
  { id: 'primary_diligence_cs',           category: 'primary',    name: 'PLAS-1 Diligence Counter Sniper' },
  { id: 'primary_defender',              category: 'primary',    name: 'SMG-37 Defender' },
  { id: 'primary_pummeler',              category: 'primary',    name: 'SMG-72 Pummeler' },
  { id: 'primary_scorcher',              category: 'primary',    name: 'PLAS-101 Scorcher' },
  { id: 'primary_punisher',              category: 'primary',    name: 'SG-8 Punisher' },
  { id: 'primary_punisher_plasma',        category: 'primary',    name: 'SG-8P Punisher Plasma' },
  { id: 'primary_slugger',               category: 'primary',    name: 'SG-8S Slugger' },
  { id: 'primary_spray_and_pray',         category: 'primary',    name: 'SG-225SP Breaker Spray&Pray' },
  { id: 'primary_breaker',               category: 'primary',    name: 'SG-225 Breaker' },
  { id: 'primary_breaker_incendiary',     category: 'primary',    name: 'SG-225IE Breaker Incendiary' },
  { id: 'primary_sickle',                category: 'primary',    name: 'LAS-16 Sickle' },
  { id: 'primary_scythe',                category: 'primary',    name: 'LAS-5 Scythe' },
  { id: 'primary_blitzer',               category: 'primary',    name: 'SG-22 Blitzer' },
  { id: 'primary_torcherer',             category: 'primary',    name: 'FLAM-66 Torcherer' },
  { id: 'primary_halt',                  category: 'primary',    name: 'SG-20 Halt' },
  { id: 'primary_constitution',          category: 'primary',    name: 'R-63 Diligence' },
  { id: 'primary_eruptor',               category: 'primary',    name: 'R-36 Eruptor' },
  { id: 'primary_cookout',               category: 'primary',    name: 'SG-451 Cookout' },
  { id: 'primary_tenderizer',            category: 'primary',    name: 'AR-61 Tenderizer' },
  { id: 'primary_pummeler_mg',           category: 'primary',    name: 'MG-43 Machine Gun' },
  { id: 'primary_reprimand',             category: 'primary',    name: 'SMG-32 Reprimand' },

  // ─── SECONDARY WEAPONS ──────────────────────────────────────────────────────
  { id: 'secondary_peacemaker',          category: 'secondary',  name: 'P-2 Peacemaker' },
  { id: 'secondary_redeemer',            category: 'secondary',  name: 'P-19 Redeemer' },
  { id: 'secondary_senator',             category: 'secondary',  name: 'P-4 Senator' },
  { id: 'secondary_dagger',              category: 'secondary',  name: 'LAS-7 Dagger' },
  { id: 'secondary_grenade_pistol',      category: 'secondary',  name: 'GP-31 Grenade Pistol' },
  { id: 'secondary_verdict',             category: 'secondary',  name: 'P-113 Verdict' },
  { id: 'secondary_crisper',             category: 'secondary',  name: 'P-72 Crisper' },
  { id: 'secondary_loyalist',            category: 'secondary',  name: 'P-11 Stim Pistol' },
  { id: 'secondary_bushwhacker',         category: 'secondary',  name: 'SG-22 Bushwhacker' },
  { id: 'secondary_ultimatum',           category: 'secondary',  name: 'GP-31 Ultimatum' },

  // ─── GRENADES ───────────────────────────────────────────────────────────────
  { id: 'grenade_frag',                  category: 'grenade',    name: 'G-6 Frag' },
  { id: 'grenade_high_explosive',        category: 'grenade',    name: 'G-12 High Explosive' },
  { id: 'grenade_incendiary',            category: 'grenade',    name: 'G-10 Incendiary' },
  { id: 'grenade_smoke',                 category: 'grenade',    name: 'G-3 Smoke' },
  { id: 'grenade_stun',                  category: 'grenade',    name: 'G-23 Stun' },
  { id: 'grenade_thermite',              category: 'grenade',    name: 'G-123 Thermite' },
  { id: 'grenade_impact',                category: 'grenade',    name: 'G-16 Impact' },
  { id: 'grenade_gas',                   category: 'grenade',    name: 'G-13 Incendiary Impact' },
  { id: 'grenade_throwing_knife',        category: 'grenade',    name: 'K-2 Throwing Knife' },

  // ─── STRATAGEMS: EAGLE ──────────────────────────────────────────────────────
  { id: 'strat_eagle_airstrike',         category: 'stratagem',  subtype: 'eagle',      name: 'Eagle Airstrike' },
  { id: 'strat_eagle_cluster_bomb',      category: 'stratagem',  subtype: 'eagle',      name: 'Eagle Cluster Bomb' },
  { id: 'strat_eagle_napalm',            category: 'stratagem',  subtype: 'eagle',      name: 'Eagle Napalm Airstrike' },
  { id: 'strat_eagle_smoke',             category: 'stratagem',  subtype: 'eagle',      name: 'Eagle Smoke Strike' },
  { id: 'strat_eagle_110mm',             category: 'stratagem',  subtype: 'eagle',      name: 'Eagle 110MM Rocket Pods' },
  { id: 'strat_eagle_500kg',             category: 'stratagem',  subtype: 'eagle',      name: 'Eagle 500KG Bomb' },
  { id: 'strat_eagle_strafing',          category: 'stratagem',  subtype: 'eagle',      name: 'Eagle Strafing Run' },

  // ─── STRATAGEMS: ORBITAL ────────────────────────────────────────────────────
  { id: 'strat_orbital_gatling',         category: 'stratagem',  subtype: 'orbital',    name: 'Orbital Gatling Barrage' },
  { id: 'strat_orbital_airburst',        category: 'stratagem',  subtype: 'orbital',    name: 'Orbital Airburst Strike' },
  { id: 'strat_orbital_120mm',           category: 'stratagem',  subtype: 'orbital',    name: 'Orbital 120MM HE Barrage' },
  { id: 'strat_orbital_380mm',           category: 'stratagem',  subtype: 'orbital',    name: 'Orbital 380MM HE Barrage' },
  { id: 'strat_orbital_walking',         category: 'stratagem',  subtype: 'orbital',    name: 'Orbital Walking Barrage' },
  { id: 'strat_orbital_laser',           category: 'stratagem',  subtype: 'orbital',    name: 'Orbital Laser' },
  { id: 'strat_orbital_railcannon',      category: 'stratagem',  subtype: 'orbital',    name: 'Orbital Railcannon Strike' },
  { id: 'strat_orbital_precision',       category: 'stratagem',  subtype: 'orbital',    name: 'Orbital Precision Strike' },
  { id: 'strat_orbital_smoke',           category: 'stratagem',  subtype: 'orbital',    name: 'Orbital Smoke Strike' },
  { id: 'strat_orbital_ems',             category: 'stratagem',  subtype: 'orbital',    name: 'Orbital EMS Strike' },
  { id: 'strat_orbital_gas',             category: 'stratagem',  subtype: 'orbital',    name: 'Orbital Gas Strike' },

  // ─── STRATAGEMS: SUPPORT WEAPONS ────────────────────────────────────────────
  { id: 'strat_machine_gun',             category: 'stratagem',  subtype: 'support',    name: 'Machine Gun' },
  { id: 'strat_anti_materiel_rifle',     category: 'stratagem',  subtype: 'support',    name: 'Anti-Materiel Rifle' },
  { id: 'strat_stalwart',                category: 'stratagem',  subtype: 'support',    name: 'Stalwart' },
  { id: 'strat_expendable_at',           category: 'stratagem',  subtype: 'support',    name: 'Expendable Anti-Tank' },
  { id: 'strat_recoilless_rifle',        category: 'stratagem',  subtype: 'support',    name: 'Recoilless Rifle' },
  { id: 'strat_flamethrower',            category: 'stratagem',  subtype: 'support',    name: 'Flamethrower' },
  { id: 'strat_autocannon',              category: 'stratagem',  subtype: 'support',    name: 'Autocannon' },
  { id: 'strat_railgun',                 category: 'stratagem',  subtype: 'support',    name: 'Railgun' },
  { id: 'strat_spear',                   category: 'stratagem',  subtype: 'support',    name: 'Spear' },
  { id: 'strat_grenade_launcher',        category: 'stratagem',  subtype: 'support',    name: 'Grenade Launcher' },
  { id: 'strat_laser_cannon',            category: 'stratagem',  subtype: 'support',    name: 'Laser Cannon' },
  { id: 'strat_arc_thrower',             category: 'stratagem',  subtype: 'support',    name: 'Arc Thrower' },
  { id: 'strat_quasar_cannon',           category: 'stratagem',  subtype: 'support',    name: 'Quasar Cannon' },
  { id: 'strat_heavy_machine_gun',       category: 'stratagem',  subtype: 'support',    name: 'Heavy Machine Gun' },
  { id: 'strat_commando',                category: 'stratagem',  subtype: 'support',    name: 'Commando' },

  // ─── STRATAGEMS: DEFENSIVE / BACKPACKS ──────────────────────────────────────
  { id: 'strat_shield_relay',            category: 'stratagem',  subtype: 'defensive',  name: 'Shield Generator Relay' },
  { id: 'strat_tesla_tower',             category: 'stratagem',  subtype: 'defensive',  name: 'Tesla Tower' },
  { id: 'strat_mg_sentry',               category: 'stratagem',  subtype: 'defensive',  name: 'MG Sentry' },
  { id: 'strat_gatling_sentry',          category: 'stratagem',  subtype: 'defensive',  name: 'Gatling Sentry' },
  { id: 'strat_mortar_sentry',           category: 'stratagem',  subtype: 'defensive',  name: 'Mortar Sentry' },
  { id: 'strat_autocannon_sentry',       category: 'stratagem',  subtype: 'defensive',  name: 'Autocannon Sentry' },
  { id: 'strat_rocket_sentry',           category: 'stratagem',  subtype: 'defensive',  name: 'Rocket Sentry' },
  { id: 'strat_ems_mortar_sentry',       category: 'stratagem',  subtype: 'defensive',  name: 'EMS Mortar Sentry' },
  { id: 'strat_supply_pack',             category: 'stratagem',  subtype: 'defensive',  name: 'Supply Pack' },
  { id: 'strat_jump_pack',               category: 'stratagem',  subtype: 'defensive',  name: 'Jump Pack' },
  { id: 'strat_ballistic_shield',        category: 'stratagem',  subtype: 'defensive',  name: 'Ballistic Shield Backpack' },
  { id: 'strat_arc_shield',              category: 'stratagem',  subtype: 'defensive',  name: 'Personal Shield Generator' },
  { id: 'strat_guard_dog',               category: 'stratagem',  subtype: 'defensive',  name: 'Guard Dog' },
  { id: 'strat_guard_dog_rover',         category: 'stratagem',  subtype: 'defensive',  name: 'Guard Dog Rover' },
  { id: 'strat_patriot_exosuit',         category: 'stratagem',  subtype: 'defensive',  name: 'Patriot Exosuit' },
  { id: 'strat_emancipator_exosuit',     category: 'stratagem',  subtype: 'defensive',  name: 'Emancipator Exosuit' },
]

export function getItemInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('')
}

export const CATEGORIES = ['primary', 'secondary', 'grenade', 'stratagem']

export const CATEGORY_LABELS = {
  primary:   'Primary',
  secondary: 'Secondary',
  grenade:   'Grenade',
  stratagem: 'Stratagem',
}

export const SUBTYPE_LABELS = {
  eagle:     'Eagle',
  orbital:   'Orbital',
  support:   'Support Weapon',
  defensive: 'Defensive / Backpack',
}
