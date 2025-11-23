# 🌱 Database Seed Guide

## What This Does

The seed script creates a **fully populated school database** with:

- **1 Admin** (Manager)
- **35 Teachers** with realistic qualifications
- **600 Students** distributed across all classes and sections
- **12 Classes** (Grade 1 through Grade 12)
- **48 Sections** (A, B, C, D for each grade)
- **Multiple Subjects** assigned to classes with teachers

---

## 🚀 How to Run the Seed

### Step 1: Make Sure Database is Ready

```bash
# Ensure migrations are applied
npm run db:migrate
```

### Step 2: Run the Seed Script

```bash
npm run db:seed
```

**This will:**
1. Clear ALL existing data (⚠️ Warning: Deletes everything!)
2. Create 1 admin user
3. Create 35 teachers
4. Create 12 classes (grades)
5. Create 48 sections
6. Create 600 students
7. Create and assign subjects

**Takes about 2-3 minutes to complete.**

---

## 🔑 Login Credentials (After Seeding)

### **Admin / Manager**
- **Email:** `admin@springfield.edu`
- **Password:** `admin123456`
- **Dashboard:** http://localhost:3000/login?role=admin

### **Any Teacher** (35 teachers created)
- **Email:** `[firstname].[lastname][number]@springfield.edu`
  - Example: `james.smith1@springfield.edu`
  - Example: `jennifer.garcia2@springfield.edu`
- **Password:** `teacher123` (same for all teachers)
- **Dashboard:** http://localhost:3000/login?role=teacher

### **Any Student** (600 students created)
- **Email:** `[firstname].[lastname][number]@student.springfield.edu`
  - Example: `john.johnson1@student.springfield.edu`
  - Example: `sarah.williams5@student.springfield.edu`
- **Password:** `student123` (same for all students)
- **Dashboard:** http://localhost:3000/login?role=student

---

## 📊 What You'll See

### After Seeding - Admin Dashboard

1. **Login** as admin: `admin@springfield.edu` / `admin123456`
2. **Dashboard stats** will show:
   - Total Students: **600**
   - Total Teachers: **35**
   - Classes: **12**
   - Subjects: **~100+**

### Explore the Data

**View Students:**
- Go to: http://localhost:3000/admin/students
- You'll see 600 students with names, admission numbers, classes
- Try searching for names

**View Teachers:**
- Go to: http://localhost:3000/admin/teachers
- You'll see 35 teachers with employee codes, qualifications

**View Classes:**
- Go to: http://localhost:3000/admin/classes
- You'll see Grade 1 through Grade 12
- Each shows how many sections and students

**View Sections:**
- Go to: http://localhost:3000/admin/sections
- You'll see A, B, C, D sections for each grade
- Shows student count per section

**View Subjects:**
- Go to: http://localhost:3000/admin/subjects
- You'll see subjects like Mathematics, Science, English
- Each assigned to classes and teachers

---

## 🎯 Finding Specific Users

### Using Prisma Studio (Easy Way)

```bash
npm run db:studio
```

Opens at: http://localhost:5555

1. Click **"User"** table
2. See all emails and roles
3. Copy any email to login

### Using MySQL

```bash
mysql -u root -psmspassword

USE school_management;

-- See all teachers
SELECT email FROM user WHERE role = 'TEACHER' LIMIT 10;

-- See all students  
SELECT email FROM user WHERE role = 'STUDENT' LIMIT 10;

-- See admin
SELECT email FROM user WHERE role = 'ADMIN';
```

---

## 📋 Sample Logins to Try

After seeding, try logging in with these (exact emails may vary):

**Teachers:**
- james.smith1@springfield.edu / teacher123
- mary.johnson2@springfield.edu / teacher123
- robert.williams3@springfield.edu / teacher123

**Students:**
- john.brown1@student.springfield.edu / student123
- jennifer.garcia2@student.springfield.edu / student123
- michael.miller3@student.springfield.edu / student123

---

## 🔄 Re-seed Anytime

Want to start fresh? Just run:

```bash
npm run db:seed
```

**Warning:** This will DELETE all existing data and recreate everything!

---

## 📈 Data Distribution

**Students per Grade:**
- ~50 students per grade (600 total ÷ 12 grades)
- ~12-13 students per section (600 ÷ 48 sections)

**Classes:**
- Grade 1, Grade 2, ... Grade 12

**Sections per Grade:**
- Section A, B, C, D (4 sections each)

**Subjects:**
- Mathematics, English, Science, Social Studies
- Physical Education, Art, Music, Computer Science
- Biology, Chemistry, Physics (higher grades)
- History, Geography, Foreign Language

**Teachers:**
- Each assigned to multiple subjects
- Each subject has an assigned teacher
- Each class has a class teacher

---

## ⚡ Quick Test Workflow

After seeding:

1. **Login as Admin**
   ```
   http://localhost:3000/login?role=admin
   admin@springfield.edu / admin123456
   ```

2. **View Dashboard** - See all stats

3. **Browse Students** - 600 students to explore

4. **Browse Teachers** - 35 teachers to explore

5. **Login as Teacher**
   - Logout from admin
   - Login with any teacher email
   - Explore teacher dashboard

6. **Login as Student**
   - Logout from teacher
   - Login with any student email
   - Explore student dashboard

---

## 🛠️ Troubleshooting

### Seed fails with "Cannot find module"

```bash
npm install -D tsx
npm run db:seed
```

### Seed fails with "Prisma Client not found"

```bash
npm run db:generate
npm run db:seed
```

### Seed takes too long

This is normal! Creating 600+ records takes 2-3 minutes.

You'll see progress updates:
```
✓ Created 100/600 students
✓ Created 200/600 students
...
```

### Want fewer students?

Edit `prisma/seed.ts`:
```typescript
const studentCount = 600; // Change to 100 or 200
```

Then run: `npm run db:seed`

---

## ✅ Success Indicators

You know the seed worked when:

1. **Terminal shows:**
   ```
   ✅ Seed completed successfully!
   
   📊 Seed Summary:
   👤 Admin Users:    1
   👨‍🏫 Teachers:        35
   👨‍🎓 Students:        600
   🏫 Classes:        12
   📋 Sections:       48
   📚 Subjects:       100+
   ```

2. **Can login as admin:** admin@springfield.edu / admin123456

3. **Dashboard shows 600 students, 35 teachers**

4. **Student page shows hundreds of records**

---

## 🎉 You're Ready!

After seeding, you have a **fully functional school management system** with:

- Real looking data
- Multiple users to test with
- All relationships set up
- Ready to test all features

**Start exploring!** 🚀

Login as admin and browse through students, teachers, classes, sections, and subjects!
