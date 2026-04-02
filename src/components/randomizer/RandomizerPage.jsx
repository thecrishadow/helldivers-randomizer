import { useState, useMemo } from 'react'
import { useProfilesCtx } from '../../App.jsx'
import { useImagesCtx } from '../../App.jsx'
import { useAdminCtx } from '../../App.jsx'
import { ITEMS } from '../../data/items.js'
import { randomize } from '../../utils/randomize.js'
import LoadoutSlot from './LoadoutSlot.jsx'

const STRAT_LABELS = ['Estratagema 1', 'Estratagema 2', 'Estratagema 3', 'Estratagema 4']

export default function RandomizerPage() {
  const { ownedSet } = useProfilesCtx()
  const { images } = useImagesCtx()
  const { customItems } = useAdminCtx()
  const allItems = useMemo(() => [...ITEMS, ...customItems], [customItems])
  const [loadout, setLoadout] = useState(null)
  const [error, setError] = useState(null)
  const [rolling, setRolling] = useState(false)

  function roll() {
    setRolling(true)
    setError(null)

    // Small delay for feel
    setTimeout(() => {
      const result = randomize(ownedSet, allItems)
      if (result.error) {
        setError(result.error)
        setLoadout(null)
      } else {
        setLoadout(result)
      }
      setRolling(false)
    }, 200)
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Loadout Aleatorio</h2>
        <p style={{ color: 'var(--text)', marginBottom: 24, fontSize: '0.9rem' }}>
          Genera un loadout aleatorio con tus armas y estratagemas desbloqueadas.
        </p>
        <button
          onClick={roll}
          disabled={rolling}
          className="btn-accent"
        >
          {rolling ? 'Sorteando...' : '🎲 ¡Sortear Loadout!'}
        </button>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 10,
          padding: '16px 20px',
          color: '#fca5a5',
          marginBottom: 24,
          textAlign: 'center',
        }}>
          {error}
        </div>
      )}

      {loadout && (
        <div>
          {/* Weapons row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginBottom: 16,
          }}>
            <LoadoutSlot label="Primaria"   item={loadout.primary}   imageDataUrl={images[loadout.primary?.id]} />
            <LoadoutSlot label="Secundaria" item={loadout.secondary} imageDataUrl={images[loadout.secondary?.id]} />
            <LoadoutSlot label="Granada"    item={loadout.grenade}   imageDataUrl={images[loadout.grenade?.id]} />
          </div>

          {/* Stratagems row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
          }}>
            {loadout.stratagems.map((strat, i) => (
              <LoadoutSlot
                key={strat.id}
                label={STRAT_LABELS[i]}
                item={strat}
                imageDataUrl={images[strat.id]}
              />
            ))}
          </div>
        </div>
      )}

      {!loadout && !error && (
        <div style={{
          textAlign: 'center',
          color: 'var(--border)',
          fontSize: '4rem',
          marginTop: 40,
          userSelect: 'none',
        }}>
          🎯
        </div>
      )}
    </div>
  )
}
