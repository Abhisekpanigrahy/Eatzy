import React from 'react'
import './OurPolicy.css'

const OurPolicy = () => {
  return (
    <div className='our-policy'>
      <div className="policy-item">
        <div className="policy-icon">🚀</div>
        <p className="policy-title">Fast Delivery</p>
        <p className="policy-desc">Delivered to your door in 30 mins</p>
      </div>
      <div className="policy-item">
        <div className="policy-icon">🔄</div>
        <p className="policy-title">Easy Reorder</p>
        <p className="policy-desc">Reorder your favourites in one tap</p>
      </div>
      <div className="policy-item">
        <div className="policy-icon">🛡️</div>
        <p className="policy-title">Safe & Fresh</p>
        <p className="policy-desc">Hygienic packing & fresh ingredients</p>
      </div>
      <div className="policy-item">
        <div className="policy-icon">💬</div>
        <p className="policy-title">24/7 Support</p>
        <p className="policy-desc">We're always here to help you</p>
      </div>
    </div>
  )
}

export default OurPolicy
