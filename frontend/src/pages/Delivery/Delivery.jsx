import React from 'react'
import './Delivery.css'

const Delivery = () => {
  return (
    <div className='delivery-page'>
      <div className="delivery-hero">
        <h1>Delivery Information</h1>
        <p>Everything you need to know about our delivery process</p>
      </div>

      <div className="delivery-sections">
        <div className="delivery-section">
          <div className="ds-icon">🚀</div>
          <div>
            <h3>Delivery Zones</h3>
            <p>We currently deliver to all major areas within the city. Enter your address at checkout to confirm delivery availability to your location.</p>
          </div>
        </div>
        <div className="delivery-section">
          <div className="ds-icon">⏱️</div>
          <div>
            <h3>Delivery Time</h3>
            <p>Standard delivery takes 25–45 minutes depending on your location and current order volume. We aim to have your food delivered hot and fresh every time.</p>
          </div>
        </div>
        <div className="delivery-section">
          <div className="ds-icon">💰</div>
          <div>
            <h3>Delivery Charges</h3>
            <p>A flat delivery fee of $5 is charged per order. Orders above $50 qualify for free delivery. Delivery charges are shown clearly at checkout before payment.</p>
          </div>
        </div>
        <div className="delivery-section">
          <div className="ds-icon">🔄</div>
          <div>
            <h3>Order Issues & Refunds</h3>
            <p>If there is an issue with your order — missing items, wrong order, or quality concerns — contact us within 30 minutes of delivery. We'll make it right with a refund or replacement.</p>
          </div>
        </div>
        <div className="delivery-section">
          <div className="ds-icon">📦</div>
          <div>
            <h3>Packaging</h3>
            <p>All orders are packed in food-safe, eco-friendly containers designed to keep your food fresh during transit. Hot items are sealed to retain heat.</p>
          </div>
        </div>
        <div className="delivery-section">
          <div className="ds-icon">📞</div>
          <div>
            <h3>Track & Support</h3>
            <p>Once your order is placed, you can track its status from your "My Orders" page. Our support team is available 24/7 if you need assistance.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Delivery
