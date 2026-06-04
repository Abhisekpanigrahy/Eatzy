import React from 'react'
import './About.css'
import NewsletterBox from '../../components/NewsletterBox/NewsletterBox'

const About = () => {
  return (
    <div className='about'>
      <div className="about-hero">
        <div className="about-hero-text">
          <p className="about-label">Our Story</p>
          <h1>About <span>Eatzy</span></h1>
          <p className="about-subtitle">Bringing delicious food from the best local kitchens right to your doorstep — fast, fresh, and hassle-free.</p>
        </div>
      </div>

      <div className="about-mission">
        <div className="about-mission-text">
          <h2>Why We Started</h2>
          <p>Eatzy was founded with a simple mission: make great food accessible to everyone. We partner with the finest local restaurants and home chefs to curate a menu that satisfies every craving.</p>
          <p>Whether you're a student looking for a quick bite, a family wanting a comfortable dinner, or an office worker craving a hearty lunch — Eatzy is your go-to food delivery partner.</p>
        </div>
        <div className="about-mission-img">
          <div className="about-mission-card">
            <div className="mission-stat">
              <h3>50K+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="mission-stat">
              <h3>200+</h3>
              <p>Menu Items</p>
            </div>
            <div className="mission-stat">
              <h3>30 min</h3>
              <p>Avg Delivery</p>
            </div>
            <div className="mission-stat">
              <h3>4.8★</h3>
              <p>App Rating</p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-values">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🍽️</div>
            <h3>Quality First</h3>
            <p>We work only with restaurants that maintain the highest food quality and hygiene standards.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">⚡</div>
            <h3>Speed</h3>
            <p>Your time matters. Our optimised delivery network ensures your food arrives hot and on time.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🌱</div>
            <h3>Sustainability</h3>
            <p>We use eco-friendly packaging and partner with restaurants that support sustainable practices.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">❤️</div>
            <h3>Community</h3>
            <p>We support local restaurants and chefs, helping them grow while feeding their community.</p>
          </div>
        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default About
