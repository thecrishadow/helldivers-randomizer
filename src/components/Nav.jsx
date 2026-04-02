import { useAdminCtx } from '../App.jsx'
import { useAuthCtx } from '../App.jsx'
import { useProfilesCtx } from '../App.jsx'

export default function Nav({ activeTab, onTabChange }) {
  const { user, logout } = useAuthCtx()
  const { isAdmin, editMode } = useAdminCtx()
  const { activeProfile } = useProfilesCtx()

  const TABS = [
    { id: 'inventory',  label: 'Inventario' },
    { id: 'randomizer', label: 'Randomizer' },
    { id: 'profile',    label: 'Mi Perfil' },
    ...(isAdmin ? [{ id: 'admin', label: '⚙ Admin' }] : []),
  ]

  return (
    <nav style={{
      background: '#111113',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 8,
      flexWrap: 'wrap',
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

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', flexShrink: 0 }}>
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
        <span style={{ fontSize: '0.8rem', color: 'var(--text-bright)', whiteSpace: 'nowrap' }}>
          {activeProfile?.name ?? user?.displayName ?? user?.email}
        </span>
        <button
          onClick={logout}
          style={{
            background: 'transparent',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            padding: '5px 10px',
            fontSize: '0.8rem',
          }}
        >
          Salir
        </button>
      </div>
    </nav>
  )
}
