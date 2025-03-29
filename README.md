# Orbis TON Frontend

A Next.js application for collecting applications to migrate users from Orbis to TON.

Uses Next.js for server and frontend.
Uses Prisma as the database ORM.

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- PostgreSQL database

## Getting Started

1. Install pnpm if not installed:
```bash
npm i -g pnpm
```

2. Clone the repository:
```bash
git clone https://github.com/qwadratic/orbis-ton-migration-form
cd orbis-ton-migration-form
```

1. Install dependencies:
```bash
pnpm i
```

1. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# For seedphrase encryption
ENCRYPTION_KEY="secure-encryption-key"
```

5. Set up the database:
```bash
# Generate Prisma client
pnpm prisma generate

# Push the schema to the database
pnpm prisma db push
```

6. Run the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
orbis-ton-frontend/
├── app/                    # Next.js app directory
├── components/            # React components
├── lib/                   # Utility functions and shared code
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── scripts/              # Utility scripts
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm export` - Export applications to CSV
