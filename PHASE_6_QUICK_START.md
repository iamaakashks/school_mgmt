# Phase 6: Quick Start Guide

## Setup Steps

1. **Regenerate Prisma Client** (if needed):
   ```bash
   npx prisma generate
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Access the Application**:
   ```
   http://localhost:3000
   ```

## Testing Workflow

### Step 1: Admin - Create Exam

1. Login as Admin:
   - Email: `admin@springfield.edu`
   - Password: `admin123`

2. Navigate to: **Admin Dashboard → Exams** or `http://localhost:3000/admin/exams`

3. Click **"+ Create Exam"** button

4. Fill in the form:
   - Exam Name: "Mid Term 1"
   - Term: "Term 1" (optional)
   - Class: Select any class (e.g., "Class 1")
   - Start Date: Choose a date
   - End Date: Choose a date after start date
   - Click **"Create Exam"**

### Step 2: Admin - Attach Subjects

1. From the exam list, click **"Manage Subjects"** for the newly created exam

2. On the Subject Management page:
   - Check the subjects you want to include in the exam
   - Set max marks for each subject (default is 100)
   - Click **"Save Subjects"**

### Step 3: Teacher - Enter Marks

1. Logout and login as Teacher:
   - Email: `teacher1@springfield.edu`
   - Password: `teacher123`

2. Navigate to: **Teacher Dashboard → Enter Exam Results** or `http://localhost:3000/teacher/exams`

3. Enter marks:
   - Select **Class** from dropdown
   - Select **Exam** from dropdown (filtered by selected class)
   - Optionally select **Section**
   - Click **"Load Students"**

4. Enter marks for each student in each subject:
   - Type marks in the input fields
   - Marks are validated against max marks
   - Click **"Save Results"**

### Step 4: Student - View Results

1. Logout and login as Student:
   - Email: `student1@springfield.edu`
   - Password: `student123`

2. Navigate to: **Student Dashboard → View My Results** or `http://localhost:3000/student/results`

3. View exam history:
   - See all exams for your class
   - View total marks and percentage
   - Click **"View Report Card"** on any exam with results

4. View/Print Report Card:
   - Review detailed subject-wise marks
   - See grades and percentage
   - Click **"Print Report Card"** to print
   - Use browser's print function (Ctrl+P or Cmd+P)

## Features to Test

### Admin Features
- ✅ Create multiple exams for different classes
- ✅ Attach subjects with custom max marks
- ✅ View class results (filter by section)
- ✅ See student-wise performance

### Teacher Features
- ✅ Enter marks for all students in a class
- ✅ Edit previously entered marks
- ✅ Filter by section
- ✅ Bulk save marks
- ✅ Validation: marks can't exceed max marks

### Student Features
- ✅ View exam history
- ✅ See total marks and percentage
- ✅ Access detailed report cards
- ✅ Print report cards
- ✅ See grades automatically calculated

## Page URLs

| Role    | Page                     | URL                                      |
|---------|--------------------------|------------------------------------------|
| Admin   | Exams List               | `/admin/exams`                           |
| Admin   | Manage Subjects          | `/admin/exams/[examId]/subjects`         |
| Admin   | View Class Results       | `/admin/exams/[examId]/results`          |
| Teacher | Enter Marks              | `/teacher/exams`                         |
| Student | Results History          | `/student/results`                       |
| Student | Report Card              | `/student/results/[examId]`              |

## API Endpoints

| Method | Endpoint                                | Role           | Description                |
|--------|-----------------------------------------|----------------|----------------------------|
| POST   | `/api/exams`                            | ADMIN          | Create new exam            |
| GET    | `/api/exams`                            | ALL            | List all exams             |
| POST   | `/api/exams/[examId]/subjects`          | ADMIN          | Attach subjects to exam    |
| GET    | `/api/exams/[examId]/subjects`          | ALL            | Get exam subjects          |
| POST   | `/api/exams/[examId]/results`           | TEACHER        | Enter/update marks         |
| GET    | `/api/exams/[examId]/results/class`     | ADMIN, TEACHER | Get class results          |
| GET    | `/api/exams/[examId]/results/student`   | ALL            | Get student results        |
| GET    | `/api/students/results`                 | STUDENT        | Get all student results    |

## Sample Data for Testing

### Create Exam Example
```json
{
  "name": "Mid Term 1",
  "term": "Term 1",
  "classId": "[class-id-from-database]",
  "startDate": "2024-02-01",
  "endDate": "2024-02-10"
}
```

### Attach Subjects Example
```json
{
  "subjects": [
    {
      "subjectId": "[subject-id-1]",
      "maxMarks": 100
    },
    {
      "subjectId": "[subject-id-2]",
      "maxMarks": 50
    }
  ]
}
```

### Enter Results Example
```json
{
  "records": [
    {
      "studentId": "[student-id-1]",
      "subjectId": "[subject-id-1]",
      "marks": 85
    },
    {
      "studentId": "[student-id-1]",
      "subjectId": "[subject-id-2]",
      "marks": 42
    }
  ]
}
```

## Common Issues & Solutions

### Issue: "Exam not found"
- **Solution**: Make sure you created the exam first in the admin panel

### Issue: "No subjects found"
- **Solution**: Attach subjects to the exam before trying to enter marks

### Issue: "No students found"
- **Solution**: Make sure students are enrolled in the selected class/section

### Issue: "Results not yet published"
- **Solution**: Teacher needs to enter marks first. Students see this message if no marks are entered.

### Issue: Report card doesn't print properly
- **Solution**: Use Chrome/Edge browser for best print results. Use "Print to PDF" for saving.

### Issue: Prisma client errors
- **Solution**: Run `npx prisma generate` to regenerate the Prisma client

## Print Settings for Report Cards

For best print quality:
1. Open report card page
2. Click "Print Report Card" button (or Ctrl+P / Cmd+P)
3. In print dialog:
   - Paper size: A4
   - Margins: Default (or 1cm)
   - Background graphics: ON (for better appearance)
   - Headers/Footers: OFF (optional)
4. Print or Save as PDF

## Grading System

The system uses automatic grading based on percentage:

| Grade | Percentage | Description    |
|-------|------------|----------------|
| A+    | 90-100%    | Excellent      |
| A     | 80-89%     | Very Good      |
| B+    | 70-79%     | Good           |
| B     | 60-69%     | Above Average  |
| C     | 50-59%     | Average        |
| D     | 40-49%     | Pass           |
| F     | Below 40%  | Fail           |

## Performance Notes

- Results are calculated on-demand (not pre-cached)
- For large classes (50+ students), marks entry may take a few seconds
- Print preview may be slow on the first load
- All operations are transactional (atomic)

## Next Steps

After Phase 6, you might want to add:
- Bulk import of marks via CSV
- Result analytics and charts
- Class rank calculation
- Progress reports comparing multiple exams
- Parent portal
- Email notifications for result publication
- Comments/remarks feature on report cards

## Support

If you encounter any issues:
1. Check browser console for errors (F12)
2. Verify database connection
3. Ensure Prisma client is generated
4. Check that you're logged in with the correct role
5. Verify data exists (exams, subjects, students)
