# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Docker to run PostgreSQL)
- Git

## Initial Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd next15-portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Copy the example environment file:

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

```env
# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# NextAuth - Generate a secret: https://generate-secret.vercel.app/32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-jwt-secret-key-here-make-it-long-and-random"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 4. Start PostgreSQL Database

#### Option A: Using Docker (Recommended)

```bash
docker compose up -d
```

This will start a PostgreSQL database on `localhost:5432` with:
- Database: `next15`
- Username: `postgres`
- Password: `postgres`

#### Option B: Use Existing PostgreSQL

Update the `DATABASE_URL` in your `.env` file to point to your PostgreSQL instance.

### 5. Run Database Migrations

```bash
npx prisma migrate dev
```

This will:
- Create the database schema
- Generate the Prisma Client

### 6. Seed the Database (Optional)

Create an admin user and sample data:

```bash
npm run db:seed
```

Default admin credentials:
- Email: `admin@example.com`
- Password: `admin123`
- Role: `SUPER_ADMIN`

**⚠️ Change these credentials in production!**

### 7. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Commands

### Reset Database

```bash
npx prisma migrate reset
```

This will:
- Drop the database
- Recreate the database
- Run all migrations
- Run seed script (if configured)

### View Database in Prisma Studio

```bash
npx prisma studio
```

Opens a visual database editor at [http://localhost:5555](http://localhost:5555)

### Generate Prisma Client

After schema changes:

```bash
npx prisma generate
```

### Create a New Migration

After modifying `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name your_migration_name
```

## Project Structure

```
next15-portfolio/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── api/              # API routes
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # Dashboard pages
│   │   └── layout.tsx        # Root layout
│   ├── components/           # React components
│   │   ├── layout/          # Layout components
│   │   ├── navigation/      # Navigation components
│   │   ├── ui/              # UI components
│   │   └── users/           # User management components
│   ├── lib/                 # Utility libraries
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── db.ts            # Prisma client
│   │   └── trpc.ts          # tRPC configuration
│   ├── server/              # Server-side code
│   │   └── routers/         # tRPC routers
│   └── types/               # TypeScript type definitions
├── .env                     # Environment variables (create from env.example)
├── docker-compose.yml       # Docker configuration for PostgreSQL
└── package.json             # Project dependencies
```

## Features Implemented

### ✅ Phase 1: Foundation (Completed)

- [x] Next.js 15 with App Router
- [x] TypeScript configuration
- [x] Tailwind CSS styling
- [x] NextAuth.js authentication (credentials & Google OAuth)
- [x] tRPC for type-safe APIs
- [x] Prisma ORM with PostgreSQL
- [x] User registration and login
- [x] Dashboard layout with sidebar navigation
- [x] User management system (admin only)
- [x] Role-based access control (USER, ADMIN, SUPER_ADMIN)
- [x] Activity logging
- [x] App registry foundation

### 🚧 Next Steps (Phase 2)

- [ ] App installation/uninstallation system
- [ ] Dynamic routing for apps
- [ ] App marketplace UI
- [ ] First demo app (CRM or Project Management)

## Development Workflow

### Creating a New Page

1. Create a new file in `src/app/your-route/page.tsx`
2. Use the dashboard layout if needed (create in a subfolder of `dashboard/`)
3. Implement your page component
4. Add navigation link in `src/components/layout/DashboardLayout.tsx`

### Creating a New tRPC Router

1. Create a new file in `src/server/routers/your-router.ts`
2. Define your procedures
3. Import and add to the main router in `src/server/index.ts`

### Adding a New Database Model

1. Update `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add_your_model`
3. Prisma Client will be automatically regenerated

## Troubleshooting

### Database Connection Issues

If you can't connect to the database:

1. Check if PostgreSQL is running: `docker ps` (if using Docker)
2. Verify your `DATABASE_URL` in `.env`
3. Try connecting with a database client to verify credentials

### Migration Issues

If migrations fail:

```bash
# Reset everything and start fresh
npx prisma migrate reset
npx prisma generate
```

### Port Already in Use

If port 3000 is already in use:

```bash
# Run on a different port
npm run dev -- -p 3001
```

## Production Deployment

### Environment Variables

Set these in your production environment:

- `DATABASE_URL` - Production PostgreSQL connection string
- `NEXTAUTH_SECRET` - Strong random secret (32+ characters)
- `NEXTAUTH_URL` - Your production domain
- `GOOGLE_CLIENT_ID` - (Optional) For Google OAuth
- `GOOGLE_CLIENT_SECRET` - (Optional) For Google OAuth

### Build and Start

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

For issues or questions, please refer to `ARCHITECTURE.md` for the overall system design and planned features.
