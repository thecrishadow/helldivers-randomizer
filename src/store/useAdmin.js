import { useState, useEffect, useCallback } from 'react'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { auth, db } from '../firebase.js'

export function useAdmin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [customItems, setCustomItems] = useState([])

  // Persist Firebase auth session across page reloads
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setIsLoggedIn(!!user)
      setAuthLoading(false)
    })
    return unsub
  }, [])

  // Listen to custom items in Firestore in real time — all visitors see the same list
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'custom-items'), snapshot => {
      setCustomItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  // Returns error string on failure, null on success
  const login = useCallback(async (email, pass) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass)
      return null
    } catch (err) {
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) return 'Correo o contraseña incorrectos.'
      if (err.code === 'auth/too-many-requests')
        return 'Demasiados intentos fallidos. Intenta más tarde.'
      return 'Error al iniciar sesión. Intenta de nuevo.'
    }
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
    setEditMode(false)
  }, [])

  const addCustomItem = useCallback(async (item) => {
    // Firestore generates the id — no need to create one manually
    await addDoc(collection(db, 'custom-items'), item)
  }, [])

  const removeCustomItem = useCallback(async (itemId) => {
    await deleteDoc(doc(db, 'custom-items', itemId))
  }, [])

  return { isLoggedIn, authLoading, login, logout, editMode, setEditMode, customItems, addCustomItem, removeCustomItem }
}
