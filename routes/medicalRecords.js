const express       = require('express');
const router        = express.Router();
const MedicalRecord = require('../models/MedicalRecords');
const { protect }   = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const records = await MedicalRecord.find()
      .populate('patient_id', 'name contact')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/patient/:patientId', protect, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient_id: req.params.patientId })
      .populate('patient_id', 'name');
    res.json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient_id', 'name contact');
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const record = await MedicalRecord.create(req.body);
    res.status(201).json(record);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await MedicalRecord.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Record not found' });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await MedicalRecord.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;