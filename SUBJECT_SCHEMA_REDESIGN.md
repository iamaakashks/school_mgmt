# Subject Schema Redesign - Proposal

## Current Problem

**Current Schema**:
```prisma
model Subject {
  id          String   @id @default(cuid())
  name        String
  code        String   @unique     ← Problem: Can't reuse codes
  classId     String?              ← Problem: One subject = one class
  teacherId   String?              ← Problem: One subject = one teacher
}
```

**Issues**:
1. ❌ "Mathematics" needs different codes for each class (MTH001-Class1, MTH001-Class2)
2. ❌ Same subject appears multiple times with different codes
3. ❌ Can't track which classes offer which subjects properly
4. ❌ Can't assign multiple teachers to same subject across classes

## Proposed Solution

### New Schema Structure

```prisma
// Core subject definition (ONE record per unique subject)
model Subject {
  id          String   @id @default(cuid())
  name        String   @unique     // "Mathematics", "Science", etc.
  code        String   @unique     // "MTH001", "SCI001", etc.
  description String?  @db.Text    // Subject description
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  classSubjects SubjectAssignment[]  // Which classes offer this
  examSubjects  ExamSubject[]
  examResults   ExamResult[]
}

// Junction table: Which classes offer which subjects, with which teachers
model SubjectAssignment {
  id          String   @id @default(cuid())
  subjectId   String                // Link to Subject
  classId     String                // Which class
  teacherId   String?               // Which teacher (can be null initially)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  subject     Subject  @relation(fields: [subjectId], references: [id], onDelete: Cascade)
  class       Class    @relation(fields: [classId], references: [id], onDelete: Cascade)
  teacher     Teacher? @relation(fields: [teacherId], references: [id], onDelete: SetNull)

  @@unique([subjectId, classId])  // Each subject once per class
  @@index([subjectId])
  @@index([classId])
  @@index([teacherId])
}

// Update Teacher model to support the new relation
model Teacher {
  // ... existing fields ...
  subjectAssignments SubjectAssignment[]  // NEW
}

// Update Class model
model Class {
  // ... existing fields ...
  subjectAssignments SubjectAssignment[]  // NEW (replaces subjects)
}
```

### Benefits

✅ **One Subject, One Code**: "Mathematics" = "MTH001" (always)
✅ **Multiple Classes**: Same subject can be offered in multiple classes
✅ **Multiple Teachers**: Different teachers can teach same subject in different classes
✅ **Clean Data**: No duplicate subject names with different codes
✅ **Flexible Assignment**: Easy to add/remove class-subject-teacher combinations
✅ **Better Tracking**: Know exactly which subjects are offered where

### Example Data

**Before** (Current - Confusing):
```
Subjects Table:
| id  | name        | code       | classId  | teacherId |
|-----|-------------|------------|----------|-----------|
| 1   | Mathematics | MTH001-C1  | class-1  | teacher-1 |
| 2   | Mathematics | MTH001-C2  | class-2  | teacher-2 |
| 3   | Mathematics | MTH001-C3  | class-3  | teacher-1 |
```

**After** (Proposed - Clear):
```
Subjects Table:
| id  | name        | code   | description           |
|-----|-------------|--------|-----------------------|
| 1   | Mathematics | MTH001 | Core mathematics...   |

SubjectAssignments Table:
| id  | subjectId | classId  | teacherId |
|-----|-----------|----------|-----------|
| 1   | 1         | class-1  | teacher-1 |
| 2   | 1         | class-2  | teacher-2 |
| 3   | 1         | class-3  | teacher-1 |
```

## Migration Strategy

### Option 1: Fresh Start (If data not critical)
```bash
# Drop existing data and recreate
npx prisma migrate reset
npx prisma migrate dev --name restructure_subjects
npx prisma db seed  # Re-seed with new structure
```

### Option 2: Data Migration (If data is important)
```sql
-- Step 1: Create new tables
CREATE TABLE SubjectAssignment ...

-- Step 2: Migrate existing data
-- Extract unique subjects first
INSERT INTO Subject_new (name, code, description)
SELECT DISTINCT 
  name,
  SUBSTRING(code, 1, 6) as code,  -- Remove class suffix
  NULL as description
FROM Subject
GROUP BY name;

-- Step 3: Create assignments from old structure
INSERT INTO SubjectAssignment (subjectId, classId, teacherId)
SELECT 
  new_subject.id,
  old_subject.classId,
  old_subject.teacherId
FROM Subject old_subject
JOIN Subject_new new_subject ON old_subject.name = new_subject.name;

-- Step 4: Update foreign keys in ExamSubject, ExamResult
-- Step 5: Drop old Subject table
-- Step 6: Rename Subject_new to Subject
```

