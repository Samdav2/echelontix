import React from 'react';
import '../styles/EventPage.css';
import logo from '../assets/logo.jpg';
import partyImage from '../assets/party.jpg';
import love from '../assets/love.jpg';
import lasuFoodFest from '../assets/lasu-food-fest.jpg';

function EventsPage  () {
  return (
    <div>
      {/* Navigation Bar */}
      <header className="navbar">
        <div className="logo"><img src={logo} alt="logo" /></div>
        <nav className="menu">
          <a href="#">Home</a>
          <a href="#" className="active">Event</a>
          <a href="#">About</a>
          <a href="#">Contacts</a>
          <a href="#">Book Tickets</a>
        </nav>
      </header>

      {/* Slider Section */}
      <section className="slider">
        <img src={partyImage} alt="Event" className="slide-image" />
        <button className="arrow left">&#8592;</button>
        <button className="arrow right">&#8594;</button>
        <div className="dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </section>

      {/* Events Section */}
      <section className="events-section">
        <h2>NEW EVENTS</h2>
        <div className="event-gallery">
          <img src={love} alt="Event 1 Flyer" />
          <img src={love} alt="Event 2 Flyer" />
          <img src={love} alt="Event 3 Flyer" />
          <img src={love} alt="Event 4 Flyer" />
        </div>
      </section>

      {/* Categories */}
      <section className="category-section">
        <h2>Discover by Category</h2>
        <div className="category-grid">
          <div className="category-card"><i className="fas fa-home"></i><p>House Party</p></div>
          <div className="category-card"><i className="fas fa-basketball-ball"></i><p>Pool Party</p></div>
          <div className="category-card"><i className="fas fa-microphone"></i><p>Seminar</p></div>
          <div className="category-card"><i className="fas fa-birthday-cake"></i><p>Birthday Party</p></div>
          <div className="category-card"><i className="fas fa-glass-martini-alt"></i><p>Club Party</p></div>
          <div className="category-card"><i className="fas fa-umbrella-beach"></i><p>Beach Party</p></div>
          <div className="category-card"><i className="fas fa-headphones"></i><p>Concert</p></div>
        </div>
      </section>

      {/* Trending Events */}
      <div className="container">
        <header>
          <h1>Trending Event</h1>
        </header>
        <div className="event-cards">
          <div className="event-card"><img src={love} alt="Heartbeat & Rhythm" /><p>Heartbeat & Rhythm Love Fest</p></div>
          <div className="event-card"><img src={love} alt="Lasu Food Festival" /><p>Lasu Food Festival</p></div>
          <div className="event-card"><img src={lasuFoodFest} alt="Lasu Food Festival" /><p>Lasu Food Festival</p></div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h2>Lets Connect there</h2>
            <hr />
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Event</a></li>
              <li><a href="#">Team</a></li>
              <li><a href="#">Book Tickets</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>JOIN US</h3>
            <ul>
              <li><a href="#">Sign in</a></li>
              <li><a href="#">Sign out</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <button className="hire-btn">HIRE US</button>
            <h3>CONTACT US</h3>
            <p>Contact us on <strong>Owl_initiators</strong> for more update</p>
            <p>Provide details for follow-up or queries regarding the booking</p>
            <div className="social-icons">
              <a href="#">C</a>
              <a href="#">T</a>
              <a href="#">I</a>
              <a href="#">F</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>@2024 ECHELONTIX. All Right Reserved.</p>
          <div>
            <a href="#">User Terms & Conditions</a> | <a href="#">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EventsPage;