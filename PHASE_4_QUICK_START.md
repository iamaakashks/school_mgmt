# Phase 4 Quick Start Guide

## 🚀 Getting Started with Student & Teacher Admissions

This guide will help you quickly start using the admission features implemented in Phase 4.

---

## Prerequisites

Before you begin, ensure:
- ✅ Database is running and migrated
- ✅ Database is seeded with classes and sections
- ✅ Admin account is created
- ✅ Application is running (`npm run dev`)

---

## Step 1: Login as Admin

1. Navigate to: `http://localhost:3000/login`
2. Login with admin credentials:
   ```
   Email: admin@school.com
   Password: Admin@123
   ```
3. You'll be redirected to `/admin` dashboard

---

## Step 2: Admit a Student

### Navigate to Student Admission
1. Click **"Students"** in the sidebar, or go to `/admin/students`
2. Click the **"+ Add Student"** button (top right)
3. You'll be taken to `/admin/students/new`

### Fill the Student Admission Form

**Account Information:**
- **Email:** `john.doe@school.com`
- **Password:** `Student123` (minimum 8 characters)

**Personal Information:**
- **Admission Number:** `STU2024001` (must be unique)
- **First Name:** `John`
- **Last Name:** `Doe`
- **Date of Birth:** `2010-05-15`
- **Gender:** `Male`
- **Join Date:** `2024-01-15` (defaults to today)

**Academic Information:**
- **Class:** Select from dropdown (e.g., "Class 10")
- **Section:** Select from dropdown (filtered by class, e.g., "Section A")

**Parent/Guardian Information (Optional):**
- **Parent Name:** `Jane Doe`
- **Parent Phone:** `+1234567890`
- **Address:** `123 Main Street, City, State`

### Submit the Form
1. Click **"Admit Student"** button
2. Wait for success message
3. You'll be redirected to `/admin/students`
4. The new student will appear in the list

### Verify Student Can Login
1. Logout from admin account
2. Login with student credentials:
   ```
   Email: john.doe@school.com
   Password: Student123
   ```
3. You'll be redirected to `/student` dashboard

---

## Step 3: Admit a Teacher

### Navigate to Teacher Admission
1. Login as admin
2. Click **"Teachers"** in the sidebar, or go to `/admin/teachers`
3. Click the **"+ Add Teacher"** button (top right)
4. You'll be taken to `/admin/teachers/new`

### Fill the Teacher Admission Form

**Account Information:**
- **Email:** `jane.smith@school.com`
- **Password:** `Teacher123` (minimum 8 characters)

**Personal Information:**
- **Employee Code:** `TCH2024001` (must be unique)
- **First Name:** `Jane`
- **Last Name:** `Smith`
- **Phone:** `+1234567890` (optional)
- **Qualification:** `M.Ed. in Mathematics` (optional)

### Submit the Form
1. Click **"Admit Teacher"** button
2. Wait for success message
3. You'll be redirected to `/admin/teachers`
4. The new teacher will appear in the list

### Verify Teacher Can Login
1. Logout from admin account
2. Login with teacher credentials:
   ```
   Email: jane.smith@school.com
   Password: Teacher123
   ```
3. You'll be redirected to `/teacher` dashboard

---

## Common Workflows

### Admitting Multiple Students
```
For each student:
1. Go to /admin/students
2. Click "+ Add Student"
3. Fill the form with unique:
   - Email
   - Admission Number
4. Submit
5. Repeat
```

### Admitting Multiple Teachers
```
For each teacher:
1. Go to /admin/teachers
2. Click "+ Add Teacher"
3. Fill the form with unique:
   - Email
   - Employee Code
4. Submit
5. Repeat
```

---

## Troubleshooting

### Error: "A user with this email already exists"
**Cause:** Email is already registered  
**Solution:** Use a different email address

### Error: "A student with this admission number already exists"
**Cause:** Admission number is already used  
**Solution:** Use a different admission number (e.g., increment: STU2024002)

### Error: "A teacher with this employee code already exists"
**Cause:** Employee code is already used  
**Solution:** Use a different employee code (e.g., increment: TCH2024002)

### Error: "Password must be at least 8 characters"
**Cause:** Password is too short  
**Solution:** Use a password with 8 or more characters

### Error: "Validation failed"
**Cause:** One or more required fields are missing  
**Solution:** Fill in all fields marked with * (asterisk)

### Section dropdown is disabled
**Cause:** No class is selected  
**Solution:** Select a class first, then sections will be available

### No sections appear in dropdown
**Cause:** Selected class has no sections  
**Solution:** Create sections for the class first (at `/admin/sections`)

---

## Tips & Best Practices

### Admission Number Format
Use a consistent format for admission numbers:
- **Prefix:** `STU` for students
- **Year:** `2024` for current year
- **Number:** `001`, `002`, etc. (with leading zeros)
- **Example:** `STU2024001`, `STU2024002`, `STU2024003`

### Employee Code Format
Use a consistent format for employee codes:
- **Prefix:** `TCH` for teachers
- **Year:** `2024` for current year
- **Number:** `001`, `002`, etc. (with leading zeros)
- **Example:** `TCH2024001`, `TCH2024002`, `TCH2024003`

### Password Policy
For initial passwords:
- Minimum 8 characters
- Include uppercase and lowercase letters
- Include numbers
- Example: `Student123`, `Teacher456`

**Note:** In production, consider:
- Forcing password change on first login
- Sending credentials via email
- Using temporary passwords