### Option 3: Gradual Migration (Safest)
1. Add new tables alongside existing
2. Keep both systems running
3. Migrate data gradually
4. Switch over when verified
5. Remove old tables

## UI Changes Needed

### 1. Subject List Page (`/admin/subjects`)
**Current**: Shows individual subject-class assignments
**New**: Shows unique subjects with class count

```
Before:
- Mathematics (MTH001-C1) - Class 1 - Teacher A
- Mathematics (MTH001-C2) - Class 2 - Teacher B

After:
- Mathematics (MTH001)
  - Taught in 2 classes
  - 2 teachers assigned
```

### 2. Subject Details Page (`/admin/subjects/[id]`)
**Shows**:
- Subject name, code, description
- Table of class assignments:
  | Class | Teacher | Students | Status |
- Statistics: Total classes, total teachers, total students
- Exam usage across all classes

### 3. Subject Form
**New Flow**:
1. Create subject (name, code, description) - ONCE
2. Assign to classes (select class + teacher) - MULTIPLE TIMES

### 4. Class Management
When viewing a class, show:
- List of subjects offered in that class
- Assigned teachers for each subject
- Add/remove subject assignments

## API Changes Needed

### New Endpoints

```typescript
// Create subject (no class/teacher)
POST /api/subjects
Body: { name, code, description }

// Assign subject to class
POST /api/subjects/[id]/assign
Body: { classId, teacherId }

// Remove assignment
DELETE /api/subjects/[id]/assign/[assignmentId]

// Get subject with all assignments
GET /api/subjects/[id]
Response: {
  subject: { name, code, description },
  assignments: [
    { classId, className, teacherId, teacherName }
  ]
}

// Update subject (name, code, description only)
PATCH /api/subjects/[id]
Body: { name?, code?, description? }
```

## Backward Compatibility

### For Exams Module
```typescript
// ExamSubject still references Subject by ID
// No changes needed - works with new structure

// When creating exam, just link to subject ID
// The class is determined by the exam's classId
```

### For Results Module
```typescript
// ExamResult still references Subject by ID
// No changes needed - works with new structure
```

## Implementation Steps

### Phase 1: Schema Update
1. ✅ Update `schema.prisma`
2. ✅ Create migration
3. ✅ Test migration on dev database

### Phase 2: Data Migration
1. ✅ Export existing subject data
2. ✅ Transform to new structure
3. ✅ Import into new tables
4. ✅ Verify data integrity

### Phase 3: API Updates
1. ✅ Update subject CRUD APIs
2. ✅ Create assignment APIs
3. ✅ Update related APIs (exams, classes)
4. ✅ Test all endpoints

### Phase 4: UI Updates
1. ✅ Update subject list page
2. ✅ Update subject details page
3. ✅ Create assignment interface
4. ✅ Update class management
5. ✅ Test user flows

### Phase 5: Testing & Deployment
1. ✅ Integration testing
2. ✅ User acceptance testing
3. ✅ Deploy to production
4. ✅ Monitor for issues

## Estimated Impact

**Database**:
- New table: `SubjectAssignment`
- Modified: `Subject`, `Teacher`, `Class`
- Unchanged: `ExamSubject`, `ExamResult`

**API Routes**:
- Modified: 3 routes
- New: 2 routes
- Unchanged: Exam/Result routes

**UI Pages**:
- Modified: 4 pages
- New: 1 page (assignment interface)
- Unchanged: Exam/Result pages

**Time Estimate**:
- Schema + Migration: 1 hour
- API Updates: 2 hours
- UI Updates: 3 hours
- Testing: 2 hours
- **Total**: ~8 hours

## Recommendation

**Immediate Action**: 
Since this is a fundamental design issue, I recommend implementing this change before the system goes live with real data. The longer we wait, the harder migration becomes.

**Approach**:
Use **Option 1 (Fresh Start)** if you're still in development/testing phase with sample data.

**Next Steps**:
1. Approve schema redesign
2. I'll implement the changes
3. Test thoroughly
4. Provide migration scripts if needed

Would you like me to proceed with this implementation?
