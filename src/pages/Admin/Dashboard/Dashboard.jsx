import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar/Navbar'
import Footer from '../../../components/Footer/Footer'
import { compressImageFile } from '../../../utils/compressImage'
import './Dashboard.css'

export default function AdminDashboard() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('medicines')
  const [products, setProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [listError, setListError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin')
    const adminToken = localStorage.getItem('adminToken')

    if (isAdmin !== 'true' || !adminToken) {
      navigate('/admin/login')
    } else {
      fetchProducts()
    }
  }, [navigate])

  const handleUnauthorized = () => {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminId')
    navigate('/admin/login')
  }

  const fetchProducts = async () => {
    setIsLoadingProducts(true)
    setListError('')

    try {
      const response = await fetch(`${apiUrl}/products`)
      const data = await response.json()

      if (!response.ok) {
        setProducts([])
        setListError(data.message || 'Could not load medicines. Is the backend running?')
        return
      }

      if (Array.isArray(data)) {
        setProducts(data)
      } else {
        setProducts([])
        setListError('Unexpected response from server')
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setProducts([])
      setListError('Could not load medicines. Run npm run dev from the project folder.')
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) {
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size should be less than 5MB')
      return
    }

    try {
      const compressedImage = await compressImageFile(file)
      setImage(compressedImage)
      setFormError('')
    } catch (err) {
      setFormError(err.message || 'Could not process image')
    }
  }

  const handleAddMedicine = async (e) => {
    e.preventDefault()
    setFormError('')
    setMessage('')
    setIsSubmitting(true)

    if (!image) {
      setFormError('Please upload a medicine image')
      setIsSubmitting(false)
      return
    }

    try {
      const adminToken = localStorage.getItem('adminToken')
      const response = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ name, price: Number(price), image, slug, category })
      })

      let data = {}
      try {
        data = await response.json()
      } catch {
        setFormError('Server error while adding medicine. Check that npm run dev is running.')
        return
      }

      if (response.status === 401) {
        handleUnauthorized()
        return
      }

      if (response.ok && data.success) {
        setMessage('Medicine added successfully!')
        setName('')
        setPrice('')
        setImage('')
        setSlug('')
        setCategory('medicines')
        fetchProducts()
      } else {
        setFormError(data.message || 'Failed to add medicine')
      }
    } catch (err) {
      setFormError('Cannot reach server. Run npm run dev from the project folder.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!id) {
      setListError('Cannot delete this medicine because it is missing an ID.')
      return
    }

    if (!window.confirm('Are you sure you want to delete this medicine?')) {
      return
    }

    setDeletingId(id)
    setListError('')
    setMessage('')

    try {
      const adminToken = localStorage.getItem('adminToken')
      const response = await fetch(`${apiUrl}/products/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      })

      let data = {}
      try {
        data = await response.json()
      } catch {
        setListError('Server error while deleting. Check that npm run dev is running.')
        return
      }

      if (response.status === 401) {
        handleUnauthorized()
        return
      }

      if (response.ok && data.success) {
        setMessage('Medicine deleted successfully!')
        fetchProducts()
      } else {
        setListError(data.message || 'Failed to delete medicine')
      }
    } catch (err) {
      setListError('Cannot reach server. Run npm run dev from the project folder.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminId')
    navigate('/admin/login')
  }

  return (
    <div className="layout">
      <Navbar />
      <main className="main dashboard-page">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
          <div className="add-medicine-card">
            <h2 className="card-title">Add New Medicine</h2>
            <form onSubmit={handleAddMedicine} className="add-medicine-form">
              <div className="form-group">
                <label>Medicine Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter medicine name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  required
                />
              </div>
              <div className="form-group">
                <label>Medicine Image (Upload)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!image}
                  className="file-input"
                />
                {image && (
                  <div className="image-preview-container" style={{ marginTop: '10px' }}>
                    <img 
                      src={image} 
                      alt="Preview" 
                      style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setImage('')} 
                      style={{ display: 'block', marginTop: '8px', color: '#ff4d4f', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Slug (Unique identifier)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. paracetamol-500"
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
              {message && <p className="success-message">{message}</p>}
              {formError && <p className="error-message">{formError}</p>}
              <button type="submit" className="add-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Medicine'}
              </button>
            </form>
          </div>

          <div className="manage-medicines-card">
            <h2 className="card-title">Manage Medicines</h2>
            {listError && products.length > 0 && (
              <p className="error-message">{listError}</p>
            )}
            <div className="products-list">
              {isLoadingProducts ? (
                <p className="no-products">Loading medicines...</p>
              ) : listError && products.length === 0 ? (
                <p className="error-message">{listError}</p>
              ) : products.length === 0 ? (
                <p className="no-products">No medicines yet. Add one using the form above.</p>
              ) : (
                <div className="table-responsive">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => {
                        const productIdentifier = product._id || product.id || product.slug

                        return (
                        <tr key={productIdentifier}>
                          <td>{product.name}</td>
                          <td>₹{product.price}</td>
                          <td className="capitalize">{product.category}</td>
                          <td>
                            <button 
                              onClick={() => handleDeleteProduct(productIdentifier)} 
                              className="delete-btn"
                              disabled={!productIdentifier || deletingId === productIdentifier}
                            >
                              {deletingId === productIdentifier ? 'Deleting...' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
