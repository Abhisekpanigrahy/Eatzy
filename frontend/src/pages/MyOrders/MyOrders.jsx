import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets'

const STATUS_STEPS = ['Food Processing', 'Out for delivery', 'Delivered']

const MyOrders = () => {
  const [data, setData] = useState([])
  const { url, token } = useContext(StoreContext)

  const fetchOrders = async () => {
    const response = await axios.post(
      url + '/api/order/userorders',
      {},
      { headers: { token } }
    )
    if (response.data.success) {
      setData(response.data.data)
    }
  }

  useEffect(() => {
    if (token) fetchOrders()
  }, [token])

  const getStepIndex = (status) => STATUS_STEPS.indexOf(status)

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className='container'>
        {data.length === 0 && (
          <p className='no-orders'>No orders placed yet.</p>
        )}
        {data.map((order, index) => (
          <div key={index} className='my-orders-order'>
            <img src={assets.parcel_icon} alt='' />

            <div className='order-info'>
              <p className='order-items'>
                {order.items.map((item, i) =>
                  i === order.items.length - 1
                    ? item.name + ' x ' + item.quantity
                    : item.name + ' x ' + item.quantity + ', '
                )}
              </p>
              <div className='order-meta'>
                <span className={`pay-method ${order.paymentMethod}`}>
                  {order.paymentMethod === 'cod' ? '💵 COD' : '💳 Stripe'}
                </span>
                <span className={`pay-status ${order.payment ? 'paid' : 'pending'}`}>
                  {order.payment ? 'Paid' : 'Payment Pending'}
                </span>
              </div>
            </div>

            <p className='order-amount'>${order.amount}.00</p>
            <p className='order-count'>Items: {order.items.length}</p>

            {/* Status tracker */}
            <div className='order-tracker'>
              {STATUS_STEPS.map((step, i) => {
                const current = getStepIndex(order.status)
                const done    = i <= current
                return (
                  <div key={i} className={`tracker-step ${done ? 'done' : ''} ${i === current ? 'active' : ''}`}>
                    <div className='tracker-dot'></div>
                    {i < STATUS_STEPS.length - 1 && <div className={`tracker-line ${i < current ? 'done' : ''}`}></div>}
                    <p>{step}</p>
                  </div>
                )
              })}
            </div>

            <button onClick={fetchOrders}>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrders
