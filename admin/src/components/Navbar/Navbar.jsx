import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'

const Navbar = ({ setToken }) => {
  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setToken('')
    toast.success('Logged out')
  }

  return (
    <div className='navbar'>
      <h1 className='logo'>Eatzy<span>.</span></h1>
      <div className='navbar-right'>
        <span className='admin-badge'>Admin</span>
        <button className='logout-btn' onClick={handleLogout}>Logout</button>
        <img className='profile' src={assets.profile_image} alt="" />
      </div>
    </div>
  )
}

export default Navbar
