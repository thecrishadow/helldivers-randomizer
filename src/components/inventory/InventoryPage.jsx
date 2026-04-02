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
  const { customItems } = useAdminCtx()
  const allItems = useMemo(() => [...ITEMS, ...customItems], [customItems])
  const [activeCategory, setActiveCategory] = useState('primary')

  const counts = useMemo(() => {
    const result = {}
    CATEGORIES.forEach(cat => {
      const catItems = allItems.filter(i => i.category === cat)
      result[cat] = {
        total: catItems.length,
        owned: catItems.filter(i => ownedSet.has(i.id)).length,
      }
    })
    return result
  }, [ownedSet, allItems])

  const categoryItems = allItems.filter(i => i.category === activeCategory)

  // Group stratagems by subtype
  const grouped = useMemo(() => {
    if (activeCategory !== 'stratagem') return null
    const groups = {}
    categoryItems.forEach(item => {
      const key = item.subtype ?? 'other'
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
    })
    return groups
  }, [activeCategory, categoryItems])

  const catIds = categoryItems.map(i => i.id)
  const allOwned = catIds.every(id => ownedSet.has(id))
  const noneOwned = catIds.every(id => !ownedSet.has(id))

  function renderGrid(items) {
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
          />
        ))}
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
        onChange={setActiveCategory}
        counts={counts}
      />

      {grouped ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {Object.entries(grouped).map(([subtype, items]) => (
            <div key={subtype}>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                {SUBTYPE_LABELS[subtype] ?? subtype}
              </h3>
              {renderGrid(items)}
            </div>
          ))}
        </div>
      ) : renderGrid(categoryItems)}
    </div>
  )
}
