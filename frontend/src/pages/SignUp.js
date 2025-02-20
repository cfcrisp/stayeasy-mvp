import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '../styles/SignUp.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/signup', { email, password, businessName });
      localStorage.setItem('token', response.data.token);
      history.push('/dashboard');
    } catch (err) {
      setError(err.response.data.message || 'An error occurred during sign up.');
    }
  };

  return (
    <div className="signup-container">
      <h1>Welcome to StayEasy</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength="8"
          required
        />
        <input
          type="text"
          placeholder="Business Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        />
        <button type="submit">Start Free Trial</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SignUp;