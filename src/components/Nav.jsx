import { useProfilesCtx } from '../App.jsx'
import { useAdminCtx } from '../App.jsx'

const TABS = [
  { id: 'inventory',  label: 'Inventario' },
  { id: 'randomizer', label: 'Randomizer' },
  { id: 'profiles',   label: 'Perfiles' },
  { id: 'admin',      label: '⚙ Admin' },
]

export default function Nav({ activeTab, onTabChange }) {
  const { activeProfile } = useProfilesCtx()
  const { isLoggedIn, editMode } = useAdminCtx()

  return (
    <nav style={{
      background: '#111113',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 8,
    }}>
      <span style={{
        color: 'var(--accent)',
        fontWeight: 700,
        fontSize: '1.1rem',
        letterSpacing: 1,
        marginRight: 16,
        whiteSpace: 'nowrap',
        padding: '16px 0',
      }}>
        ⚔ HD2 Randomizer
      </span>

      <div style={{ display: 'flex', gap: 4, flex: 1 }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            style={{
              background: activeTab === t.id ? 'var(--bg-card)' : 'transparent',
              color: activeTab === t.id ? 'var(--accent)' : 'var(--text)',
              borderRadius: 6,
              padding: '8px 16px',
              fontSize: '0.875rem',
              border: activeTab === t.id ? '1px solid var(--border-accent)' : '1px solid transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        {editMode && (
          <span style={{
            fontSize: '0.75rem',
            background: 'rgba(232,200,74,0.15)',
            color: 'var(--accent)',
            border: '1px solid var(--accent-dim)',
            borderRadius: 4,
            padding: '3px 8px',
            whiteSpace: 'nowrap',
          }}>
            Modo edición
          </span>
        )}
        {activeProfile && (
          <span style={{
            fontSize: '0.8rem',
            color: 'var(--text)',
            whiteSpace: 'nowrap',
            padding: '0 8px',
          }}>
            Perfil: <strong style={{ color: 'var(--text-bright)' }}>{activeProfile.name}</strong>
          </span>
        )}
      </div>
    </nav>
  )
}
