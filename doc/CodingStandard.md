# Coding Standard

Version : 1.0

Project :

Portfolio IT

---

# 1. Purpose

Dokumen ini mendefinisikan standar penulisan kode yang wajib diterapkan selama pengembangan aplikasi Portfolio IT.

Tujuan:

- Menjaga konsistensi kode.
- Mempermudah kolaborasi.
- Mengurangi technical debt.
- Memudahkan code review.
- Mempercepat proses maintenance.
- Meningkatkan kualitas perangkat lunak.

Dokumen ini berlaku untuk seluruh anggota tim pengembang.

---

# 2. Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js 15 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | Laravel 12 |
| Language | PHP 8.4 |
| Database | MySQL 8 |
| Cache | Redis |
| Container | Docker |
| Version Control | Git |

---

# 3. General Principles

Seluruh kode harus mengikuti prinsip:

- Clean Code
- SOLID
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- YAGNI (You Aren't Gonna Need It)
- Separation of Concerns
- Composition over Inheritance

---

# 4. File & Folder Naming

## Folder

Gunakan **kebab-case**.

Contoh:

```text
project-images/
contact-form/
shared-components/
```

## File

### React Component

Gunakan **PascalCase**.

```text
ProjectCard.tsx
ProfileSection.tsx
ContactForm.tsx
```

### TypeScript Utility

Gunakan **camelCase**.

```text
formatDate.ts
apiClient.ts
calculateAge.ts
```

### PHP Class

Gunakan **PascalCase**.

```text
ProjectService.php
ProjectRepository.php
ProfileController.php
```

---

# 5. Variable Naming

Gunakan **camelCase**.

Baik:

```ts
projectTitle
currentUser
profileImage
```

Kurang baik:

```ts
a
b
data1
temp
```

Nama variabel harus menjelaskan tujuan penggunaannya.

---

# 6. Constant Naming

Gunakan **UPPER_SNAKE_CASE**.

```text
MAX_UPLOAD_SIZE

CACHE_TTL

DEFAULT_LANGUAGE

MAX_LOGIN_ATTEMPT
```

---

# 7. Function Naming

Gunakan kata kerja.

Baik:

```text
createProject()

updateProfile()

deleteSkill()

sendMessage()

uploadCertificate()
```

Kurang baik:

```text
project()

profile()

skill()
```

---

# 8. Class Naming

Gunakan suffix sesuai tanggung jawab.

| Type | Suffix |
|--------|---------|
| Controller | Controller |
| Service | Service |
| Repository | Repository |
| Interface | Interface |
| DTO | DTO |
| Request | Request |
| Resource | Resource |
| Policy | Policy |
| Middleware | Middleware |

---

# 9. Database Standard

## Table

Gunakan bentuk jamak.

```text
users

projects

skills

certificates
```

## Column

Gunakan snake_case.

```text
project_title

created_at

updated_at

profile_image
```

---

# 10. API Standard

RESTful.

Contoh:

```text
GET /api/projects

POST /api/projects

PUT /api/projects/{id}

DELETE /api/projects/{id}
```

Gunakan noun, bukan verb, pada endpoint.

---

# 11. Controller Standard

Controller hanya boleh:

- menerima request
- memanggil service
- mengembalikan response

Controller tidak boleh:

- menjalankan query database
- menyimpan business logic
- memanggil repository secara langsung

---

# 12. Service Standard

Service bertanggung jawab terhadap:

- Business Logic
- Transaction
- Workflow
- Validasi lanjutan
- Integrasi antar modul

---

# 13. Repository Standard

Repository hanya menangani:

- Query
- CRUD
- Pagination
- Filtering
- Sorting

Repository tidak boleh berisi business rule.

---

# 14. Validation Standard

Seluruh input wajib divalidasi.

Gunakan:

- Laravel Form Request
- Zod (Frontend)
- TypeScript Type Checking

Validasi dilakukan pada:

- Backend
- Frontend

---

# 15. Error Handling Standard

Gunakan:

- Global Exception Handler
- Custom Exception
- Standard JSON Response

Jangan gunakan:

```php
die();

exit();

dd();

var_dump();
```

pada lingkungan production.

---

# 16. Logging Standard

Log yang wajib:

- Login
- Logout
- Error
- CRUD penting
- Upload file
- Authentication failure

Jangan pernah mencatat:

- Password
- Token
- API Key
- Secret

---

# 17. Security Standard

Developer wajib:

- Menggunakan HTTPS.
- Menggunakan prepared statement atau ORM.
- Menyimpan secret di `.env`.
- Memvalidasi seluruh input.
- Melakukan output encoding bila diperlukan.
- Membatasi ukuran file upload.

---

# 18. Comment Standard

Gunakan komentar hanya jika benar-benar diperlukan.

Baik:

```php
// Generate thumbnail setelah file berhasil diunggah.
```

Hindari komentar yang hanya mengulang isi kode.

```php
// Increment i
$i++;
```

---

# 19. Formatting Standard

## PHP

- PSR-12
- 4 spaces
- UTF-8

## TypeScript

- ESLint
- Prettier
- 2 spaces (sesuai konfigurasi proyek)

Seluruh file harus diformat sebelum commit.

---

# 20. Git Branch Strategy

Branch utama:

```text
main

develop
```

Branch fitur:

```text
feature/profile

feature/project

feature/contact
```

Branch lain:

```text
bugfix/

hotfix/

release/
```

---

# 21. Commit Message Standard

Gunakan Conventional Commits.

Contoh:

```text
feat(project): add project CRUD

fix(profile): fix image upload

docs(api): update API specification

refactor(service): simplify profile service

test(auth): add login unit test

chore(ci): update workflow
```

---

# 22. Pull Request Standard

Setiap Pull Request harus:

- Memiliki deskripsi.
- Menyertakan screenshot jika ada perubahan UI.
- Lulus seluruh pengujian.
- Tidak memiliki konflik.
- Direview minimal oleh satu developer lain.

---

# 23. Code Review Checklist

Periksa:

- [ ] Naming convention.
- [ ] Clean Code.
- [ ] SOLID.
- [ ] Tidak ada duplicated code.
- [ ] Error handling benar.
- [ ] Logging sesuai.
- [ ] Validasi input lengkap.
- [ ] Tidak ada hardcoded secret.
- [ ] Dokumentasi diperbarui.
- [ ] Testing tersedia.

---

# 24. Testing Standard

Minimal pengujian:

| Test | Target |
|------|--------|
| Unit Test | ≥ 80% coverage |
| Integration Test | Modul utama |
| API Test | Seluruh endpoint utama |
| UI Test | Halaman kritis |

---

# 25. Documentation Standard

Perubahan fitur harus memperbarui dokumen terkait:

- BRD (jika kebutuhan bisnis berubah)
- PRD
- API Specification
- Database Schema
- SDD
- UAT
- README

---

# 26. Dependency Management

Aturan:

- Gunakan dependency yang aktif dipelihara.
- Hapus dependency yang tidak digunakan.
- Perbarui secara berkala.
- Periksa kerentanan keamanan sebelum rilis.

---

# 27. Developer Checklist

Sebelum melakukan commit:

- [ ] Kode berhasil di-build.
- [ ] Tidak ada warning penting.
- [ ] Linter lulus.
- [ ] Formatter dijalankan.
- [ ] Unit test lulus.
- [ ] Dokumentasi diperbarui.
- [ ] Commit message sesuai standar.

---

# 28. Best Practices

- Gunakan nama yang deskriptif.
- Buat fungsi kecil dengan satu tanggung jawab.
- Hindari nested condition yang kompleks.
- Gunakan Enum untuk nilai konstan.
- Hindari magic number dan magic string.
- Manfaatkan Dependency Injection.
- Terapkan code review pada setiap perubahan.

---

# 29. References

Standar yang menjadi acuan:

- PSR-1
- PSR-4
- PSR-12
- Laravel Best Practices
- TypeScript Handbook
- React Documentation
- Next.js Documentation
- OWASP Secure Coding Practices
- Conventional Commits 1.0.0

---

# 30. Summary

Coding Standard menjadi pedoman operasional harian bagi seluruh developer dalam menulis, meninjau, dan memelihara source code aplikasi Portfolio IT.

Dengan mengikuti standar ini, proyek akan memiliki kode yang konsisten, mudah dipahami, aman, mudah diuji, dan siap dikembangkan oleh tim dalam jangka panjang.