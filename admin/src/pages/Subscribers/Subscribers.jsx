import React, { useEffect, useState } from 'react'
import './Subscribers.css'
import { url } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Subscribers = () => {
    const [subscribers, setSubscribers] = useState([])

    const fetchSubscribers = async () => {
        try {
            const token = localStorage.getItem('adminToken')
            const response = await axios.get(`${url}/api/newsletter/list`, { headers: { token } })
            if (response.data.success) {
                setSubscribers(response.data.data)
            } else {
                toast.error('Failed to load subscribers')
            }
        } catch {
            toast.error('Error fetching subscribers')
        }
    }

    useEffect(() => { fetchSubscribers() }, [])

    return (
        <div className='subscribers-page add flex-col'>
            <p>Newsletter Subscribers ({subscribers.length})</p>
            <div className='subscribers-table'>
                <div className='sub-table-header'>
                    <b>#</b>
                    <b>Email</b>
                    <b>Subscribed On</b>
                </div>
                {subscribers.map((sub, index) => (
                    <div key={sub._id} className='sub-table-row'>
                        <p>{index + 1}</p>
                        <p>{sub.email}</p>
                        <p>{new Date(sub.subscribedAt).toLocaleDateString()}</p>
                    </div>
                ))}
                {subscribers.length === 0 && (
                    <p className='no-subs'>No subscribers yet.</p>
                )}
            </div>
        </div>
    )
}

export default Subscribers
