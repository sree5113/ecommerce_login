import React, { useState } from 'react';
import './LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import googleLogo from './th2.png';
import logo from './logo.png';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
      console.error('Login error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="logo-and-title">
        <div className="logo-container">
          <div className='logo-icon'></div>
          <span className="logo-text">ECOMMERCE</span>
        </div>
      </div>
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}
          <div className="input-wrapper email-icon-wrapper">
            <Mail className="input-icon" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-wrapper lock-icon-wrapper">
            <Lock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="password-toggle-icon"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </span>
          </div>
          <button type="submit">Sign In</button>
          <Link to="/forgot-password">FORGOT PASSWORD</Link>
        </form>
        <div className="or-divider">or</div>
        <button className="google-signin">
          <img src={googleLogo} alt="Google Logo" />
          Sign In With Google
        </button>
      </div>
      <div className="register-link">
        Don't have an account ? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default LoginPage;

