import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://16.171.159.39:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, name } = data;
        alert('Login successful');

        // Store the token in localStorage
        localStorage.setItem('token', token);

        onLogin(name, token); // Pass the user data to the parent component (if needed)
        navigate('/'); // Redirect to profile page after login
      } else {
        const errorMessage = await response.text();
        alert(`Login failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClose = () => {
    onClose(); // Call the onClose function (if needed)
    navigate('/'); // Redirect to the home page after closing
  };

  return (
    <div className="login-modal">
      <div className="modal-content">
        <h2 style={{ fontWeight: 'bold' }}>LOGIN</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <button type="button" onClick={handleClose}>Close</button>
        </form>
        <p>
          Not registered? <Link to="/register" className="underline-link">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
