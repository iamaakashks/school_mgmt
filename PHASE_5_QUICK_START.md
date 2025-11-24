# Phase 5: Attendance Module - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Run Database Migration
```bash
npx prisma migrate dev --name add_attendance_module
npx prisma generate
```

### Step 2: Restart Server
```bash
npm run dev
```

### Step 3: Test the Module
The server should start at `http://localhost:3000`

---

## 📋 Quick Testing Guide

### For Teachers
1. **Login** as a teacher (use credentials from `SAMPLE_LOGINS.md`)
2. **Navigate** to `/teacher/attendance` or click "Mark Attendance" button
3. **Select:**
   - A class from the dropdown
   - A section from the dropdown
   - Today's date (pre-selected)
4. **Mark Attendance:**
   - Click status buttons for each student (Present/Absent/Late/Excused)
   - Or use "All Present" / "All Absent" buttons
5. **Save** - Click "Save Attendance" button
6. **Verify** - Success message appears

### For Students
1. **Login** as a student (use credentials from `SAMPLE_LOGINS.md`)
2. **Navigate** to `/student/attendance` or click "View My Attendance" button
3. **View:**
   - Attendance percentage (large display)
   - Total days, present, absent, late, excused counts
   - Monthly breakdown
   - Recent 30 records

### For Admins
1. **Login** as admin
2. **Navigate** to `/admin/attendance` or click "Attendance" card on dashboard
3. **Select:**
   - Any class
   - Any section
   - Any date
4. **Click** "View Attendance"
5. **Review:**
   - Statistics cards (total, present, absent, etc.)
   - Attendance rate percentage
   - Full student list with status

---

## 🎯 Key Routes

| Route | Role | Purpose |
|-------|------|---------|
| `/teacher/attendance` | Teacher | Mark student attendance |
| `/student/attendance` | Student | View own attendance |
| `/admin/attendance` | Admin | View any class attendance |

---

## 🔑 API Endpoints

### 1. Mark Attendance (Teacher Only)
```
POST /api/attendance/mark
```
```json
{
  "classId": "...",
  "sectionId": "...",
  "date": "2024-01-15",
  "records": [
    {"studentId": "...", "status": "PRESENT"}
  ]
}
```

### 2. Get Class Attendance (Admin/Teacher)
```
GET /api/attendance/class?classId=...&sectionId=...&date=2024-01-15
```

### 3. Get Student Summary (All Roles)
```
GET /api/attendance/student-summary
GET /api/attendance/student-summary?studentId=... (Admin/Teacher)
```

---

## 📊 Database Schema

### New Enum
```prisma
enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  EXCUSED
}
```

### New Model
```prisma
model Attendance {
  id          String           @id @default(cuid())
  studentId   String
  date        DateTime         @db.Date
  status      AttendanceStatus
  markedById  String
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  student     Student          @relation(...)
  markedBy    Teacher          @relation(...)

  @@unique([studentId, date])
  @@index([studentId])
  @@index([date])
  @@index([markedById])
}
```

---

## ✨ Features Implemented

### ✅ Teacher Features
- Select class, section, and date
- View all students in class/section
- Mark attendance with 4 statuses (Present/Absent/Late/Excused)
- Bulk actions: "All Present" and "All Absent"
- Update existing attendance records
- See when attendance was last marked

### ✅ Student Features
- View overall attendance percentage
- See breakdown: total days, present, absent, late, excused
- Monthly attendance breakdown
- Recent 30 attendance records
- Color-coded status indicators
- Percentage color coding (green ≥90%, yellow ≥75%, red <75%)

### ✅ Admin Features
- View attendance for any class/section
- Filter by date
- See statistics dashboard (6 cards)
- View attendance rate percentage
- See detailed student list with timestamps
- Status badges with color coding

### ✅ Technical Features
- Full RBAC implementation
- Transaction-based updates (atomic)
- Upsert logic (update or create)
- Date normalization (time removed)
- Mobile responsive design
- Dark theme support
- Loading states
- Error handling
- Success/error messages

---

## 🎨 UI Elements

### Status Colors
- **PRESENT:** Green background, green text
- **ABSENT:** Red background, red text
- **LATE:** Yellow background, yellow text
- **EXCUSED:** Blue background, blue text
- **Not Marked:** Gray background, gray text

### Percentage Colors
- **≥90%:** Green (excellent)
- **≥75%:** Yellow (good)
- **<75%:** Red (needs improvement)

---

## 🔒 Security & Validation

### Authentication
- All routes require valid JWT token
- Token stored in HTTP-only cookie
- Role-based access control enforced

