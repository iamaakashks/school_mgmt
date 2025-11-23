import { PrismaClient, Role, UserStatus, Gender } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper function to hash passwords
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Helper to generate random date of birth (age 5-18 for students)
function randomDOB(minAge: number, maxAge: number): Date {
  const today = new Date();
  const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
  const year = today.getFullYear() - age;
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month, day);
}

// Helper to generate random phone
function randomPhone(): string {
  return `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
}

// Sample names
const firstNames = {
  male: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 
         'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth',
         'Kevin', 'Brian', 'George', 'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan', 'Jacob'],
  female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
           'Nancy', 'Lisa', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle',
           'Dorothy', 'Carol', 'Amanda', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia']
};

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                   'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
                   'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
                   'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'];

const subjects = [
  { name: 'Mathematics', code: 'MATH' },
  { name: 'English', code: 'ENG' },
  { name: 'Science', code: 'SCI' },
  { name: 'Social Studies', code: 'SS' },
  { name: 'Physical Education', code: 'PE' },
  { name: 'Art', code: 'ART' },
  { name: 'Music', code: 'MUS' },
  { name: 'Computer Science', code: 'CS' },
  { name: 'Biology', code: 'BIO' },
  { name: 'Chemistry', code: 'CHEM' },
  { name: 'Physics', code: 'PHY' },
  { name: 'History', code: 'HIST' },
  { name: 'Geography', code: 'GEO' },
  { name: 'Foreign Language', code: 'LANG' },
];

const qualifications = [
  'B.Ed. in Mathematics',
  'M.Ed. in Science',
  'B.A. in English Literature',
  'M.Sc. in Physics',
  'Ph.D. in Chemistry',
  'B.Ed. in Physical Education',
  'M.A. in History',
  'B.Sc. in Computer Science',
  'M.Ed. in Special Education',
  'B.A. in Fine Arts',
];

async function main() {
  console.log('🌱 Starting seed...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.subject.deleteMany();
  await prisma.section.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Cleared existing data\n');

  // Create Admin User
  console.log('👤 Creating admin user...');
  const adminPassword = await hashPassword('admin123456');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@springfield.edu',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });
  console.log(`✅ Created admin: ${admin.email}\n`);

  // Create Classes (Grades 1-12)
  console.log('🏫 Creating classes...');
  const classes = [];
  for (let grade = 1; grade <= 12; grade++) {
    const cls = await prisma.class.create({
      data: {
        name: `Grade ${grade}`,
        order: grade,
      },
    });
    classes.push(cls);
    console.log(`  ✓ Created ${cls.name}`);
  }
  console.log(`✅ Created ${classes.length} classes\n`);

  // Create Sections (A, B, C, D for each class)
  console.log('📋 Creating sections...');
  const sections: any[] = [];
  const sectionNames = ['A', 'B', 'C', 'D'];
  
  for (const cls of classes) {
    for (const sectionName of sectionNames) {
      const section = await prisma.section.create({
        data: {
          name: sectionName,
          classId: cls.id,
        },
      });
      sections.push({ ...section, classOrder: cls.order });
    }
    console.log(`  ✓ Created sections for ${cls.name}`);
  }
  console.log(`✅ Created ${sections.length} sections\n`);

  // Create Teachers (35 teachers)
  console.log('👨‍🏫 Creating teachers...');
  const teachers = [];
  const teacherCount = 35;
  
  for (let i = 1; i <= teacherCount; i++) {
    const gender = Math.random() > 0.5 ? Gender.MALE : Gender.FEMALE;
    const firstName = firstNames[gender === Gender.MALE ? 'male' : 'female'][Math.floor(Math.random() * 30)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@springfield.edu`;
    const password = await hashPassword('teacher123');
    
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: password,
        role: Role.TEACHER,
        status: UserStatus.ACTIVE,
      },
    });
    
    const teacher = await prisma.teacher.create({
      data: {
        userId: user.id,
        empCode: `TCH${String(i).padStart(4, '0')}`,
        firstName,
        lastName,
        phone: randomPhone(),
        qualification: qualifications[Math.floor(Math.random() * qualifications.length)],
      },
    });
    
    teachers.push(teacher);
    if (i % 10 === 0) {
      console.log(`  ✓ Created ${i}/${teacherCount} teachers`);
    }
  }
  console.log(`✅ Created ${teachers.length} teachers\n`);

  // Create Subjects and assign to teachers
  console.log('📚 Creating subjects...');
  const createdSubjects = [];
  
  for (const subject of subjects) {
    // Assign subject to random classes and teachers
    const assignedClasses = classes.slice(0, Math.floor(Math.random() * 6) + 3); // 3-8 classes per subject
    
    for (const cls of assignedClasses) {
      const teacher = teachers[Math.floor(Math.random() * teachers.length)];
      const subj = await prisma.subject.create({
        data: {
          name: subject.name,
          code: `${subject.code}${cls.order}`,
          classId: cls.id,
          teacherId: teacher.id,
        },
      });
      createdSubjects.push(subj);
    }
  }
  console.log(`✅ Created ${createdSubjects.length} subject assignments\n`);

  // Assign class teachers (one teacher per class)
  console.log('👔 Assigning class teachers...');
  for (let i = 0; i < classes.length; i++) {
    await prisma.class.update({
      where: { id: classes[i].id },
      data: { classTeacherId: teachers[i % teachers.length].id },
    });
  }
  console.log(`✅ Assigned class teachers\n`);

  // Create Students (600 students distributed across classes)
  console.log('👨‍🎓 Creating students...');
  const studentCount = 600;
  let admissionCounter = 1;
  
  // Calculate students per section (evenly distributed)
  const studentsPerSection = Math.floor(studentCount / sections.length);
  let remainingStudents = studentCount;
  
  for (const section of sections) {
    const studentsForThisSection = Math.min(
      studentsPerSection + (Math.random() > 0.5 ? 1 : 0), 
      remainingStudents
    );
    
    for (let i = 0; i < studentsForThisSection; i++) {
      const gender = Math.random() > 0.5 ? Gender.MALE : Gender.FEMALE;
      const firstName = firstNames[gender === Gender.MALE ? 'male' : 'female'][Math.floor(Math.random() * 30)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${admissionCounter}@student.springfield.edu`;
      const password = await hashPassword('student123');
      
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: password,
          role: Role.STUDENT,
          status: UserStatus.ACTIVE,
        },
      });
      
      const ageRange = section.classOrder <= 5 ? [5, 10] : section.classOrder <= 8 ? [11, 13] : [14, 18];
      
      await prisma.student.create({
        data: {
          userId: user.id,
          admissionNo: `STU${String(admissionCounter).padStart(5, '0')}`,
          firstName,
          lastName,
          dob: randomDOB(ageRange[0], ageRange[1]),
          gender,
          classId: section.classId,
          sectionId: section.id,
          parentName: `${firstNames[Math.random() > 0.5 ? 'male' : 'female'][0]} ${lastName}`,
          parentPhone: randomPhone(),
          address: `${Math.floor(Math.random() * 9999) + 1} Main Street, Springfield, ST ${Math.floor(Math.random() * 90000) + 10000}`,
        },
      });
      
      admissionCounter++;
      remainingStudents--;
    }
    
    if (admissionCounter % 100 === 0) {
      console.log(`  ✓ Created ${admissionCounter - 1}/${studentCount} students`);
    }
  }
  console.log(`✅ Created ${admissionCounter - 1} students\n`);

  // Summary
  console.log('📊 Seed Summary:');
  console.log('═══════════════════════════════════════');
  console.log(`👤 Admin Users:    1`);
  console.log(`👨‍🏫 Teachers:        ${teachers.length}`);
  console.log(`👨‍🎓 Students:        ${admissionCounter - 1}`);
  console.log(`🏫 Classes:        ${classes.length}`);
  console.log(`📋 Sections:       ${sections.length}`);
  console.log(`📚 Subjects:       ${createdSubjects.length}`);
  console.log('═══════════════════════════════════════');
  console.log('\n✅ Seed completed successfully!\n');
  
  console.log('🔑 Login Credentials:');
  console.log('═══════════════════════════════════════');
  console.log('Admin:');
  console.log('  Email: admin@springfield.edu');
  console.log('  Password: admin123456');
  console.log('\nAny Teacher:');
  console.log('  Email: [firstname].[lastname][number]@springfield.edu');
  console.log('  Password: teacher123');
  console.log('\nAny Student:');
  console.log('  Email: [firstname].[lastname][number]@student.springfield.edu');
  console.log('  Password: student123');
  console.log('═══════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
