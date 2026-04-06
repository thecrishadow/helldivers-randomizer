import { useState, useMemo } from 'react'
import { useAdminCtx } from '../../App.jsx'
import { useAuthCtx } from '../../App.jsx'
import {
  CATEGORY_LABELS, CATEGORY_SUBTYPES, SUBTYPE_LABELS,
  CATEGORIES, WARBONDS,
} from '../../data/items.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

const FREE_WARBOND = { id: null, name: '— Sin Warbond (Req. Slips) —' }
const ALL_WARBONDS = [FREE_WARBOND, ...WARBONDS]

const ACTION_LABELS = { create: 'Creado', update: 'Editado', delete: 'Eliminado' }
const ACTION_COLORS = { create: 'var(--success)', update: 'var(--accent)', delete: 'var(--danger)' }

function formatTs(ts) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })
}

// ── Edit Mode Toggle ──────────────────────────────────────────────────────────

function EditModeSection() {
  const { editMode, setEditMode } = useAdminCtx()

  return (
    <section className="admin-section">
      <h3 className="admin-section__title">Modo Edición de Imágenes</h3>
      <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: 20 }}>
        Activa el modo edición para poder subir o cambiar imágenes en el inventario.
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

// ── Item Form (shared by Add and Edit) ────────────────────────────────────────

