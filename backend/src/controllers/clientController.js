// backend/src/controllers/clientController.js
const { pool } = require('../utils/db');
const { scheduleText } = require('../services/textService');

exports.addClient = async (req, res) => {
  const { name, phone, lastJobDate, serviceType, followUpDays, message } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'INSERT INTO clients (user_id, name, phone, last_job_date, service_type) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [userId, name, phone, lastJobDate, serviceType]
    );

    const clientId = result.rows[0].id;
    const followUpDate = new Date(lastJobDate);
    followUpDate.setDate(followUpDate.getDate() + followUpDays);

    await pool.query(
      'INSERT INTO follow_ups (client_id, scheduled_date, message) VALUES ($1, $2, $3)',
      [clientId, followUpDate, message]
    );

    await scheduleText(clientId, phone, message, followUpDate);

    res.status(201).json({ message: 'Client added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding client' });
  }
};

exports.getClients = async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = 25;
  const offset = (page - 1) * limit;

  try {
    const countResult = await pool.query('SELECT COUNT(*) FROM clients WHERE user_id = $1', [userId]);
    const totalClients = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalClients / limit);

    const result = await pool.query(
      `SELECT c.*, f.scheduled_date as next_follow_up 
       FROM clients c 
       LEFT JOIN follow_ups f ON c.id = f.client_id 
       WHERE c.user_id = $1 
       ORDER BY c.last_job_date DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    res.json({
      clients: result.rows,
      currentPage: page,
      totalPages: totalPages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching clients' });
  }
};

exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, phone, lastJobDate, serviceType, followUpDays, message } = req.body;
  const userId = req.user.id;

  try {
    await pool.query(
      'UPDATE clients SET name = $1, phone = $2, last_job_date = $3, service_type = $4 WHERE id = $5 AND user_id = $6',
      [name, phone, lastJobDate, serviceType, id, userId]
    );

    const followUpDate = new Date(lastJobDate);
    followUpDate.setDate(followUpDate.getDate() + followUpDays);

    await pool.query(
      'UPDATE follow_ups SET scheduled_date = $1, message = $2 WHERE client_id = $3',
      [followUpDate, message, id]
    );

    await scheduleText(id, phone, message, followUpDate);

    res.json({ message: 'Client updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating client' });
  }
};