import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes, Navigate } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Edit from './pages/Edit/Edit'
import Login from './pages/Login/Login'
import Users from './pages/Users/Users'
import Subscribers from './pages/Subscribers/Subscribers'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '')

  useEffect(() => {
    if (!token) {
      localStorage.removeItem('adminToken')
    }
  }, [token])

  if (!token) {
    return (
      <>
        <ToastContainer />
        <Login setToken={setToken} />
      </>
    )
  }

  return (
    <div className='app'>
      <ToastContainer/>
      <Navbar setToken={setToken} />
      <hr />
      <div className="app-content">
        <Sidebar/>
        <Routes>
          <Route path="/" element={<Navigate to="/list" replace />}/>
          <Route path="/add" element={<Add/>}/>
          <Route path="/list" element={<List/>}/>
          <Route path="/orders" element={<Orders/>}/>
          <Route path="/edit/:id" element={<Edit/>}/>
          <Route path="/users" element={<Users/>}/>
          <Route path="/subscribers" element={<Subscribers/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
