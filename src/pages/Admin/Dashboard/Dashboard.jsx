import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal'
import EditModal from '../../../components/EditModal/EditModal'
import AddModal from '../../../components/AddModal/AddModal'
import { getApiUrl } from '../../../utils/apiUrl'
import './Dashboard.css'

const ITEMS_PER_PAGE = 10

export default function AdminDashboard() {
  const apiUrl = getApiUrl()
  const [products, setProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [message, setMessage] = useState('')
  const [listError, setListError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null })
  const [editingProduct, setEditingProduct] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('products') // 'dashboard' or 'products'
  const navigate = useNavigate()

  const totalPages = Math.max(1, Math.ceil(totalProducts / ITEMS_PER_PAGE))

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin')
    const adminToken = localStorage.getItem('adminToken')

    if (isAdmin !== 'true' || !adminToken) {
      navigate('/admin/login')
    }
  }, [navigate])

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin')
    const adminToken = localStorage.getItem('adminToken')
    if (isAdmin === 'true' && adminToken) {
      fetchProducts(currentPage)
    }
  }, [currentPage, apiUrl])

  // Clear messages after 4 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 4000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleUnauthorized = () => {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminId')
    navigate('/admin/login')
  }

  const fetchProducts = async (page = 1) => {
    setIsLoadingProducts(true)
    setListError('')

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(ITEMS_PER_PAGE),
      })
      const response = await fetch(`${apiUrl}/products?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        setProducts([])
        setTotalProducts(0)
        setListError(data.message || 'Could not load medicines. Is the backend running?')
        return
      }

      const productsArray = data.data || data
      if (Array.isArray(productsArray)) {
        setProducts(productsArray)
        setTotalProducts(data.pagination?.total ?? productsArray.length)
      } else {
        setProducts([])
        setTotalProducts(0)
        setListError('Unexpected response from server')
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setProducts([])
      setTotalProducts(0)
      setListError('Could not load medicines. Check that the backend is deployed and VITE_API_URL is set.')
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const handleAddMedicine = async (newProduct) => {
    const adminToken = localStorage.getItem('adminToken')
    const response = await fetch(`${apiUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify(newProduct)
    })

    let data = {}
    try {
      data = await response.json()
    } catch {
      throw new Error('Server error while adding medicine.')
    }

    if (response.status === 401) {
      handleUnauthorized()
      return
    }

    if (response.ok && data.success) {
      setMessage('Medicine added successfully!')
      setIsAddModalOpen(false)
      fetchProducts(currentPage)
    } else {
      throw new Error(data.message || 'Failed to add medicine')
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!id) {
      setListError('Cannot delete this medicine because it is missing an ID.')
      return
    }

    setConfirmDelete({ isOpen: false, id: null })
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
        fetchProducts(currentPage)
      } else {
        setListError(data.message || 'Failed to delete medicine')
      }
    } catch (err) {
      setListError('Cannot reach server. Run npm run dev from the project folder.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
  }

  const handleSaveEdit = async (updates) => {
    const adminToken = localStorage.getItem('adminToken')
    const identifier = editingProduct._id || editingProduct.id || editingProduct.slug

    const response = await fetch(`${apiUrl}/products/${encodeURIComponent(identifier)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify(updates)
    })

    const data = await response.json()

    if (response.status === 401) {
      handleUnauthorized()
      return
    }

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update medicine')
    }

    setEditingProduct(null)
    setMessage('Medicine updated successfully!')
    fetchProducts(currentPage)
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminId')
    navigate('/admin/login')
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  // Calculate dashboard statistics (current page slice; totals use server count where available)
  const totalMedicines = totalProducts || products.length
  const medicinesCategoryCount = products.filter(p => p.category === 'medicines').length
  const healthcareCategoryCount = products.filter(p => p.category === 'healthcare').length
  const labtestsCategoryCount = products.filter(p => p.category === 'lab-tests').length
  const personalCategoryCount = products.filter(p => p.category === 'personal-care').length
  const avgPrice = totalMedicines > 0 ? (products.reduce((sum, p) => sum + (p.price || 0), 0) / totalMedicines).toFixed(2) : 0

  return (
    <div className="admin-panel-layout">
      {/* Sidebar navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-logo">Admin Panel</h2>
          <p className="sidebar-subtitle">LifeLine Pharmacy</p>
        </div>
        
        <nav className="sidebar-menu">
          <button 
            className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
            Dashboard
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            Products
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-logout-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-content">
        <header className="content-header">
          <div className="header-info">
            <h1 className="content-title">
              {activeTab === 'dashboard' ? 'Dashboard Overview' : 'Manage Products'}
            </h1>
          </div>
          <div className="header-actions">
            {activeTab === 'products' && (
              <button onClick={() => setIsAddModalOpen(true)} className="add-product-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add New Product
              </button>
            )}
          </div>
        </header>

        {message && <div className="toast-message success">{message}</div>}
        {listError && <div className="toast-message error">{listError}</div>}

        <div className="content-body">
          {activeTab === 'dashboard' ? (
            <div className="dashboard-stats-grid">
              <div className="stat-card">
                <div className="stat-title">Total Products</div>
                <div className="stat-value">{totalMedicines}</div>
                <div className="stat-desc">Medicines registered in system</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Average Price</div>
                <div className="stat-value">₹{avgPrice}</div>
                <div className="stat-desc">Across all categories</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Medicines Category</div>
                <div className="stat-value">{medicinesCategoryCount}</div>
                <div className="stat-desc">Items in medicines</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Healthcare Category</div>
                <div className="stat-value">{healthcareCategoryCount}</div>
                <div className="stat-desc">Items in healthcare</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Lab Tests</div>
                <div className="stat-value">{labtestsCategoryCount}</div>
                <div className="stat-desc">Items in lab-tests</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Personal Care</div>
                <div className="stat-value">{personalCategoryCount}</div>
                <div className="stat-desc">Items in personal-care</div>
              </div>
            </div>
          ) : (
            /* Products tab */
            <div className="products-table-card">
              {isLoadingProducts ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading products list...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="empty-state">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-icon">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  <p>No products found. Start by adding one!</p>
                  <button onClick={() => setIsAddModalOpen(true)} className="add-product-btn margin-top">
                    Add Product
                  </button>
                </div>
              ) : (
                <>
                  <div className="table-wrapper">
                    <table className="products-data-table">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Category</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => {
                          const productIdentifier = product._id || product.id || product.slug

                          return (
                            <tr key={productIdentifier}>
                              <td className="image-cell">
                                <div className="product-image-container">
                                  <img 
                                    src={product.image || product.imageUrl || 'https://via.placeholder.com/50'} 
                                    alt={product.name} 
                                    loading="lazy"
                                  />
                                </div>
                              </td>
                              <td className="name-cell">
                                <span className="product-name">{product.name}</span>
                              </td>
                              <td className="price-cell">
                                <span className="product-price">₹{product.price}</span>
                              </td>
                              <td className="category-cell">
                                <span className="category-badge">{product.category}</span>
                              </td>
                              <td className="actions-cell text-right">
                                <button 
                                  onClick={() => handleEditProduct(product)} 
                                  className="action-icon-btn edit"
                                  title="Edit Product"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => setConfirmDelete({ isOpen: true, id: productIdentifier })} 
                                  className="action-icon-btn delete"
                                  disabled={!productIdentifier || deletingId === productIdentifier}
                                  title="Delete Product"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    <line x1="10" y1="11" x2="10" y2="17" />
                                    <line x1="14" y1="11" x2="14" y2="17" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="table-pagination">
                      <button
                        className="pagination-btn"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Prev
                      </button>
                      <div className="pagination-numbers">
                        {getPageNumbers().map((page) => (
                          <button
                            key={page}
                            className={`pagination-number-btn ${page === currentPage ? 'active' : ''}`}
                            onClick={() => goToPage(page)}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <button
                        className="pagination-btn"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AddModal
        isOpen={isAddModalOpen}
        onSave={handleAddMedicine}
        onCancel={() => setIsAddModalOpen(false)}
      />

      <EditModal
        isOpen={!!editingProduct}
        product={editingProduct}
        onSave={handleSaveEdit}
        onCancel={() => setEditingProduct(null)}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Delete Medicine"
        message="Are you sure you want to delete this medicine? This action cannot be undone."
        confirmText="Delete"
        onConfirm={() => handleDeleteProduct(confirmDelete.id)}
        onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
        isLoading={deletingId === confirmDelete.id}
      />
    </div>
  )
}
