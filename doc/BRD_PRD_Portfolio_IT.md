# Business Requirements Document (BRD)

## Aplikasi Portfolio IT

### Informasi Dokumen

  Item          Keterangan
  ------------- ----------------------
  Nama Proyek   Portfolio IT
  Versi         1.0
  Tanggal       03 Juli 2026
  Pemilik       I Kadek Agga Sugitha
  Status        Draft

## Latar Belakang

Seorang profesional di bidang Teknologi Informasi membutuhkan media
digital yang dapat memperlihatkan identitas profesional, pengalaman
kerja, proyek, kemampuan teknis, sertifikasi, serta informasi kontak
dalam satu platform yang mudah diakses.

## Tujuan Bisnis

-   Membangun personal branding.
-   Menampilkan pengalaman kerja.
-   Menampilkan proyek.
-   Menampilkan skill.
-   Menampilkan sertifikasi.
-   Memudahkan recruiter dan client mengenal profil.

## Stakeholder

-   Administrator (Pemilik Portfolio)
-   Recruiter
-   HRD
-   Client

## Ruang Lingkup

### In Scope

-   Landing Page
-   About
-   Experience
-   Skills
-   Projects
-   Certificates
-   Contact
-   Download CV
-   Admin Dashboard

### Out of Scope

-   Marketplace
-   Chat realtime
-   Pembayaran

## Business Requirements

-   Sistem menampilkan profil profesional.
-   Sistem menampilkan pengalaman kerja.
-   Sistem menampilkan proyek.
-   Sistem menampilkan skill.
-   Sistem menampilkan sertifikasi.
-   Visitor dapat mengunduh CV.
-   Admin dapat mengelola seluruh data portfolio.

------------------------------------------------------------------------

# Product Requirements Document (PRD)

## User Persona

### Recruiter

-   Melihat pengalaman kerja.
-   Download CV.

### Client

-   Melihat proyek.
-   Menghubungi pemilik.

### Administrator

-   Mengelola seluruh data portfolio.

## Sitemap

``` text
Home
├── About
├── Experience
├── Skills
├── Projects
│   ├── Detail Project
│   └── Gallery
├── Certificates
├── Contact
└── Download CV

Admin
├── Login
├── Dashboard
├── Profile
├── Experience
├── Projects
├── Skills
├── Certificates
├── Messages
└── Settings
```

## Functional Requirements

-   Login Admin
-   CRUD Profile
-   CRUD Experience
-   CRUD Skills
-   CRUD Projects
-   CRUD Certificates
-   Contact Form
-   Download CV
-   Search & Filter Project

## Non Functional Requirements

  Kategori        Requirement
  --------------- -------------------------
  Response Time   \< 2 detik
  Availability    99%
  Security        HTTPS + JWT
  Responsive      Desktop, Tablet, Mobile
  Database        MySQL / PostgreSQL
  API             REST API

## Acceptance Criteria

### Login

-   Username dan password valid.
-   Session aman.

### Tambah Project

-   Semua field wajib diisi.
-   Screenshot berhasil diunggah.
-   Data tampil di halaman publik.

### Contact

-   Email valid.
-   Pesan berhasil dikirim.

## Struktur Database

-   users
-   profile
-   experiences
-   skills
-   projects
-   project_images
-   certificates
-   messages
-   settings

## Teknologi

-   Frontend: React / Next.js
-   Backend: Laravel / Spring Boot
-   Database: MySQL / PostgreSQL
-   Deployment: Docker + Nginx
-   Version Control: Git
