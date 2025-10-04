# NextApp - Modular Dashboard Platform

A modern, modular dashboard platform inspired by Odoo, built with Next.js 15, TypeScript, and tRPC. This project allows users to install and manage multiple applications from a central hub, with each app maintaining consistent infrastructure while providing unique functionality.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![tRPC](https://img.shields.io/badge/tRPC-11-2596be)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## 🚀 Features

### ✅ Implemented (Phase 1)

- **Authentication System**
  - Email/password login with NextAuth.js
  - Google OAuth integration
  - Secure password hashing with bcrypt
  - Session management with JWT

- **User Management**
  - Role-based access control (USER, ADMIN, SUPER_ADMIN)
  - User CRUD operations (admin only)
  - User status management (Active, Inactive, Suspended)
  - Activity logging for audit trails

- **Dashboard**
  - Responsive sidebar navigation
  - Modern UI with Tailwind CSS
  - Statistics cards and quick actions
  - Activity feed

- **App Registry Foundation**
  - Database schema for app definitions
  - App installation tracking
  - App marketplace UI placeholder

- **Type-Safe APIs**
  - tRPC for end-to-end type safety
  - Automatic API documentation through types
  - React Query integration for data fetching

### 🚧 Coming Soon (Phase 2+)

- App installation/uninstallation system
- Dynamic routing for installed apps
- First demo apps (CRM, Project Management, Inventory)
- Inter-app communication
- Advanced analytics
- Webhook system

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **API:** tRPC for type-safe APIs
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS 4
- **UI Components:** Custom components with Heroicons
- **State Management:** React Query (via tRPC)

## 📦 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd next15-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Update `.env` with your database credentials and secrets.

4. **Start the database (using Docker)**
   ```bash
   docker compose up -d
   ```

5. **Run migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Seed the database (optional)**
   ```bash
   npm run db:seed
   ```
   
   This creates:
   - Admin user: `admin@example.com` / `admin123`
   - Regular user: `user@example.com` / `user123`

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open in browser**
   Visit [http://localhost:3000](http://localhost:3000)

For detailed setup instructions, see [SETUP.md](./SETUP.md).

## 📖 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete system architecture and roadmap
- **[SETUP.md](./SETUP.md)** - Detailed setup and development guide

## 🏗️ Project Structure

```
next15-portfolio/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts            # Database seed script
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── api/          # API routes (NextAuth, tRPC)
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # Dashboard pages
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   │   ├── layout/      # Layout components
│   │   ├── ui/          # Reusable UI components
│   │   └── users/       # User management components
│   ├── lib/             # Utility libraries
│   │   ├── auth.ts      # NextAuth configuration
│   │   ├── db.ts        # Prisma client
│   │   └── trpc.ts      # tRPC setup
│   ├── server/          # Server-side code
│   │   └── routers/     # tRPC routers
│   └── types/           # TypeScript definitions
├── ARCHITECTURE.md      # System architecture
├── SETUP.md            # Setup guide
└── package.json        # Dependencies
```

## 🎯 Key Concepts

### Modular App System

The platform is designed around a modular architecture where:

1. **Core System** provides authentication, user management, and app infrastructure
2. **App Registry** maintains a catalog of available apps
3. **Installed Apps** are tracked per-user with custom settings
4. **Consistent Infrastructure** ensures all apps use the same tech stack

### Role-Based Access Control

Three user roles with different permissions:

- **USER** - Basic access to installed apps
- **ADMIN** - User management and app administration
- **SUPER_ADMIN** - Full system access

### Type Safety

End-to-end type safety from database to frontend:

```typescript
// Define once in the backend
export const userRouter = router({
  getAll: adminProcedure.query(async () => {
    return await db.user.findMany();
  }),
});

// Use with full type inference in the frontend
const { data: users } = trpc.user.getAll.useQuery();
// users is fully typed!
```

## 🔧 Development

### Database Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Reset database
npm run db:reset

# Seed database
npm run db:seed
```

### Code Quality

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## 🎨 Screenshots

### Dashboard
Modern, responsive dashboard with sidebar navigation and statistics cards.

### User Management
Comprehensive user management with role assignment and status control.

### App Marketplace
Browse and install apps to extend your workspace functionality.

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome!

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

Built with amazing open-source tools:
- [Next.js](https://nextjs.org/)
- [tRPC](https://trpc.io/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/)

## 📧 Contact

For questions or feedback about this project, please open an issue or reach out through the repository.

---

**Note:** This is an active development project. Features are being added regularly. Check [ARCHITECTURE.md](./ARCHITECTURE.md) for the complete roadmap.
