# School Management System

A comprehensive, full-stack school management system built with Next.js, TypeScript, Prisma, and MySQL.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT (Access & Refresh tokens in HTTP-only cookies)
- **Authorization**: Role-Based Access Control (RBAC)
- **UI Components**: Tailwind CSS + shadcn/ui (to be added)

## Features

### Roles
- **ADMIN**: Full system control (student/teacher admission, class management, exams, fees, announcements)
- **TEACHER**: Attendance marking, grade entry, class management, messaging
- **STUDENT**: View results, attendance, announcements, fees, messaging

### Key Modules (In Development)
- ✅ Landing page with role-based login
- ✅ Database schema (User model)
- 🚧 Authentication system
- 🚧 Admin dashboard
- 🚧 Teacher dashboard
- 🚧 Student dashboard
- 🚧 Attendance management
- 🚧 Exam & results management
- 🚧 Fee management
- 🚧 Announcements system
- 🚧 Messaging system

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MySQL database (local or hosted)
- npm or yarn package manager

### Installation

1. **Clone the repository** (or initialize if starting fresh)

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and update with your MySQL connection string
# DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
# Example: DATABASE_URL="mysql://root:password@localhost:3306/school_management"
```

4. **Set up the database**

Make sure your MySQL server is running, then:

```bash
# Generate Prisma Client
npm run db:generate

# Create the database schema (run migrations)
npm run db:migrate

# This will:
# - Create the database if it doesn't exist
# - Apply the schema from prisma/schema.prisma
# - Generate the Prisma Client
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes without migrations (dev only)
- `npm run db:migrate` - Create and apply migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
school_mgmt/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── prisma.config.ts       # Prisma configuration (Prisma 7)
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── admin/            # Admin dashboard
│   │   ├── teacher/          # Teacher dashboard
│   │   ├── student/          # Student dashboard
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Landing page
│   │   └── globals.css       # Global styles
│   ├── components/           # Reusable React components
│   └── lib/                  # Utilities and configurations
│       └── db.ts             # Prisma client singleton
├── .env                      # Environment variables (not in git)
├── .env.example             # Environment variables template
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Database Schema

Currently implemented:

- **User** model with:
  - Email-based authentication
  - Role (ADMIN, TEACHER, STUDENT)
  - Status (ACTIVE, INACTIVE, SUSPENDED)
  - Timestamps

More models will be added in future phases (Student, Teacher, Class, Subject, Exam, Attendance, etc.)

## Development Phases

### ✅ Phase 1: Project Setup (COMPLETED)
- Next.js with TypeScript and App Router
- Tailwind CSS configuration
- Prisma with MySQL
- Basic landing page
- Placeholder dashboards

### 🚧 Phase 2: Authentication (Next)
- Login/logout functionality
- JWT token management
- Protected routes
- Role-based access control

### 🚧 Phase 3: Core Models & Admin Features
- Extended database schema
- Admin CRUD operations
- Student/Teacher admission

### 🚧 Phase 4: Teacher Features
- Attendance marking
- Grade entry
- Class management

### 🚧 Phase 5: Student Features
- Results viewing
- Attendance statistics
- Announcements

### 🚧 Phase 6: Additional Features
- Fee management
- Messaging system
- Reports and analytics

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check DATABASE_URL in .env is correct
- Ensure the database user has proper permissions

### Prisma Client Errors
```bash
# Regenerate the Prisma Client
npm run db:generate
```

### Port Already in Use
```bash
# Kill the process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

## Contributing

This is a school project. Future phases will add more features incrementally.

## License

Private - Educational purposes only.

---

**Built with ❤️ for Springfield Academy**
