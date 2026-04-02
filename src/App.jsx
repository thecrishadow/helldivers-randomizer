import { useState, createContext, useContext } from 'react'
import { useProfiles } from './store/useProfiles.js'
import { useImages } from './store/useImages.js'
import { useAdmin } from './store/useAdmin.js'
import Nav from './components/Nav.jsx'
import InventoryPage from './components/inventory/InventoryPage.jsx'
import RandomizerPage from './components/randomizer/RandomizerPage.jsx'
import ProfilesPage from './components/profiles/ProfilesPage.jsx'
import AdminPage from './components/admin/AdminPage.jsx'
import './App.css'

export const ProfilesCtx = createContext(null)
export const ImagesCtx = createContext(null)
export const AdminCtx = createContext(null)

export function useProfilesCtx() { return useContext(ProfilesCtx) }
export function useImagesCtx()   { return useContext(ImagesCtx) }
export function useAdminCtx()    { return useContext(AdminCtx) }

export default function App() {
  const [tab, setTab] = useState('inventory')
  const profilesStore = useProfiles()
  const imagesStore   = useImages()
  const adminStore    = useAdmin()

  return (
    <ProfilesCtx.Provider value={profilesStore}>
      <ImagesCtx.Provider value={imagesStore}>
        <AdminCtx.Provider value={adminStore}>
          <Nav activeTab={tab} onTabChange={setTab} />
          <main style={{ flex: 1, padding: '24px 16px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            {tab === 'inventory'  && <InventoryPage />}
            {tab === 'randomizer' && <RandomizerPage />}
            {tab === 'profiles'   && <ProfilesPage />}
            {tab === 'admin'      && <AdminPage />}
          </main>
        </AdminCtx.Provider>
      </ImagesCtx.Provider>
    </ProfilesCtx.Provider>
  )
}