### Class and Section Setup
Before admitting students:
1. Create classes at `/admin/classes`
2. Create sections for each class at `/admin/sections`
3. Then proceed with student admissions

---

## API Usage (For Developers)

### Admit Student via API

**Endpoint:** `POST /api/admin/admissions/student`

**Authentication:** Required (Admin role)

**Request:**
```bash
curl -X POST http://localhost:3000/api/admin/admissions/student \
  -H "Content-Type: application/json" \
  -H "Cookie: access_token=YOUR_ACCESS_TOKEN" \
  -d '{
    "email": "student@school.com",
    "password": "Student123",
    "admissionNo": "STU2024001",
    "firstName": "John",
    "lastName": "Doe",
    "dob": "2010-05-15",
    "gender": "MALE",
    "joinDate": "2024-01-15",
    "classId": "YOUR_CLASS_ID",
    "sectionId": "YOUR_SECTION_ID",
    "parentName": "Jane Doe",
    "parentPhone": "+1234567890",
    "address": "123 Main Street"
  }'
```

### Admit Teacher via API

**Endpoint:** `POST /api/admin/admissions/teacher`

**Authentication:** Required (Admin role)

**Request:**
```bash
curl -X POST http://localhost:3000/api/admin/admissions/teacher \
  -H "Content-Type: application/json" \
  -H "Cookie: access_token=YOUR_ACCESS_TOKEN" \
  -d '{
    "email": "teacher@school.com",
    "password": "Teacher123",
    "empCode": "TCH2024001",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+1234567890",
    "qualification": "M.Ed. in Mathematics"
  }'
```

---

## Sample Data for Testing

### Student 1
```
Email: alice.johnson@school.com
Password: Student001
Admission No: STU2024001
Name: Alice Johnson
DOB: 2009-03-15
Gender: Female
Class: Class 10
Section: Section A
Parent: Robert Johnson
Phone: +1234567890
```

### Student 2
```
Email: bob.williams@school.com
Password: Student002
Admission No: STU2024002
Name: Bob Williams
DOB: 2009-07-22
Gender: Male
Class: Class 10
Section: Section B
Parent: Mary Williams
Phone: +1234567891
```

### Teacher 1
```
Email: dr.sarah.miller@school.com
Password: Teacher001
Emp Code: TCH2024001
Name: Dr. Sarah Miller
Phone: +1234567892
Qualification: Ph.D. in Physics
```

### Teacher 2
```
Email: prof.david.brown@school.com
Password: Teacher002
Emp Code: TCH2024002
Name: Prof. David Brown
Phone: +1234567893
Qualification: M.Sc. in Chemistry
```

---

## Video Walkthrough (Steps)

### Recording a Demo
1. Start screen recording
2. Open browser at `localhost:3000/login`
3. Login as admin
4. Navigate to Students → "+ Add Student"
5. Fill form with sample data
6. Submit and show success
7. Navigate to Teachers → "+ Add Teacher"
8. Fill form with sample data
9. Submit and show success
10. Logout and login as newly created student
11. Show student dashboard
12. Logout and login as newly created teacher
13. Show teacher dashboard

---

## Next Steps

After admitting students and teachers:

1. **Assign Class Teachers**
   - Go to `/admin/classes`
   - Edit a class
   - Assign a teacher as class teacher

2. **Assign Subject Teachers**
   - Go to `/admin/subjects`
   - Edit a subject
   - Assign a teacher to teach it

3. **Create Timetables** (Phase 5+)
   - Schedule classes for students
   - Assign teachers to time slots

4. **Manage Attendance** (Phase 5+)
   - Teachers mark attendance
   - View attendance reports

---

## Security Notes

### Important Reminders
- ⚠️ Only ADMIN users can access admission pages
- ⚠️ Only ADMIN users can call admission APIs
- ⚠️ Passwords are hashed with bcrypt (never stored in plain text)
- ⚠️ Email addresses must be unique across all users
- ⚠️ Admission numbers must be unique across all students
- ⚠️ Employee codes must be unique across all teachers

### Access Control
- Students accessing `/admin` routes → Redirected to `/student`
- Teachers accessing `/admin` routes → Redirected to `/teacher`
- Unauthenticated users → Redirected to `/login`

---

## Support & Documentation

### Full Documentation
- `PHASE_4_COMPLETE.md` - Complete feature list
- `PHASE_4_SUMMARY.md` - Technical summary
- `PHASE_4_TRANSACTION_EXPLANATION.md` - Transaction logic details

### Getting Help
If you encounter issues:
1. Check error messages in browser console
2. Check server logs in terminal
3. Verify database has required data (classes, sections)
4. Ensure you're logged in as ADMIN

---

## Quick Reference

### URLs
| Page | URL | Access |
|------|-----|--------|
| Login | `/login` | Public |
| Admin Dashboard | `/admin` | Admin Only |
| Student List | `/admin/students` | Admin Only |
| Add Student | `/admin/students/new` | Admin Only |
| Teacher List | `/admin/teachers` | Admin Only |
| Add Teacher | `/admin/teachers/new` | Admin Only |

### API Endpoints
| Endpoint | Method | Access |
|----------|--------|--------|
| `/api/admin/admissions/student` | POST | Admin Only |
| `/api/admin/admissions/teacher` | POST | Admin Only |

### Default Credentials
```
Admin:
  Email: admin@school.com
  Password: Admin@123
```

---

**Happy Admitting! 🎓**

For questions or issues, refer to the full documentation or check the server logs.
