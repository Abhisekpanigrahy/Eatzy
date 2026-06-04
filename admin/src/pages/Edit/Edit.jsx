import React, { useEffect, useState } from 'react'
import './Edit.css'
import { assets, url } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'

const Edit = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [data, setData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Salad'
    })
    const [image, setImage] = useState(false)
    const [existingImage, setExistingImage] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFood = async () => {
            try {
                const response = await axios.get(`${url}/api/food/list`)
                if (response.data.success) {
                    const food = response.data.data.find(item => item._id === id)
                    if (food) {
                        setData({
                            name: food.name,
                            description: food.description,
                            price: food.price,
                            category: food.category
                        })
                        setExistingImage(food.image)
                    } else {
                        toast.error('Food item not found')
                        navigate('/list')
                    }
                }
            } catch (error) {
                toast.error('Error loading food item')
            } finally {
                setLoading(false)
            }
        }
        fetchFood()
    }, [id])

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        const formData = new FormData()
        formData.append('id', id)
        formData.append('name', data.name)
        formData.append('description', data.description)
        formData.append('price', Number(data.price))
        formData.append('category', data.category)
        if (image) {
            formData.append('image', image)
        }
        try {
            const response = await axios.post(`${url}/api/food/update`, formData)
            if (response.data.success) {
                toast.success('Food item updated successfully!')
                navigate('/list')
            } else {
                toast.error(response.data.message || 'Update failed')
            }
        } catch (error) {
            toast.error('Error updating food item')
        }
    }

    if (loading) {
        return <div className='edit'><p>Loading...</p></div>
    }

    return (
        <div className='edit add'>
            <p>Edit Food Item</p>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className='add-img-upload flex-col'>
                    <p>Food Image</p>
                    <label htmlFor="image">
                        <img
                            src={image ? URL.createObjectURL(image) : `${url}/images/${existingImage}`}
                            alt="food"
                        />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                    <p className='edit-img-hint'>Click image to change (leave unchanged to keep current)</p>
                </div>
                <div className='add-product-name flex-col'>
                    <p>Product name</p>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Type here' required />
                </div>
                <div className='add-product-description flex-col'>
                    <p>Product description</p>
                    <textarea name='description' onChange={onChangeHandler} value={data.description} rows={6} placeholder='Write content here' required />
                </div>
                <div className='add-category-price'>
                    <div className='add-category flex-col'>
                        <p>Product category</p>
                        <select name='category' onChange={onChangeHandler} value={data.category}>
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>
                    <div className='add-price flex-col'>
                        <p>Product Price</p>
                        <input type="number" name='price' onChange={onChangeHandler} value={data.price} placeholder='$25' required />
                    </div>
                </div>
                <div className='edit-actions'>
                    <button type='submit' className='add-btn'>SAVE CHANGES</button>
                    <button type='button' className='edit-cancel-btn' onClick={() => navigate('/list')}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default Edit
