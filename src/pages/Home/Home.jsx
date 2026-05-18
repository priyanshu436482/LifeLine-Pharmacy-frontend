import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getApiUrl } from '../../utils/apiUrl'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import HeroSection from '../../components/HeroSection/HeroSection'
import ProductCard from '../../components/ProductCard/ProductCard'
import { categories, products as staticProducts } from '../../data/products'
import { useSearch } from '../../context/SearchContext'
import './Home.css'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { setSelectedCategory, setSearchQuery } = useSearch()

  const apiUrl = getApiUrl()

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/products`)
        if (response.ok) {
          const data = await response.json()
          setFeaturedProducts(data.slice(0, 8))
        } else {
          console.error('Failed to fetch products')
          setFeaturedProducts(staticProducts.slice(0, 8)) // Fallback
        }
      } catch (error) {
        console.error('Error loading featured products:', error)
        setFeaturedProducts(staticProducts.slice(0, 8)) // Fallback
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedProducts()
  }, [apiUrl])

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId)
    setSearchQuery('')
  }

  return (
    <div className="layout">
      <Navbar />
      <main className="main">
        <HeroSection />

        <section className="section categories-section">
          <div className="container">
            <h2 className="section__title">Shop by Category</h2>
            <div className="categories-grid">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={cat.path}
                  className="category-card"
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <span className="category-card__icon">{cat.icon}</span>
                  <span className="category-card__name">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section products-section">
          <div className="container">
            <div className="section__header">
              <h2 className="section__title">Featured Products</h2>
              <Link to="/products" className="section__link">
                View All
              </Link>
            </div>
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <div className="products-grid">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
