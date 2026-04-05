import { useState, useMemo } from 'react'
import { ITEMS, CATEGORIES, CATEGORY_LABELS, SUBTYPE_LABELS, WARBONDS, GROUPED_CATEGORIES } from '../../data/items.js'

const CATEGORY_SUBTYPES = {
  primary:   ['assault_rifle', 'shotgun', 'marksman_rifle', 'smg', 'energy', 'explosive', 'flamethrower', 'volley_gun'],
  secondary: ['pistol', 'explosive', 'energy', 'melee'],
  grenade:   ['standard', 'special', 'incendiary'],
  armor:     ['light', 'medium', 'heavy'],
  stratagem: ['eagle', 'orbital', 'support', 'backpack', 'sentry', 'emplacement', 'mines', 'mech', 'mission', 'cqc'],
  booster:   ['supply', 'survival', 'mobility', 'recon', 'reinforcement', 'extraction', 'stealth', 'hellpod', 'combat'],
}
import { useProfilesCtx } from '../../App.jsx'
import { useImagesCtx } from '../../App.jsx'
import { useAdminCtx } from '../../App.jsx'
import CategoryTabs from './CategoryTabs.jsx'
import ItemCard from './ItemCard.jsx'

// ── Warbond panel ─────────────────────────────────────────────────────────────

const FREE_WARBOND = { id: '__free__', name: 'Sin Warbond (Req. Slips)' }
const ALL_WARBONDS = [...WARBONDS, FREE_WARBOND]

