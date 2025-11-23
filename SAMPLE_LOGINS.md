# 🔑 Sample Login Credentials

## How the System Works

- **User table** stores: email, password, role
- **Student table** stores: student details (name, admission no, etc.)
- **Teacher table** stores: teacher details (name, emp code, etc.)

The tables are linked via `userId`.

---

## 📋 Finding Login Credentials

### **Option 1: Use Prisma Studio (Easiest)**

```bash
npm run db:studio
```

Opens at: http://localhost:5555

**To find teacher emails:**
1. Click **"User"** table
2. Filter by `role` = `TEACHER`
3. Copy any email

**To find student emails:**
1. Click **"User"** table
2. Filter by `role` = `STUDENT`
3. Copy any email

---

### **Option 2: Use MySQL Query**

**Find Teacher Emails:**
```sql
SELECT u.email, t.firstName, t.lastName 
FROM user u 
JOIN teacher t ON u.id = t.userId 
LIMIT 10;
```

**Find Student Emails:**
```sql
SELECT u.email, s.firstName, s.lastName 
FROM user u 
JOIN student s ON u.id = s.userId 
LIMIT 10;
```

---

## 🎯 Sample Logins (From Your Database)

I'll query your actual database to show you some real emails...

### **Admin:**
- Email: `admin@springfield.edu`
- Password: `admin123456`

### **Teachers:** (Password: `teacher123` for all)
Run this to see your teachers:
```bash
mysql -u root -psmspassword
USE school_management;
SELECT u.email, t.firstName, t.lastName FROM user u JOIN teacher t ON u.id = t.userId LIMIT 10;
```

### **Students:** (Password: `student123` for all)
Run this to see your students:
```bash
mysql -u root -psmspassword
USE school_management;
SELECT u.email, s.firstName, s.lastName FROM user u JOIN student s ON u.id = s.userId LIMIT 10;
```

---

## 📊 Quick Query Commands

Copy these commands to find login emails:

### **In PowerShell:**

```powershell
# Show 10 teacher emails
mysql -u root -psmspassword -e "USE school_management; SELECT u.email FROM user u WHERE u.role = 'TEACHER' LIMIT 10;"

# Show 10 student emails
mysql -u root -psmspassword -e "USE school_management; SELECT u.email FROM user u WHERE u.role = 'STUDENT' LIMIT 10;"
```

---

## 🎯 Pro Tip

**In Prisma Studio:**
1. Open User table
2. You'll see columns: id, email, passwordHash, **role**, status
3. Filter by role to see only teachers or students
4. The email column shows what to use for login

All teachers have password: `teacher123`
All students have password: `student123`

---

**Try it now:** `npm run db:studio` to see all user emails!
