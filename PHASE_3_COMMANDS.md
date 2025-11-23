# Phase 3 - Command Reference

Quick reference for all commands needed for Phase 3.

---

## 🚀 Initial Setup

### Run the Migration

```bash
npx prisma migrate dev --name init_core_models
```

**What this does:**
- Creates 5 new database tables
- Applies schema changes to MySQL
- Regenerates Prisma Client automatically

**Expected output:**
```
✔ Generated migration name: 20241124XXXXXX_init_core_models
Applying migration `20241124XXXXXX_init_core_models`
Your database is now in sync with your schema.
✔ Generated Prisma Client
```

---

## 🛠️ Development Commands

### Start Development Server

```bash
npm run dev
```

Server will start on: http://localhost:3000

### View Database (GUI)

```bash
npm run db:studio
```

Opens Prisma Studio at: http://localhost:5555

### Generate Prisma Client

```bash
npm run db:generate
```

Use this if you modify schema without running migration.

---

## 🔍 Verification Commands

### Check Database Tables

```bash
# Connect to MySQL
mysql -u root -p

# Show all tables
USE school_management;
SHOW TABLES;

# Verify specific table
DESCRIBE Student;
DESCRIBE Teacher;
DESCRIBE Class;
DESCRIBE Section;
DESCRIBE Subject;

# Exit MySQL
EXIT;
```

### Check Prisma Schema

```bash
# Validate schema syntax
npx prisma validate

# Format schema file
npx prisma format
```

---

## 🌐 Testing URLs

### Admin Pages

| Page | URL |
|------|-----|
| Dashboard | http://localhost:3000/admin |
| Classes | http://localhost:3000/admin/classes |
| Sections | http://localhost:3000/admin/sections |
| Subjects | http://localhost:3000/admin/subjects |
| Students | http://localhost:3000/admin/students |
| Teachers | http://localhost:3000/admin/teachers |

### Login

```
http://localhost:3000/login?role=admin
```

---

## 🧹 Cleanup Commands

### Clear Next.js Cache

```bash
# Windows PowerShell
Remove-Item -Path .next -Recurse -Force

# Mac/Linux
rm -rf .next
```

### Stop All Node Processes

```bash
# Windows PowerShell
Get-Process -Name node | Stop-Process -Force

# Mac/Linux
pkill node
```

### Reset Database (⚠️ DESTRUCTIVE)

```bash
# This will delete ALL data and re-run all migrations
npx prisma migrate reset
```

---

## 📊 Data Management

### View Data in Database

```bash
# Option 1: Prisma Studio (recommended)
npm run db:studio

# Option 2: MySQL CLI
mysql -u root -p
USE school_management;
SELECT * FROM Class;
SELECT * FROM Section;
SELECT * FROM Subject;
```

### Count Records

```bash
mysql -u root -p
USE school_management;
SELECT COUNT(*) FROM Student;
SELECT COUNT(*) FROM Teacher;
SELECT COUNT(*) FROM Class;
SELECT COUNT(*) FROM Section;
SELECT COUNT(*) FROM Subject;
```

---

## 🐛 Troubleshooting Commands

### Prisma Issues

```bash
# Regenerate client
npx prisma generate

# Check for drift between schema and database
npx prisma migrate status

# Reset and re-apply migrations
npx prisma migrate reset
npx prisma migrate dev
```

### Database Connection Issues

```bash
# Test MySQL connection
mysql -u root -p

# Check if database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'school_management';"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE school_management;"
```

### TypeScript Errors

```bash
# Check for TypeScript errors
npx tsc --noEmit

# If using VS Code, restart TS server
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Port Already in Use

```bash
# Windows PowerShell - Find process on port 3000
netstat -ano | findstr :3000

# Kill process by PID
Stop-Process -Id <PID> -Force

# Or kill all node processes
Get-Process -Name node | Stop-Process -Force

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

---

## 🔄 Rollback Commands

### Undo Last Migration

```bash
# View migration history
npx prisma migrate status

# Rollback to previous migration (manual process)
# 1. Delete last migration folder
# 2. Run migrate dev again
```

### Reset to Clean State

