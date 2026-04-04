const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const dotenv   = require('dotenv');

dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hospital_db';

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected\n');

    const db    = mongoose.connection.db;
    const col   = db.collection('users');

    // delete ALL existing users
    await col.deleteMany({});
    console.log('🗑️  Deleted all existing users\n');

    // also clear profiles
    await db.collection('doctors').deleteMany({});
    await db.collection('patients').deleteMany({});
    await db.collection('nurses').deleteMany({});
    console.log('🗑️  Deleted all profiles\n');

    // hash passwords fresh
    const adminHash   = await bcrypt.hash('admin123',   10);
    const doctorHash  = await bcrypt.hash('doctor123',  10);
    const patientHash = await bcrypt.hash('patient123', 10);
    const nurseHash   = await bcrypt.hash('nurse123',   10);

    // verify hashes
    console.log('🔐 Hash verification:');
    console.log('  admin123   :', await bcrypt.compare('admin123',   adminHash)   ? '✅' : '❌');
    console.log('  doctor123  :', await bcrypt.compare('doctor123',  doctorHash)  ? '✅' : '❌');
    console.log('  patient123 :', await bcrypt.compare('patient123', patientHash) ? '✅' : '❌');
    console.log('  nurse123   :', await bcrypt.compare('nurse123',   nurseHash)   ? '✅' : '❌');
    console.log('');

    // create doctor profile
    const doctorResult = await db.collection('doctors').insertOne({
      name:           'Dr. Meera Reddy',
      specialization: 'Cardiology',
      contact:        '9876500001',
      email:          'doctor@hms.com',
      createdAt:      new Date(),
      updatedAt:      new Date(),
    });

    // create patient profile
    const patientResult = await db.collection('patients').insertOne({
      name:      'Ravi Shankar',
      dob:       new Date('1990-05-12'),
      gender:    'Male',
      contact:   '9876543210',
      address:   'Warangal, Telangana',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // create nurse profile
    const nurseResult = await db.collection('nurses').insertOne({
      name:       'Anjali Sharma',
      department: 'Cardiology',
      contact:    '9876541001',
      createdAt:  new Date(),
      updatedAt:  new Date(),
    });

    // insert users directly into MongoDB (bypassing mongoose hooks)
    await col.insertMany([
      {
        name:      'Admin',
        email:     'admin@hms.com',
        password:  adminHash,
        role:      'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name:         'Dr. Meera Reddy',
        email:        'doctor@hms.com',
        password:     doctorHash,
        role:         'doctor',
        profileId:    doctorResult.insertedId,
        profileModel: 'Doctor',
        createdAt:    new Date(),
        updatedAt:    new Date(),
      },
      {
        name:         'Ravi Shankar',
        email:        'patient@hms.com',
        password:     patientHash,
        role:         'patient',
        profileId:    patientResult.insertedId,
        profileModel: 'Patient',
        createdAt:    new Date(),
        updatedAt:    new Date(),
      },
      {
        name:         'Anjali Sharma',
        email:        'nurse@hms.com',
        password:     nurseHash,
        role:         'nurse',
        profileId:    nurseResult.insertedId,
        profileModel: 'Nurse',
        createdAt:    new Date(),
        updatedAt:    new Date(),
      },
    ]);

    console.log('✅ All users inserted directly into MongoDB!\n');

    // final verify
    const allUsers = await col.find({}).toArray();
    console.log('📋 Final verification:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const passwords = { admin:'admin123', doctor:'doctor123', patient:'patient123', nurse:'nurse123' };

    for (const u of allUsers) {
      const pw    = passwords[u.role];
      const ok    = await bcrypt.compare(pw, u.password);
      console.log(`  ${u.role.padEnd(8)} | ${u.email.padEnd(22)} | ${pw.padEnd(12)} | ${ok ? '✅ OK' : '❌ FAIL'}`);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    await mongoose.disconnect();
    console.log('🔌 Disconnected. Now restart backend and login!\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error(err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

run();