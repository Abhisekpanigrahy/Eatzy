import React, { useContext } from 'react'
import './BestSeller.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const BestSeller = () => {
  const { food_list } = useContext(StoreContext)
  // Show first 5 items as "best sellers"
  const bestSellers = food_list.slice(0, 5)

  return (
    <div className='best-seller'>
      <div className="best-seller-header">
        <div className="header-label"><span></span><p>Best Sellers</p><span></span></div>
        <h2>Our Most Popular Dishes</h2>
        <p className="header-desc">Loved by our customers — these are the dishes people keep coming back for.</p>
      </div>
      <div className="best-seller-list">
        {bestSellers.map((item) => (
          <FoodItem key={item._id} id={item._id} name={item.name} desc={item.description} price={item.price} image={item.image} />
        ))}
      </div>
    </div>
  )
}

export default BestSeller
