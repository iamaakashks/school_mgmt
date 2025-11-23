# 🚀 Complete Setup Guide - Step by Step

## Overview
You have a School Management System with:
- **Phase 1:** Basic Next.js setup + Landing page
- **Phase 2:** Authentication (Login system)
- **Phase 3:** Database models (Classes, Sections, Subjects, Students, Teachers)

Let's get everything working!

---

## ✅ Step-by-Step Setup

### **Step 1: Verify MySQL is Running**

```bash
# Test MySQL connection
mysql -u root -p
# Enter password: smspassword
# If it connects, type: EXIT
```

**If MySQL is not running:**
- Windows: Open Services → Start MySQL80
- Mac: `mysql.server start`
- Linux: `sudo systemctl start mysql`

---

### **Step 2: Install Dependencies**

```bash
npm install
```

Wait for it to complete. This installs all required packages.

---

### **Step 3: Generate Prisma Client**

```bash
npm run db:generate
```

**Expected output:**
```
✔ Generated Prisma Client
```

---

### **Step 4: Run Database Migrations**

This creates all database tables (User, Student, Teacher, Class, Section, Subject).

```bash
npm run db:migrate
```

**When prompted for migration name, type:** `complete_setup`

**Expected output:**
```
✔ Generated migration name: 20241124XXXXXX_complete_setup
Applying migration...
Your database is now in sync with your schema.
```

**If you see errors here, STOP and send me the error message.**

---

### **Step 5: Verify Database Tables**

```bash
mysql -u root -p
# Password: smspassword

USE school_management;
SHOW TABLES;
```

**You should see:**
- User
- Student
- Teacher
- Class
- Section
- Subject
- _prisma_migrations

Type `EXIT` to leave MySQL.

---

### **Step 6: Start Development Server**

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 16.0.3
- Local:   http://localhost:3000
✓ Ready in XXXms
```

**Server should now be running. Keep this terminal open.**

---

## 🎯 Step-by-Step Testing

### **Test 1: View Landing Page**

1. Open browser: http://localhost:3000
2. You should see "Springfield Academy" landing page
3. Three login cards: Admin, Teacher, Student

**✅ If you see this, Phase 1 works!**

---

### **Test 2: Create Admin User**

**Option A - Using Browser Console (Easiest):**

1. On the landing page, press **F12** (opens DevTools)
2. Click **Console** tab
3. Copy and paste this code:

```javascript
fetch('/api/auth/register-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@school.edu',
    password: 'admin123456'
  })
})
.then(r => r.json())
.then(data => console.log('SUCCESS:', data))
.catch(err => console.error('ERROR:', err))
```

4. Press **Enter**
5. Wait 2 seconds
6. You should see: `SUCCESS: {message: "Admin user created successfully", user: {...}}`

**Option B - Using PowerShell:**

```powershell
$body = '{"email":"admin@school.edu","password":"admin123456"}'
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register-admin" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
```

**If you get an error, send me the error message!**

---

### **Test 3: Login as Admin**

1. Go to: http://localhost:3000/login?role=admin
2. You should see a red-themed login page with "Admin Login"
3. Enter:
   - **Email:** `admin@school.edu`
   - **Password:** `admin123456`
4. Click **Sign In**
5. You should be redirected to: http://localhost:3000/admin

**You should now see:**
- "Dashboard" heading
- Stats cards showing zeros (Total Students: 0, Total Teachers: 0, etc.)
- Quick action cards (Classes, Sections, Subjects, Students, Teachers)
- Logout button in top right

**✅ If you see this, Phase 2 (Authentication) works!**

---

### **Test 4: Create a Class**

1. On the admin dashboard, click the **"Classes"** card
2. You'll see URL: http://localhost:3000/admin/classes
3. Click **"+ Add Class"** button (top right, red button)
4. A dialog will open
5. Enter:
   - **Class Name:** `Grade 6`
   - **Display Order:** `6`
6. Click **"Create Class"**
7. Dialog closes, you should see "Grade 6" in the table

**✅ If you see this, Phase 3 (Database) works!**

---

### **Test 5: Create a Section**

1. Click **"Sections"** from quick actions or go to: http://localhost:3000/admin/sections
2. Click **"+ Add Section"**
3. Select:
   - **Class:** Grade 6
   - **Section Name:** `A`
4. Click **"Create Section"**
5. You should see "Grade 6 - A" in the table

---

### **Test 6: Create a Subject**

1. Go to: http://localhost:3000/admin/subjects
2. Click **"+ Add Subject"**
3. Enter:
   - **Subject Name:** `Mathematics`
   - **Subject Code:** `MATH6`
   - **Class:** Grade 6 (optional)
4. Click **"Create Subject"**
5. You should see "Mathematics" in the table

---

### **Test 7: Check Dashboard Stats**

1. Go back to: http://localhost:3000/admin
2. The stats should now show:
   - Total Students: 0
   - Total Teachers: 0
   - **Classes: 1**
   - **Subjects: 1**

**✅ All tests pass? Your app is working perfectly!**

---

## 🧪 Testing Other Roles

### **Note About Students and Teachers**

Currently, you can only:
- **View** the students and teachers lists (they'll be empty)
- You **cannot** create students/teachers yet (that's Phase 4)

But you can test the pages:
1. **Students:** http://localhost:3000/admin/students
2. **Teachers:** http://localhost:3000/admin/teachers

They should show empty state messages.

---

## 🔄 Testing Different User Roles

### **Create a Teacher User** (for testing)

**Step 1: Create user via API**

In browser console (F12 → Console):

```javascript
fetch('/api/auth/register-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'teacher@school.edu',
    password: 'teacher123'
  })
})
.then(r => r.json())
.then(console.log)
```

**Step 2: Change role to TEACHER**

```bash
# Open Prisma Studio
npm run db:studio
```

This opens: http://localhost:5555

1. Click **"User"** table
2. Find `teacher@school.edu`
3. Change **role** from `ADMIN` to `TEACHER`
4. Click **"Save 1 change"**

**Step 3: Login as Teacher**

1. Logout from admin (click Logout button)
2. Go to: http://localhost:3000/login?role=teacher
3. Login with: `teacher@school.edu` / `teacher123`
4. You'll see the Teacher Dashboard (green theme)

### **Create a Student User** (for testing)

Same process but:
- Email: `student@school.edu`
- Password: `student123`
- Change role to `STUDENT`
- Login at: http://localhost:3000/login?role=student

---

## 🎨 What Each Page Does

### **Landing Page** (`/`)
- Shows school branding
- Three login cards for Admin, Teacher, Student
- Feature showcase
- No login required

### **Login Page** (`/login?role=X`)
- Role-specific styling (red for admin, green for teacher, blue for student)
- Email + password form
- Redirects to appropriate dashboard after login

### **Admin Dashboard** (`/admin`)
- Shows stats (students, teachers, classes, subjects)
- Quick action cards for navigation
- Logout button
- **Only accessible by ADMIN role**

### **Classes Management** (`/admin/classes`)
- List all classes
- Create new class
- Delete class
- Shows section count and student count

### **Sections Management** (`/admin/sections`)
- List all sections
- Create section (must select a class first)
- Delete section
- Shows student count per section

### **Subjects Management** (`/admin/subjects`)
- List all subjects
- Create subject with code
- Optionally assign to class and teacher
- Delete subject

### **Students List** (`/admin/students`)
- List all students (empty for now)
- Search by name or admission number
- Phase 4 will add "Create Student" button

### **Teachers List** (`/admin/teachers`)
- List all teachers (empty for now)
- Shows employee code, qualifications
- Phase 4 will add "Create Teacher" button

---

## 🔒 Security Features Working

### **Route Protection**

Try this test:
1. Logout from admin dashboard
2. Try to access: http://localhost:3000/admin
3. You should be **redirected to login page**

This proves the authentication is working!

### **Role-Based Access**

Try this test:
1. Login as admin
2. Try to access: http://localhost:3000/teacher
3. You should be **redirected back to /admin**

This proves RBAC (Role-Based Access Control) is working!

---

## 📊 Database Structure

Your database now has these tables:

```
User
├─ id, email, passwordHash, role, status
├─ Relations: → Student (1:1), → Teacher (1:1)

