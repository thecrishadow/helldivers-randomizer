import { useState, useEffect, useCallback } from 'react'
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase.js'
import { DEFAULT_OWNED_IDS } from '../data/items.js'

export function useProfiles(user) {
  const [activeProfile, setActiveProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setActiveProfile(null)
      setProfileLoading(false)
      return
    }
    setProfileLoading(true)
    const ref = doc(db, 'user-profiles', user.uid)
    return onSnapshot(ref, snap => {
      if (snap.exists()) {
        setActiveProfile({ id: user.uid, ...snap.data() })
      } else {
        // First login — create the profile document with default items
        const defaultOwned = {}
        DEFAULT_OWNED_IDS.forEach(id => { defaultOwned[id] = true })
        const newProfile = { name: user.displayName || 'Helldiver', ownedItems: defaultOwned }
        setDoc(ref, newProfile)
        setActiveProfile({ id: user.uid, ...newProfile })
      }
      setProfileLoading(false)
    })
  }, [user])

  const toggleOwned = useCallback(async (itemId) => {
    if (!user || !activeProfile) return
    const owned = { ...activeProfile.ownedItems }
    if (owned[itemId]) delete owned[itemId]
    else owned[itemId] = true
    await updateDoc(doc(db, 'user-profiles', user.uid), { ownedItems: owned })
  }, [user, activeProfile])

  const setAllOwned = useCallback(async (itemIds, value) => {
    if (!user || !activeProfile) return
    const owned = { ...activeProfile.ownedItems }
    itemIds.forEach(id => { if (value) owned[id] = true; else delete owned[id] })
    await updateDoc(doc(db, 'user-profiles', user.uid), { ownedItems: owned })
  }, [user, activeProfile])

  const renameProfile = useCallback(async (name) => {
    if (!user) return
    await updateDoc(doc(db, 'user-profiles', user.uid), { name: name.trim() })
  }, [user])

  const ownedSet = new Set(Object.keys(activeProfile?.ownedItems ?? {}))

  return { activeProfile, profileLoading, ownedSet, toggleOwned, setAllOwned, renameProfile }
}
