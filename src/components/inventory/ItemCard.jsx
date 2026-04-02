import { useState, useRef } from 'react'
import { getItemInitials } from '../../data/items.js'
import { useAdminCtx } from '../../App.jsx'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB

export default function ItemCard({ item, owned, imageDataUrl, onToggleOwned, onUploadImage, onDeleteImage }) {
  const fileRef = useRef(null)
  const [imgError, setImgError] = useState(null)
  const { editMode } = useAdminCtx()

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImgError(null)
    if (!file.type.startsWith('image/')) {
      setImgError('El archivo debe ser una imagen.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImgError('La imagen no puede superar 5 MB.')
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = ev => onUploadImage(item.id, ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const initials = getItemInitials(item.name)

  return (
    <div className={`item-card${owned ? ' item-card--owned' : ''}`}>
      {/* Image area */}
      <div
        className="item-card__image"
        onClick={editMode ? () => fileRef.current?.click() : undefined}
        title={editMode ? 'Clic para cambiar imagen' : undefined}
        style={editMode ? undefined : { cursor: 'default' }}
      >
        {imageDataUrl ? (
          <img
            src={imageDataUrl}
            alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span className="item-card__initials">{initials}</span>
        )}
        <div className="img-hover-overlay" />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {/* Info */}
      <div className="item-card__info">
        <span className="item-card__name">{item.name}</span>
        {imgError && (
          <span style={{ fontSize: '0.7rem', color: 'var(--danger)' }}>{imgError}</span>
        )}
        <div className="item-card__footer">
          <label className={`item-card__label${owned ? ' item-card__label--owned' : ''}`}>
            <input
              type="checkbox"
              checked={owned}
              onChange={() => onToggleOwned(item.id)}
              style={{ accentColor: 'var(--accent)', width: 14, height: 14 }}
            />
            {owned ? 'Desbloqueado' : 'Bloqueado'}
          </label>
          {imageDataUrl && editMode && (
            <button
              className="item-card__delete-btn"
              onClick={() => onDeleteImage(item.id)}
              title="Eliminar imagen"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
