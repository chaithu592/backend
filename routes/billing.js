const express   = require('express');
const router    = express.Router();
const Billing   = require('../models/Billing');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const bills = await Billing.find()
      .populate('patient_id', 'name contact')
      .sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const bill = await Billing.findById(req.params.id)
      .populate('patient_id', 'name contact');
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    res.json(bill);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const bill = await Billing.create(req.body);
    res.status(201).json(bill);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await Billing.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Bill not found' });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Billing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bill deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;