const mongoose = require('mongoose');

const nurseSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: [true, 'Nurse name is required'],
    trim:     true,
  },
  department: {
    type:    String,
    default: 'General',
    enum: [
      'Cardiology','Neurology','Orthopedics',
      'Ophthalmology','Pediatrics','General','ICU','Emergency',
    ],
  },
  contact: {
    type:    String,
    default: '',
  },
  schedule: [
    {
      day:        String,
      shift:      { type: String, enum: ['Morning','Evening','Night','Off'] },
      time:       String,
      ward:       String,
      supervisor: String,
    }
  ],
  tasks: [
    {
      task:     String,
      time:     String,
      priority: { type: String, enum: ['high','medium','low'] },
      status:   { type: String, enum: ['pending','completed'], default: 'pending' },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Nurse', nurseSchema);