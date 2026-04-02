import { useState } from 'react'
import { useAuthCtx } from '../../App.jsx'

function LoginForm() {
  const { login } = useAuthCtx()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const err = await login(email, pass)
    setLoading(false)
    if (err) setError(err)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={e => { setEmail(e.target.value); setError(null) }}
        autoComplete="email"
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={pass}
        onChange={e => { setPass(e.target.value); setError(null) }}
        autoComplete="current-password"
        required
      />
      {error && <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</span>}
      <button type="submit" className="btn-accent" disabled={loading} style={{ marginTop: 4 }}>
        {loading ? 'Entrando...' : 'Iniciar sesión'}
      </button>
    </form>
  )
}

function RegisterForm({ onSuccess }) {
  const { register } = useAuthCtx()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (pass !== confirm) { setError('Las contraseñas no coinciden.'); return }
    setLoading(true)
    const err = await register(name, email, pass)
    setLoading(false)
    if (err) setError(err)
    else onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={name}
        onChange={e => { setName(e.target.value); setError(null) }}
        autoComplete="name"
        maxLength={40}
        required
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={e => { setEmail(e.target.value); setError(null) }}
        autoComplete="email"
        required
      />
      <input
        type="password"
        placeholder="Contraseña (mínimo 6 caracteres)"
        value={pass}
        onChange={e => { setPass(e.target.value); setError(null) }}
        autoComplete="new-password"
        required
      />
      <input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirm}
        onChange={e => { setConfirm(e.target.value); setError(null) }}
        autoComplete="new-password"
        required
      />
      {error && <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</span>}
      <button type="submit" className="btn-accent" disabled={loading} style={{ marginTop: 4 }}>
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>
    </form>
  )
}

function GuestButton() {
  const { loginAsGuest } = useAuthCtx()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleGuest() {
    setLoading(true)
    const err = await loginAsGuest()
    setLoading(false)
    if (err) setError(err)
  }

  return (
    <div style={{ marginTop: 16, textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ fontSize: '0.8rem', color: 'var(--text)' }}>o</span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
      {error && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', display: 'block', marginBottom: 8 }}>{error}</span>}
      <button
        onClick={handleGuest}
        disabled={loading}
        className="btn-ghost"
        style={{ width: '100%', padding: '10px 0' }}
      >
        {loading ? 'Entrando...' : 'Continuar como invitado'}
      </button>
      <p style={{ fontSize: '0.75rem', color: 'var(--text)', marginTop: 8, lineHeight: 1.5 }}>
        Tu inventario se guardará solo en este dispositivo.
      </p>
    </div>
  )
}

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login')

  const tabStyle = (id) => ({
    flex: 1,
    background: activeTab === id ? 'var(--bg-card)' : 'transparent',
    color: activeTab === id ? 'var(--accent)' : 'var(--text)',
    border: 'none',
    borderBottom: `2px solid ${activeTab === id ? 'var(--accent)' : 'transparent'}`,
    borderRadius: 0,
    padding: '12px 0',
    fontSize: '0.9rem',
    fontWeight: activeTab === id ? 600 : 400,
    cursor: 'pointer',
    transition: 'color 0.15s, border-color 0.15s',
  })

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>⚔</div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--accent)', letterSpacing: 1, marginBottom: 4 }}>
            HD2 Randomizer
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
            Tu loadout aleatorio para Helldivers 2
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
            <button style={tabStyle('login')} onClick={() => setActiveTab('login')}>
              Iniciar sesión
            </button>
            <button style={tabStyle('register')} onClick={() => setActiveTab('register')}>
              Crear cuenta
            </button>
          </div>

          {/* Forms */}
          <div style={{ padding: 24 }}>
            {activeTab === 'login'
              ? <LoginForm />
              : <RegisterForm onSuccess={() => setActiveTab('login')} />
            }
            <GuestButton />
          </div>
        </div>
      </div>
    </div>
  )
}
