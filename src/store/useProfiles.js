import { useState, useCallback } from 'react'

const STORAGE_KEY = 'hd2_profiles'

function newProfile(name) {
  return { id: crypto.randomUUID(), name, ownedItems: {} }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  const profile = newProfile('Mi Perfil')
  return { activeProfileId: profile.id, profiles: [profile] }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useProfiles() {
  const [state, setState] = useState(load)

  const activeProfile = state.profiles.find(p => p.id === state.activeProfileId)
    ?? state.profiles[0]

  const update = useCallback((fn) => {
    setState(prev => {
      const next = fn(prev)
      save(next)
      return next
    })
  }, [])

  const toggleOwned = useCallback((itemId) => {
    update(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => {
        if (p.id !== prev.activeProfileId) return p
        const owned = { ...p.ownedItems }
        if (owned[itemId]) delete owned[itemId]
        else owned[itemId] = true
        return { ...p, ownedItems: owned }
      })
    }))
  }, [update])

  const setAllOwned = useCallback((itemIds, value) => {
    update(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => {
        if (p.id !== prev.activeProfileId) return p
        const owned = { ...p.ownedItems }
        itemIds.forEach(id => {
          if (value) owned[id] = true
          else delete owned[id]
        })
        return { ...p, ownedItems: owned }
      })
    }))
  }, [update])

  const setActiveProfileId = useCallback((id) => {
    update(prev => ({ ...prev, activeProfileId: id }))
  }, [update])

  const createProfile = useCallback((name) => {
    const profile = newProfile(name.trim() || 'Nuevo Perfil')
    update(prev => ({
      activeProfileId: profile.id,
      profiles: [...prev.profiles, profile],
    }))
  }, [update])

  const renameProfile = useCallback((id, name) => {
    update(prev => ({
      ...prev,
      profiles: prev.profiles.map(p =>
        p.id === id ? { ...p, name: name.trim() || p.name } : p
      )
    }))
  }, [update])

  const deleteProfile = useCallback((id) => {
    update(prev => {
      const profiles = prev.profiles.filter(p => p.id !== id)
      if (profiles.length === 0) {
        const p = newProfile('Mi Perfil')
        return { activeProfileId: p.id, profiles: [p] }
      }
      const activeProfileId = prev.activeProfileId === id
        ? profiles[0].id
        : prev.activeProfileId
      return { activeProfileId, profiles }
    })
  }, [update])

  const ownedSet = new Set(Object.keys(activeProfile?.ownedItems ?? {}))

  return {
    profiles: state.profiles,
    activeProfile,
    activeProfileId: state.activeProfileId,
    ownedSet,
    toggleOwned,
    setAllOwned,
    setActiveProfileId,
    createProfile,
    renameProfile,
    deleteProfile,
  }
}
