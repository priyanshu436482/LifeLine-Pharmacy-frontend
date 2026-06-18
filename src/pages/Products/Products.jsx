import { useState, useEffect } from 'react'
import { getApiUrl } from '../../utils/apiUrl'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import ProductCard from '../../components/ProductCard/ProductCard'
import { categories, products as staticProducts } from '../../data/products'
import { useSearch } from '../../context/SearchContext'
import './Products.css'

const PAGE_SIZE = 12

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useSearch()

  const apiUrl = getApiUrl()
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedCategory])

  useEffect(() => {
    const controller = new AbortController()

    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
        })
        if (searchQuery.trim()) {
          params.set('q', searchQuery.trim())
        }
        if (selectedCategory !== 'all') {
          params.set('category', selectedCategory)
        }

        const response = await fetch(`${apiUrl}/products?${params.toString()}`, {
          signal: controller.signal,
        })

        if (response.ok) {
          const data = await response.json()
          setProducts(data.data || [])
          setTotal(data.pagination?.total ?? (data.data?.length || 0))
        } else {
          console.error('Failed to fetch products')
          setProducts(staticProducts)
          setTotal(staticProducts.length)
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error loading products:', error)
          setProducts(staticProducts)
          setTotal(staticProducts.length)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchProducts()
    return () => controller.abort()
  }, [apiUrl, page, searchQuery, selectedCategory])

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId)
  }

  const handlePageChange = (nextPage) => {
    if (nextPage >= 1 && nextPage <= totalPages) {
      setPage(nextPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
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
              {loading
                ? 'Loading products...'
                : `${total} ${total === 1 ? 'product' : 'products'} found`}
            </p>
          </header>

          {loading ? (
            <div className="products-page__loading">Loading...</div>
          ) : products.length > 0 ? (
            <>
              <div className="products-page__grid">
                {products.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="products-page__pagination" aria-label="Product pages">
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          ) : (
            <div className="products-page__empty">
              <span className="products-page__empty-icon">💊</span>
              <h3>No products found</h3>
              <p>Try searching for something else or browse all products.</p>
              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  className="filter-btn products-page__clear-btn"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
