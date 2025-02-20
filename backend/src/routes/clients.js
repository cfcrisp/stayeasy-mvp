// backend/src/routes/clients.js
const express = require('express');
const { addClient, getClients, updateClient } = require('../controllers/clientController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.post('/', addClient);
router.get('/', getClients);
router.put('/:id', updateClient);

module.exports = router;