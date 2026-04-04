const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const dotenv   = require('dotenv');

dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hospital_db';

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected\n');

    // Get raw user from DB
    const db      = mongoose.connection.db;
    const users   = await db.collection('users').find({}).toArray();

    console.log(`Found ${users.length} users in database:\n`);

    for (const user of users) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Name    :', user.name);
      console.log('Email   :', user.email);
      console.log('Role    :', user.role);
      console.log('Hash    :', user.password);

      // test passwords
      const passwords = {
        admin:   'admin123',
        doctor:  'doctor123',
        patient: 'patient123',
        nurse:   'nurse123',
      };

      const testPw = passwords[user.role] || 'admin123';
      const match  = await bcrypt.compare(testPw, user.password);
      console.log(`Match (${testPw}) :`, match ? '✅ YES' : '❌ NO');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    await mongoose.disconnect();

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

run();