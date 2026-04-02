import { useState, useEffect, useCallback } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase.js'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, u => {
      setUser(u)
      setAuthLoading(false)
    })
  }, [])

  const register = useCallback(async (name, email, pass) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass)
      await updateProfile(cred.user, { displayName: name.trim() })
      return null
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') return 'Este correo ya está en uso.'
      if (err.code === 'auth/weak-password') return 'La contraseña debe tener al menos 6 caracteres.'
      if (err.code === 'auth/invalid-email') return 'El correo no es válido.'
      return 'Error al crear la cuenta. Intenta de nuevo.'
    }
  }, [])

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

  const logout = useCallback(() => signOut(auth), [])

  return { user, authLoading, register, login, logout }
}
