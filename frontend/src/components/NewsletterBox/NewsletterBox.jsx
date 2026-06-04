import React, { useState } from 'react'
import './NewsletterBox.css'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useContext } from 'react'
import { StoreContext } from '../../Context/StoreContext'

const NewsletterBox = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { url } = useContext(StoreContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const response = await axios.post(`${url}/api/newsletter/subscribe`, { email })
      if (response.data.success) {
        toast.success(response.data.message)
        setEmail('')
      } else {
        toast.info(response.data.message)
      }
    } catch {
      toast.error('Subscription failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='newsletter-box'>
      <p className='newsletter-title'>Subscribe now & get 20% off</p>
      <p className='newsletter-desc'>Stay updated with our latest dishes, special offers, and exclusive deals. Join our food lovers community today!</p>
      <form onSubmit={onSubmitHandler}>
        <input type="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type='submit' disabled={loading}>{loading ? 'Subscribing...' : 'SUBSCRIBE'}</button>
      </form>
    </div>
  )
}

export default NewsletterBox
