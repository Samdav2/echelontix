import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './index.css';
import App from './App';
import Login from "./pages/LoginPage";
import About from "./pages/AboutPage";
import Event from "./pages/EventPage";
import Home from "./pages/Home";
import Ticket from "./pages/GetTicket";



const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/*<Route path="/" element={<App />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/all-events" element={<Event />} /> 
        <Route path="/" element={<Home />} /> 
        <Route path="get-ticket" element={<Ticket />} /> 
      </Routes>
    </Router>
  </React.StrictMode>
);
