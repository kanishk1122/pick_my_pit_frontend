import React from 'react'
import { motion } from 'framer-motion'
import Herosection from './Herosection/index.jsx'
import Firstsection from './Firstsection/index.jsx'
import FeaturedPets from './Home/FeaturedPets.jsx'
import Newsletter from './Home/Newsletter.jsx'

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const sectionVariants = {
    hidden: { 
      opacity: 0,
      y: 40
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom cubic-bezier for smooth motion
      }
    }
  }

  return (
    <motion.div 
      className="space-y-0"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={sectionVariants}>
        <Herosection/>
      </motion.div>
      
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <FeaturedPets/>
      </motion.div>
      
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <Firstsection/>
      </motion.div>
      
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <Newsletter/>
      </motion.div>
    </motion.div>
  )
}

export default Home