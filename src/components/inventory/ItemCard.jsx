import { useState, useRef } from 'react'
import { getItemInitials } from '../../data/items.js'
import { useAdminCtx } from '../../App.jsx'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB

export default function ItemCard({ item, owned, imageDataUrl, onToggleOwned, onUploadImage, onDeleteImage, onRename, onArchive, onDelete }) {
  const fileRef = useRef(null)
  const [imgError, setImgError] = useState(null)
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
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

  function startNameEdit() {
    setNameInput(item.name)
    setEditingName(true)
  }

  async function commitNameEdit(e) {
    e.preventDefault()
    const trimmed = nameInput.trim()
    if (trimmed && trimmed !== item.name) await onRename(item.id, trimmed)
    setEditingName(false)
  }

  const initials = getItemInitials(item.name)
  const cardClass = [
    'item-card',
    owned ? 'item-card--owned' : '',
    item.archived ? 'item-card--archived' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClass}>
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
        {editMode && editingName ? (
          <form onSubmit={commitNameEdit} style={{ display: 'flex', gap: 3 }}>
            <input
              autoFocus
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              maxLength={60}
              style={{ fontSize: '0.72rem', padding: '3px 6px', flex: 1 }}
            />
            <button type="submit" style={{ padding: '2px 6px', fontSize: '0.7rem', background: 'var(--accent)', color: '#000', fontWeight: 700 }}>✓</button>
            <button type="button" onClick={() => setEditingName(false)} style={{ padding: '2px 6px', fontSize: '0.7rem', background: 'var(--bg-card-alt)', color: 'var(--text)', border: '1px solid var(--border)' }}>✕</button>
          </form>
        ) : (
          <span
            className="item-card__name"
            onClick={editMode ? startNameEdit : undefined}
            title={editMode ? 'Clic para renombrar' : undefined}
            style={editMode ? { cursor: 'text', textDecoration: 'underline dotted var(--border-accent)' } : undefined}
          >
            {item.name}
          </span>
        )}

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

        {editMode && (
          <div className="item-card__edit-actions">
            <button
              className="item-card__action-btn"
              onClick={() => onArchive(item.id, !item.archived)}
            >
              {item.archived ? '↩ Restaurar' : '⊘ Archivar'}
            </button>
            {item._isCustom && (
              <button
                className="item-card__action-btn item-card__action-btn--danger"
                onClick={() => onDelete(item.id)}
              >
                🗑 Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