```bash
# DANGER: This deletes ALL data
npx prisma migrate reset

# Then re-run migrations
npx prisma migrate dev
```

---

## 📦 Package Management

### Install Dependencies

```bash
npm install
```

### Add New Dependencies

```bash
# Example: Add a new library
npm install <package-name>

# Add as dev dependency
npm install -D <package-name>
```

### Update Prisma

```bash
npm install @prisma/client@latest
npm install -D prisma@latest
npx prisma generate
```

---

## 🧪 Testing Commands

### Quick Test Workflow

```bash
# 1. Start server
npm run dev

# 2. In another terminal, check if server is up
curl http://localhost:3000

# 3. Open Prisma Studio to view data
npm run db:studio

# 4. Check database directly
mysql -u root -p
USE school_management;
SELECT * FROM Class;
```

---

## 📝 Log Commands

### View Server Logs

```bash
# Server logs appear in terminal where you ran:
npm run dev

# To save logs to file (Windows PowerShell)
npm run dev 2>&1 | Tee-Object -FilePath server.log

# Mac/Linux
npm run dev 2>&1 | tee server.log
```

### View Database Query Logs

Prisma logs queries when `log` option is set in `src/lib/db.ts`:

```typescript
new PrismaClient({
  log: ['query', 'error', 'warn'],
})
```

---

## 🎯 Quick Command Cheatsheet

```bash
# Most common commands for Phase 3

# 1. Run migration (first time)
npx prisma migrate dev --name init_core_models

# 2. Start server
npm run dev

# 3. View database
npm run db:studio

# 4. Regenerate client (if needed)
npm run db:generate

# 5. Check database tables
mysql -u root -p -e "USE school_management; SHOW TABLES;"
```

---

## 🔐 Database Credentials

Your `.env` file should have:

```bash
DATABASE_URL="mysql://root:yourpassword@localhost:3306/school_management"
```

To test connection:

```bash
mysql -h localhost -P 3306 -u root -p school_management
```

---

## 💡 Pro Tips

### Create Alias (Optional)

**Windows PowerShell:**
```powershell
# Add to your PowerShell profile
Set-Alias pstudio "npx prisma studio"
Set-Alias pmigrate "npx prisma migrate dev"
```

**Mac/Linux (Bash/Zsh):**
```bash
# Add to .bashrc or .zshrc
alias pstudio="npx prisma studio"
alias pmigrate="npx prisma migrate dev"
```

### Watch Mode for Development

```bash
# Server auto-restarts on file changes (Next.js does this by default)
npm run dev
```

### Quick Database Check

```bash
# One-liner to check all table counts
mysql -u root -p -e "USE school_management; SELECT 'Student' as tbl, COUNT(*) as cnt FROM Student UNION SELECT 'Teacher', COUNT(*) FROM Teacher UNION SELECT 'Class', COUNT(*) FROM Class UNION SELECT 'Section', COUNT(*) FROM Section UNION SELECT 'Subject', COUNT(*) FROM Subject;"
```

---

## 📞 Common Issues & Fixes

### Issue: Migration fails

```bash
# Solution 1: Check database connection
mysql -u root -p

# Solution 2: Verify DATABASE_URL
cat .env | grep DATABASE_URL

# Solution 3: Reset and retry
npx prisma migrate reset
npx prisma migrate dev
```

### Issue: Tables not visible

```bash
# Solution: Regenerate and restart
npx prisma generate
# Restart dev server
```

### Issue: TypeScript errors

```bash
# Solution: Regenerate Prisma Client
npx prisma generate
# Restart VS Code TypeScript server
```

---

## 🎉 Success Indicators

You know Phase 3 is working when:

```bash
# ✓ Migration succeeds
npx prisma migrate dev --name init_core_models
# Output: "Your database is now in sync"

# ✓ Server starts without errors
npm run dev
# Output: "Ready in XXXms"

# ✓ Can access admin pages
curl http://localhost:3000/admin
# Output: HTTP 200 OK

# ✓ Database has all tables
mysql -u root -p -e "USE school_management; SHOW TABLES;"
# Output: Lists all 6 tables (User + 5 new)
```

---

This command reference covers all operations you'll need for Phase 3!
