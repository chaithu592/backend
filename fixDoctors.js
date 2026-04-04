const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/hospital_db')
  .then(async () => {
    console.log('✅ Connected\n');

    const db      = mongoose.connection.db;
    const doctors = db.collection('doctors');
    const users   = db.collection('users');

    // delete ALL existing doctor users
    await users.deleteMany({ role: 'doctor' });
    console.log('🗑️  Cleared old doctor users\n');

    // get all doctor profiles
    const allDoctors = await doctors.find({}).toArray();
    console.log(`Found ${allDoctors.length} doctor profiles\n`);

    // if no doctor profiles exist, create them
    if (allDoctors.length === 0) {
      console.log('No doctor profiles found — creating them...\n');

      const docList = [
        { name: 'Dr. Meera Reddy',    specialization: 'Cardiology',       contact: '9876500001', email: 'doctor@hms.com'  },
        { name: 'Dr. Arjun Nair',     specialization: 'Neurology',        contact: '9876500002', email: 'arjun@hms.com'   },
        { name: 'Dr. Priya Singh',    specialization: 'Orthopedics',      contact: '9876500003', email: 'priya@hms.com'   },
        { name: 'Dr. Sanjay Rao',     specialization: 'Ophthalmology',    contact: '9876500004', email: 'sanjay@hms.com'  },
        { name: 'Dr. Kavitha Sharma', specialization: 'Pediatrics',       contact: '9876500005', email: 'kavitha@hms.com' },
        { name: 'Dr. Ramesh Kumar',   specialization: 'General Medicine', contact: '9876500006', email: 'ramesh@hms.com'  },
      ];

      for (const doc of docList) {
        await doctors.insertOne({
          ...doc,
          schedule:  [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      console.log('✅ Doctor profiles created\n');
    }

    // now get all doctors again
    const finalDoctors = await doctors.find({}).toArray();

    // password map per email
    const passwordMap = {
      'doctor@hms.com':  'doctor123',
      'arjun@hms.com':   'arjun123',
      'priya@hms.com':   'priya123',
      'sanjay@hms.com':  'sanjay123',
      'kavitha@hms.com': 'kavitha123',
      'ramesh@hms.com':  'ramesh123',
      'meera@hms.com':   'meera123',
    };

    console.log('Creating user accounts for all doctors:\n');

    for (const doc of finalDoctors) {
      const pw = passwordMap[doc.email] ||
        doc.name.replace('Dr. ', '').split(' ')[0].toLowerCase() + '123';

      const hash = await bcrypt.hash(pw, 10);

      // verify hash works
      const verify = await bcrypt.compare(pw, hash);

      await users.insertOne({
        name:         doc.name,
        email:        doc.email,
        password:     hash,
        role:         'doctor',
        profileId:    doc._id,
        profileModel: 'Doctor',
        createdAt:    new Date(),
        updatedAt:    new Date(),
      });

      console.log(`✅ ${doc.name}`);
      console.log(`   Email    : ${doc.email}`);
      console.log(`   Password : ${pw}`);
      console.log(`   Hash OK  : ${verify ? '✅' : '❌'}\n`);
    }

    // final verify - test each login
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 FINAL VERIFICATION:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const allUsers = await users.find({ role: 'doctor' }).toArray();
    for (const u of allUsers) {
      const pw = passwordMap[u.email] ||
        u.name.replace('Dr. ', '').split(' ')[0].toLowerCase() + '123';
      const ok = await bcrypt.compare(pw, u.password);
      console.log(`  ${u.name.padEnd(22)} | ${u.email.padEnd(20)} | ${pw.padEnd(12)} | ${ok ? '✅ OK' : '❌ FAIL'}`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    console.log('🔌 Done! All doctors can now login.\n');
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });