import React, { useContext, useEffect, useState } from 'react'
import './Verify.css'
import './TrackOrder.css'
import { useParams, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'

const TrackOrder = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { url, token } = useContext(StoreContext)
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } })
            if (response.data.success) {
                const foundOrder = response.data.data.find(o => o._id === id)
                setOrder(foundOrder)
            }
        } catch (error) {
            console.error("Error fetching order:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token && id) {
            fetchOrderDetails()
        }
    }, [token, id])

    if (loading) return <div className='verify'><div className="spinner"></div></div>

    if (!order) return <div className='verify'><h2>Order not found</h2><button onClick={() => navigate('/myorders')}>Back to Orders</button></div>

    const steps = [
        { status: 'Food Processing', label: 'Order Placed', icon: '📝' },
        { status: 'Food Processing', label: 'Preparing', icon: '🍳' },
        { status: 'Out for delivery', label: 'On the Way', icon: '🛵' },
        { status: 'Delivered', label: 'Delivered', icon: '🏠' }
    ]

    const getStatusIndex = (status) => {
        if (status === 'Delivered') return 3;
        if (status === 'Out for delivery') return 2;
        return 1; // Preparing/Processing
    }

    const currentIndex = getStatusIndex(order.status)

    return (
        <div className='track-order-page'>
            <div className="track-order-container">
                <div className="track-order-header">
                    <h2>Track Your Order</h2>
                    <p>Order ID: #{order._id.slice(-8).toUpperCase()}</p>
                </div>

                <div className="tracking-visual">
                    {steps.map((step, index) => {
                        const isCompleted = index <= currentIndex
                        const isActive = index === currentIndex
                        
                        return (
                            <div key={index} className={`tracking-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                                <div className="step-line-container">
                                    <div className="step-dot">
                                        <span className="step-icon">{step.icon}</span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`step-line ${index < currentIndex ? 'filled' : ''}`}></div>
                                    )}
                                </div>
                                <p className="step-label">{step.label}</p>
                            </div>
                        )
                    })}
                </div>

                <div className="order-summary-card">
                    <h3>Order Details</h3>
                    <div className="order-items-list">
                        {order.items.map((item, index) => (
                            <div key={index} className="order-item-row">
                                <span>{item.name} x {item.quantity}</span>
                                <span>${item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <hr />
                    <div className="order-total-row">
                        <b>Total Amount</b>
                        <b>${order.amount}.00</b>
                    </div>
                </div>

                <button className="back-btn" onClick={() => navigate('/myorders')}>Back to My Orders</button>
            </div>
        </div>
    )
}

export default TrackOrder
