import React, { useState } from 'react'
import './Login.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { url } from '../../assets/assets'

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post(`${url}/api/user/admin`, { email, password })
            if (response.data.success) {
                setToken(response.data.token)
                localStorage.setItem('adminToken', response.data.token)
                toast.success('Welcome, Admin!')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error('Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='admin-login'>
            <div className='admin-login-card'>
                <div className='admin-login-header'>
                    <h1>Eatzy<span>.</span></h1>
                    <p>Admin Panel</p>
                </div>
                <form onSubmit={onSubmitHandler}>
                    <div className='login-field'>
                        <label>Email Address</label>
                        <input
                            type='email'
                            placeholder='admin@example.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='login-field'>
                        <label>Password</label>
                        <input
                            type='password'
                            placeholder='Enter password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type='submit' disabled={loading}>
                        {loading ? <span className='login-spinner'></span> : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