function ItemForm({ initial, onSave, onCancel, loading }) {
  const [name, setName]       = useState(initial?.name ?? '')
  const [category, setCategory] = useState(initial?.category ?? 'primary')
  const [subtype, setSubtype]   = useState(initial?.subtype ?? CATEGORY_SUBTYPES['primary'][0])
  const [warbond, setWarbond]   = useState(initial?.warbond ?? null)
  const [archived, setArchived] = useState(initial?.archived ?? false)
  const [error, setError]       = useState(null)

  function handleCategoryChange(cat) {
    setCategory(cat)
    setSubtype(CATEGORY_SUBTYPES[cat][0])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) { setError('El nombre es requerido.'); return }
    setError(null)
    await onSave({ name: trimmed, category, subtype, warbond: warbond || null, archived })
  }

  const inputStyle = { fontSize: '0.85rem', padding: '6px 10px', width: '100%', boxSizing: 'border-box' }
  const labelStyle = { fontSize: '0.75rem', color: 'var(--text)', marginBottom: 3, display: 'block' }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <label style={labelStyle}>Nombre</label>
        <input
          autoFocus
          type="text"
          placeholder="Nombre del ítem"
          value={name}
          onChange={e => { setName(e.target.value); setError(null) }}
          maxLength={80}
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div>
          <label style={labelStyle}>Categoría</label>
          <select value={category} onChange={e => handleCategoryChange(e.target.value)} style={inputStyle}>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Subtipo</label>
          <select value={subtype} onChange={e => setSubtype(e.target.value)} style={inputStyle}>
            {CATEGORY_SUBTYPES[category].map(s => (
              <option key={s} value={s}>{SUBTYPE_LABELS[s] ?? s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Warbond</label>
        <select value={warbond ?? ''} onChange={e => setWarbond(e.target.value || null)} style={inputStyle}>
          {ALL_WARBONDS.map(wb => (
            <option key={wb.id ?? '__free__'} value={wb.id ?? ''}>{wb.name}</option>
          ))}
        </select>
      </div>

      {initial && (
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text)', cursor: 'pointer' }}>
          <input type="checkbox" checked={archived} onChange={e => setArchived(e.target.checked)} />
          Archivado (oculto en el inventario)
        </label>
      )}

      {error && <span style={{ color: 'var(--danger)', fontSize: '0.82rem' }}>{error}</span>}

      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button type="submit" className="btn-accent" disabled={loading} style={{ flex: 1 }}>
          {loading ? 'Guardando...' : (initial ? 'Guardar cambios' : 'Agregar ítem')}
        </button>
        <button type="button" onClick={onCancel} disabled={loading}
          style={{ flex: 1, background: 'var(--bg-card-alt)', color: 'var(--text)', border: '1px solid var(--border)' }}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

// ── Catalog Section ───────────────────────────────────────────────────────────

function CatalogSection() {
  const { catalogItems, addCatalogItem, updateCatalogItem, deleteCatalogItem } = useAdminCtx()
  const [filterCat, setFilterCat]   = useState('all')
  const [filterText, setFilterText] = useState('')
  const [showAdd, setShowAdd]       = useState(false)
  const [editingId, setEditingId]   = useState(null)
  const [loading, setLoading]       = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = useMemo(() => {
    return catalogItems
      .filter(i => filterCat === 'all' || i.category === filterCat)
      .filter(i => !filterText || i.name.toLowerCase().includes(filterText.toLowerCase()))
      .sort((a, b) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category)
        if (a.subtype !== b.subtype) return (a.subtype ?? '').localeCompare(b.subtype ?? '')
        return a.name.localeCompare(b.name)
      })
  }, [catalogItems, filterCat, filterText])

  async function handleAdd(data) {
    setLoading(true)
    try { await addCatalogItem(data); setShowAdd(false) }
    finally { setLoading(false) }
  }

  async function handleUpdate(item, data) {
    setLoading(true)
    try { await updateCatalogItem(item.id, data, item); setEditingId(null) }
    finally { setLoading(false) }
  }

  async function handleDelete(item) {
    setLoading(true)
    try { await deleteCatalogItem(item.id, item.name); setConfirmDelete(null) }
    finally { setLoading(false) }
  }

  return (
    <section className="admin-section">
      <h3 className="admin-section__title">Catálogo de ítems ({catalogItems.length})</h3>
      <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: 20 }}>
        Todos los cambios se guardan en Firestore y se registran en el log de cambios.
      </p>

      {/* Add form */}
      {showAdd ? (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--accent-dim)',
          borderRadius: 10,
          padding: 16,
          marginBottom: 16,
        }}>
          <h4 style={{ fontSize: '0.875rem', color: 'var(--accent)', marginBottom: 12 }}>Nuevo ítem</h4>
          <ItemForm
            onSave={handleAdd}
            onCancel={() => setShowAdd(false)}
            loading={loading}
          />
        </div>
      ) : (
        <button
          className="btn-accent"
          onClick={() => setShowAdd(true)}
          style={{ marginBottom: 16 }}
        >
          + Agregar ítem
        </button>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          style={{ fontSize: '0.82rem', padding: '5px 8px' }}
        >
          <option value="all">Todas las categorías</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          style={{ fontSize: '0.82rem', padding: '5px 10px', flex: 1, minWidth: 160 }}
        />
      </div>

      {/* Item list */}
      {filtered.length === 0 ? (
        <p style={{ color: 'var(--text)', fontSize: '0.875rem' }}>
          {catalogItems.length === 0
            ? 'El catálogo está vacío. Agrega el primer ítem.'
            : 'Ningún ítem coincide con los filtros.'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(item => (
            <div key={item.id}>
              {editingId === item.id ? (
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--accent-dim)',
                  borderRadius: 8,
                  padding: 14,
                }}>
                  <h4 style={{ fontSize: '0.82rem', color: 'var(--accent)', marginBottom: 10 }}>
                    Editando: {item.name}
                  </h4>
                  <ItemForm
                    initial={item}
                    onSave={data => handleUpdate(item, data)}
                    onCancel={() => setEditingId(null)}
                    loading={loading}
                  />
                </div>
              ) : confirmDelete?.id === item.id ? (
                <div style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                }}>
                  <span style={{ color: '#fca5a5', fontSize: '0.85rem', flex: 1 }}>
                    ¿Eliminar <strong>{item.name}</strong>? Esta acción no se puede deshacer.
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={loading}
                      style={{ background: 'var(--danger)', color: '#fff', border: 'none', padding: '4px 12px', fontSize: '0.8rem', borderRadius: 5 }}
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      style={{ background: 'var(--bg-card-alt)', color: 'var(--text)', border: '1px solid var(--border)', padding: '4px 10px', fontSize: '0.8rem', borderRadius: 5 }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '9px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  opacity: item.archived ? 0.5 : 1,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ color: 'var(--text-bright)', fontSize: '0.875rem', fontWeight: 500 }}>
                      {item.name}
                      {item.archived && <span style={{ color: 'var(--text)', fontSize: '0.72rem', marginLeft: 6 }}>[archivado]</span>}
                    </span>
                    <div style={{ color: 'var(--text)', fontSize: '0.72rem', marginTop: 2 }}>
                      {CATEGORY_LABELS[item.category]}
                      {item.subtype ? ` — ${SUBTYPE_LABELS[item.subtype] ?? item.subtype}` : ''}
                      {item.warbond ? ` — ${WARBONDS.find(w => w.id === item.warbond)?.name ?? item.warbond}` : ' — Sin Warbond'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                    <button
                      onClick={() => { setEditingId(item.id); setShowAdd(false) }}
                      style={{ background: 'var(--bg-card-alt)', color: 'var(--text)', border: '1px solid var(--border)', padding: '3px 10px', fontSize: '0.78rem', borderRadius: 5 }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setConfirmDelete(item)}
                      style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.3)', padding: '3px 10px', fontSize: '0.78rem', borderRadius: 5 }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// ── Changelog Section ─────────────────────────────────────────────────────────

function ChangelogSection() {
  const { changelog } = useAdminCtx()
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? changelog : changelog.slice(0, 20)

  return (
    <section className="admin-section">
      <h3 className="admin-section__title">Log de cambios ({changelog.length})</h3>
      {changelog.length === 0 ? (
        <p style={{ color: 'var(--text)', fontSize: '0.875rem' }}>No hay cambios registrados aún.</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {visible.map(entry => (
              <div key={entry.id} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 7,
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
                flexWrap: 'wrap',
              }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: ACTION_COLORS[entry.action] ?? 'var(--text)',
                  flexShrink: 0,
                  minWidth: 56,
                }}>
                  {ACTION_LABELS[entry.action] ?? entry.action}
                </span>
                <span style={{ color: 'var(--text-bright)', fontSize: '0.82rem', flex: 1 }}>
                  {entry.itemName}
                </span>
                {entry.changes && Object.keys(entry.changes).length > 0 && (
                  <span style={{ color: 'var(--text)', fontSize: '0.72rem' }}>
                    {Object.entries(entry.changes).map(([field, { from, to }]) =>
                      `${field}: "${from ?? '—'}" → "${to ?? '—'}"`
                    ).join(' · ')}
                  </span>
                )}
                <span style={{ color: 'var(--text)', fontSize: '0.7rem', flexShrink: 0 }}>
                  {entry.adminEmail} · {formatTs(entry.timestamp)}
                </span>
              </div>
            ))}
          </div>
          {changelog.length > 20 && (
            <button
              onClick={() => setShowAll(v => !v)}
              className="btn-ghost"
              style={{ marginTop: 10, fontSize: '0.8rem' }}
            >
              {showAll ? 'Ver menos' : `Ver todos (${changelog.length})`}
            </button>
          )}
        </>
      )}
    </section>
  )
}

// ── Admins Section ────────────────────────────────────────────────────────────

function AdminsSection() {
  const { adminEmails, addAdmin, removeAdmin } = useAdminCtx()
  const { user } = useAuthCtx()
  const envAdmin = import.meta.env.VITE_ADMIN_EMAIL
  const [newEmail, setNewEmail] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  async function handleAdd(e) {
    e.preventDefault()
    const email = newEmail.trim().toLowerCase()
    if (!email) return
    if (adminEmails.includes(email) || email === envAdmin) {
      setError('Ese email ya es administrador.'); return
    }
    setLoading(true)
    try {
      await addAdmin(email)
      setNewEmail('')
      setError(null)
    } catch {
      setError('No se pudo agregar el administrador.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRemove(email) {
    setLoading(true)
    try { await removeAdmin(email) }
    finally { setLoading(false) }
  }

  return (
    <section className="admin-section">
      <h3 className="admin-section__title">Administradores</h3>
      <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: 16 }}>
        Los administradores pueden editar el catálogo y ver el log de cambios.
      </p>

      {/* Existing admins */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {envAdmin && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 7,
            padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ flex: 1, color: 'var(--text-bright)', fontSize: '0.875rem' }}>{envAdmin}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent)' }}>Super admin</span>
          </div>
        )}
        {adminEmails.map(email => (
          <div key={email} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 7,
            padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ flex: 1, color: 'var(--text-bright)', fontSize: '0.875rem' }}>{email}</span>
            {email !== user?.email && (
              <button
                onClick={() => handleRemove(email)}
                disabled={loading}
                style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.3)', padding: '3px 10px', fontSize: '0.78rem', borderRadius: 5 }}
              >
                Quitar
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add admin form */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          type="email"
          placeholder="nuevo@admin.com"
          value={newEmail}
          onChange={e => { setNewEmail(e.target.value); setError(null) }}
          style={{ flex: 1, minWidth: 200, fontSize: '0.85rem', padding: '6px 10px' }}
        />
        <button type="submit" className="btn-accent" disabled={loading}>
          {loading ? 'Agregando...' : 'Agregar admin'}
        </button>
      </form>
      {error && <span style={{ color: 'var(--danger)', fontSize: '0.82rem', marginTop: 6, display: 'block' }}>{error}</span>}
    </section>
  )
}

// ── Users ─────────────────────────────────────────────────────────────────────

function UsersSection() {
  const { allProfiles } = useAdminCtx()

  return (
    <section className="admin-section">
      <h3 className="admin-section__title">Usuarios registrados ({allProfiles.length})</h3>
      {allProfiles.length === 0 ? (
        <p style={{ color: 'var(--text)', fontSize: '0.875rem' }}>No hay usuarios registrados aún.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {allProfiles.map(profile => (
            <div key={profile.id} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
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
    <div style={{ maxWidth: 760 }}>
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
      <CatalogSection />
      <AdminsSection />
      <ChangelogSection />
      <UsersSection />
    </div>
  )
}
