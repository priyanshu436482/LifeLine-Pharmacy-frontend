import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import './Cart.css'

export default function Cart() {
  const { items, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart()

  if (items.length === 0) {
    return (
      <div className="layout">
        <Navbar />
        <main className="main cart-page">
          <div className="container">
            <h1 className="cart-page__title">Your Cart</h1>
            <div className="cart-empty">
              <p className="cart-empty__text">Your cart is empty.</p>
              <Link to="/products" className="cart-empty__link">
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="layout">
      <Navbar />
      <main className="main cart-page">
        <div className="container">
          <h1 className="cart-page__title">Your Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h1>

          <div className="cart-layout">
            <div className="cart-list">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item__image-wrap">
                    <img
                      src={item.image || item.imageUrl}
                      alt={item.name}
                      className="cart-item__image"
                    />
                  </div>
                  <div className="cart-item__details">
                    <h3 className="cart-item__name">{item.name}</h3>
                    <p className="cart-item__price">₹{item.price}</p>
                    <div className="cart-item__actions">
                      <div className="cart-item__qty">
                        <button
                          type="button"
                          className="cart-item__qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="cart-item__qty-num">{item.quantity}</span>
                        <button
                          type="button"
                          className="cart-item__qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="cart-item__remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="cart-item__total">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <div className="cart-summary__box">
                <h3 className="cart-summary__title">Order Summary</h3>
                <div className="cart-summary__row">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="cart-summary__row cart-summary__total">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>
                <Link to="/products" className="cart-summary__continue">
                  Continue Shopping
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
