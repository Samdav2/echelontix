import React from 'react';
import '../styles/aboutPage.css';
import logo from '../assets/logo.jpg';
import user from '../assets/user.png';

 function AboutPage () {
  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Echelotix" />
        </div>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">Event</a></li>
          <li><a className="active" href="#">About</a></li>
          <li><a href="#">Contacts</a></li>
          <li><a href="#">Book Tickets</a></li>
        </ul>
      </nav>

      <section className="about-section">
        <h2>Who we are...</h2>
        <p><strong>ECHELONTIX</strong> is an event hub where anyone can discover new events, read about past events and get tickets for these events. We handle the ticketing system for events, both online and offline for event planners across Nigeria.</p>
      </section>

      <section className="mission-section">
        <h2>Mission</h2>
        <ul>
          <li>Creating a more streamlined approach to event hosting and ticketing</li>
          <li>Building a community of creative youths</li>
          <li>Promoting Nigeria's pop culture</li>
        </ul>
      </section>

      <section className="vision-section">
        <h2>Vision</h2>
        <ul>
          <li>To be the go-to site for every buzzing event nationwide</li>
          <li>To be the best ticketing platform</li>
          <li>To build a network of creative youths</li>
        </ul>
      </section>

      <section className="history-section">
        <h2>History</h2>
        <p><strong>ECHELOTIX</strong> started in 2024 as an extension. It was a straightforward plan to create a ticket managing platform where event planners can sell tickets for any kind of event ranging from small house parties to large-scale music festivals.</p>
      </section>

      <section className="team-section">
        <h2>OUR TEAM</h2>
        <div className="team-grid">
          {[...Array(6)].map((_, index) => (
            <div className="team-member" key={index}>
              <img src={user} alt={`Team Member ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;