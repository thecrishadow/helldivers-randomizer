import { useState, useEffect, useCallback } from 'react'
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase.js'

export function useImages() {
  const [images, setImages] = useState({}) // { [itemId]: downloadUrl }
  const [dbError, setDbError] = useState(null)

  // Listen to Firestore image map in real time — all visitors see the same images
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'item-images'),
      snapshot => {
        const map = {}
        snapshot.forEach(d => { map[d.id] = d.data().url })
        setImages(map)
      },
      () => setDbError('No se pudieron cargar las imágenes.')
    )
    return unsub
  }, [])

  const setImage = useCallback(async (itemId, dataUrl) => {
    try {
      const storageRef = ref(storage, `item-images/${itemId}`)
      await uploadString(storageRef, dataUrl, 'data_url')
      const url = await getDownloadURL(storageRef)
      await setDoc(doc(db, 'item-images', itemId), { url })
    } catch {
      setDbError('No se pudo guardar la imagen.')
    }
  }, [])

  const deleteImage = useCallback(async (itemId) => {
    try {
      await deleteObject(ref(storage, `item-images/${itemId}`))
      await deleteDoc(doc(db, 'item-images', itemId))
    } catch {
      setDbError('No se pudo eliminar la imagen.')
    }
  }, [])

  return { images, setImage, deleteImage, dbError }
}
