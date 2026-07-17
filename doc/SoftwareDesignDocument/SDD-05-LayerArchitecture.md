# Software Design Document (SDD)

# Chapter 5
# Layer Architecture

Version : 1.0

Project :

Portfolio IT

---

# 1. Overview

Bab ini menjelaskan struktur layer aplikasi Portfolio IT.

Arsitektur menggunakan kombinasi:

- Layered Architecture
- Clean Architecture
- Repository Pattern
- Service Layer Pattern

Pendekatan ini bertujuan untuk memisahkan tanggung jawab setiap komponen sehingga aplikasi mudah dipelihara, diuji, dan dikembangkan.

---

# 2. Architecture Principles

Layer Architecture menerapkan prinsip berikut:

- Separation of Concerns
- Single Responsibility Principle (SRP)
- Dependency Inversion Principle (DIP)
- Open/Closed Principle (OCP)
- Low Coupling
- High Cohesion

---

# 3. Layer Overview

```text
                    Presentation Layer
                           │
                           ▼
                    Application Layer
                           │
                           ▼
                      Domain Layer
                           │
                           ▼
                  Infrastructure Layer
                           │
                           ▼
                       Database Layer
```

Setiap layer hanya dapat berkomunikasi dengan layer di bawahnya.

---

# 4. Layer Responsibilities

| Layer | Responsibility |
|--------|----------------|
| Presentation | UI, Routing, Request & Response |
| Application | Business Use Case, Orchestration |
| Domain | Business Rules & Entity |
| Infrastructure | Database, Storage, External Service |
| Database | Persistent Data |

---

# 5. Presentation Layer

## Tujuan

Presentation Layer bertanggung jawab menerima input pengguna dan menampilkan hasil kepada pengguna.

### Frontend

- Pages
- Components
- Layouts
- Hooks
- Services

### Backend

- Controllers
- Form Request
- API Resource
- Middleware

---

## Struktur

```text
Presentation

├── React Component

├── Next.js Page

├── Laravel Controller

├── Middleware

└── Request Validation
```

---

## Contoh

```
ProjectController

ProfileController

SkillController
```

Controller hanya bertugas:

- menerima request
- memvalidasi request
- memanggil service
- mengembalikan response

Controller **tidak boleh** memiliki business logic.

---

# 6. Application Layer

Application Layer mengatur alur proses bisnis.

Layer ini menghubungkan Presentation Layer dengan Domain Layer.

---

## Struktur

```text
Application

├── Services

├── Use Cases

├── DTO

└── Interfaces
```

---

## Contoh Service

```
AuthService

ProjectService

ProfileService

CertificateService

MessageService
```

---

## Contoh Use Case

```
CreateProject

UpdateProject

DeleteProject

UploadCertificate

SendMessage
```

---

## Tanggung Jawab

- Menjalankan business process
- Validasi aturan bisnis
- Memanggil repository
- Mengelola transaksi
- Mengatur workflow

---

# 7. Domain Layer

Domain Layer merupakan inti aplikasi.

Seluruh aturan bisnis berada pada layer ini.

---

## Struktur

```text
Domain

├── Entities

├── Value Objects

├── Domain Services

├── Events

└── Exceptions
```

---

## Entity

Contoh

```
Project

Profile

Experience

Skill

Certificate
```

Entity memiliki:

- Identity
- Attribute
- Behavior

---

## Value Object

Contoh

```
Email

PhoneNumber

Url

SkillLevel
```

Value Object bersifat immutable.

---

## Domain Service

Digunakan apabila business rule tidak cocok ditempatkan pada Entity.

Contoh

```
ProjectValidationService

ProfileCompletionService
```

---

# 8. Infrastructure Layer

Infrastructure Layer menangani implementasi teknis.

---

## Struktur

```text
Infrastructure

├── Repository

├── Storage

├── Mail

├── Cache

├── Queue

└── Third Party
```

