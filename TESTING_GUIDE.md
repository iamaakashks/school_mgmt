# Testing Guide - Phase 2 Authentication

This guide will walk you through testing the authentication system step by step.

## Prerequisites

- MySQL server running
- Node.js and npm installed
- Project dependencies installed (`npm install`)

---

## Step 1: Database Setup

### 1.1 Update Your .env File

Make sure your `.env` file has the correct database connection:

```bash
DATABASE_URL="mysql://root:yourpassword@localhost:3306/school_management"
```

Replace `yourpassword` with your MySQL root password.

### 1.2 Run Prisma Migration

This will create the database tables:

```bash
npm run db:migrate
```

**When prompted for migration name, enter:** `add_auth_system`

**Expected output:**
```
Prisma schema loaded from prisma\schema.prisma
Datasource "db": MySQL database "school_management"

√ Enter a name for the new migration: … add_auth_system
Applying migration `20241124XXXXXX_add_auth_system`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20241124XXXXXX_add_auth_system/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v7.0.0)
```

---

## Step 2: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
   ▲ Next.js 16.0.3 (Turbopack)
   - Local:         http://localhost:3000
   - Network:       http://192.168.x.x:3000

 ✓ Starting...
 ✓ Ready in XXXms
```

---

## Step 3: Test Landing Page

1. Open browser: http://localhost:3000
2. You should see the Springfield Academy landing page
3. Verify all three login cards are visible
4. Click "Admin Login" - should go to `/login?role=admin`

**✅ Landing page works - authentication doesn't break existing functionality!**

---

## Step 4: Create Admin User

### Option A: Using curl (Windows PowerShell)

```powershell
curl -X POST http://localhost:3000/api/auth/register-admin `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@springfield.edu\",\"password\":\"admin123456\"}'
```

### Option B: Using curl (Mac/Linux/Git Bash)

```bash
curl -X POST http://localhost:3000/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@springfield.edu","password":"admin123456"}'
```

### Option C: Using Browser DevTools

1. Open http://localhost:3000 in browser
2. Open DevTools (F12)
3. Go to Console tab
4. Paste and run:

```javascript
fetch('/api/auth/register-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@springfield.edu',
    password: 'admin123456'
  })
})
.then(r => r.json())
.then(console.log)
```

### Option D: Using Postman or Thunder Client (VS Code)

- Method: POST
- URL: http://localhost:3000/api/auth/register-admin
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "admin@springfield.edu",
  "password": "admin123456"
}
```

**Expected Response:**
```json
{
  "message": "Admin user created successfully",
  "user": {
    "id": "clxxx...",
    "email": "admin@springfield.edu",
    "role": "ADMIN",
    "status": "ACTIVE",
    "createdAt": "2024-11-24T..."
  }
}
```

**✅ Admin user created!**

---

## Step 5: Test Login

### 5.1 Navigate to Login Page

Go to: http://localhost:3000/login?role=admin

You should see:
- Red/pink gradient admin icon
- "Admin Login" title
- Email and password fields
- "Sign In" button

### 5.2 Enter Credentials

- Email: `admin@springfield.edu`
- Password: `admin123456`

### 5.3 Click "Sign In"

**Expected behavior:**
1. Button shows "Signing in..." with spinner
2. Page redirects to `/admin`
3. You see "Welcome, Administrator" message
4. Header shows "Admin Dashboard" and "Logout" button
5. Quick stats cards show (all zeros for now)
6. Success message: "🎉 Authentication Active!"

**✅ Login works!**

---

## Step 6: Test Protected Routes

### 6.1 Try Accessing Teacher Dashboard

While logged in as Admin, manually navigate to:
http://localhost:3000/teacher

**Expected behavior:**
- Should immediately redirect back to `/admin`
- This proves RBAC is working!

### 6.2 Try Accessing Student Dashboard

Navigate to: http://localhost:3000/student

**Expected behavior:**
- Should immediately redirect back to `/admin`

**✅ RBAC works - users can only access their role's dashboard!**

---

## Step 7: Test Logout

### 7.1 Click Logout Button

In the admin dashboard header, click "Logout"

**Expected behavior:**
1. Button shows "Logging out..."
2. Redirects to `/login`
3. Cookies are cleared

### 7.2 Try Accessing Admin Dashboard

Navigate to: http://localhost:3000/admin

**Expected behavior:**
- Should redirect to `/login`
- This proves you're logged out!

**✅ Logout works!**

---

## Step 8: Test Invalid Login

### 8.1 Try Wrong Password

Go to: http://localhost:3000/login?role=admin

Enter:
- Email: `admin@springfield.edu`
- Password: `wrongpassword`

**Expected behavior:**
- Error message: "Invalid email or password"
- Stays on login page

### 8.2 Try Non-existent User

Enter:
- Email: `fake@example.com`
- Password: `anything`

