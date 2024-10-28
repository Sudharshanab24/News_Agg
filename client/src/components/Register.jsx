import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(''); // New state for name
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/login'); // Navigate to the login page
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Registration API call
    try {
      const response = await fetch('https://newsaggregator-cml2.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }), // Include name in request
      });

      if (response.ok) {
        alert('Registration successful');
        navigate('/'); // Navigate to the home page after successful registration
      } else {
        const errorMessage = await response.text();
        alert(`Registration failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-modal">
      <div className="modal-content">
        <h2 style={{ fontWeight: 'bold' }}>REGISTER</h2>

        {/* Back arrow icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black" // Set the stroke color to black
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          onClick={handleBack} // Navigate back on click
          style={{ cursor: 'pointer', marginBottom: '20px' }} // Change cursor and margin
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name" // New input for name
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
