import { useState, useEffect, useCallback } from 'react'
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.js'

export function useAdmin(user) {
  const isAdmin = !!user && !!import.meta.env.VITE_ADMIN_EMAIL && user.email === import.meta.env.VITE_ADMIN_EMAIL

  const [editMode, setEditMode] = useState(false)
  const [customItems, setCustomItems] = useState([])
  const [allProfiles, setAllProfiles] = useState([])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'custom-items'), snapshot => {
      setCustomItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
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

  return { isAdmin, editMode, setEditMode, customItems, addCustomItem, removeCustomItem, allProfiles }
}
