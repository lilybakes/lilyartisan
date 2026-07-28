import { supabase } from './supabase'

const BUCKET = 'lilyartisan-images'

// Resize an image file to fit within maxSize (longest side), returns a JPEG blob.
// Keeps upload sizes reasonable — a phone-camera photo → ~30–80 KB output.
async function resizeImage(file, maxSize) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Failed to decode image'))
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        canvas.toBlob(
          blob => blob ? resolve(blob) : reject(new Error('Canvas encode failed')),
          'image/jpeg',
          0.85,
        )
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Upload an image to Supabase Storage.
 * @param file — the File from an <input type="file">
 * @param folder — subfolder name, e.g. 'recipes' or 'ingredients'
 * @param maxSize — longest side in pixels (recipes 512, ingredients 256)
 * @returns public URL of the uploaded image
 */
export async function uploadImage(file, folder, maxSize = 512) {
  if (!file || !file.type?.startsWith('image/')) throw new Error('Please pick an image file')
  const blob = await resizeImage(file, maxSize)
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
  const { error } = await supabase.storage.from(BUCKET).upload(filename, blob, {
    contentType: 'image/jpeg',
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename)
  return data.publicUrl
}

/**
 * Delete an image from Supabase Storage by its public URL.
 * Safe to call with null / non-bucket URLs — silently ignores.
 */
export async function deleteImage(url) {
  if (!url || typeof url !== 'string') return
  const marker = `/${BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return
  const path = url.slice(idx + marker.length)
  if (!path) return
  await supabase.storage.from(BUCKET).remove([path])
}
