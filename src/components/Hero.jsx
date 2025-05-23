import React from 'react';
import '../styles/Hero.css';
import booth from '../assets/booth.png';

const Hero = () => (
  <section className="hero">
    <aside className="sidebar">
      <button className="menu-toggle">☰</button>
      <nav className="social-links">
        <a href="#"><i className="fab fa-linkedin" /></a>
        <a href="#"><i className="fab fa-facebook" /></a>
        <a href="#"><i className="fab fa-twitter" /></a>
      </nav>
    </aside>

    <div className="hero-content">
      <h1>ECHELONTIX</h1>
      <p>Your trusted partner in innovation and event management.</p>
      <div className="buttons">
        <button className="btn-outline">Log in</button>
        <button className="btn-primary">Register</button>
      </div>
    </div>

    <div className="hero-image">
      <img src={booth} alt="Tickets Booth" />
      <div className="hero-image-overlay" />
      <div className="slider-controls">
        <button className="prev">‹</button>
        <button className="next">›</button>
      </div>
    </div>
  </section>
);

export default Hero;