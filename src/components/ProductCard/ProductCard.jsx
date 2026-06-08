import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { id, _id, name, price, image, imageUrl, slug } = product
  const productId = id || _id
  const productImage = image || imageUrl

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart({ id: productId, name, price, image: productImage, slug })
  }

  return (
    <article className="product-card">
      <Link to={`/products#${slug || productId}`} className="product-card__link">
        <div className="product-card__image-wrap">
          <img
            src={productImage}
            alt={name}
            className="product-card__image"
            loading="lazy"
          />
        </div>
        <h3 className="product-card__name">{name}</h3>
        <p className="product-card__price">₹{price}</p>
      </Link>
      <button
        type="button"
        className="product-card__btn"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </article>
  )
}
