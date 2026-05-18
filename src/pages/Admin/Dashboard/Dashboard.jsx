import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar/Navbar'
import Footer from '../../../components/Footer/Footer'
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
  const [error, setError] = useState('')
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
    setError('')

    try {
      const response = await fetch(`${apiUrl}/products`)
      const data = await response.json()

      if (!response.ok) {
        setProducts([])
        setError(data.message || 'Could not load medicines. Is the backend running?')
        return
      }

      if (Array.isArray(data)) {
        setProducts(data)
      } else {
        setProducts([])
        setError('Unexpected response from server')
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setProducts([])
      setError('Could not load medicines. Run npm run dev from the project folder.')
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddMedicine = async (e) => {
    e.preventDefault()
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
      const data = await response.json()

      if (response.status === 401) {
        handleUnauthorized()
        return
      }

      if (data.success) {
        setMessage('Medicine added successfully!')
        setName('')
        setPrice('')
        setImage('')
        setSlug('')
        setCategory('medicines')
        setError('')
        fetchProducts() // Refresh the list
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to add medicine. Please try again.')
    }
  }

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        const adminToken = localStorage.getItem('adminToken')
        const response = await fetch(`${apiUrl}/products/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        })
        const data = await response.json()

        if (response.status === 401) {
          handleUnauthorized()
          return
        }

        if (data.success) {
          setMessage('Medicine deleted successfully!')
          fetchProducts() // Refresh the list
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError('Failed to delete medicine.')
      }
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
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="add-btn">Add Medicine</button>
            </form>
          </div>

          <div className="manage-medicines-card">
            <h2 className="card-title">Manage Medicines</h2>
            <div className="products-list">
              {isLoadingProducts ? (
                <p className="no-products">Loading medicines...</p>
              ) : error && products.length === 0 ? (
                <p className="error-message">{error}</p>
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
                      {products.map((product) => (
                        <tr key={product._id}>
                          <td>{product.name}</td>
                          <td>₹{product.price}</td>
                          <td className="capitalize">{product.category}</td>
                          <td>
                            <button 
                              onClick={() => handleDeleteProduct(product._id)} 
                              className="delete-btn"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
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
