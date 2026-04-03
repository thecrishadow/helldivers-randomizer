import { useState, useMemo } from 'react'
import { ITEMS, CATEGORIES, SUBTYPE_LABELS } from '../../data/items.js'
import { useProfilesCtx } from '../../App.jsx'
import { useImagesCtx } from '../../App.jsx'
import { useAdminCtx } from '../../App.jsx'
import CategoryTabs from './CategoryTabs.jsx'
import ItemCard from './ItemCard.jsx'

export default function InventoryPage() {
  const { ownedSet, toggleOwned, setAllOwned } = useProfilesCtx()
  const { images, setImage, deleteImage, dbError } = useImagesCtx()
  const { customItems, addCustomItem, removeCustomItem, editMode, itemOverrides, setItemOverride, clearItemOverride } = useAdminCtx()
  const [activeCategory, setActiveCategory] = useState('primary')
  const [addForm, setAddForm] = useState(null) // null | { name, subtype }

  // Merge base items + custom items, apply overrides (name, archived)
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

  // Group stratagems by subtype
  const grouped = useMemo(() => {
    if (activeCategory !== 'stratagem') return null
    const groups = {}
    visibleItems.forEach(item => {
      const key = item.subtype ?? 'other'
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
    })
    return groups
  }, [activeCategory, visibleItems])

  const catIds = visibleItems.map(i => i.id)
  const allOwned = catIds.every(id => ownedSet.has(id))
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

  async function handleAddSubmit(e) {
    e.preventDefault()
    const { name, subtype } = addForm
    if (!name.trim()) return
    const newItem = {
      category: activeCategory,
      name: name.trim(),
      ...(activeCategory === 'stratagem' && subtype ? { subtype } : {}),
    }
    await addCustomItem(newItem)
    setAddForm(null)
  }

  function AddCard() {
    if (addForm === null) {
      return (
        <button
          className="item-card item-card--add"
          onClick={() => setAddForm({ name: '', subtype: 'support' })}
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
        {activeCategory === 'stratagem' && (
          <select
            value={addForm.subtype}
            onChange={e => setAddForm(f => ({ ...f, subtype: e.target.value }))}
            style={{ fontSize: '0.75rem', padding: '4px 6px' }}
          >
            <option value="eagle">Eagle</option>
            <option value="orbital">Orbital</option>
            <option value="support">Support</option>
            <option value="defensive">Defensive</option>
          </select>
        )}
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
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setAllOwned(catIds, true)}
            disabled={allOwned}
            className="btn-ghost"
          >
            Seleccionar todos
          </button>
          <button
            onClick={() => setAllOwned(catIds, false)}
            disabled={noneOwned}
            className="btn-ghost"
          >
            Deseleccionar todos
          </button>
        </div>
      </div>

      <CategoryTabs
        active={activeCategory}
        onChange={cat => { setActiveCategory(cat); setAddForm(null) }}
        counts={counts}
      />

      {grouped ? (
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
      ) : renderGrid(visibleItems, true)}
    </div>
  )
}
