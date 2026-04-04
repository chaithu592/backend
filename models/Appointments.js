const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient_id: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Patient',
    required: true,
  },
  doctor_id: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Doctor',
    required: true,
  },
  nurse_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Nurse',           // ← new optional field
  },
  appointment_date: {
    type:     Date,
    required: true,
  },
  time: {
    type:     String,
    required: true,
  },
  reason: {
    type:     String,
    required: true,
  },
  status: {
    type:    String,
    enum:    ['pending','confirmed','cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);