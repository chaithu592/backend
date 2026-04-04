const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  patient_id: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Patient',
    required: true,
  },
  total_amount: {
    type:     Number,
    required: true,
  },
  payment_status: {
    type:    String,
    enum:    ['pending','paid','failed'],
    default: 'pending',
  },
  payment_details: {
    method:         String,
    transaction_id: String,
    paid_at:        Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('Billing', billingSchema);