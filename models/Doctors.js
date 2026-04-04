const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: [true, 'Doctor name is required'],
    trim:     true,
  },
  specialization: {
    type:    String,
    default: 'General Medicine',
  },
  contact: {
    type:    String,
    default: '',
  },
  email: {
    type:      String,
    required:  true,
    unique:    true,
    lowercase: true,
    trim:      true,
  },
  schedule: [
    {
      day:      String,
      time:     String,
      room:     String,
      patients: Number,
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);