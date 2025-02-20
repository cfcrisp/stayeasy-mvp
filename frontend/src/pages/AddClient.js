import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '../styles/AddClient.css';

const AddClient = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [lastJobDate, setLastJobDate] = useState(new Date().toISOString().split('T')[0]);
  const [serviceType, setServiceType] = useState('');
  const [followUpDays, setFollowUpDays] = useState(1);
  const [message, setMessage] = useState("Hi [Name], thanks for choosing [Business Name]! Happy with your [Service Type]? Reply with feedback or to book again!");
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/clients', {
        name,
        phone,
        lastJobDate,
        serviceType,
        followUpDays,
        message
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      history.push('/dashboard');
    } catch (err) {
      setError(err.response.data.message || 'An error occurred while adding the client.');
    }
  };

  return (
    <div className="add-client-container">
      <h1>Add New Client</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Client Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="date"
          value={lastJobDate}
          onChange={(e) => setLastJobDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Service Type"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
        />
        <div>
          <label>Follow-Up Days:</label>
          <input
            type="number"
            min="1"
            max="90"
            value={followUpDays}
            onChange={(e) => setFollowUpDays(parseInt(e.target.value))}
          />
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
        ></textarea>
        <button type="submit">Save & Set Follow-Up</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AddClient;