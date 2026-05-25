import React from 'react'
import Hero from '../Components/Hero/Hero'
import Popular from '../Components/Popular/Popular'
import Popularmen from '../Components/Popular/Popularmen'
import Offers from '../Components/Offers/Offers'
import NewCollections from '../Components/NewCollections/NewCollections'
import NewsLetter from '../Components/NewsLetter/NewsLetter'
import './CSS/Shop.css'

const Shop = () => {
  return (
    <div className="shop-page">
      <div className="shop-hero-wrap">
        <Hero />
      </div>

      <section className="shop-section shop-section-soft">
        <Popularmen />
      </section>

      <section className="shop-section">
        <Popular />
      </section>

      <section className="shop-section shop-section-highlight">
        <Offers />
      </section>

      <section className="shop-section">
        <NewCollections />
      </section>

      <section className="shop-newsletter-wrap">
        <NewsLetter />
      </section>
    </div>
  )
}

export default Shop