function WarbondPanel({ allItems, ownedSet, images, editMode, onSelectWarbond, onUploadWarbondImage }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: 10,
      marginBottom: 28,
    }}>
      {ALL_WARBONDS.map(wb => {
        const wbItems = allItems.filter(i =>
          wb.id === '__free__' ? i.warbond == null : i.warbond === wb.id
        )
        if (wbItems.length === 0) return null
        const ownedCount = wbItems.filter(i => ownedSet.has(i.id)).length
        const imgKey = `warbond_${wb.id}`
        const imgUrl = images[imgKey]

        return (
          <div key={wb.id} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Image area */}
            <div
              style={{
                height: 70,
                background: 'var(--bg-card-alt)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                cursor: editMode ? 'pointer' : 'default',
                position: 'relative',
              }}
              onClick={editMode ? () => onUploadWarbondImage(wb.id) : undefined}
              title={editMode ? 'Clic para cambiar imagen' : undefined}
            >
              {imgUrl ? (
                <img src={imgUrl} alt={wb.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '1.5rem', color: 'var(--border)', userSelect: 'none' }}>🎖</span>
              )}
            </div>
            <div style={{ padding: '8px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-bright)', fontWeight: 600, lineHeight: 1.3 }}>
                {wb.name}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--accent)' }}>
                {ownedCount}/{wbItems.length} desbloqueados
              </span>
              <button
                onClick={() => onSelectWarbond(wbItems.map(i => i.id))}
                style={{
                  marginTop: 'auto',
                  background: 'var(--bg-card-alt)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  borderRadius: 5,
                  padding: '4px 0',
                  fontSize: '0.68rem',
                  cursor: 'pointer',
                }}
              >
                Seleccionar todos
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function InventoryPage() {
  const { ownedSet, toggleOwned, setAllOwned } = useProfilesCtx()
  const { images, setImage, deleteImage, dbError } = useImagesCtx()
  const { customItems, addCustomItem, removeCustomItem, editMode, itemOverrides, setItemOverride, clearItemOverride } = useAdminCtx()
  const [activeCategory, setActiveCategory] = useState('primary')
  const [showWarbonds, setShowWarbonds] = useState(false)
  const [addForm, setAddForm] = useState(null)

  // File input ref for warbond image uploads
  const [pendingWarbondId, setPendingWarbondId] = useState(null)

  const allItems = useMemo(() => {
    return [...ITEMS, ...customItems.map(i => ({ ...i, _isCustom: true }))].map(item => {
      const ov = itemOverrides[item.id]
      if (!ov) return item
      return { ...item, ...(ov.name ? { name: ov.name } : {}), archived: ov.archived ?? false }
    })
  }, [customItems, itemOverrides])

  const counts = useMemo(() => {
    const result = {}
    CATEGORIES.forEach(cat => {
      const catItems = allItems.filter(i => i.category === cat && !i.archived)
      result[cat] = {
        total: catItems.length,
        owned: catItems.filter(i => ownedSet.has(i.id)).length,
      }
    })
    return result
  }, [ownedSet, allItems])

  const categoryItems = allItems.filter(i => i.category === activeCategory)
  const visibleItems = editMode ? categoryItems : categoryItems.filter(i => !i.archived)

  // Group by subtype
  const grouped = useMemo(() => {
    const groups = {}
    visibleItems.forEach(item => {
      const key = item.subtype ?? 'other'
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
    })
    return groups
  }, [visibleItems])

  const catIds = visibleItems.map(i => i.id)
  const allOwned = catIds.length > 0 && catIds.every(id => ownedSet.has(id))
  const noneOwned = catIds.every(id => !ownedSet.has(id))

  async function handleRename(itemId, newName) {
    await setItemOverride(itemId, { name: newName })
  }

  async function handleArchive(itemId, archived) {
    await setItemOverride(itemId, { archived })
  }

  async function handleDelete(itemId) {
    await removeCustomItem(itemId)
    await clearItemOverride(itemId)
  }

  function handleWarbondImageUpload(warbondId) {
    setPendingWarbondId(warbondId)
    document.getElementById('warbond-file-input').click()
  }

  function handleWarbondFileChange(e) {
    const file = e.target.files[0]
    if (!file || !pendingWarbondId) return
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = ev => {
      setImage(`warbond_${pendingWarbondId}`, ev.target.result)
      setPendingWarbondId(null)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function handleAddSubmit(e) {
    e.preventDefault()
    const { name, subtype } = addForm
    if (!name.trim()) return
    const newItem = {
      category: activeCategory,
      name: name.trim(),
      ...(subtype ? { subtype } : {}),
    }
    await addCustomItem(newItem)
    setAddForm(null)
  }

  function AddCard() {
    if (addForm === null) {
      return (
        <button
          className="item-card item-card--add"
          onClick={() => setAddForm({ name: '', subtype: (CATEGORY_SUBTYPES[activeCategory] ?? [])[0] ?? '' })}
          style={{ cursor: 'pointer', justifyContent: 'center', alignItems: 'center', minHeight: 130 }}
        >
          <span style={{ fontSize: '1.8rem', color: 'var(--border)' }}>＋</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text)', marginTop: 4 }}>Agregar ítem</span>
        </button>
      )
    }
    return (
      <form
        onSubmit={handleAddSubmit}
        className="item-card item-card--add"
        style={{ padding: 10, gap: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <input
          autoFocus
          type="text"
          placeholder="Nombre"
          value={addForm.name}
          onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
          maxLength={60}
          style={{ fontSize: '0.78rem', padding: '4px 8px' }}
        />
        <select
          value={addForm.subtype}
          onChange={e => setAddForm(f => ({ ...f, subtype: e.target.value }))}
          style={{ fontSize: '0.75rem', padding: '4px 6px' }}
        >
          {(CATEGORY_SUBTYPES[activeCategory] ?? []).map(s => (
            <option key={s} value={s}>{SUBTYPE_LABELS[s] ?? s}</option>
          ))}
        </select>
        <div style={{ display: 'flex', gap: 4 }}>
          <button type="submit" style={{ flex: 1, padding: '4px 6px', fontSize: '0.72rem', background: 'var(--accent)', color: '#000', fontWeight: 700 }}>
            Guardar
          </button>
          <button type="button" onClick={() => setAddForm(null)} style={{ flex: 1, padding: '4px 6px', fontSize: '0.72rem', background: 'var(--bg-card-alt)', color: 'var(--text)', border: '1px solid var(--border)' }}>
            Cancelar
          </button>
        </div>
      </form>
    )
  }

  function renderGrid(items, showAdd = false) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: 12,
      }}>
        {items.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            owned={ownedSet.has(item.id)}
            imageDataUrl={images[item.id] ?? null}
            onToggleOwned={toggleOwned}
            onUploadImage={setImage}
            onDeleteImage={deleteImage}
            onRename={handleRename}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />
        ))}
        {editMode && showAdd && <AddCard />}
      </div>
    )
  }

  return (
    <div>
      {/* Hidden file input for warbond images */}
      <input
        id="warbond-file-input"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleWarbondFileChange}
      />

      {dbError && (
        <div style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 8,
          padding: '10px 16px',
          color: '#fca5a5',
          fontSize: '0.85rem',
          marginBottom: 16,
        }}>
          {dbError}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: '1.3rem' }}>Inventario</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowWarbonds(v => !v)}
            className="btn-ghost"
            style={{ borderColor: showWarbonds ? 'var(--accent-dim)' : undefined, color: showWarbonds ? 'var(--accent)' : undefined }}
          >
            🎖 Warbonds
          </button>
          <button onClick={() => setAllOwned(catIds, true)} disabled={allOwned} className="btn-ghost">
            Seleccionar todos
          </button>
          <button onClick={() => setAllOwned(catIds, false)} disabled={noneOwned} className="btn-ghost">
            Deseleccionar todos
          </button>
        </div>
      </div>

      {showWarbonds && (
        <WarbondPanel
          allItems={allItems}
          ownedSet={ownedSet}
          images={images}
          editMode={editMode}
          onSelectWarbond={ids => setAllOwned(ids, true)}
          onUploadWarbondImage={handleWarbondImageUpload}
        />
      )}

      <CategoryTabs
        active={activeCategory}
        onChange={cat => { setActiveCategory(cat); setAddForm(null) }}
        counts={counts}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {Object.entries(grouped).map(([subtype, items]) => (
          <div key={subtype}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              {SUBTYPE_LABELS[subtype] ?? subtype}
            </h3>
            {renderGrid(items, false)}
          </div>
        ))}
        {editMode && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: 12,
          }}>
            <AddCard />
          </div>
        )}
      </div>
    </div>
  )
}
