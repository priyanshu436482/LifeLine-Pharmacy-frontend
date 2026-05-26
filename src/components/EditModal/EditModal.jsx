import { useState, useEffect } from 'react'
import { compressImageFile } from '../../utils/compressImage'
import './EditModal.css'

export default function EditModal({ isOpen, product, onSave, onCancel }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('medicines')
  const [image, setImage] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (product) {
      setName(product.name || '')
      setPrice(String(product.price ?? ''))
      setSlug(product.slug || '')
      setCategory(product.category || 'medicines')
      setImage(product.image || '')
      setImageFile(null)
      setError('')
    }
  }, [product])

  if (!isOpen || !product) return null

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }

    try {
      const compressed = await compressImageFile(file)
      setImageFile(compressed)
      setImage(compressed)
      setError('')
    } catch (err) {
      setError(err.message || 'Could not process image')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSaving(true)

    try {
      await onSave({
        name,
        price: Number(price),
        slug,
        category,
        image: imageFile || image
      })
    } catch (err) {
      setError(err.message || 'Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Edit Medicine</h3>
        <form onSubmit={handleSubmit} className="edit-modal-form">
          <div className="form-group">
            <label>Medicine Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter medicine name" required />
          </div>
          <div className="form-group">
            <label>Price (₹)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price" required />
          </div>
          <div className="form-group">
            <label>Medicine Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
            {image && (
              <div className="edit-image-preview">
                <img src={image} alt="Preview" />
                <button type="button" className="edit-remove-image" onClick={() => { setImage(''); setImageFile(null) }}>
                  Remove Image
                </button>
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Slug (Unique identifier)</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. paracetamol-500" required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="medicines">Medicines</option>
              <option value="healthcare">Healthcare</option>
              <option value="lab-tests">Lab Tests</option>
              <option value="personal-care">Personal Care</option>
            </select>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="modal-btn modal-btn-cancel" onClick={onCancel} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="modal-btn modal-btn-confirm" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
