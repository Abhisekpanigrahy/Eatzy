import React, { useContext, useEffect, useState } from 'react'
import './Profile.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const Profile = () => {
  const { token, setToken, wishlist, food_list, url } = useContext(StoreContext)
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    if (!token) { navigate('/'); return }
    // Load profile from backend
    axios.get(`${url}/api/user/profile`, { headers: { token } })
      .then(res => {
        if (res.data.success) {
          const u = res.data.data
          setProfile({
            name:    u.name    || '',
            email:   u.email   || '',
            phone:   u.phone   || '',
            address: u.address || ''
          })
        }
      })
      .catch(() => {})
  }, [token])

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const onSaveHandler = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${url}/api/user/profile/update`,
        { name: profile.name, phone: profile.phone, address: profile.address },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success('Profile updated successfully!')
      } else {
        toast.error(response.data.message)
      }
    } catch {
      toast.error('Failed to update profile')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    navigate('/')
    toast.success('Logged out successfully!')
  }

  const wishlistedItems = food_list.filter(item => wishlist?.includes(item._id))

  return (
    <div className='profile-page'>
      <div className="profile-sidebar">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <h3>{profile.name}</h3>
          <p>{profile.email || 'No email set'}</p>
        </div>
        <nav className="profile-nav">
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            👤 My Profile
          </button>
          <button className={activeTab === 'wishlist' ? 'active' : ''} onClick={() => setActiveTab('wishlist')}>
            ❤️ Wishlist ({wishlistedItems.length})
          </button>
          <button onClick={() => navigate('/myorders')}>
            📦 My Orders
          </button>
          <button className="logout-btn" onClick={logout}>
            🚪 Logout
          </button>
        </nav>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-form-section">
            <h2>My Profile</h2>
            <form onSubmit={onSaveHandler}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={profile.name} onChange={onChangeHandler} placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={profile.email} onChange={onChangeHandler} placeholder="Your email" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" name="phone" value={profile.phone} onChange={onChangeHandler} placeholder="Your phone" />
                </div>
              </div>
              <div className="form-group">
                <label>Default Delivery Address</label>
                <textarea name="address" value={profile.address} onChange={onChangeHandler} rows={3} placeholder="Your delivery address" />
              </div>
              <button type="submit" className="save-btn">Save Changes</button>
            </form>
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="wishlist-section">
            <h2>My Wishlist</h2>
            {wishlistedItems.length === 0 ? (
              <div className="empty-wishlist">
                <p>♡ Your wishlist is empty</p>
                <button onClick={() => navigate('/menu')}>Browse Menu</button>
              </div>
            ) : (
              <div className="wishlist-grid">
                {wishlistedItems.map(item => (
                  <div key={item._id} className="wishlist-item" onClick={() => navigate(`/food/${item._id}`)}>
                    <img src={item.image.startsWith("http") ? item.image : url + "/images/" + item.image} alt={item.name} loading="lazy" />
                    <div className="wishlist-item-info">
                      <p className="wi-name">{item.name}</p>
                      <p className="wi-price">${item.price}</p>
                      <p className="wi-category">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
