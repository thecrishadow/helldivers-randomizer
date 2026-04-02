import { useState } from 'react'
import { useProfilesCtx } from '../../App.jsx'
import { useAuthCtx } from '../../App.jsx'

export default function ProfilesPage() {
  const { user } = useAuthCtx()
  const { activeProfile, ownedSet, renameProfile } = useProfilesCtx()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  function startEdit() {
    setName(activeProfile?.name ?? '')
    setEditing(true)
  }

  async function commitEdit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    await renameProfile(name)
    setSaving(false)
    setEditing(false)
  }

  const ownedCount = ownedSet.size

  return (
    <div style={{ maxWidth: 500 }}>
      <h2 style={{ fontSize: '1.3rem', marginBottom: 24 }}>Mi Perfil</h2>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-accent)',
        borderRadius: 12,
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {/* Name */}
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            Nombre
          </div>
          {editing ? (
            <form onSubmit={commitEdit} style={{ display: 'flex', gap: 8 }}>
              <input
                autoFocus
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={40}
                style={{ maxWidth: 240 }}
              />
              <button type="submit" disabled={saving} style={{ background: 'var(--accent)', color: '#000', fontWeight: 600 }}>
                {saving ? '...' : 'Guardar'}
              </button>
              <button type="button" onClick={() => setEditing(false)}
                style={{ background: 'var(--bg-card-alt)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                Cancelar
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: 'var(--text-bright)', fontWeight: 600, fontSize: '1.1rem' }}>
                {activeProfile?.name}
              </span>
              <button
                onClick={startEdit}
                style={{ background: 'var(--bg-card-alt)', color: 'var(--text)', border: '1px solid var(--border)', fontSize: '0.8rem', padding: '4px 10px' }}
              >
                Renombrar
              </button>
            </div>
          )}
        </div>

        {/* Email / guest notice */}
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
            {user?.isAnonymous ? 'Cuenta' : 'Correo'}
          </div>
          {user?.isAnonymous ? (
            <div style={{
              background: 'rgba(232,200,74,0.1)',
              border: '1px solid var(--accent-dim)',
              borderRadius: 6,
              padding: '8px 12px',
              fontSize: '0.85rem',
              color: 'var(--accent)',
              lineHeight: 1.5,
            }}>
              Modo invitado — tu inventario solo se guarda en este dispositivo.
              <br />
              <span style={{ color: 'var(--text)', fontSize: '0.8rem' }}>
                Crea una cuenta para sincronizar tu progreso desde cualquier lugar.
              </span>
            </div>
          ) : (
            <span style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{user?.email}</span>
          )}
        </div>

        {/* Stats */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Inventario
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>
            {ownedCount}
            <span style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 400, marginLeft: 8 }}>
              objetos desbloqueados
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
