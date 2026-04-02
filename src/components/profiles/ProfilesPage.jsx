import { useState } from 'react'
import { useProfilesCtx } from '../../App.jsx'
import ProfileForm from './ProfileForm.jsx'

export default function ProfilesPage() {
  const { profiles, activeProfileId, setActiveProfileId, renameProfile, deleteProfile } = useProfilesCtx()
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  function startEdit(profile) {
    setEditingId(profile.id)
    setEditName(profile.name)
  }

  function commitEdit(id) {
    renameProfile(id, editName)
    setEditingId(null)
  }

  function handleDelete(id) {
    if (!confirm('¿Eliminar este perfil? Se perderán los datos de inventario del perfil.')) return
    deleteProfile(id)
  }

  const ownedCount = p => Object.keys(p.ownedItems).length

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontSize: '1.3rem', marginBottom: 8 }}>Perfiles</h2>
      <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: 24 }}>
        Cada perfil tiene su propio inventario de armas y estratagemas desbloqueadas.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
        {profiles.map(profile => {
          const isActive = profile.id === activeProfileId
          const isEditing = editingId === profile.id

          return (
            <div
              key={profile.id}
              style={{
                background: isActive ? 'var(--bg-card)' : 'var(--bg-primary)',
                border: `1px solid ${isActive ? 'var(--border-accent)' : 'var(--border)'}`,
                borderRadius: 10,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              {/* Active indicator */}
              <div style={{
                width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                background: isActive ? 'var(--accent)' : 'var(--border)',
              }} />

              {/* Name / edit field */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {isEditing ? (
                  <form
                    onSubmit={e => { e.preventDefault(); commitEdit(profile.id) }}
                    style={{ display: 'flex', gap: 8 }}
                  >
                    <input
                      autoFocus
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      maxLength={40}
                      style={{ maxWidth: 200 }}
                    />
                    <button type="submit" style={{ background: 'var(--accent)', color: '#000', fontWeight: 600 }}>
                      Guardar
                    </button>
                    <button type="button" onClick={() => setEditingId(null)}
                      style={{ background: 'var(--bg-card-alt)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <>
                    <div style={{ color: isActive ? 'var(--text-bright)' : 'var(--text)', fontWeight: isActive ? 600 : 400 }}>
                      {profile.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text)', marginTop: 2 }}>
                      {ownedCount(profile)} objetos desbloqueados
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              {!isEditing && (
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {!isActive && (
                    <button
                      onClick={() => setActiveProfileId(profile.id)}
                      style={{ background: 'var(--accent)', color: '#000', fontWeight: 600 }}
                    >
                      Seleccionar
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(profile)}
                    style={{ background: 'var(--bg-card-alt)', color: 'var(--text)', border: '1px solid var(--border)' }}
                  >
                    Renombrar
                  </button>
                  <button
                    onClick={() => handleDelete(profile.id)}
                    style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.3)' }}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24 }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 16 }}>Crear nuevo perfil</h3>
        <ProfileForm />
      </div>
    </div>
  )
}
