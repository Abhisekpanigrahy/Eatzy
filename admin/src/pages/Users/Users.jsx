import React, { useEffect, useState } from 'react'
import './Users.css'
import { url } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Users = () => {
    const [users, setUsers] = useState([])

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken')
            const response = await axios.get(`${url}/api/user/list`, { headers: { token } })
            if (response.data.success) {
                setUsers(response.data.data)
            } else {
                toast.error('Failed to load users')
            }
        } catch {
            toast.error('Error fetching users')
        }
    }

    useEffect(() => { fetchUsers() }, [])

    return (
        <div className='users-page add flex-col'>
            <p>All Users ({users.length})</p>
            <div className='users-table'>
                <div className='users-table-header'>
                    <b>#</b>
                    <b>Name</b>
                    <b>Email</b>
                    <b>Role</b>
                    <b>Newsletter</b>
                </div>
                {users.map((user, index) => (
                    <div key={user._id} className='users-table-row'>
                        <p>{index + 1}</p>
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                        <span className={`role-badge ${user.role}`}>{user.role}</span>
                        <p>{user.newsletter ? '✅' : '—'}</p>
                    </div>
                ))}
                {users.length === 0 && (
                    <p className='no-users'>No users found.</p>
                )}
            </div>
        </div>
    )
}

export default Users
