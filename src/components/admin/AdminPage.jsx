import { useState } from 'react'
import { useAdminCtx } from '../../App.jsx'
import { useAuthCtx } from '../../App.jsx'
import { ITEMS, CATEGORY_LABELS, SUBTYPE_LABELS } from '../../data/items.js'

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
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const allItems = [...ITEMS, ...customItems]

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) { setError('El nombre es requerido.'); return }
    if (allItems.some(i => i.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Ya existe un objeto con ese nombre.'); return
    }
    setLoading(true)
    try {
      await addCustomItem({
        name: trimmed,
        category,
        ...(category === 'stratagem' ? { subtype } : {}),
      })
      setName('')
      setError(null)
      setSuccess(`"${trimmed}" agregado correctamente.`)
      setTimeout(() => setSuccess(null), 3000)
    } catch {
      setError('No se pudo agregar el objeto. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="admin-section">
      <h3 className="admin-section__title">Agregar Arma / Estratagema</h3>
      <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: 20 }}>
        Agrega nuevos objetos sin editar el código. Se guardan en la nube y son visibles para todos.
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
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          {category === 'stratagem' && (
            <select value={subtype} onChange={e => setSubtype(e.target.value)}>
              {SUBTYPES.map(s => (
                <option key={s} value={s}>{SUBTYPE_LABELS[s]}</option>
              ))}
            </select>
          )}
        </div>
        {error && <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</span>}
        {success && <span style={{ color: 'var(--success)', fontSize: '0.85rem' }}>{success}</span>}
        <button type="submit" className="btn-accent" disabled={loading}>
          {loading ? 'Guardando...' : 'Agregar objeto'}
        </button>
      </form>

      {customItems.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h4 style={{ fontSize: '0.875rem', color: 'var(--text-bright)', marginBottom: 12 }}>
            Objetos personalizados ({customItems.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {customItems.map(item => (
              <div key={item.id} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--text-bright)', fontSize: '0.875rem' }}>{item.name}</div>
                  <div style={{ color: 'var(--text)', fontSize: '0.75rem', marginTop: 2 }}>
                    {CATEGORY_LABELS[item.category]}
                    {item.subtype ? ` — ${SUBTYPE_LABELS[item.subtype]}` : ''}
                  </div>
                </div>
                <button
                  onClick={() => removeCustomItem(item.id)}
                  style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.3)', padding: '4px 10px', fontSize: '0.8rem' }}
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
  const { allProfiles } = useAdminCtx()

  return (
    <section className="admin-section">
      <h3 className="admin-section__title">Usuarios registrados ({allProfiles.length})</h3>
      <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: 20 }}>
        Los usuarios se registran ellos mismos desde la pantalla de inicio.
      </p>

      {allProfiles.length === 0 ? (
        <p style={{ color: 'var(--text)', fontSize: '0.875rem' }}>No hay usuarios registrados aún.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {allProfiles.map(profile => (
            <div key={profile.id} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--text-bright)', fontSize: '0.875rem', fontWeight: 500 }}>
                  {profile.name}
                </div>
                <div style={{ color: 'var(--text)', fontSize: '0.75rem', marginTop: 2 }}>
                  {Object.keys(profile.ownedItems ?? {}).length} objetos desbloqueados
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// ── Panel ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { logout } = useAuthCtx()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await logout()
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem' }}>Panel de Administración</h2>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', fontSize: '0.8rem' }}
        >
          {loggingOut ? 'Cerrando...' : 'Cerrar sesión'}
        </button>
      </div>

      <EditModeSection />
      <AddItemSection />
      <UsersSection />
    </div>
  )
}
