const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: [true, 'Patient name is required'],
    trim:     true,
  },
  dob: {
    type:     Date,
    required: false,
    default:  null,
  },
  gender: {
    type:    String,
    enum:    ['Male', 'Female', 'Other'],
    default: 'Male',
  },
  contact: {
    type:    String,
    default: '',
  },
  address: {
    type:    String,
    trim:    true,
    default: '',
  },
  medical_history: [
    {
      diagnosis: String,
      treatment: String,
      date:      Date,
      doctor:    String,
    }
  ],
  insurance_info: {
    provider:    String,
    policy_no:   String,
    valid_until: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);