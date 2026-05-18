import { useState, useEffect } from 'react'
import { getApiUrl } from '../../utils/apiUrl'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import ProductCard from '../../components/ProductCard/ProductCard'
import { categories, products as staticProducts } from '../../data/products'
import { useSearch } from '../../context/SearchContext'
import './Products.css'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useSearch()

  const apiUrl = getApiUrl()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/products`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        } else {
          console.error('Failed to fetch products')
          setProducts(staticProducts) // Fallback to static
        }
      } catch (error) {
        console.error('Error loading products:', error)
        setProducts(staticProducts) // Fallback to static
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [apiUrl])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId)
  }

  return (
    <div className="layout">
      <Navbar />
      <main className="main products-page">
        <div className="container">
          <header className="products-page__header">
            <h1 className="products-page__title">
              {searchQuery ? (
                <>Results for <em>"{searchQuery}"</em></>
              ) : selectedCategory !== 'all' ? (
                <>Category: <em>"{categories.find(c => c.id === selectedCategory)?.name}"</em></>
              ) : 'Our Products'}
            </h1>
            
            <div className="products-page__filters">
              <button 
                className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('all')}
              >
                All
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <p className="products-page__subtitle">
              {loading ? 'Loading products...' : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'} found`}
            </p>
          </header>

          {loading ? (
            <div className="products-page__loading">Loading...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="products-page__grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="products-page__empty">
              <span className="products-page__empty-icon">💊</span>
              <h3>No products found</h3>
              <p>Try searching for something else or browse all products.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
