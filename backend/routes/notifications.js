const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect } = require('../middleware/authMiddleware');

// GET /api/notifications - Fetch all active notifications for the user
router.get('/', protect, async (req, res) => {
  try {
    const [notifications] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving notifications' });
  }
});

// DELETE /api/notifications/:id - Destroy the notification indicating its consumption
router.delete('/:id', protect, async (req, res) => {
  try {
    const [existing] = await db.query('SELECT * FROM notifications WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    
    if (existing.length === 0) {
       return res.status(404).json({ message: 'Notification not found' });
    }

    await db.query('DELETE FROM notifications WHERE id = ?', [req.params.id]);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting notification' });
  }
});

module.exports = router;
