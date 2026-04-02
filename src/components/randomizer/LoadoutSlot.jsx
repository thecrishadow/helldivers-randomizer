import { getItemInitials } from '../../data/items.js'

export default function LoadoutSlot({ label, item, imageDataUrl }) {
  const initials = item ? getItemInitials(item.name) : '?'

  return (
    <div className="loadout-slot">
      <div className="loadout-slot__image">
        {imageDataUrl ? (
          <img src={imageDataUrl} alt={item?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span className="loadout-slot__initials">{initials}</span>
        )}
      </div>
      <div className="loadout-slot__info">
        <div className="loadout-slot__label">{label}</div>
        <div className="loadout-slot__name">{item?.name ?? '—'}</div>
      </div>
    </div>
  )
}
