const express     = require('express');
const router      = express.Router();
const Appointment = require('../models/Appointments');
const { protect } = require('../middleware/auth');

// GET all appointments — admin
router.get('/', protect, async (req, res) => {
  try {
    const appts = await Appointment.find()
  .populate('patient_id', 'name contact gender')
  .populate('doctor_id',  'name specialization email contact')
  .populate('nurse_id',   'name department contact')   // ← add this
  .sort({ appointment_date: -1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET appointments for a specific PATIENT
router.get('/my/patient/:patientId', protect, async (req, res) => {
  try {
    const appts = await Appointment.find({ patient_id: req.params.patientId })
      .populate('doctor_id', 'name specialization email contact')
       .populate('nurse_id',  'name department contact')
      .sort({ appointment_date: -1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET appointments for a specific DOCTOR
router.get('/my/doctor/:doctorId', protect, async (req, res) => {
  try {
    console.log('Fetching appointments for doctor:', req.params.doctorId);
    const appts = await Appointment.find({ doctor_id: req.params.doctorId })
      .populate('patient_id', 'name contact gender dob')
      .populate('doctor_id',  'name specialization')
      .sort({ appointment_date: -1 });
    console.log('Found appointments:', appts.length);
    res.json(appts);
  } catch (err) {
    console.error('Doctor appointments error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// GET appointments assigned to a specific NURSE
router.get('/my/nurse/:nurseId', protect, async (req, res) => {
  try {
    console.log('Fetching appointments for nurse:', req.params.nurseId);
    const appts = await Appointment.find({ nurse_id: req.params.nurseId })
      .populate('patient_id', 'name contact gender dob')
      .populate('doctor_id',  'name specialization')
      .populate('nurse_id',   'name department')
      .sort({ appointment_date: -1 });
    console.log('Found nurse appointments:', appts.length);
    res.json(appts);
  } catch (err) {
    console.error('Nurse appointments error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// GET single appointment
router.get('/:id', protect, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id)
      .populate('patient_id', 'name contact')
      .populate('doctor_id',  'name specialization');
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST book appointment
router.post('/', protect, async (req, res) => {
  try {
    console.log('Booking appointment:', req.body);
    const appt = await Appointment.create(req.body);
    const populated = await Appointment.findById(appt._id)
      .populate('patient_id', 'name contact')
      .populate('doctor_id',  'name specialization')
      .populate('nurse_id',   'name department contact');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Book appointment error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// PUT update appointment status
router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    )
      .populate('patient_id', 'name contact')
      .populate('doctor_id',  'name specialization');
    if (!updated) return res.status(404).json({ message: 'Appointment not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE appointment
router.delete('/:id', protect, async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;