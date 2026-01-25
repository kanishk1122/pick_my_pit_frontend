import React from 'react'
import Herosection from './Herosection/index.jsx'
import Firstsection from './Firstsection/index.jsx'
import FeaturedPets from './Home/FeaturedPets.jsx'
import Newsletter from './Home/Newsletter.jsx'

const Home = () => {
  return (
    <div className="space-y-0">
        <Herosection/>
        <FeaturedPets/>
        <Firstsection/>
        <Newsletter/>
    </div>
  )
}

export default Home