---

## Repository

Repository bertugas mengambil dan menyimpan data.

Contoh

```
ProjectRepository

SkillRepository

ExperienceRepository
```

---

## Storage

Implementasi penyimpanan file.

Contoh

```
Local Storage

AWS S3

Google Cloud Storage
```

---

## Mail

Mengirim email dari Contact Form.

---

## Cache

Opsional menggunakan Redis untuk:

- Project List
- Profile
- Skills

---

# 9. Database Layer

Layer ini bertanggung jawab terhadap penyimpanan data.

Komponen:

- MySQL
- Eloquent ORM
- Migration
- Seeder

---

# 10. Request Lifecycle

```text
Browser
   │
   ▼
Next.js
   │
   ▼
API Service
   │
   ▼
Laravel Middleware
   │
   ▼
Controller
   │
   ▼
Application Service
   │
   ▼
Repository
   │
   ▼
MySQL
   │
   ▼
Repository
   │
   ▼
Service
   │
   ▼
Controller
   │
   ▼
JSON Response
   │
   ▼
Frontend
```

---

# 11. Dependency Rule

Dependency hanya mengarah ke dalam (inward dependency).

```text
Presentation
      │
      ▼
Application
      │
      ▼
Domain
      ▲
      │
Infrastructure
```

Domain Layer tidak mengetahui implementasi Infrastructure.

---

# 12. Repository Pattern

Repository menjadi perantara antara Service dan Database.

```text
Controller

↓

Service

↓

Repository Interface

↓

Repository Implementation

↓

Database
```

Keuntungan:

- Mudah di-mock saat testing
- Tidak bergantung pada ORM
- Mudah mengganti database

---

# 13. Service Layer Pattern

Service Layer berisi business logic.

Contoh:

```
ProjectService

ProfileService

SkillService

ExperienceService
```

Business logic tidak ditempatkan pada Controller maupun Model.

---

# 14. Error Handling Flow

```text
Request

↓

Validation

↓

Business Validation

↓

Repository

↓

Database

↓

Exception

↓

Handler

↓

JSON Error Response
```

---

# 15. Security Across Layers

Presentation

- Input Validation
- Authentication Check

Application

- Authorization
- Business Rule Validation

Infrastructure

- SQL Injection Protection
- File Validation
- External Service Validation

Database

- Foreign Key
- Constraint
- Transaction

---

# 16. Layer Interaction Example

Use Case: Create Project

```text
User

↓

Project Page

↓

POST /projects

↓

ProjectController

↓

ProjectService

↓

ProjectRepository

↓

MySQL

↓

Success Response
```

---

# 17. Benefits

Implementasi Layer Architecture memberikan keuntungan:

- Kode lebih terstruktur
- Mudah diuji (Unit Test)
- Mudah dipelihara
- Mendukung Dependency Injection
- Mendukung Clean Architecture
- Memudahkan Code Review
- Mengurangi duplikasi kode

---

# 18. Risks

Beberapa tantangan:

- Struktur lebih kompleks dibanding MVC sederhana.
- Membutuhkan disiplin dalam memisahkan tanggung jawab.
- Membutuhkan dokumentasi yang baik.

---

# 19. Best Practices

- Controller maksimal berisi orkestrasi request dan response.
- Semua business logic berada pada Service atau Use Case.
- Repository hanya menangani akses data.
- Entity tidak bergantung pada framework.
- Gunakan Dependency Injection.
- Hindari query database langsung di Controller.
- Gunakan DTO untuk transfer data antar layer bila diperlukan.

---

# 20. Summary

Layer Architecture menjadi fondasi utama pengembangan Portfolio IT. Dengan memisahkan Presentation, Application, Domain, Infrastructure, dan Database Layer, aplikasi menjadi lebih modular, mudah diuji, serta siap dikembangkan untuk kebutuhan yang lebih kompleks tanpa mengubah struktur dasar sistem.