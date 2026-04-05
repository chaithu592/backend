const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const MONGO_URI = 'mongodb://localhost:27017/hospital_db';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');

    const db       = mongoose.connection.db;
    const users    = db.collection('users');
    const doctors  = db.collection('doctors');
    const patients = db.collection('patients');
    const nurses   = db.collection('nurses');

    // clear everything
    await users.deleteMany({});
    await doctors.deleteMany({});
    await patients.deleteMany({});
    await nurses.deleteMany({});
    console.log('🗑️  Cleared existing data\n');

    // ── hash all passwords ──
    const h = async (pw) => await bcrypt.hash(pw, 10);

    // ══════════════════════
    // DOCTORS
    // ══════════════════════
    const doctorList = [
      { name: 'Dr. Meera Reddy',    specialization: 'Cardiology',       contact: '9876500001', email: 'doctor@hms.com',  password: 'doctor123'  },
      { name: 'Dr. Arjun Nair',     specialization: 'Neurology',        contact: '9876500002', email: 'arjun@hms.com',   password: 'arjun123'   },
      { name: 'Dr. Priya Singh',    specialization: 'Orthopedics',      contact: '9876500003', email: 'priya@hms.com',   password: 'priya123'   },
      { name: 'Dr. Sanjay Rao',     specialization: 'Ophthalmology',    contact: '9876500004', email: 'sanjay@hms.com',  password: 'sanjay123'  },
      { name: 'Dr. Kavitha Sharma', specialization: 'Pediatrics',       contact: '9876500005', email: 'kavitha@hms.com', password: 'kavitha123' },
      { name: 'Dr. Ramesh Kumar',   specialization: 'General Medicine', contact: '9876500006', email: 'ramesh@hms.com',  password: 'ramesh123'  },
    ];

    console.log('👨‍⚕️ Creating doctors...');
    for (const doc of doctorList) {
      const result = await doctors.insertOne({
        name:           doc.name,
        specialization: doc.specialization,
        contact:        doc.contact,
        email:          doc.email,
        schedule:       [],
        createdAt:      new Date(),
        updatedAt:      new Date(),
      });
      await users.insertOne({
        name:         doc.name,
        email:        doc.email,
        password:     await h(doc.password),
        role:         'doctor',
        profileId:    result.insertedId,
        profileModel: 'Doctor',
        createdAt:    new Date(),
        updatedAt:    new Date(),
      });
      console.log(`  ✅ ${doc.name} | ${doc.email} | ${doc.password}`);
    }

    // ══════════════════════
    // PATIENTS
    // ══════════════════════
    const patientList = [
      { name: 'Ravi Shankar',  dob: '1990-05-12', gender: 'Male',   contact: '9876543210', address: 'Warangal',   email: 'patient@hms.com', password: 'patient123' },
      { name: 'Sunita Devi',   dob: '1985-08-22', gender: 'Female', contact: '9812345678', address: 'Hyderabad',  email: 'sunita@hms.com',  password: 'sunita123'  },
      { name: 'Karthik Varma', dob: '2000-01-30', gender: 'Male',   contact: '9898765432', address: 'Karimnagar', email: 'karthik@hms.com', password: 'karthik123' },
      { name: 'Lakshmi Bai',   dob: '1975-11-05', gender: 'Female', contact: '9701234567', address: 'Nalgonda',   email: 'lakshmi@hms.com', password: 'lakshmi123' },
      { name: 'Pavan Kumar',   dob: '1995-03-18', gender: 'Male',   contact: '9654321098', address: 'Nizamabad',  email: 'pavan@hms.com',   password: 'pavan123'   },
      { name: 'Anitha Reddy',  dob: '1992-07-25', gender: 'Female', contact: '9543210987', address: 'Khammam',    email: 'anitha@hms.com',  password: 'anitha123'  },
    ];

    console.log('\n👤 Creating patients...');
    for (const pat of patientList) {
      const result = await patients.insertOne({
        name:            pat.name,
        dob:             new Date(pat.dob),
        gender:          pat.gender,
        contact:         pat.contact,
        address:         pat.address,
        medical_history: [],
        insurance_info:  {},
        createdAt:       new Date(),
        updatedAt:       new Date(),
      });
      await users.insertOne({
        name:         pat.name,
        email:        pat.email,
        password:     await h(pat.password),
        role:         'patient',
        profileId:    result.insertedId,
        profileModel: 'Patient',
        createdAt:    new Date(),
        updatedAt:    new Date(),
      });
      console.log(`  ✅ ${pat.name} | ${pat.email} | ${pat.password}`);
    }

    // ══════════════════════
    // NURSES
    // ══════════════════════
    const nurseList = [
      { name: 'Anjali Sharma', department: 'Cardiology',    contact: '9876541001', email: 'nurse@hms.com',   password: 'nurse123'   },
      { name: 'Rekha Pillai',  department: 'Neurology',     contact: '9876541002', email: 'rekha@hms.com',   password: 'rekha123'   },
      { name: 'Divya Nair',    department: 'Orthopedics',   contact: '9876541003', email: 'divya@hms.com',   password: 'divya123'   },
      { name: 'Meena Kumari',  department: 'Ophthalmology', contact: '9876541004', email: 'meena@hms.com',   password: 'meena123'   },
      { name: 'Sravani Reddy', department: 'Pediatrics',    contact: '9876541005', email: 'sravani@hms.com', password: 'sravani123' },
      { name: 'Bhavana Rao',   department: 'ICU',           contact: '9876541006', email: 'bhavana@hms.com', password: 'bhavana123' },
    ];

    console.log('\n👩‍⚕️ Creating nurses...');
    for (const nur of nurseList) {
      const result = await nurses.insertOne({
        name:       nur.name,
        department: nur.department,
        contact:    nur.contact,
        schedule:   [],
        tasks:      [],
        createdAt:  new Date(),
        updatedAt:  new Date(),
      });
      await users.insertOne({
        name:         nur.name,
        email:        nur.email,
        password:     await h(nur.password),
        role:         'nurse',
        profileId:    result.insertedId,
        profileModel: 'Nurse',
        createdAt:    new Date(),
        updatedAt:    new Date(),
      });
      console.log(`  ✅ ${nur.name} | ${nur.email} | ${nur.password}`);
    }

    // ══════════════════════
    // ADMIN
    // ══════════════════════
    console.log('\n🔐 Creating admin...');
    await users.insertOne({
      name:      'Admin',
      email:     'admin@hms.com',
      password:  await h('admin123'),
      role:      'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('  ✅ Admin | admin@hms.com | admin123');

    // ══════════════════════
    // SUMMARY
    // ══════════════════════
    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║            ✅ DATABASE SETUP COMPLETE!                   ║');
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log('║  ADMIN    → admin@hms.com        / admin123             ║');
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log('║  DOCTORS                                                 ║');
    console.log('║  doctor@hms.com   / doctor123  (Dr. Meera Reddy)        ║');
    console.log('║  arjun@hms.com    / arjun123   (Dr. Arjun Nair)         ║');
    console.log('║  priya@hms.com    / priya123   (Dr. Priya Singh)        ║');
    console.log('║  sanjay@hms.com   / sanjay123  (Dr. Sanjay Rao)         ║');
    console.log('║  kavitha@hms.com  / kavitha123 (Dr. Kavitha Sharma)     ║');
    console.log('║  ramesh@hms.com   / ramesh123  (Dr. Ramesh Kumar)       ║');
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log('║  PATIENTS                                                ║');
    console.log('║  patient@hms.com  / patient123 (Ravi Shankar)           ║');
    console.log('║  sunita@hms.com   / sunita123  (Sunita Devi)            ║');
    console.log('║  karthik@hms.com  / karthik123 (Karthik Varma)          ║');
    console.log('║  lakshmi@hms.com  / lakshmi123 (Lakshmi Bai)            ║');
    console.log('║  pavan@hms.com    / pavan123   (Pavan Kumar)            ║');
    console.log('║  anitha@hms.com   / anitha123  (Anitha Reddy)           ║');
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log('║  NURSES                                                  ║');
    console.log('║  nurse@hms.com    / nurse123   (Anjali Sharma)          ║');
    console.log('║  rekha@hms.com    / rekha123   (Rekha Pillai)           ║');
    console.log('║  divya@hms.com    / divya123   (Divya Nair)             ║');
    console.log('║  meena@hms.com    / meena123   (Meena Kumari)           ║');
    console.log('║  sravani@hms.com  / sravani123 (Sravani Reddy)          ║');
    console.log('║  bhavana@hms.com  / bhavana123 (Bhavana Rao)            ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('\n🚀 Now run: npm run dev\n');

    await mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });