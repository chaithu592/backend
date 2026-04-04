const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/hospital_db')
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');

    const db      = mongoose.connection.db;
    const doctors = db.collection('doctors');
    const users   = db.collection('users');

    const pwHash = await bcrypt.hash('doctor123', 10);

    const list = [
      { name: 'Dr. Meera Reddy',    specialization: 'Cardiology',       contact: '9876500001', email: 'meera@hms.com'    },
      { name: 'Dr. Arjun Nair',     specialization: 'Neurology',        contact: '9876500002', email: 'arjun@hms.com'    },
      { name: 'Dr. Priya Singh',    specialization: 'Orthopedics',      contact: '9876500003', email: 'priya@hms.com'    },
      { name: 'Dr. Sanjay Rao',     specialization: 'Ophthalmology',    contact: '9876500004', email: 'sanjay@hms.com'   },
      { name: 'Dr. Kavitha Sharma', specialization: 'Pediatrics',       contact: '9876500005', email: 'kavitha@hms.com'  },
      { name: 'Dr. Ramesh Kumar',   specialization: 'General Medicine', contact: '9876500006', email: 'ramesh@hms.com'   },
    ];

    for (const doc of list) {
      const exists = await doctors.findOne({ email: doc.email });
      if (exists) {
        console.log('⚠️  Already exists - Skip:', doc.name);
        continue;
      }

      const r = await doctors.insertOne({
        ...doc,
        schedule:  [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const userExists = await users.findOne({ email: doc.email });
      if (!userExists) {
        await users.insertOne({
          name:         doc.name,
          email:        doc.email,
          password:     pwHash,
          role:         'doctor',
          profileId:    r.insertedId,
          profileModel: 'Doctor',
          createdAt:    new Date(),
          updatedAt:    new Date(),
        });
      }
      console.log('✅ Added:', doc.name, '-', doc.specialization);
    }

    const all = await doctors.find({}).toArray();
    console.log('\n📋 All doctors in DB:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    all.forEach(d => console.log(`  ${d.name} | ${d.specialization} | ${d.email}`));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Total:', all.length, 'doctors\n');

    await mongoose.disconnect();
    console.log('🔌 Done!\n');
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });