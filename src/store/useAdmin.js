import { useState, useCallback } from 'react'

const CUSTOM_ITEMS_KEY = 'hd2_custom_items'

function loadCustomItems() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_ITEMS_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function useAdmin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [customItems, setCustomItems] = useState(loadCustomItems)

  const login = useCallback((user, pass) => {
    if (user === 'admin' && pass === 'adminC') {
      setIsLoggedIn(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setIsLoggedIn(false)
    setEditMode(false)
  }, [])

  const addCustomItem = useCallback((item) => {
    setCustomItems(prev => {
      const next = [...prev, item]
      localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const removeCustomItem = useCallback((id) => {
    setCustomItems(prev => {
      const next = prev.filter(i => i.id !== id)
      localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { isLoggedIn, login, logout, editMode, setEditMode, customItems, addCustomItem, removeCustomItem }
}
