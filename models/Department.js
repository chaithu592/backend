const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: true,
    unique:   true,
    trim:     true,
  },
  head_doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Doctor',
  },
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);