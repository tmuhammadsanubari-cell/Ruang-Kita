Berikut adalah draf dokumentasi **README.md** untuk proyek **RuangKita** berdasarkan struktur file dan kode yang Anda berikan:

---

# RuangKita - Campus Facility Reservation App

RuangKita adalah aplikasi berbasis web yang dirancang untuk mempermudah proses pemesanan fasilitas di lingkungan kampus. Aplikasi ini menyediakan platform terpusat bagi mahasiswa untuk melihat ketersediaan ruangan dan bagi admin untuk mengelola pemesanan secara efisien.

## Fitur Utama

### 1. Peran Pengguna (User)

* **Eksplorasi Fasilitas**: Menjelajahi daftar fasilitas kampus yang tersedia.
* **Detail Fasilitas**: Melihat informasi mendalam mengenai fasilitas tertentu sebelum melakukan pemesanan.
* **Manajemen Reservasi**: Melakukan pemesanan dan memantau status reservasi pribadi melalui halaman "My Reservations".
* **Notifikasi Real-time**: Mendapatkan pemberitahuan instan ketika status reservasi disetujui atau ditolak oleh admin.

### 2. Peran Admin

* **Dashboard Admin**: Ringkasan aktivitas dan statistik penggunaan fasilitas.
* **Kelola Fasilitas**: Menambah, mengubah, atau menghapus data fasilitas kampus.
* **Kelola Reservasi**: Meninjau permohonan pemesanan, memberikan persetujuan, atau penolakan disertai catatan admin.

### 3. Keamanan & Otentikasi

* Sistem pendaftaran dan masuk (Login/Register) yang aman.
* Otentikasi berbasis peran (Role-based Access Control) untuk membedakan akses antara User dan Admin.

## Teknologi yang Digunakan

Proyek ini dibangun menggunakan modern tech stack berikut:

* **Framework**: [React 18.3](https://reactjs.org/)
* **Build Tool**: [Vite](https://vitejs.dev/)
* **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
* **Backend & Database**: [Supabase](https://supabase.com/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) (menggunakan `class-variance-authority` dan `tailwind-merge`)
* **Komponen UI**: [Radix UI](https://www.radix-ui.com/) (Accordion, Dialog, Popover, dll.)
* **Ikon**: [Lucide React](https://lucide.dev/)
* **Animasi**: [Framer Motion](https://www.framer.com/motion/)
* **Form Management**: [React Hook Form](https://react-hook-form.com/)

## Struktur Proyek Singkat

* `src/controllers/`: Berisi `AuthContext` dan `DataContext` untuk manajemen state global.
* `src/views/`: Berisi halaman utama aplikasi (Home, Admin Dashboard, Login, dll.).
* `src/components/`: Komponen UI yang dapat digunakan kembali, termasuk Navbar dan sistem notifikasi.
* `src/models/`: Pendefinisian tipe data TypeScript.

## Cara Menjalankan Proyek

1. **Instalasi Dependensi**:
```bash
npm install

```


2. **Menjalankan Mode Pengembangan**:
```bash
npm run dev

```


3. **Membangun untuk Produksi**:
```bash
npm run build

```


4. **Pratinjau Hasil Build**:
```bash
npm run preview

```
