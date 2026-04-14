const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Create complaint
router.post('/', protect, upload.single('image'), async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can submit complaints' });
  }

  const { title, description, incidentDate, category, priority } = req.body;
  if (!title || !description || !category || !priority) {
    return res.status(400).json({ message: 'Title, description, category, and priority are required' });
  }

  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const [result] = await db.query(
      'INSERT INTO complaints (student_id, title, description, category, priority, incident_date, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, title, description, category, priority, incidentDate || null, image_url]
    );

    // Dispatch notifications to the corresponding category's Admins
    const adminTargetType = category === 'Hostel' ? 'Hostel Admin' : 'College Admin';
    const [admins] = await db.query('SELECT id FROM users WHERE role = "admin" AND admin_type = ?', [adminTargetType]);
    
    for (const admin of admins) {
      await db.query(
        'INSERT INTO notifications (user_id, complaint_id, title, message) VALUES (?, ?, ?, ?)',
        [admin.id, result.insertId, `New ${category} Complaint`, `Priority [${priority}]: ${title} (#${result.insertId})`]
      );
    }

    res.status(201).json({ id: result.insertId, student_id: req.user.id, title, description, category, priority, image_url, status: 'Pending' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get complaints (students get their own, admins get all)
router.get('/', protect, async (req, res) => {
  try {
    let query, params;
    
    if (req.user.role === 'admin') {
      let adminTargetCategory = req.user.admin_type === 'Hostel Admin' ? 'Hostel' : 'College';
      query = 'SELECT c.*, u.name as student_name, u.email as student_email FROM complaints c JOIN users u ON c.student_id = u.id WHERE c.category = ? ORDER BY c.created_at DESC';
      params = [adminTargetCategory];
    } else {
      query = 'SELECT * FROM complaints WHERE student_id = ? ORDER BY created_at DESC';
      params = [req.user.id];
    }

    const [complaints] = await db.query(query, params);
    
    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Complaint (Admins or Student Owner)
router.put('/:id', protect, async (req, res) => {
  const { title, description, status, adminRemark, incidentDate } = req.body;
  const { id } = req.params;

  try {
    const [existing] = await db.query('SELECT * FROM complaints WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Complaint not found' });
    
    // Check ownership vs Admin
    if (req.user.role !== 'admin' && existing[0].student_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this complaint' });
    }

    // Only admin can successfully change Status or Admin Remark
    const newStatus = (req.user.role === 'admin' && status) ? status : existing[0].status;
    const newAdminRemark = (req.user.role === 'admin' && adminRemark !== undefined) ? adminRemark : existing[0].admin_remark;

    if (req.user.role === 'admin' && status && !['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    let updateQuery = 'UPDATE complaints SET title = ?, description = ?, status = ?, admin_remark = ?, incident_date = ? WHERE id = ?';
    let updateParams = [title, description, newStatus, newAdminRemark, incidentDate || existing[0].incident_date, id];

    if (newStatus === 'Resolved' && existing[0].status !== 'Resolved') {
      updateQuery = 'UPDATE complaints SET title = ?, description = ?, status = ?, admin_remark = ?, incident_date = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ?';
    }

    // Identify changes triggering notification map for Student
    if (req.user.role === 'admin' && (newStatus !== existing[0].status || newAdminRemark !== existing[0].admin_remark)) {
      await db.query(
        'INSERT INTO notifications (user_id, complaint_id, title, message) VALUES (?, ?, ?, ?)',
        [existing[0].student_id, id, `Complaint #${id} Update`, `Status: ${newStatus} | Remark: ${newAdminRemark || 'None'}`]
      );
    }

    await db.query(updateQuery, updateParams);
    res.json({ message: 'Complaint updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete Complaint
router.delete('/:id', protect, adminOnly, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM complaints WHERE id = ?', [id]);
    res.json({ message: 'Complaint deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
