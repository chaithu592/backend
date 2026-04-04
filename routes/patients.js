const express = require('express');
const router  = express.Router();
const Patient = require('../models/Patients');
const { protect } = require('../middleware/auth');

// GET all
router.get('/', protect, async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET one
router.get('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create
router.post('/', protect, async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT update
router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await Patient.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Patient not found' });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE
router.delete('/:id', protect, async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;