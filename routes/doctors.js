const express = require('express');
const router  = express.Router();
const Doctor  = require('../models/Doctors');
const { protect } = require('../middleware/auth');

// ── GET all doctors list (for patient booking) ──
// IMPORTANT: this must be BEFORE /:id route
router.get('/list/all', async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .select('name specialization contact email schedule')
      .sort({ name: 1 });
    console.log('📋 Doctors list fetched:', doctors.length, 'doctors');
    res.json(doctors);
  } catch (err) {
    console.error('Error fetching doctors list:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── GET all doctors (admin) ──
router.get('/', protect, async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET single doctor ──
router.get('/:id', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST create doctor ──
router.post('/', protect, async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── PUT update doctor ──
router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await Doctor.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Doctor not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── DELETE doctor ──
router.delete('/:id', protect, async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;