# Software Design Document (SDD)

# Chapter 4
# Project Structure

Version : 1.0

Project :

Portfolio IT

---

# 1. Overview

Bab ini menjelaskan struktur direktori aplikasi Portfolio IT.

Tujuan dibuatnya standar struktur project adalah:

- Konsisten
- Mudah dipahami
- Mudah dipelihara
- Mudah dikembangkan
- Mendukung kolaborasi tim
- Mempermudah proses deployment

Seluruh developer wajib mengikuti struktur ini.

---

# 2. Repository Structure

```text
portfolio-it/

├── frontend/
├── backend/
├── docker/
├── docs/
├── scripts/
├── .github/
├── .gitignore
├── docker-compose.yml
├── Makefile
└── README.md
```

---

# 3. Root Directory

| Folder | Function |
|----------|----------------|
|frontend|Frontend Application|
|backend|REST API|
|docker|Docker Configuration|
|docs|Project Documentation|
|scripts|Automation Script|
|.github|CI/CD|
|README.md|Project Information|

---

# 4. Frontend Structure

```text
frontend/

src/

├── app/
├── components/
├── layouts/
├── hooks/
├── services/
├── lib/
├── types/
├── utils/
├── assets/
├── styles/
├── constants/
├── middleware/
├── contexts/
├── providers/
├── config/
└── tests/
```

---

# 5. Frontend Folder Description

## app/

Berisi halaman aplikasi.

Contoh

```
app/

page.tsx

about/

projects/

contact/
```

---

## components/

Reusable Component.

Contoh

```
Button

Navbar

Footer

Card

Modal

Input

Badge

Avatar
```

---

## layouts/

Layout utama.

Contoh

```
MainLayout

DashboardLayout

AuthLayout
```

---

## hooks/

Custom React Hook.

Contoh

```
useAuth

useApi

usePagination

useTheme
```

---

## services/

Komunikasi REST API.

Contoh

```
AuthService

ProjectService

ProfileService

MessageService
```

---

## utils/

Helper Function.

Contoh

```
Formatter

Validator

Date Helper

String Helper
```

---

## assets/

Static Asset.

```
images/

icons/

fonts/

logo/
```

---

## config/

Konfigurasi aplikasi.

```
api.ts

env.ts

routes.ts
```

---

# 6. Backend Structure

```text
backend/

app/

├── Http/
├── Models/
├── Services/
├── Repositories/
├── Interfaces/
├── Policies/
├── Exceptions/
├── Traits/
├── Helpers/
├── Enums/
└── Providers/

database/

routes/

config/

storage/

public/

tests/
```

---

# 7. Backend Folder Description

## Http/

Berisi:

```
Controllers

Requests

Middleware

Resources
```

---

## Models/

Entity Database.

```
User

Project

Skill

Experience

Certificate

Message
```

---

## Services/

Business Logic.

Contoh

```
ProjectService

ProfileService

MessageService

AuthService
```

---

## Repositories/

Akses Database.

Contoh

```
ProjectRepository

ProfileRepository

SkillRepository
```

---

## Interfaces/

Contract Interface.

Contoh

```
ProjectRepositoryInterface
```

---

## Policies/

Authorization.

---

## Traits/

Reusable Logic.

---

## Helpers/

Function Global.

---

## Enums/

Konstanta.

---

# 8. Database Folder

```text
database/

migrations/

seeders/

factories/
```

---

# 9. Routes

```text
routes/

api.php

web.php

console.php
```

---

# 10. Docker Structure

```text
docker/

nginx/

php/

mysql/

redis/

supervisor/
```

---

# 11. Documentation

```text
docs/

BRD/

PRD/

SDD/

API/

Database/

Deployment/
```

---

# 12. GitHub Workflow

```text
.github/

workflows/

ci.yml

deploy.yml
```

---

# 13. Naming Convention

Folder

```
lowercase
```

Contoh

```
components

services

repositories
```

---

File

PascalCase

```
ProjectCard.tsx

UserService.php
```

---

Interface

```
IProjectRepository
```

atau

```
ProjectRepositoryInterface
```

---

Database Table

Plural

```
projects

skills

messages
```

---

Model

Singular

```
Project

Skill

Message
```

---

Controller

```
ProjectController

ProfileController
```

---

Service

```
ProjectService
```

---

Repository

```
ProjectRepository
```

---

# 14. Import Rules

Gunakan alias import.

Contoh

```
@/components

@/services

@/hooks
```

Hindari relative path panjang.

```
../../../../components
```

---

# 15. Dependency Rule

Presentation Layer

↓

Service Layer

↓

Repository Layer

↓

Database

Presentation Layer **tidak boleh** mengakses database secara langsung.

Controller **tidak boleh** berisi business logic.

Business Logic harus berada di Service Layer.

---

# 16. Module Structure

Setiap fitur mengikuti struktur yang sama.

Contoh

```
Project

ProjectController

ProjectService

ProjectRepository

ProjectRequest

ProjectResource

ProjectPolicy

ProjectModel
```

---

# 17. Testing Structure

Frontend

```
tests/

unit/

integration/

e2e/
```

Backend

```
tests/

Feature/

Unit/
```

---

# 18. Storage Structure

```
storage/

logs/

app/

public/

uploads/

certificates/

projects/

cv/
```

---

# 19. Configuration Files

Frontend

```
package.json

tsconfig.json

next.config.ts

eslint.config.js

.prettierrc
```

Backend

```
composer.json

phpunit.xml

.env.example

artisan
```

---

# 20. Best Practice

- Gunakan Single Responsibility Principle.
- Maksimal satu class per file.
- Hindari circular dependency.
- Gunakan constructor dependency injection.
- Hindari hardcoded configuration.
- Simpan konfigurasi pada environment variable.
- Pisahkan business logic dari controller.

---

# 21. Summary

Struktur project dirancang untuk mendukung pengembangan jangka panjang dengan menerapkan Layered Architecture dan prinsip Clean Code. Seluruh anggota tim diharapkan mengikuti struktur dan konvensi ini agar kode tetap konsisten, mudah dipelihara, dan mudah dikembangkan.