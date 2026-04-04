const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const User    = require('../models/User');
const Patient = require('../models/Patients');
const Doctor  = require('../models/Doctors');
const Nurse   = require('../models/Nurses');

const generateToken = (id, role) =>
  jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

// ══════════════════════════════
//   POST /api/auth/register
// ══════════════════════════════
router.post('/register', async (req, res) => {
  const {
    name, email, password, role,
    contact, gender, dob, address,
    specialization,
  } = req.body;

  try {
    // 1. basic check
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    // 2. check duplicate email
    const cleanEmail = email.toLowerCase().trim();
    const exists = await User.findOne({ email: cleanEmail });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered. Please login.' });
    }

    // 3. hash password HERE manually — no pre-save hook needed
    const hashedPassword = await bcrypt.hash(password, 10);

    // verify hash works before saving
    const verify = await bcrypt.compare(password, hashedPassword);
    console.log('🔐 Password hash verify:', verify);

    let profileId    = null;
    let profileModel = null;

    // 4. create role-based profile
    if (role === 'patient') {
      console.log('Creating patient profile...');
      const patient = await Patient.create({
        name:    name.trim(),
        dob:     dob ? new Date(dob) : null,
        gender:  gender || 'Male',
        contact: contact || '',
        address: address || '',
      });
      console.log('✅ Patient created:', patient._id);
      profileId    = patient._id;
      profileModel = 'Patient';
    }

    else if (role === 'doctor') {
      const docExists = await Doctor.findOne({ email: cleanEmail });
      if (docExists) {
        return res.status(400).json({ message: 'Doctor with this email already exists.' });
      }
      const doctor = await Doctor.create({
        name:           name.trim(),
        specialization: specialization || 'General Medicine',
        contact:        contact || '',
        email:          cleanEmail,
      });
      console.log('✅ Doctor created:', doctor._id);
      profileId    = doctor._id;
      profileModel = 'Doctor';
    }

    else if (role === 'nurse') {
      const nurse = await Nurse.create({
        name:       name.trim(),
        department: 'General',
        contact:    contact || '',
      });
      console.log('✅ Nurse created:', nurse._id);
      profileId    = nurse._id;
      profileModel = 'Nurse';
    }

    // 5. create user with already hashed password
    console.log('Creating user account...');
    const user = await User.create({
      name:         name.trim(),
      email:        cleanEmail,
      password:     hashedPassword,  // ← already hashed
      role:         role || 'patient',
      profileId,
      profileModel,
    });
    console.log('✅ User created:', user._id);

    // 6. return token
    return res.status(201).json({
      _id:       user._id,
      name:      user.name,
      email:     user.email,
      role:      user.role,
      profileId: user.profileId,
      token:     generateToken(user._id, user.role),
      message:   'Registration successful',
    });

  } catch (err) {
    console.error('❌ Register error:', err);

    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ message: `${field} already in use.` });
    }

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    return res.status(500).json({ message: err.message || 'Server error during registration.' });
  }
});

// ══════════════════════════════
//   POST /api/auth/login
// ══════════════════════════════
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      console.log('❌ No user found for:', email);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    console.log('✅ User found:', user.email, '| role:', user.role);

    // compare password directly with bcrypt
    const match = await bcrypt.compare(password, user.password);
    console.log('🔑 Password match:', match);

    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.json({
      _id:       user._id,
      name:      user.name,
      email:     user.email,
      role:      user.role,
      profileId: user.profileId,
      token:     generateToken(user._id, user.role),
    });

  } catch (err) {
    console.error('❌ Login error:', err.message);
    return res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;