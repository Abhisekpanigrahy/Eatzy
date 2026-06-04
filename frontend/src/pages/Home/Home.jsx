import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
import OurPolicy from '../../components/OurPolicy/OurPolicy'
import NewsletterBox from '../../components/NewsletterBox/NewsletterBox'
import BestSeller from '../../components/BestSeller/BestSeller'

const Home = () => {

  const [category,setCategory] = useState("All")

  return (
    <>
      <Header/>
      <ExploreMenu setCategory={setCategory} category={category}/>
      <FoodDisplay category={category}/>
      <OurPolicy/>
      <BestSeller/>
      <AppDownload/>
      <NewsletterBox/>
    </>
  )
}

export default Home
