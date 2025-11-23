# Phase 3 - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Run Migration (5 minutes)

```bash
# Generate Prisma Client and run migration
npx prisma migrate dev --name init_core_models
```

This creates 5 new tables: Student, Teacher, Class, Section, Subject

### Step 2: Restart Server

```bash
# Stop existing server (Ctrl+C)
# Start fresh
npm run dev
```

### Step 3: Test Admin Pages

1. **Login:** http://localhost:3000/login?role=admin
2. **Dashboard:** http://localhost:3000/admin
3. **Try creating:**
   - A class: Click "Classes" → "+ Add Class"
   - A section: Click "Sections" → "+ Add Section"
   - A subject: Click "Subjects" → "+ Add Subject"

---

## 📋 What's New

### 5 New Admin Pages

| Page | URL | Features |
|------|-----|----------|
| Classes | `/admin/classes` | Create, list, delete classes |
| Sections | `/admin/sections` | Create, list, delete sections |
| Subjects | `/admin/subjects` | Create, list, delete subjects |
| Students | `/admin/students` | List students (read-only) + search |
| Teachers | `/admin/teachers` | List teachers (read-only) |

### Updated Dashboard

- Real-time stats (students, teachers, classes, subjects)
- Quick action cards for navigation
- Clean, professional design

---

## 🎯 Quick Test Workflow

### Create Your First Class

1. Go to `/admin/classes`
2. Click "+ Add Class"
3. Enter:
   - Name: "Grade 6"
   - Order: 6
4. Click "Create Class"

### Create a Section

1. Go to `/admin/sections`
2. Click "+ Add Section"
3. Select: Class = "Grade 6"
4. Enter: Name = "A"
5. Click "Create Section"

### Create a Subject

1. Go to `/admin/subjects`
2. Click "+ Add Subject"
3. Enter:
   - Name: "Mathematics"
   - Code: "MATH6"
   - Class: "Grade 6" (optional)
4. Click "Create Subject"

---

## 🔍 Database Schema

### New Models

- **Student** - Student profiles linked to User
- **Teacher** - Teacher profiles linked to User
- **Class** - School grades/classes (e.g., Grade 6)
- **Section** - Divisions within classes (e.g., A, B, C)
- **Subject** - Academic subjects

### Relationships

```
Class (1) ──> (*) Section ──> (*) Student
      (1) ──> (*) Subject
      (1) ──> (*) Student

Teacher (1) ──> (*) Subject
```

---

## 🛠️ Common Commands

```bash
# Run migration
npx prisma migrate dev --name init_core_models

# View database in GUI
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Start dev server
npm run dev
```

---

## ❓ Troubleshooting

### Migration fails

```bash
# Check database connection
mysql -u root -p

# Verify .env has correct DATABASE_URL
cat .env
```

### Tables not showing

```bash
# Regenerate Prisma Client
npx prisma generate

# Restart server
npm run dev
```

### Can't access admin pages

- Make sure you're logged in as admin
- Check middleware is running
- Clear browser cookies and re-login

---

## 📚 Full Documentation

See `PHASE_3_COMPLETE.md` for:
- Detailed schema documentation
- Complete API reference
- Security implementation
- Testing checklist
- Migration SQL preview

---

## 🎉 Success!

If you can create classes, sections, and subjects, Phase 3 is working!

**Next:** Phase 4 will add student and teacher admission workflows.

---

**Questions?**
- See `PHASE_3_COMPLETE.md` for full details
- Check `TESTING_GUIDE.md` for troubleshooting
- Review `API_REFERENCE.md` for API docs
