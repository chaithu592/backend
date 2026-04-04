const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/hospital_db')
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');

    const db      = mongoose.connection.db;
    const doctors = db.collection('doctors');
    const users   = db.collection('users');

    // get all doctors from DB
    const allDoctors = await doctors.find({}).toArray();
    console.log(`Found ${allDoctors.length} doctors in DB\n`);

    for (const doc of allDoctors) {
      // check if user account already exists
      const userExists = await users.findOne({ email: doc.email });

      if (userExists) {
        console.log(`⚠️  User already exists for: ${doc.name} (${doc.email})`);
        continue;
      }

      // create password from doctor name
      // e.g. "Dr. Arjun Nair" → "arjun123"
      const firstName = doc.name
        .replace('Dr. ', '')
        .split(' ')[0]
        .toLowerCase();
      const password  = `${firstName}123`;
      const pwHash    = await bcrypt.hash(password, 10);

      await users.insertOne({
        name:         doc.name,
        email:        doc.email,
        password:     pwHash,
        role:         'doctor',
        profileId:    doc._id,
        profileModel: 'Doctor',
        createdAt:    new Date(),
        updatedAt:    new Date(),
      });

      console.log(`✅ Created login for: ${doc.name}`);
      console.log(`   Email    : ${doc.email}`);
      console.log(`   Password : ${password}\n`);
    }

    // show final summary
    const allUsers = await users.find({ role: 'doctor' }).toArray();
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 ALL DOCTOR LOGIN CREDENTIALS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    for (const u of allUsers) {
      const firstName = u.name.replace('Dr. ', '').split(' ')[0].toLowerCase();
      const password  = u.email === 'doctor@hms.com' ? 'doctor123' : `${firstName}123`;
      console.log(`  ${u.name.padEnd(25)} | ${u.email.padEnd(22)} | ${password}`);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    console.log('🔌 Done!\n');
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });