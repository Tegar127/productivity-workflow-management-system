# Setup Guide: Productivity & Workflow Management System

## 1. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in the Supabase Dashboard.
3. Copy the contents of `supabase/schema.sql` and run it. This will create all tables, enums, RLS policies, and triggers.

## 2. Environment Variables
1. Rename `.env.local.example` to `.env.local`.
2. Fill in your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase Project Settings (API tab).

## 3. Installation
```bash
npm install
```

## 4. Running the App
```bash
npm run dev
```

## 5. Usage
- Go to `http://localhost:3000/login`.
- **Register** a new account. You can choose a role (Admin, Manager, Member).
- **Admin/Manager** can see the Approvals page.
- **Member** can manage their tasks.
- Priority will automatically adjust based on the "Smart Priority Engine" logic.

## 6. Project Structure
- `app/(dashboard)`: Protected routes using a shared layout with Sidebar and Navbar.
- `components/`: Reusable UI components (TaskCard, Charts, etc.).
- `utils/supabase/`: Supabase client configurations (SSR support).
- `types/`: TypeScript definitions.
- `utils/taskHelpers.ts`: Smart priority logic.
