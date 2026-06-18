import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useSearch } from '../../context/SearchContext'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const { cartCount } = useCart()
  const { searchQuery, setSearchQuery, setSelectedCategory } = useSearch()
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    // Clear category when searching
    setSelectedCategory('all')
    // If we're not on the products page, navigate to it when searching
    if (query && window.location.hash !== '#/products') {
      navigate('/products')
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSelectedCategory('all')
      navigate('/products')
    }
  }

  const handleLinkClick = () => {
    setMenuOpen(false)
    setProfileDropdownOpen(false)
    // Clear search and category when clicking main nav links
    setSearchQuery('')
    setSelectedCategory('all')
  }

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" onClick={handleLinkClick}>
          <span className="navbar__logo-icon">⚕</span>
          <span className="navbar__logo-text">LifeLine Pharmacy</span>
        </Link>

        <form className="navbar__search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search medicines..."
            className="navbar__search-input"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <span className="navbar__search-icon">🔍</span>
          {searchQuery && (
            <button 
              type="button" 
              className="navbar__search-clear"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </form>

        <button
          type="button"
          className="navbar__toggle"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
          <Link to="/" className="navbar__link" onClick={handleLinkClick}>
            Home
          </Link>
          <Link to="/products" className="navbar__link" onClick={handleLinkClick}>
            Products
          </Link>
          <Link to="/about" className="navbar__link" onClick={handleLinkClick}>
            About
          </Link>
          <Link to="/contact" className="navbar__link" onClick={handleLinkClick}>
            Contact
          </Link>
          <Link
            to="/cart"
            className="navbar__link navbar__cart"
            onClick={() => setMenuOpen(false)}
          >
            <span className="navbar__cart-icon">🛒</span>
            <span className="navbar__cart-text">Cart</span>
            {cartCount > 0 && (
              <span className="navbar__cart-badge">{cartCount}</span>
            )}
          </Link>
          {isAuthenticated ? (
            <div className="navbar__profile-dropdown">
              <button
                type="button"
                className="navbar__profile-trigger"
                onClick={() => setProfileDropdownOpen((o) => !o)}
              >
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.first_name} className="navbar__avatar" />
                ) : (
                  <span className="navbar__avatar-initials">
                    {user?.first_name?.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="navbar__profile-name">{user?.first_name}</span>
              </button>
              {profileDropdownOpen && (
                <div className="navbar__dropdown-menu">
                  <div className="navbar__dropdown-userinfo">
                    <strong>{user?.first_name} {user?.last_name}</strong>
                    <span>{user?.email}</span>
                  </div>
                  <hr />
                  <button
                    onClick={() => {
                      logout()
                      setProfileDropdownOpen(false)
                      setMenuOpen(false)
                    }}
                    className="navbar__dropdown-item logout"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar__link navbar__login-btn" onClick={handleLinkClick}>
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