### Authorization
- Teachers: Can mark attendance for any class
- Students: Can only view their own data
- Admins: Can view any student/class data

### Validation
- Students must belong to selected class/section
- Date cannot be in the future
- Status must be valid enum value
- One attendance record per student per day

---

## 📱 Mobile Responsive

All pages are optimized for:
- ✅ Mobile phones (portrait)
- ✅ Mobile phones (landscape)
- ✅ Tablets
- ✅ Desktop screens
- ✅ Large displays

---

## 🌓 Dark Theme

Full dark theme support across:
- ✅ All attendance pages
- ✅ All form components
- ✅ All status badges
- ✅ All statistics cards
- ✅ All tables and lists

---

## 🐛 Troubleshooting

### Issue: "No students found"
**Solution:** Ensure students are assigned to the selected class and section via `/admin/students`

### Issue: "Unauthorized" error
**Solution:** Make sure you're logged in with the correct role (Teacher for marking)

### Issue: Cannot select future dates
**Solution:** This is intentional - attendance can only be marked for today or past dates

### Issue: Attendance not saving
**Solution:** Check browser console for errors; verify all students belong to selected class/section

---

## 📦 Files Created

### API Routes (3 files)
- `src/app/api/attendance/mark/route.ts`
- `src/app/api/attendance/class/route.ts`
- `src/app/api/attendance/student-summary/route.ts`

### Teacher Pages (2 files)
- `src/app/teacher/attendance/page.tsx`
- `src/app/teacher/attendance/AttendanceMarkingForm.tsx`

### Student Pages (2 files)
- `src/app/student/attendance/page.tsx`
- `src/app/student/attendance/AttendanceSummary.tsx`

### Admin Pages (2 files)
- `src/app/admin/attendance/page.tsx`
- `src/app/admin/attendance/AttendanceOverview.tsx`

### Modified Files (4 files)
- `prisma/schema.prisma` - Added Attendance model
- `src/app/admin/page.tsx` - Added navigation link
- `src/app/teacher/page.tsx` - Added navigation button
- `src/app/student/page.tsx` - Added navigation button

---

## 🎓 Usage Examples

### Scenario 1: Daily Attendance
1. Teacher logs in at start of day
2. Navigates to `/teacher/attendance`
3. Selects class and section
4. Date is already set to today
5. Clicks "All Present"
6. Marks absent/late students individually
7. Clicks "Save Attendance"

### Scenario 2: Check Student Attendance
1. Student logs in
2. Clicks "View My Attendance"
3. Sees attendance percentage (e.g., 92%)
4. Reviews monthly breakdown
5. Checks recent records

### Scenario 3: Admin Review
1. Admin wants to check class attendance
2. Navigates to `/admin/attendance`
3. Selects "Grade 10" and "Section A"
4. Selects yesterday's date
5. Views statistics: 25/30 present (83%)
6. Reviews which students were absent

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Database migration completed successfully
- [ ] Server running without errors
- [ ] Can login as teacher
- [ ] Teacher can access `/teacher/attendance`
- [ ] Can select class and section
- [ ] Students list appears
- [ ] Can mark attendance
- [ ] Attendance saves successfully
- [ ] Can login as student
- [ ] Student can access `/student/attendance`
- [ ] Student sees their attendance summary
- [ ] Can login as admin
- [ ] Admin can access `/admin/attendance`
- [ ] Admin can view any class attendance

---

## 🚀 Next Phase

Phase 5 is complete! Ready for:
- **Phase 6:** Exam & Results Module
- **Phase 7:** Fee Management
- **Phase 8:** Timetable & Scheduling
- **Phase 9:** Library Management
- **Phase 10:** Reports & Analytics

---

## 📚 Full Documentation

For complete details, see:
- `PHASE_5_ATTENDANCE_MODULE.md` - Comprehensive documentation
- `SAMPLE_LOGINS.md` - Test credentials
- `TESTING_GUIDE.md` - Testing procedures

---

## 💡 Tips

1. **Bulk Operations:** Use "All Present" for efficiency, then mark exceptions
2. **Historical Data:** You can mark attendance for past dates if missed
3. **Updates Allowed:** You can change attendance status anytime
4. **One Per Day:** Each student can have only one status per day (automatically updated)
5. **Mobile Friendly:** Use on phone/tablet for on-the-go attendance marking

---

## 🎉 Success!

Phase 5 Attendance Module is now complete and ready to use!

For any issues or questions, refer to the troubleshooting section or full documentation.

Happy tracking! 📊✨
