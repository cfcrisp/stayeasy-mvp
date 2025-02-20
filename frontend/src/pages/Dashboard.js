import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchClients();
  }, [currentPage]);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`/api/clients?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setClients(response.data.clients);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <Link to="/add-client" className="add-client-btn">Add Client</Link>
      <div className="client-list">
        {clients.map(client => (
          <div key={client.id} className="client-item">
            <h3>{client.name}</h3>
            <p>Last Job: {new Date(client.lastJobDate).toLocaleDateString()}</p>
            <p>Next Follow-Up: {client.nextFollowUp ? new Date(client.nextFollowUp).toLocaleDateString() : 'Not scheduled'}</p>
            <Link to={`/edit-client/${client.id}`}>Edit</Link>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</button>
          <span>{currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;