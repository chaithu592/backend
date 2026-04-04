const express = require('express');
const router  = express.Router();
const Nurse   = require('../models/Nurses');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const nurses = await Nurse.find().sort({ createdAt: -1 });
    res.json(nurses);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/department/:dept', protect, async (req, res) => {
  try {
    const nurses = await Nurse.find({ department: req.params.dept });
    res.json(nurses);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const nurse = await Nurse.findById(req.params.id);
    if (!nurse) return res.status(404).json({ message: 'Nurse not found' });
    res.json(nurse);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const nurse = await Nurse.create(req.body);
    res.status(201).json(nurse);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await Nurse.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Nurse not found' });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Nurse.findByIdAndDelete(req.params.id);
    res.json({ message: 'Nurse deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id/tasks/:taskId', protect, async (req, res) => {
  try {
    const nurse = await Nurse.findById(req.params.id);
    if (!nurse) return res.status(404).json({ message: 'Nurse not found' });
    const task = nurse.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.status = req.body.status;
    await nurse.save();
    res.json(nurse);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;