import React from 'react';
import '../styles/LoginPage.css';

function login () {
  return (
    <div className="login-container">
      <div className="login-overlay">
        <form className="login-form">
          <h2>Welcome Back</h2>
          <p>Enter your email and password to sign in</p>
          
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
          <div className="forgot-password">Forgot password?</div>

          <button type="submit">Sign In</button>

          <div className="or-divider"><span>or</span></div>
          
          <button className="google-btn">Sign in with Google</button>

          <p className="signup-link">Don’t have an account? <a href="#">Sign up</a></p>
        </form>
      </div>
    </div>
  );
};

export default login;