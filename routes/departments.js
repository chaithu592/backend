const express    = require('express');
const router     = express.Router();
const Department = require('../models/Department');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const depts = await Department.find()
      .populate('head_doctor', 'name specialization');
    res.json(depts);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json(dept);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await Department.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: 'Department deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;