Student
├─ id, userId, admissionNo, firstName, lastName
├─ Relations: → User, → Class, → Section

Teacher
├─ id, userId, empCode, firstName, lastName
├─ Relations: → User, → Subject[]

Class
├─ id, name, order
├─ Relations: → Section[], → Student[], → Subject[]

Section
├─ id, name, classId
├─ Relations: → Class, → Student[]

Subject
├─ id, name, code, classId, teacherId
├─ Relations: → Class, → Teacher
```

---

## 🐛 Common Issues & Solutions

### **Issue 1: "Can't connect to database"**

**Solution:**
```bash
# Check if MySQL is running
mysql -u root -p

# If it's not running, start it:
# Windows: Services → MySQL80 → Start
# Mac: mysql.server start
```

### **Issue 2: "Port 3000 already in use"**

**Solution:**
```bash
# Kill the process using port 3000
Get-Process -Name node | Stop-Process -Force

# Then restart server
npm run dev
```

### **Issue 3: Migration fails**

**Solution:**
```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Then run migration again
npm run db:migrate
```

### **Issue 4: "Invalid credentials" when logging in**

**Solution:**
- Double-check email and password
- Make sure you created the admin user (Test 2)
- Try creating the user again

### **Issue 5: TypeScript errors**

**Solution:**
```bash
# Regenerate Prisma Client
npm run db:generate

# Restart VS Code TypeScript server
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

---

## ✅ Final Checklist

- [ ] MySQL is running
- [ ] `npm install` completed
- [ ] `npm run db:generate` succeeded
- [ ] `npm run db:migrate` succeeded
- [ ] Database has 6 tables (User, Student, Teacher, Class, Section, Subject)
- [ ] Dev server is running (`npm run dev`)
- [ ] Landing page loads (http://localhost:3000)
- [ ] Can create admin user
- [ ] Can login as admin
- [ ] Can access admin dashboard
- [ ] Can create a class
- [ ] Can create a section
- [ ] Can create a subject
- [ ] Dashboard stats update correctly
- [ ] Can logout
- [ ] Cannot access admin dashboard when logged out

---

## 🎉 Success!

If all checklist items pass, your app is **fully working**!

You now have:
- ✅ Working authentication system
- ✅ Role-based access control
- ✅ Admin dashboard with navigation
- ✅ Class, section, and subject management
- ✅ Protected routes
- ✅ Database with proper relationships

---

## 🚀 What's Next?

**Phase 4 will add:**
- Student admission form (create student + user account)
- Teacher admission form (create teacher + user account)
- Edit functionality for all entities
- Profile management
- And more!

---

## 📞 Need Help?

If you encounter any error:
1. Copy the **entire error message**
2. Note which **step** you were on
3. Send me the error and I'll help fix it!

---

**Good luck! 🎓**
