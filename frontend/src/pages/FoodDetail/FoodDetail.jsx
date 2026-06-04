import React, { useContext, useEffect, useState } from 'react'
import './FoodDetail.css'
import { useParams, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets'
import FoodItem from '../../components/FoodItem/FoodItem'
import { toast } from 'react-toastify'
import axios from 'axios'

const FoodDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { food_list, cartItems, addToCart, removeFromCart, url, token, wishlist, toggleWishlist } = useContext(StoreContext)

  const [food, setFood] = useState(null)
  const [reviews, setReviews] = useState([])
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const found = food_list.find(item => item._id === id)
    setFood(found || null)
    if (found && found.reviews) {
      setReviews(found.reviews)
    }
  }, [id, food_list])

  const relatedFoods = food_list.filter(item => item.category === food?.category && item._id !== id).slice(0, 4)

  const cartQty = cartItems?.[id] || 0

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(id)
    }
    toast.success(`${food.name} added to cart!`)
  }

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  const submitReview = async (e) => {
    e.preventDefault()
    if (!token) {
      toast.error('Please sign in to leave a review')
      return
    }
    if (!reviewText.trim()) return
    try {
      const response = await axios.post(`${url}/api/food/review`, {
        foodId: id,
        rating: reviewRating,
        text: reviewText,
        userName: 'You'
      }, { headers: { token } })
      if (response.data.success) {
        setReviews(response.data.data.reviews || [])
        setReviewText('')
        setReviewRating(5)
        toast.success('Review submitted!')
      } else {
        toast.error(response.data.message)
      }
    } catch {
      toast.error('Failed to submit review')
    }
  }

  if (!food) {
    return (
      <div className="food-detail-not-found">
        <h2>Item not found</h2>
        <button onClick={() => navigate('/menu')}>Back to Menu</button>
      </div>
    )
  }

  const isWishlisted = wishlist?.includes(id)

  return (
    <div className='food-detail'>
      <div className="food-detail-top">
        <div className="food-detail-images">
          <img
            className="food-detail-main-img"
            src={food.image.startsWith("http") ? food.image : url + "/images/" + food.image}
            alt={food.name}
            loading="lazy"
          />
        </div>
        <div className="food-detail-info">
          <h1 className="food-detail-name">{food.name}</h1>
          <div className="food-detail-rating-row">
            <img src={assets.rating_starts} alt="rating" />
            <span className="avg-rating">{avgRating}</span>
            <span className="review-count">({reviews.length} reviews)</span>
          </div>
          <p className="food-detail-price">${food.price}</p>
          <p className="food-detail-desc">{food.description}</p>
          <p className="food-detail-category">Category: <strong>{food.category}</strong></p>

          <div className="food-detail-qty-row">
            <div className="qty-control">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              ADD TO CART
            </button>
            <button
              className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
              onClick={() => toggleWishlist(id)}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isWishlisted ? '♥' : '♡'}
            </button>
          </div>

          {cartQty > 0 && (
            <p className="in-cart-note">🛒 {cartQty} already in cart</p>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="food-detail-reviews">
        <h3>Customer Reviews</h3>
        <form className="review-form" onSubmit={submitReview}>
          <div className="review-rating-select">
            <label>Your Rating:</label>
            <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))}>
              <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
              <option value={4}>⭐⭐⭐⭐ (4)</option>
              <option value={3}>⭐⭐⭐ (3)</option>
              <option value={2}>⭐⭐ (2)</option>
              <option value={1}>⭐ (1)</option>
            </select>
          </div>
          <textarea
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            placeholder="Share your experience with this dish..."
            rows={3}
          />
          <button type="submit">Submit Review</button>
        </form>
        <div className="reviews-list">
          {reviews.length === 0
            ? <p className="no-reviews">No reviews yet. Be the first to review!</p>
            : reviews.map(r => (
              <div key={r.id} className="review-card">
                <div className="review-header">
                  <strong>{r.user}</strong>
                  <span>{'⭐'.repeat(r.rating)}</span>
                  <span className="review-date">{r.date}</span>
                </div>
                <p>{r.text}</p>
              </div>
            ))
          }
        </div>
      </div>

      {/* Related Foods */}
      {relatedFoods.length > 0 && (
        <div className="food-detail-related">
          <h3>You Might Also Like</h3>
          <div className="related-list">
            {relatedFoods.map(item => (
              <FoodItem key={item._id} id={item._id} name={item.name} desc={item.description} price={item.price} image={item.image} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FoodDetail
