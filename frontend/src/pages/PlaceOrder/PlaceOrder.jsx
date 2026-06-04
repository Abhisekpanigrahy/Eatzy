import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const PlaceOrder = () => {
    const [data, setData] = useState({
        firstName: '', lastName: '', email: '',
        street: '', city: '', state: '',
        zipcode: '', country: '', phone: ''
    })
    const [paymentMethod, setPaymentMethod] = useState('stripe')
    const [loading, setLoading] = useState(false)

    const { getTotalCartAmount, token, food_list, cartItems = {}, url, setCartItems, setShowLogin } = useContext(StoreContext)
    const navigate = useNavigate()

    const onChangeHandler = (e) => {
        const { name, value } = e.target
        setData(d => ({ ...d, [name]: value }))
    }

    const placeOrder = async (e) => {
        e.preventDefault()
        if (!token) { setShowLogin(true); return }

        setLoading(true)
        const orderItems = food_list
            .filter(item => cartItems[item._id] > 0)
            .map(item => ({ ...item, quantity: cartItems[item._id] }))

        const orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + 5,
            paymentMethod,
        }

        try {
            const response = await axios.post(url + '/api/order/place', orderData, { headers: { token } })
            if (response.data.success) {
                if (paymentMethod === 'cod') {
                    setCartItems({})
                    toast.success('Order placed! Pay on delivery.')
                    navigate('/myorders')
                } else {
                    window.location.replace(response.data.session_url)
                }
            } else {
                toast.error(response.data.message || 'Something went wrong')
            }
        } catch {
            toast.error('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!token) setShowLogin(true)
        else if (getTotalCartAmount() === 0) navigate('/cart')
    }, [token])

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className='place-order-left'>
                <p className='title'>Delivery Information</p>
                <div className='multi-field'>
                    <input type='text' name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
                    <input type='text' name='lastName'  onChange={onChangeHandler} value={data.lastName}  placeholder='Last name'  required />
                </div>
                <input type='email' name='email'  onChange={onChangeHandler} value={data.email}  placeholder='Email address' required />
                <input type='text'  name='street' onChange={onChangeHandler} value={data.street} placeholder='Street'        required />
                <div className='multi-field'>
                    <input type='text' name='city'  onChange={onChangeHandler} value={data.city}  placeholder='City'  required />
                    <input type='text' name='state' onChange={onChangeHandler} value={data.state} placeholder='State' required />
                </div>
                <div className='multi-field'>
                    <input type='text' name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' required />
                    <input type='text' name='country' onChange={onChangeHandler} value={data.country} placeholder='Country'  required />
                </div>
                <input type='text' name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />

                {/* Payment Method */}
                <p className='title' style={{ marginTop: '24px' }}>Payment Method</p>
                <div className='payment-methods'>
                    <div
                        className={`payment-option ${paymentMethod === 'stripe' ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod('stripe')}
                    >
                        <div className='payment-radio'><span /></div>
                        <div className='payment-label'>
                            <p>Pay with Card</p>
                            <span>Stripe — secure online payment</span>
                        </div>
                        <div className='payment-icons'>
                            <span>💳</span>
                        </div>
                    </div>
                    <div
                        className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod('cod')}
                    >
                        <div className='payment-radio'><span /></div>
                        <div className='payment-label'>
                            <p>Cash on Delivery</p>
                            <span>Pay when your order arrives</span>
                        </div>
                        <div className='payment-icons'>
                            <span>💵</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='place-order-right'>
                <div className='cart-total'>
                    <h2>Cart Totals</h2>
                    <div>
                        <div className='cart-total-details'><p>Subtotal</p><p>${getTotalCartAmount()}</p></div>
                        <hr />
                        <div className='cart-total-details'><p>Delivery Fee</p><p>${getTotalCartAmount() === 0 ? 0 : 5}</p></div>
                        <hr />
                        <div className='cart-total-details'><b>Total</b><b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}</b></div>
                    </div>
                </div>
                <button className='place-order-submit' type='submit' disabled={loading}>
                    {loading
                        ? <div className='loader'></div>
                        : paymentMethod === 'cod'
                            ? 'Place Order'
                            : 'Proceed to Payment'}
                </button>
            </div>
        </form>
    )
}

export default PlaceOrder
