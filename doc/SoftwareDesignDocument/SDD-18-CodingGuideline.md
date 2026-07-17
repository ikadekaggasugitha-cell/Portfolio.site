# Software Design Document (SDD)

# Chapter 18
# Coding Guideline

Version : 1.0

Project :

Portfolio IT

---

# 1. Overview

Dokumen ini menetapkan standar penulisan kode (Coding Guideline) untuk seluruh pengembang yang terlibat dalam proyek Portfolio IT.

Tujuan utama coding guideline adalah:

- Menjaga konsistensi kode.
- Mempermudah kolaborasi tim.
- Mengurangi technical debt.
- Meningkatkan maintainability.
- Mendukung proses code review.
- Memudahkan onboarding developer baru.

Standar ini berlaku untuk seluruh source code frontend, backend, database, dan infrastruktur.

---

# 2. Coding Principles

Seluruh developer wajib menerapkan prinsip berikut:

- Clean Code
- SOLID Principle
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- YAGNI (You Aren't Gonna Need It)
- Separation of Concerns
- Single Responsibility Principle
- Composition Over Inheritance

---

# 3. Technology Standards

| Layer | Standard |
|---------|----------|
| Backend | PHP 8.4 |
| Framework | Laravel 12 |
| Frontend | Next.js 15 |
| Language | TypeScript |
| Database | MySQL 8 |
| Cache | Redis |
| API | RESTful JSON |
| Container | Docker |

---

# 4. Coding Style

## Backend

Mengikuti:

- PSR-12
- PSR-4 Autoloading
- Laravel Coding Style

## Frontend

Mengikuti:

- ESLint
- Prettier
- TypeScript Strict Mode

---

# 5. Naming Convention

## Class

Gunakan PascalCase.

Contoh:

```text
ProjectService
ProjectRepository
ProfileController
```

---

## Interface

Gunakan suffix `Interface`.

```text
ProjectRepositoryInterface
StorageServiceInterface
```

---

## Method

Gunakan camelCase.

```php
createProject()

updateProfile()

deleteCertificate()
```

---

## Variable

Gunakan camelCase.

```php
$projectTitle

$userProfile

$currentUser
```

---

## Constant

Gunakan UPPER_SNAKE_CASE.

```php
MAX_UPLOAD_SIZE

DEFAULT_LANGUAGE

CACHE_TTL
```

---

## Database Table

Gunakan bentuk jamak.

```text
users

projects

skills

messages
```

---

## Column

Gunakan snake_case.

```text
created_at

updated_at

profile_image

project_title
```

---

## Route

Gunakan kebab-case.

```text
/api/projects

/api/project-images

/api/contact-messages
```

---

# 6. Folder Structure

Backend:

```text
app/

Controllers/

Services/

Repositories/

Models/

Policies/

Traits/

Enums/

Exceptions/
```

Frontend:

```text
src/

app/

components/

hooks/

services/

lib/

utils/

types/
```

---

# 7. Controller Guideline

Controller hanya bertugas:

- Menerima request.
- Validasi awal melalui Form Request.
- Memanggil Service.
- Mengembalikan response.

Controller tidak boleh:

- Menjalankan query database.
- Berisi business logic.
- Mengakses repository secara langsung.

---

# 8. Service Guideline

Service bertanggung jawab terhadap:

- Business Logic
- Validation lanjutan
- Workflow
- Transaction
- Integrasi antar modul

Service tidak boleh menghasilkan tampilan (view).

---

# 9. Repository Guideline

Repository hanya bertugas:

- Query Database
- CRUD
- Pagination
- Filtering
- Sorting

Repository tidak boleh berisi business logic.

---

# 10. Model Guideline

Model hanya berisi:

- Relasi
- Attribute Casting
- Accessor
- Mutator
- Scope

Hindari business logic kompleks di dalam model.

---

# 11. API Guideline

Gunakan prinsip RESTful.

Contoh:

```text
GET /projects

GET /projects/{id}

POST /projects

PUT /projects/{id}

DELETE /projects/{id}
```

Gunakan JSON sebagai format pertukaran data.

---

# 12. Error Handling Guideline

- Gunakan Global Exception Handler.
- Jangan menggunakan `die()`, `exit()`, atau `dd()` pada production.
- Gunakan custom exception jika diperlukan.
- Selalu kembalikan format error yang konsisten.

---

# 13. Logging Guideline

Log wajib dibuat untuk:

- Login
- Logout
- Error
- CRUD penting
- Upload File
- Perubahan data sensitif

Jangan pernah mencatat:

- Password
- JWT Token
- API Secret
- Data sensitif pengguna

---

# 14. Security Guideline

Developer wajib:

- Menggunakan parameter binding.
- Melakukan validasi seluruh input.
- Menggunakan hashing untuk password.
- Menyimpan secret di `.env`.
- Menggunakan HTTPS.
- Melakukan sanitasi output.

---

# 15. Database Guideline

Aturan:

- Gunakan migration.
- Gunakan foreign key.
- Gunakan index pada kolom pencarian.
- Hindari query N+1.
- Gunakan eager loading.

---

# 16. Frontend Guideline

Komponen harus:

- Reusable.
- Stateless jika memungkinkan.
- Memiliki satu tanggung jawab utama.
- Menggunakan TypeScript.

Pisahkan:

- UI
- Business Logic
- API Service
- Utility Function

---

# 17. Git Workflow

Strategi branch:

```text
main

develop

feature/*

bugfix/*

hotfix/*

release/*
```

Contoh:

```text
feature/project-management

feature/contact-page

bugfix/login-validation
```

---

# 18. Commit Convention

Gunakan format:

```text
type(scope): message
```

Contoh:

```text
feat(project): add project CRUD

fix(auth): fix login validation

docs(api): update API documentation

refactor(service): simplify project service

test(project): add unit test

chore(ci): update docker image
```

---

# 19. Pull Request Guideline

Setiap Pull Request harus:

- Memiliki deskripsi perubahan.
- Menyertakan referensi issue (jika ada).
- Lulus seluruh pengujian.
- Tidak memiliki konflik.
- Telah direview minimal oleh satu developer lain.

---

# 20. Code Review Checklist

Checklist:

- [ ] Mengikuti Coding Guideline.
- [ ] Tidak ada duplicated code.
- [ ] Penamaan jelas.
- [ ] Business logic berada di Service.
- [ ] Validasi sudah benar.
- [ ] Error handling sudah diterapkan.
- [ ] Logging sudah sesuai.
- [ ] Tidak ada hardcoded secret.
- [ ] Unit test telah ditambahkan (jika relevan).
- [ ] Dokumentasi diperbarui.

---

# 21. Testing Guideline

Jenis pengujian:

- Unit Test
- Integration Test
- API Test
- UI Test
- Performance Test
- Security Test

Target minimal:

| Coverage | Target |
|----------|---------|
| Unit Test | ≥ 80% |
| Integration Test | Fitur kritis |
| API Test | Seluruh endpoint utama |

---

# 22. Documentation Guideline

Setiap fitur baru harus memperbarui:

- BRD (jika ada perubahan kebutuhan bisnis).
- PRD (jika ada perubahan kebutuhan produk).
- API Specification.
- Database Schema.
- SDD.
- UAT.
- README.

Komentar pada kode hanya digunakan jika logika tidak dapat dijelaskan dengan penamaan yang baik.

---

# 23. Dependency Management

Aturan:

- Gunakan library yang aktif dipelihara.
- Hindari dependency yang tidak digunakan.
- Perbarui dependency secara berkala.
- Lakukan vulnerability scan sebelum rilis.

---

# 24. Best Practices

- Tulis kode yang mudah dibaca.
- Gunakan fungsi kecil dengan satu tanggung jawab.
- Hindari magic number dan magic string.
- Gunakan Enum untuk nilai konstan.
- Hindari nested condition yang berlebihan.
- Gunakan Dependency Injection.
- Selalu lakukan code review.
- Pertahankan konsistensi style pada seluruh proyek.

---

# 25. Future Enhancement

Praktik berikut dapat diterapkan seiring berkembangnya proyek:

- Static Code Analysis (PHPStan, Larastan).
- SonarQube.
- Husky Git Hooks.
- Commit Lint.
- Conventional Changelog.
- Automated Code Formatting.
- Security Scanning pada CI/CD.
- Mutation Testing.

---

# 26. Summary

Coding Guideline menjadi pedoman utama bagi seluruh pengembang dalam menulis, meninjau, dan memelihara source code aplikasi Portfolio IT.

Dengan menerapkan standar penamaan, struktur proyek, prinsip Clean Code, SOLID, pengujian, serta workflow Git yang konsisten, kualitas kode akan tetap terjaga, mudah dipahami, dan siap dikembangkan dalam jangka panjang.