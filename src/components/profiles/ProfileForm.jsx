import { useState } from 'react'
import { useProfilesCtx } from '../../App.jsx'

export default function ProfileForm() {
  const { createProfile } = useProfilesCtx()
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    createProfile(name)
    setName('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nombre del nuevo perfil..."
        maxLength={40}
        style={{ maxWidth: 300 }}
      />
      <button
        type="submit"
        disabled={!name.trim()}
        style={{ background: 'var(--accent)', color: '#000', fontWeight: 600, whiteSpace: 'nowrap' }}
      >
        + Crear perfil
      </button>
    </form>
  )
}
