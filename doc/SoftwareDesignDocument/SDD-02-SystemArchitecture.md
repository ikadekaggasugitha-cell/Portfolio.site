# SDD-02-SystemArchitecture.md

# Software Design Document (SDD)

# Chapter 2
# System Architecture

Version : 1.0

Project :

Portfolio IT

---

# 1. Overview

Bab ini menjelaskan arsitektur sistem aplikasi Portfolio IT, hubungan antar komponen, alur komunikasi, serta tanggung jawab masing-masing layer.

Aplikasi menggunakan pendekatan **Three-Tier Architecture** yang dipadukan dengan **Layered Architecture** sehingga mudah dikembangkan, diuji, dan dipelihara.

---

# 2. Architecture Goals

Tujuan arsitektur sistem adalah:

- Modular
- Maintainable
- Scalable
- Secure
- Testable
- Reusable
- High Performance

---

# 3. High Level Architecture

```text
                    +----------------------+
                    |      Web Browser     |
                    | Chrome / Edge/Safari |
                    +----------+-----------+
                               |
                               |
                         HTTPS / TLS
                               |
                               ▼
+-------------------------------------------------------------+
|                     Frontend Application                    |
|                     React / Next.js                         |
|-------------------------------------------------------------|
| Pages                                                       |
| Components                                                  |
| Hooks                                                       |
| State Management                                            |
| API Service                                                 |
+----------------------------+--------------------------------+
                             |
                        REST API
                             |
                             ▼
+-------------------------------------------------------------+
|                    Backend Application                      |
|                       Laravel 12                            |
|-------------------------------------------------------------|
| Authentication                                              |
| Controllers                                                 |
| Middleware                                                  |
| Services                                                    |
| Repositories                                                |
| Models                                                      |
+----------------------------+--------------------------------+
                             |
                       Eloquent ORM
                             |
                             ▼
+-------------------------------------------------------------+
|                         MySQL                               |
|-------------------------------------------------------------|
| Users                                                       |
| Profile                                                     |
| Projects                                                    |
| Skills                                                      |
| Experiences                                                 |
| Certificates                                                |
| Messages                                                    |
+-------------------------------------------------------------+
```

---

# 4. Three Tier Architecture

Sistem dibagi menjadi tiga lapisan utama.

## 4.1 Presentation Layer

Komponen:

- React
- Next.js
- Tailwind CSS

Tanggung jawab:

- Menampilkan halaman.
- Mengelola navigasi.
- Validasi input sederhana.
- Mengirim request ke REST API.

---

## 4.2 Business Layer

Komponen:

- Laravel
- Service Layer
- Repository Layer

Tanggung jawab:

- Menjalankan business logic.
- Validasi request.
- Authentication.
- Authorization.
- Mengelola transaksi database.

---

## 4.3 Data Layer

Komponen:

- MySQL

Tanggung jawab:

- Penyimpanan data.
- Query.
- Indexing.
- Constraint.
- Transaction.

---

# 5. Layer Architecture

```text
Presentation Layer

↓

Controller Layer

↓

Service Layer

↓

Repository Layer

↓

Database Layer
```

Setiap layer memiliki tanggung jawab yang berbeda sehingga perubahan pada satu layer tidak memengaruhi layer lain secara langsung.

---

# 6. Request Flow

```text
Browser

↓

React Component

↓

API Service

↓

REST API

↓

Middleware JWT

↓

Controller

↓

Service

↓

Repository

↓

Database

↓

Repository

↓

Service

↓

Controller

↓

JSON Response

↓

Frontend

↓

User
```

---

# 7. Authentication Flow

```text
User Login

↓

POST /login

↓

Validate Request

↓

Authenticate User

↓

Generate JWT

↓

Return Token

↓

Store Token

↓

Authorization Header

↓

Protected API
```

---

# 8. Component Responsibility

## Frontend

Bertanggung jawab untuk:

- Rendering UI.
- Routing.
- Form Validation.
- API Communication.
- Session Management.

---

## Backend

Bertanggung jawab untuk:

- Authentication.
- CRUD.
- Validation.
- File Upload.
- Logging.
- Security.

---

## Database

Bertanggung jawab untuk:

- Penyimpanan data.
- Query.
- Constraint.
- Transaction.

---

# 9. External Services

Sistem dapat terhubung dengan:

GitHub

Digunakan untuk membuka repository project.

LinkedIn

Digunakan menuju profil profesional.

Google Drive

Opsional untuk penyimpanan CV.

Email SMTP

Mengirim notifikasi Contact Form.

---

# 10. Design Principles

Arsitektur mengikuti prinsip:

### Single Responsibility Principle

Satu class hanya memiliki satu tanggung jawab.

---

### Separation of Concern

Business Logic dipisahkan dari UI.

---

### Dependency Injection

Dependency diberikan melalui constructor.

---

### DRY

Don't Repeat Yourself.

---

### KISS

Keep It Simple.

---

### SOLID

- S
- O
- L
- I
- D

---

# 11. Advantages

Arsitektur ini memiliki keuntungan:

- Mudah dikembangkan.
- Mudah diuji.
- Mudah dipelihara.
- Mendukung CI/CD.
- Cocok untuk tim besar.
- Mudah menambahkan fitur baru.

---

# 12. Limitations

Beberapa keterbatasan:

- Membutuhkan struktur project yang disiplin.
- Layer lebih banyak dibanding aplikasi sederhana.
- Sedikit lebih kompleks untuk project kecil.

---

# 13. Future Architecture

Apabila aplikasi berkembang, arsitektur dapat ditingkatkan menjadi:

```text
Browser

↓

Load Balancer

↓

Frontend Cluster

↓

API Gateway

↓

Authentication Service

↓

Portfolio Service

↓

Media Service

↓

Notification Service

↓

Redis Cache

↓

MySQL Cluster

↓

Object Storage
```

Dengan pendekatan tersebut aplikasi dapat berkembang menuju arsitektur microservices.

---

# 14. Architecture Decision Record (ADR)

| Decision | Reason |
|----------|--------|
| REST API | Mudah diintegrasikan dengan frontend |
| Laravel | Framework stabil dan produktif |
| React/Next.js | Komponen reusable dan SEO-friendly |
| MySQL | Andal untuk aplikasi CRUD |
| JWT | Stateless Authentication |
| Docker | Konsistensi environment |

---

# 15. Summary

Arsitektur Portfolio IT menggunakan kombinasi Three-Tier Architecture dan Layered Architecture.

Pendekatan ini memberikan:

- Modularitas
- Skalabilitas
- Keamanan
- Kemudahan pemeliharaan
- Kemudahan pengujian

Bab selanjutnya akan membahas **Technology Stack** secara rinci, termasuk alasan pemilihan teknologi, dependency utama, versi yang digunakan, serta standar pengembangan.