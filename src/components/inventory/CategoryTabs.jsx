import { CATEGORY_LABELS } from '../../data/items.js'

export default function CategoryTabs({ active, onChange, counts }) {
  const tabs = Object.entries(CATEGORY_LABELS)

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
      {tabs.map(([cat, label]) => {
        const isActive = active === cat
        const { owned = 0, total = 0 } = counts[cat] ?? {}
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            style={{
              background: isActive ? 'var(--accent)' : 'var(--bg-card)',
              color: isActive ? '#000' : 'var(--text)',
              border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
              fontWeight: isActive ? 600 : 400,
              padding: '8px 16px',
              borderRadius: 8,
            }}
          >
            {label}
            <span style={{ marginLeft: 8, fontSize: '0.75rem', opacity: 0.7 }}>
              {owned}/{total}
            </span>
          </button>
        )
      })}
    </div>
  )
}
