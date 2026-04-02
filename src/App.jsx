import { useState, createContext, useContext } from 'react'
import { useAuth } from './store/useAuth.js'
import { useProfiles } from './store/useProfiles.js'
import { useImages } from './store/useImages.js'
import { useAdmin } from './store/useAdmin.js'
import Nav from './components/Nav.jsx'
import InventoryPage from './components/inventory/InventoryPage.jsx'
import RandomizerPage from './components/randomizer/RandomizerPage.jsx'
import ProfilesPage from './components/profiles/ProfilesPage.jsx'
import AdminPage from './components/admin/AdminPage.jsx'
import AuthPage from './components/auth/AuthPage.jsx'
import './App.css'

export const ProfilesCtx = createContext(null)
export const ImagesCtx = createContext(null)
export const AdminCtx = createContext(null)
export const AuthCtx = createContext(null)

export function useProfilesCtx() { return useContext(ProfilesCtx) }
export function useImagesCtx()   { return useContext(ImagesCtx) }
export function useAdminCtx()    { return useContext(AdminCtx) }
export function useAuthCtx()     { return useContext(AuthCtx) }

export default function App() {
  const [tab, setTab] = useState('inventory')
  const authStore     = useAuth()
  const profilesStore = useProfiles(authStore.user)
  const imagesStore   = useImages()
  const adminStore    = useAdmin(authStore.user)

  if (authStore.authLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100dvh', color: 'var(--text)',
      }}>
        Cargando...
      </div>
    )
  }

  if (!authStore.user) {
    return (
      <AuthCtx.Provider value={authStore}>
        <AuthPage />
      </AuthCtx.Provider>
    )
  }

  return (
    <AuthCtx.Provider value={authStore}>
      <ProfilesCtx.Provider value={profilesStore}>
        <ImagesCtx.Provider value={imagesStore}>
          <AdminCtx.Provider value={adminStore}>
            <Nav activeTab={tab} onTabChange={setTab} />
            <main style={{ flex: 1, padding: '24px 16px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
              {tab === 'inventory'  && <InventoryPage />}
              {tab === 'randomizer' && <RandomizerPage />}
              {tab === 'profile'    && <ProfilesPage />}
              {tab === 'admin'      && adminStore.isAdmin && <AdminPage />}
            </main>
          </AdminCtx.Provider>
        </ImagesCtx.Provider>
      </ProfilesCtx.Provider>
    </AuthCtx.Provider>
  )
}
