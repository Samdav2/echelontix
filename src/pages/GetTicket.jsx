import React from 'react';
import '../styles/GetTicket.css'; // Adjust the path as needed
import lasuFoodFest from '../assets/lasu-food-fest.jpg';

const GetTicket = () => {
  return (
    <div className="hero">
      <div className="overlay"></div>
      <div className="container">
        <div className="left-panel">
          <img src='lasu-food-fest.jpg' alt="Event Poster" className="poster" />
          <div className="details">
            <h2>30 JUNE</h2>
            <p>Entry at 8:30 PM</p>
            <p>Venue: Buba Maruwa Open Space, Lagos State University</p>
          </div>
        </div>

        <div className="form-card">
          <h2>Event Registration Form</h2>
          <p>
            Attendee Information<br />
            <small>Please fill the correct information</small>
          </p>
          <form>
            <div className="form-row">
              <input type="text" placeholder="First Name" required />
              <input type="text" placeholder="Last Name" required />
            </div>
            <input type="email" placeholder="Email Address" required />
            <div className="gender">
              <label>
                <input type="radio" name="gender" value="male" /> Male
              </label>
              <label>
                <input type="radio" name="gender" value="female" /> Female
              </label>
            </div>
            <select required>
              <option value="">Select a Ticket</option>
              <option value="regular">Regular</option>
              <option value="vip">VIP Pass</option>
            </select>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GetTicket;