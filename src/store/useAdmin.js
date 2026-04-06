import { useState, useEffect, useCallback } from 'react'
import {
  collection, onSnapshot, addDoc, deleteDoc,
  doc, setDoc, updateDoc, serverTimestamp,
  query, orderBy, limit,
} from 'firebase/firestore'
import { db } from '../firebase.js'

export function useAdmin(user) {
  const envAdmin = import.meta.env.VITE_ADMIN_EMAIL

  const [adminEmails, setAdminEmails]   = useState(new Set())
  const [editMode, setEditMode]         = useState(false)
  const [catalogItems, setCatalogItems] = useState([])
  const [allProfiles, setAllProfiles]   = useState([])
  const [changelog, setChangelog]       = useState([])

  const isAdmin = !!user && (user.email === envAdmin || adminEmails.has(user.email))

  // ── Admins collection ─────────────────────────────────────────────────────
  useEffect(() => {
    return onSnapshot(collection(db, 'admins'), snapshot => {
      setAdminEmails(new Set(snapshot.docs.map(d => d.data().email)))
    })
  }, [])

  // ── Catalog ───────────────────────────────────────────────────────────────
  useEffect(() => {
    return onSnapshot(collection(db, 'catalog'), snapshot => {
      setCatalogItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [])

  // ── All user profiles (admin only) ────────────────────────────────────────
  useEffect(() => {
    if (!isAdmin) return
    return onSnapshot(collection(db, 'user-profiles'), snapshot => {
      setAllProfiles(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [isAdmin])

  // ── Changelog (last 100, admin only) ─────────────────────────────────────
  useEffect(() => {
    if (!isAdmin) return
    const q = query(collection(db, 'changelog'), orderBy('timestamp', 'desc'), limit(100))
    return onSnapshot(q, snapshot => {
      setChangelog(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [isAdmin])

  // Turn off edit mode when session ends
  useEffect(() => {
    if (!isAdmin) setEditMode(false)
  }, [isAdmin])

  // ── Internal: log a change ────────────────────────────────────────────────
  const logChange = useCallback(async (action, itemId, itemName, changes = {}) => {
    if (!user) return
    await addDoc(collection(db, 'changelog'), {
      action,
      itemId,
      itemName,
      changes,
      adminEmail: user.email,
      timestamp: serverTimestamp(),
    })
  }, [user])

  // ── Catalog CRUD ──────────────────────────────────────────────────────────
  const addCatalogItem = useCallback(async (item) => {
    const ref = await addDoc(collection(db, 'catalog'), {
      ...item,
      archived: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    await logChange('create', ref.id, item.name)
  }, [logChange])

  const updateCatalogItem = useCallback(async (itemId, updates, oldItem = {}) => {
    await updateDoc(doc(db, 'catalog', itemId), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
    const changes = {}
    Object.keys(updates).forEach(key => {
      changes[key] = { from: oldItem[key], to: updates[key] }
    })
    await logChange('update', itemId, updates.name ?? oldItem.name, changes)
  }, [logChange])

  const deleteCatalogItem = useCallback(async (itemId, itemName) => {
    await deleteDoc(doc(db, 'catalog', itemId))
    await logChange('delete', itemId, itemName)
  }, [logChange])

  // ── Admin management ──────────────────────────────────────────────────────
  const addAdmin = useCallback(async (email) => {
    const id = email.replace(/[.@]/g, '_')
    await setDoc(doc(db, 'admins', id), {
      email,
      addedBy: user?.email,
      addedAt: serverTimestamp(),
    })
  }, [user])

  const removeAdmin = useCallback(async (email) => {
    const id = email.replace(/[.@]/g, '_')
    await deleteDoc(doc(db, 'admins', id))
  }, [])

  return {
    isAdmin,
    editMode, setEditMode,
    catalogItems,
    addCatalogItem, updateCatalogItem, deleteCatalogItem,
    allProfiles,
    changelog,
    adminEmails: [...adminEmails],
    addAdmin, removeAdmin,
  }
}
