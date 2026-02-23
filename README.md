# Productivity & Workflow Management System

Sebuah aplikasi web fullstack profesional yang dirancang untuk membantu tim dalam mengelola tugas, workflow, approval bertingkat, dan analisis produktivitas berbasis data.

## 🌟 Fitur Utama
- **Authentication & Role System**: Sistem login menggunakan Supabase Auth dengan tiga tingkatan role (Admin, Manager, Member) yang menentukan hak akses data dan wewenang approval.
- **Task Management**: Pengelolaan tugas secara komprehensif (CRUD) dengan status workflow (Pending, In Progress, Review, Completed) dan tingkat prioritas.
- **Smart Priority Engine**: Sistem cerdas yang menyesuaikan prioritas tugas secara otomatis berdasarkan kedekatan deadline (≤ 2 hari) dan durasi tugas yang belum dimulai.
- **Multi-Level Approval**: Workflow persetujuan bertingkat di mana tugas tertentu memerlukan validasi dari Manager atau Admin sebelum dinyatakan selesai.
- **Activity Log System**: Pencatatan transparan untuk setiap aktivitas sistem (Audit Trail) yang mencatat user, aksi, target, dan waktu kejadian.
- **Dashboard Analytics**: Visualisasi data produktivitas menggunakan Chart.js, mencakup distribusi status tugas dan grafik penyelesaian mingguan.
- **Task Discussion**: Fitur komentar pada setiap tugas untuk mendukung kolaborasi tim secara langsung.
- **Row Level Security (RLS)**: Keamanan tingkat database yang memastikan privasi dan integritas data berdasarkan profil pengguna.

## 🛠️ Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS, Lucide React, Chart.js.
- **Backend**: Supabase (PostgreSQL, Auth, RLS).
- **Logic**: Smart Priority Engine di sisi client dan Activity Logging via PostgreSQL Triggers.

## 🏗️ Arsitektur Folder
- `/app`: Routing utama aplikasi (Dashboard, Tasks, Approvals, Logs, Login).
- `/components`: Komponen UI modular (Charts, Modals, Cards, Sidebar, Navbar).
- `/utils`: Konfigurasi Supabase, middleware, dan helper logika bisnis.
- `/supabase`: SQL Schema, definisi Enum, dan kebijakan RLS.
- `/types`: Definisi tipe data TypeScript untuk konsistensi sistem.

## 📊 Database Schema
Sistem menggunakan PostgreSQL dengan struktur relasional:
- `profiles`: Data pengguna dan role.
- `tasks`: Entitas tugas utama.
- `approvals`: Riwayat persetujuan tugas.
- `activity_logs`: Log audit sistem.
- `task_comments`: Data diskusi pada tugas.
