const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient_id: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Patient',
    required: true,
  },
  diagnosis: {
    type:     String,
    required: true,
  },
  treatment: [String],
  prescriptions: [
    {
      medicine: String,
      dosage:   String,
      duration: String,
    }
  ],
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);