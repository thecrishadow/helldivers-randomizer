import { useState, useEffect, useRef, useCallback } from 'react'

const DB_NAME = 'hd2_images'
const DB_VERSION = 1
const STORE_NAME = 'images'

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = e => {
      e.target.result.createObjectStore(STORE_NAME, { keyPath: 'itemId' })
    }
    req.onsuccess = e => resolve(e.target.result)
    req.onerror = e => reject(e.target.error)
  })
}

export function useImages() {
  const dbRef = useRef(null)
  const [images, setImages] = useState({}) // { [itemId]: dataUrl }
  const [dbError, setDbError] = useState(null)

  useEffect(() => {
    openDB().then(db => {
      dbRef.current = db
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.getAll()
      req.onsuccess = () => {
        const map = {}
        req.result.forEach(r => { map[r.itemId] = r.dataUrl })
        setImages(map)
      }
      req.onerror = () => setDbError('No se pudieron cargar las imágenes guardadas.')
    }).catch(() => setDbError('No se pudo acceder al almacenamiento local. Las imágenes no estarán disponibles.'))
  }, [])

  const setImage = useCallback((itemId, dataUrl) => {
    if (!dbRef.current) return
    const tx = dbRef.current.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put({ itemId, dataUrl })
    tx.onerror = () => setDbError('No se pudo guardar la imagen.')
    setImages(prev => ({ ...prev, [itemId]: dataUrl }))
  }, [])

  const deleteImage = useCallback((itemId) => {
    if (!dbRef.current) return
    const tx = dbRef.current.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(itemId)
    tx.onerror = () => setDbError('No se pudo eliminar la imagen.')
    setImages(prev => {
      const next = { ...prev }
      delete next[itemId]
      return next
    })
  }, [])

  return { images, setImage, deleteImage, dbError }
}
