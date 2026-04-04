const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/hospital_db')
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');

    const db       = mongoose.connection.db;
    const patients = db.collection('patients');
    const nurses   = db.collection('nurses');
    const users    = db.collection('users');

    // ══════════════════════════════
    //  PATIENTS
    // ══════════════════════════════
    const patientList = [
      { name: 'Ravi Shankar',    dob: '1990-05-12', gender: 'Male',   contact: '9876543210', address: 'Warangal, Telangana',  email: 'ravi@hms.com',    password: 'ravi123'    },
      { name: 'Sunita Devi',     dob: '1985-08-22', gender: 'Female', contact: '9812345678', address: 'Hyderabad, Telangana', email: 'sunita@hms.com',  password: 'sunita123'  },
      { name: 'Karthik Varma',   dob: '2000-01-30', gender: 'Male',   contact: '9898765432', address: 'Karimnagar, Telangana',email: 'karthik@hms.com', password: 'karthik123' },
      { name: 'Lakshmi Bai',     dob: '1975-11-05', gender: 'Female', contact: '9701234567', address: 'Nalgonda, Telangana',  email: 'lakshmi@hms.com', password: 'lakshmi123' },
      { name: 'Pavan Kumar',     dob: '1995-03-18', gender: 'Male',   contact: '9654321098', address: 'Nizamabad, Telangana', email: 'pavan@hms.com',   password: 'pavan123'   },
      { name: 'Anitha Reddy',    dob: '1992-07-25', gender: 'Female', contact: '9543210987', address: 'Khammam, Telangana',   email: 'anitha@hms.com',  password: 'anitha123'  },
    ];

    // ══════════════════════════════
    //  NURSES
    // ══════════════════════════════
    const nurseList = [
      { name: 'Anjali Sharma',  department: 'Cardiology',    contact: '9876541001', email: 'anjali@hms.com',  password: 'anjali123'  },
      { name: 'Rekha Pillai',   department: 'Neurology',     contact: '9876541002', email: 'rekha@hms.com',   password: 'rekha123'   },
      { name: 'Divya Nair',     department: 'Orthopedics',   contact: '9876541003', email: 'divya@hms.com',   password: 'divya123'   },
      { name: 'Meena Kumari',   department: 'Ophthalmology', contact: '9876541004', email: 'meena@hms.com',   password: 'meena123'   },
      { name: 'Sravani Reddy',  department: 'Pediatrics',    contact: '9876541005', email: 'sravani@hms.com', password: 'sravani123' },
      { name: 'Bhavana Rao',    department: 'ICU',           contact: '9876541006', email: 'bhavana@hms.com', password: 'bhavana123' },
    ];

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 ADDING PATIENTS...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    for (const p of patientList) {
      // check if user already exists
      const userExists = await users.findOne({ email: p.email });
      if (userExists) {
        console.log(`⚠️  Skip (exists): ${p.name}`);
        continue;
      }

      // create patient profile
      const patResult = await patients.insertOne({
        name:      p.name,
        dob:       new Date(p.dob),
        gender:    p.gender,
        contact:   p.contact,
        address:   p.address,
        medical_history:  [],
        insurance_info:   {},
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // hash password
      const pwHash = await bcrypt.hash(p.password, 10);

      // create user account
      await users.insertOne({
        name:         p.name,
        email:        p.email,
        password:     pwHash,
        role:         'patient',
        profileId:    patResult.insertedId,
        profileModel: 'Patient',
        createdAt:    new Date(),
        updatedAt:    new Date(),
      });

      console.log(`✅ Added Patient: ${p.name}`);
      console.log(`   Email    : ${p.email}`);
      console.log(`   Password : ${p.password}\n`);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👩‍⚕️ ADDING NURSES...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    for (const n of nurseList) {
      // check if user already exists
      const userExists = await users.findOne({ email: n.email });
      if (userExists) {
        console.log(`⚠️  Skip (exists): ${n.name}`);
        continue;
      }

      // create nurse profile
      const nurseResult = await nurses.insertOne({
        name:       n.name,
        department: n.department,
        contact:    n.contact,
        schedule:   [],
        tasks:      [],
        createdAt:  new Date(),
        updatedAt:  new Date(),
      });

      // hash password
      const pwHash = await bcrypt.hash(n.password, 10);

      // create user account
      await users.insertOne({
        name:         n.name,
        email:        n.email,
        password:     pwHash,
        role:         'nurse',
        profileId:    nurseResult.insertedId,
        profileModel: 'Nurse',
        createdAt:    new Date(),
        updatedAt:    new Date(),
      });

      console.log(`✅ Added Nurse: ${n.name}`);
      console.log(`   Email    : ${n.email}`);
      console.log(`   Password : ${n.password}\n`);
    }

    // ══════════════════════════════
    //  FINAL SUMMARY
    // ══════════════════════════════
    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║              ALL LOGIN CREDENTIALS SUMMARY                  ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║  ADMIN                                                       ║');
    console.log('║  admin@hms.com          / admin123                          ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║  DOCTORS                                                     ║');
    console.log('║  doctor@hms.com         / doctor123  (Dr. Meera Reddy)      ║');
    console.log('║  arjun@hms.com          / arjun123   (Dr. Arjun Nair)       ║');
    console.log('║  priya@hms.com          / priya123   (Dr. Priya Singh)      ║');
    console.log('║  sanjay@hms.com         / sanjay123  (Dr. Sanjay Rao)       ║');
    console.log('║  kavitha@hms.com        / kavitha123 (Dr. Kavitha Sharma)   ║');
    console.log('║  ramesh@hms.com         / ramesh123  (Dr. Ramesh Kumar)     ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║  PATIENTS                                                    ║');
    console.log('║  patient@hms.com        / patient123 (Ravi Shankar - main)  ║');
    console.log('║  ravi@hms.com           / ravi123    (Ravi Shankar)         ║');
    console.log('║  sunita@hms.com         / sunita123  (Sunita Devi)          ║');
    console.log('║  karthik@hms.com        / karthik123 (Karthik Varma)        ║');
    console.log('║  lakshmi@hms.com        / lakshmi123 (Lakshmi Bai)          ║');
    console.log('║  pavan@hms.com          / pavan123   (Pavan Kumar)          ║');
    console.log('║  anitha@hms.com         / anitha123  (Anitha Reddy)         ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║  NURSES                                                      ║');
    console.log('║  nurse@hms.com          / nurse123   (Anjali - main)        ║');
    console.log('║  anjali@hms.com         / anjali123  (Anjali Sharma)        ║');
    console.log('║  rekha@hms.com          / rekha123   (Rekha Pillai)         ║');
    console.log('║  divya@hms.com          / divya123   (Divya Nair)           ║');
    console.log('║  meena@hms.com          / meena123   (Meena Kumari)         ║');
    console.log('║  sravani@hms.com        / sravani123 (Sravani Reddy)        ║');
    console.log('║  bhavana@hms.com        / bhavana123 (Bhavana Rao)          ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');

    await mongoose.disconnect();
    console.log('\n🔌 Done! All users created successfully.\n');
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });