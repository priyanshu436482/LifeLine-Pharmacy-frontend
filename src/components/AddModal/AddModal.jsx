import { useState } from 'react'
import { compressImageFile } from '../../utils/compressImage'
import './AddModal.css'

export default function AddModal({ isOpen, onSave, onCancel }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('medicines')
  const [image, setImage] = useState('')
  const [stock, setStock] = useState('100')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  if (!isOpen) return null

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }

    try {
      const compressed = await compressImageFile(file)
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

    if (!image) {
      setError('Please upload a medicine image')
      setIsSaving(false)
      return
    }

    try {
      await onSave({
        name,
        price: Number(price),
        slug,
        category,
        image,
        stock: Number(stock)
      })
      // Reset form on success
      setName('')
      setPrice('')
      setSlug('')
      setCategory('medicines')
      setImage('')
      setStock('100')
    } catch (err) {
      setError(err.message || 'Failed to add medicine')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content add-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Add New Medicine</h3>
          <button className="close-btn" onClick={onCancel}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="add-modal-form">
          <div className="form-group">
            <label>Medicine Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Vicks VapoRub (25ml)" 
              required 
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price (₹)</label>
              <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="e.g. 85" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Initial Stock</label>
              <input 
                type="number" 
                value={stock} 
                onChange={(e) => setStock(e.target.value)} 
                placeholder="e.g. 100" 
                required 
              />
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
          </div>
          <div className="form-group">
            <label>Slug (Unique URL identifier)</label>
            <input 
              type="text" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)} 
              placeholder="e.g. vicks-vaporub-25ml" 
              required 
            />
          </div>
          <div className="form-group">
            <label>Medicine Image</label>
            <div className="file-upload-wrapper">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="file-input" 
                id="add-image-file"
                required
              />
              <label htmlFor="add-image-file" className="file-upload-btn">
                Choose Image File
              </label>
            </div>
            {image && (
              <div className="add-image-preview">
                <img src={image} alt="Preview" />
                <button type="button" className="add-remove-image" onClick={() => setImage('')}>
                  Remove Image
                </button>
              </div>
            )}
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="modal-btn modal-btn-cancel" onClick={onCancel} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="modal-btn modal-btn-confirm" disabled={isSaving}>
              {isSaving ? 'Adding...' : 'Add Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
