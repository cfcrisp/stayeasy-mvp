// backend/src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const { sendScheduledTexts } = require('./services/textService');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);

// Hourly cron job for scheduled texts
cron.schedule('0 * * * *', async () => {
  console.log('Running scheduled text job');
  await sendScheduledTexts();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));