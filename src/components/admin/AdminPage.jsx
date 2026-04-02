import { useState } from 'react'
import { useAdminCtx } from '../../App.jsx'
import { useProfilesCtx } from '../../App.jsx'
import { ITEMS, CATEGORY_LABELS, SUBTYPE_LABELS } from '../../data/items.js'
import ProfileForm from '../profiles/ProfileForm.jsx'

// ── Login ─────────────────────────────────────────────────────────────────────

function AdminLogin() {
  const { login } = useAdminCtx()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!login(user, pass)) setError('Usuario o contraseña incorrectos.')
  }

  return (
    <div style={{ maxWidth: 360, margin: '60px auto' }}>
      <h2 style={{ fontSize: '1.3rem', marginBottom: 8 }}>Modo Administrador</h2>
      <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: 24 }}>
        Inicia sesión para acceder al panel de administración.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="text"
          placeholder="Usuario"
          value={user}
          onChange={e => { setUser(e.target.value); setError(null) }}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={e => { setPass(e.target.value); setError(null) }}
          autoComplete="current-password"
        />
        {error && (
          <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</span>
        )}
        <button type="submit" className="btn-accent" style={{ marginTop: 4 }}>
          Iniciar sesión
        </button>
      </form>
    </div>
  )
}

// ── Edit Mode Toggle ──────────────────────────────────────────────────────────

function EditModeSection() {
  const { editMode, setEditMode } = useAdminCtx()

  return (
    <section className="admin-section">
      <h3 className="admin-section__title">Modo Edición de Imágenes</h3>
      <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: 20 }}>
        Activa el modo edición para poder subir o cambiar imágenes en el inventario.
        Con el modo desactivado, hacer clic en un objeto no abre el selector de archivos.
      </p>
      <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', width: 'fit-content' }}>
        <button
          type="button"
          className="admin-toggle"
          onClick={() => setEditMode(!editMode)}
          style={{ background: editMode ? 'var(--accent)' : 'var(--border)' }}
          aria-label={editMode ? 'Desactivar modo edición' : 'Activar modo edición'}
        >
          <div className="admin-toggle__thumb" style={{ left: editMode ? 23 : 3 }} />
        </button>
        <span style={{ fontSize: '0.9rem', color: editMode ? 'var(--accent)' : 'var(--text)' }}>
          {editMode ? 'Modo edición activado' : 'Modo edición desactivado'}
        </span>
      </label>
    </section>
  )
}

// ── Add Item ──────────────────────────────────────────────────────────────────

const SUBTYPES = ['eagle', 'orbital', 'support', 'defensive']

function AddItemSection() {
  const { customItems, addCustomItem, removeCustomItem } = useAdminCtx()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('primary')
  const [subtype, setSubtype] = useState('support')
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const allItems = [...ITEMS, ...customItems]

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) { setError('El nombre es requerido.'); return }
    if (allItems.some(i => i.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Ya existe un objeto con ese nombre.')
      return
    }
    const id = 'custom_' + trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '_') + '_' + Date.now()
    const item = {
      id,
      name: trimmed,
      category,
      ...(category === 'stratagem' ? { subtype } : {}),
    }
    addCustomItem(item)
    setName('')
    setError(null)
    setSuccess(`"${trimmed}" agregado correctamente.`)
    setTimeout(() => setSuccess(null), 3000)
  }

  return (
    <section className="admin-section">
      <h3 className="admin-section__title">Agregar Arma / Estratagema</h3>
      <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: 20 }}>
        Agrega nuevos objetos personalizados sin editar el código.
        Se guardan en el almacenamiento local del navegador.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 440 }}>
        <input
          type="text"
          placeholder="Nombre del arma o estratagema"
          value={name}
          onChange={e => { setName(e.target.value); setError(null) }}
          maxLength={60}
        />
        <div style={{ display: 'flex', gap: 10 }}>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          {category === 'stratagem' && (
            <select
              value={subtype}
              onChange={e => setSubtype(e.target.value)}
            >
              {SUBTYPES.map(s => (
                <option key={s} value={s}>{SUBTYPE_LABELS[s]}</option>
              ))}
            </select>
          )}
        </div>
        {error && <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</span>}
        {success && <span style={{ color: 'var(--success)', fontSize: '0.85rem' }}>{success}</span>}
        <button type="submit" className="btn-accent">Agregar objeto</button>
      </form>

      {customItems.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h4 style={{ fontSize: '0.875rem', color: 'var(--text-bright)', marginBottom: 12 }}>
            Objetos personalizados ({customItems.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {customItems.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--text-bright)', fontSize: '0.875rem' }}>{item.name}</div>
                  <div style={{ color: 'var(--text)', fontSize: '0.75rem', marginTop: 2 }}>
                    {CATEGORY_LABELS[item.category]}
                    {item.subtype ? ` — ${SUBTYPE_LABELS[item.subtype]}` : ''}
                  </div>
                </div>
                <button
                  onClick={() => removeCustomItem(item.id)}
                  style={{
                    background: 'transparent',
                    color: 'var(--danger)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    padding: '4px 10px',
                    fontSize: '0.8rem',
                  }}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

// ── Users ─────────────────────────────────────────────────────────────────────

function UsersSection() {
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
    if (!confirm('¿Eliminar este usuario? Se perderán los datos de inventario del perfil.')) return
    deleteProfile(id)
  }

  const ownedCount = p => Object.keys(p.ownedItems).length

  return (
    <section className="admin-section">
      <h3 className="admin-section__title">Gestión de Usuarios</h3>
      <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: 20 }}>
        Crea, renombra o elimina perfiles de usuario. Cada perfil tiene su propio inventario.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
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
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div style={{
                width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                background: isActive ? 'var(--accent)' : 'var(--border)',
              }} />

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

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-bright)', marginBottom: 14 }}>Crear nuevo usuario</h4>
        <ProfileForm />
      </div>
    </section>
  )
}

// ── Admin Panel ───────────────────────────────────────────────────────────────

function AdminPanel() {
  const { logout } = useAdminCtx()

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem' }}>Panel de Administración</h2>
        <button
          onClick={logout}
          style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', fontSize: '0.8rem' }}
        >
          Cerrar sesión
        </button>
      </div>

      <EditModeSection />
      <AddItemSection />
      <UsersSection />
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { isLoggedIn } = useAdminCtx()
  return isLoggedIn ? <AdminPanel /> : <AdminLogin />
}