**Expected behavior:**
- Error message: "Invalid email or password"
- Notice: Same error for security (doesn't reveal if email exists)

**✅ Error handling works!**

---

## Step 9: Create Additional Test Users (Optional)

### Create Teacher User

**Using Browser DevTools Console:**

```javascript
fetch('/api/auth/register-admin', {
  method: 'POST',
  headers: { 'Content-Type': application/json' },
  body: JSON.stringify({
    email: 'teacher@springfield.edu',
    password: 'teacher123456'
  })
})
.then(r => r.json())
.then(data => {
  // Now update the role to TEACHER using Prisma Studio
  console.log('Created user:', data);
  console.log('Run: npm run db:studio');
  console.log('Then change role from ADMIN to TEACHER');
})
```

**Then:**
1. Run `npm run db:studio` in terminal
2. Open Prisma Studio (usually http://localhost:5555)
3. Click "User" table
4. Find the teacher user
5. Change role from "ADMIN" to "TEACHER"
6. Click "Save 1 change"

### Create Student User

Repeat the same process but change role to "STUDENT"

### Test Multi-Role Scenarios

1. **Logout** from admin account
2. **Login** as teacher: `teacher@springfield.edu` / `teacher123456`
3. Verify redirects to `/teacher`
4. Try accessing `/admin` - should redirect back to `/teacher`
5. **Logout** and repeat for student

**✅ Multi-role system works!**

---

## Step 10: Test Token Refresh (Advanced)

### 10.1 Check Cookies

1. Open DevTools (F12)
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Look under Cookies → http://localhost:3000
4. You should see:
   - `access_token` (HttpOnly ✓)
   - `refresh_token` (HttpOnly ✓)

### 10.2 Test Refresh Endpoint

In DevTools Console:

```javascript
fetch('/api/auth/refresh', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
```

**Expected response:**
```json
{
  "message": "Token refreshed successfully",
  "user": {
    "id": "clxxx...",
    "email": "admin@springfield.edu",
    "role": "ADMIN"
  }
}
```

**✅ Token refresh works!**

---

## Step 11: Test /api/auth/me Endpoint

While logged in, in DevTools Console:

```javascript
fetch('/api/auth/me')
  .then(r => r.json())
  .then(console.log)
```

**Expected response:**
```json
{
  "user": {
    "id": "clxxx...",
    "email": "admin@springfield.edu",
    "role": "ADMIN"
  }
}
```

**✅ Current user endpoint works!**

---

## Troubleshooting

### Problem: Migration fails

**Error:** `P1001: Can't reach database server`

**Solution:**
- Check MySQL is running
- Verify DATABASE_URL in .env is correct
- Test connection: `mysql -u root -p`

### Problem: "User already exists"

**Solution:**
- User was already created
- Try logging in with existing credentials
- Or use different email

### Problem: Login doesn't redirect

**Solution:**
- Check browser console for errors
- Verify dev server is running
- Clear cookies and try again

### Problem: Middleware not working

**Solution:**
- Restart dev server (Ctrl+C, then `npm run dev`)
- Clear browser cache
- Check middleware.ts file exists in src/

### Problem: TypeScript errors

**Solution:**
```bash
# Regenerate Prisma Client
npm run db:generate

# Restart TypeScript server in VS Code
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

---

## Testing Checklist

Use this checklist to verify everything works:

- [ ] Landing page loads successfully
- [ ] Can create admin user via API
- [ ] Can navigate to login page
- [ ] Login form shows correct role styling
- [ ] Can login with valid credentials
- [ ] Redirects to correct dashboard after login
- [ ] Dashboard shows user info and logout button
- [ ] Cannot access other role dashboards (RBAC working)
- [ ] Cannot access dashboards when logged out
- [ ] Logout clears cookies and redirects to login
- [ ] Cannot login with wrong password
- [ ] Error messages display correctly
- [ ] Token refresh endpoint works
- [ ] /api/auth/me endpoint returns user info
- [ ] Cookies are HttpOnly (checked in DevTools)
- [ ] Page refresh keeps user logged in

---

## Quick Reference

### Test Credentials

**Admin:**
- Email: `admin@springfield.edu`
- Password: `admin123456`

**Teacher** (if created):
- Email: `teacher@springfield.edu`
- Password: `teacher123456`

**Student** (if created):
- Email: `student@springfield.edu`
- Password: `student123456`

### Important URLs

- Landing: http://localhost:3000
- Login: http://localhost:3000/login
- Admin Dashboard: http://localhost:3000/admin
- Teacher Dashboard: http://localhost:3000/teacher
- Student Dashboard: http://localhost:3000/student

### Useful Commands

```bash
npm run dev              # Start development server
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Prisma Studio GUI
```

---

## Success! 🎉

If all tests pass, your authentication system is fully functional!

You now have:
- ✅ Secure JWT-based authentication
- ✅ Role-based access control
- ✅ Protected routes
- ✅ HTTP-only cookie security
- ✅ Beautiful login UI
- ✅ Complete logout flow

Ready for Phase 3!
