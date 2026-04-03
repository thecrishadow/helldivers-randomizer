import { useState, useEffect, useCallback } from 'react'
import { collection, onSnapshot, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase.js'

export function useAdmin(user) {
  const isAdmin = !!user && !!import.meta.env.VITE_ADMIN_EMAIL && user.email === import.meta.env.VITE_ADMIN_EMAIL

  const [editMode, setEditMode] = useState(false)
  const [customItems, setCustomItems] = useState([])
  const [allProfiles, setAllProfiles] = useState([])
  const [itemOverrides, setItemOverrides] = useState({})

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'custom-items'), snapshot => {
      setCustomItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  useEffect(() => {
    return onSnapshot(collection(db, 'item-overrides'), snapshot => {
      const map = {}
      snapshot.docs.forEach(d => { map[d.id] = d.data() })
      setItemOverrides(map)
    })
  }, [])

  // Only fetch all profiles when logged in as admin
  useEffect(() => {
    if (!isAdmin) return
    return onSnapshot(collection(db, 'user-profiles'), snapshot => {
      setAllProfiles(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [isAdmin])

  // Turn off edit mode when session ends
  useEffect(() => {
    if (!isAdmin) setEditMode(false)
  }, [isAdmin])

  const addCustomItem = useCallback(async (item) => {
    await addDoc(collection(db, 'custom-items'), item)
  }, [])

  const removeCustomItem = useCallback(async (itemId) => {
    await deleteDoc(doc(db, 'custom-items', itemId))
  }, [])

  const setItemOverride = useCallback(async (itemId, data) => {
    await setDoc(doc(db, 'item-overrides', itemId), data, { merge: true })
  }, [])

  const clearItemOverride = useCallback(async (itemId) => {
    await deleteDoc(doc(db, 'item-overrides', itemId))
  }, [])

  return { isAdmin, editMode, setEditMode, customItems, addCustomItem, removeCustomItem, allProfiles, itemOverrides, setItemOverride, clearItemOverride }
}
