// backend/src/services/textService.js
const twilio = require('twilio');
const { pool } = require('../utils/db');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

exports.scheduleText = async (clientId, phone, message, scheduledDate) => {
  // This function doesn't actually schedule with Twilio, it just saves to our database
  // The cron job will handle the actual sending
  try {
    await pool.query(
      'INSERT INTO scheduled_texts (client_id, phone, message, scheduled_date) VALUES ($1, $2, $3, $4)',
      [clientId, phone, message, scheduledDate]
    );
  } catch (error) {
    console.error('Error scheduling text:', error);
  }
};

exports.sendScheduledTexts = async () => {
  try {
    const result = await pool.query(
      "SELECT * FROM scheduled_texts WHERE scheduled_date <= NOW() AND status = 'pending'"
    );

    for (const text of result.rows) {
      try {
        await client.messages.create({
          body: text.message,
          from: process.env.TWILIO_PHONE,
          to: text.phone
        });

        await pool.query(
          "UPDATE scheduled_texts SET status = 'sent', sent_at = NOW() WHERE id = $1",
          [text.id]
        );
      } catch (error) {
        console.error('Error sending text:', error);
        await pool.query(
          "UPDATE scheduled_texts SET status = 'failed', sent_at = NOW() WHERE id = $1",
          [text.id]
        );
      }
    }
  } catch (error) {
    console.error('Error processing scheduled texts:', error);
  }
};