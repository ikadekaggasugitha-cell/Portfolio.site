# SDD-03-TechnologyStack.md

# Software Design Document (SDD)

# Chapter 3
# Technology Stack

Version : 1.0

Project :

Portfolio IT

---

# 1. Overview

Bab ini menjelaskan seluruh teknologi yang digunakan pada aplikasi Portfolio IT.

Technology Stack dipilih berdasarkan beberapa pertimbangan:

- Stabilitas
- Performa
- Kemudahan Maintenance
- Skalabilitas
- Dukungan Komunitas
- Dokumentasi
- Kemudahan Deployment

Dokumen ini menjadi acuan resmi bagi seluruh developer agar menggunakan versi teknologi yang konsisten selama pengembangan.

---

# 2. Architecture Technology

```text
                    Client Browser
                           │
                           ▼
                 React / Next.js Frontend
                           │
                      REST API (HTTPS)
                           │
                           ▼
                      Laravel Backend
                           │
                     Eloquent ORM
                           │
                           ▼
                         MySQL

               Docker + Nginx + Linux VPS
```

---

# 3. Technology Matrix

| Layer | Technology | Version |
|---------|------------|----------|
|Frontend|Next.js|15.x|
|Frontend|React|19.x|
|Styling|Tailwind CSS|4.x|
|Language|TypeScript|5.x|
|Backend|Laravel|12.x|
|Language|PHP|8.4|
|Database|MySQL|8.x|
|Cache|Redis *(Optional)*|7.x|
|Web Server|Nginx|Latest Stable|
|Container|Docker|Latest Stable|
|Version Control|Git|Latest|
|CI/CD|GitHub Actions|Latest|

---

# 4. Frontend Stack

## Framework

Next.js

Digunakan karena:

- Server Side Rendering
- Static Site Generation
- SEO Friendly
- Routing bawaan
- Image Optimization

---

## Library

React

Digunakan untuk:

- Component Based Architecture
- Reusable Component
- Virtual DOM
- Ecosystem yang besar

---

## Styling

Tailwind CSS

Keuntungan:

- Utility First
- Responsive
- Mudah dikustomisasi
- Performa tinggi

---

## Icons

Rekomendasi

- Heroicons
- Lucide Icons

---

## Form Validation

Disarankan menggunakan

- React Hook Form
- Zod

---

## HTTP Client

Axios

Digunakan untuk:

- REST API
- Request Interceptor
- Response Interceptor
- Authentication Header

---

# 5. Backend Stack

## Framework

Laravel 12

Alasan pemilihan:

- MVC
- Eloquent ORM
- Queue
- Validation
- Authentication
- Middleware
- Artisan CLI

---

## Authentication

JWT

Library

tymon/jwt-auth

Digunakan untuk:

- Login
- Authorization
- Stateless Authentication

---

## ORM

Eloquent ORM

Keuntungan:

- Relasi database
- Migration
- Seeder
- Factory
- Query Builder

---

## File Storage

Laravel Storage

Direktori

```
storage/app/public
```

Alternatif

- AWS S3
- Google Cloud Storage
- MinIO

---

# 6. Database Stack

Database

MySQL 8

Storage Engine

InnoDB

Character Set

utf8mb4

Collation

utf8mb4_unicode_ci

Keuntungan

- ACID
- Transaction
- Foreign Key
- High Performance

---

# 7. DevOps Stack

## Container

Docker

Digunakan agar:

- Environment konsisten
- Mudah deployment
- Mudah testing

---

## Reverse Proxy

Nginx

Tugas

- Reverse Proxy
- HTTPS
- Static File
- Load Balancing

---

## SSL

Let's Encrypt

HTTPS wajib digunakan.

---

# 8. Development Tools

| Software | Fungsi |
|------------|--------------------|
|Visual Studio Code|Code Editor|
|PHPStorm *(Opsional)*|IDE PHP|
|Postman|API Testing|
|Docker Desktop|Container|
|Git|Version Control|
|GitHub Desktop *(Opsional)*|Git Client|
|DBeaver|Database Management|
|MySQL Workbench|Database Design|
|Draw.io|Diagram|
|Figma|UI Design|

---

# 9. Dependency Management

Frontend

```
npm
```

atau

```
pnpm
```

Backend

```
Composer
```

---

# 10. Recommended Package

## Frontend

```
axios

react-hook-form

zod

react-hot-toast

lucide-react

framer-motion
```

---

## Backend

```
laravel/sanctum

tymon/jwt-auth

spatie/laravel-permission

maatwebsite/excel

barryvdh/laravel-debugbar

laravel/pint
```

---

# 11. Browser Support

Didukung pada:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari

Versi minimum

2 versi terbaru.

---

# 12. Operating System

Development

- Windows
- macOS
- Linux

Production

Ubuntu Server 24.04 LTS

---

# 13. Coding Language

Frontend

TypeScript

Backend

PHP

Database

SQL

Markup

HTML5

Style

CSS3

---

# 14. Version Control Strategy

Repository

GitHub

Branch

```
main
develop
feature/*
hotfix/*
release/*
```

Workflow

```
Feature

↓

Pull Request

↓

Code Review

↓

Merge Develop

↓

Testing

↓

Merge Main

↓

Production
```

---

# 15. Environment

Development

```
APP_ENV=local
```

Staging

```
APP_ENV=staging
```

Production

```
APP_ENV=production
```

---

# 16. Environment Variables

Backend

```
APP_NAME

APP_URL

DB_HOST

DB_DATABASE

DB_USERNAME

DB_PASSWORD

JWT_SECRET

MAIL_HOST

MAIL_PORT
```

Frontend

```
NEXT_PUBLIC_API_URL
```

---

# 17. Directory Standard

Frontend

```
src/

components/

hooks/

services/

pages/

assets/

types/

utils/
```

Backend

```
app/

Http/

Models/

Services/

Repositories/

Policies/

Providers/

database/

routes/

storage/
```

---

# 18. Security Stack

- HTTPS
- JWT Authentication
- Bcrypt Password
- CSRF Protection
- XSS Protection
- SQL Injection Protection
- Rate Limiting
- Validation Request

---

# 19. Monitoring

Disarankan menggunakan:

- Laravel Telescope
- Laravel Pulse
- Sentry
- Uptime Kuma
- Grafana *(Future)*

---

# 20. Future Technology

Jika aplikasi berkembang menjadi enterprise, stack dapat ditingkatkan menjadi:

Frontend

- Next.js
- React Server Component

Backend

- Laravel Octane
- Swoole

Database

- PostgreSQL
- Redis

Cloud

- AWS
- Google Cloud

CI/CD

- GitHub Actions
- Docker Registry
- Kubernetes

Observability

- Prometheus
- Grafana
- Loki

---

# 21. Summary

Technology Stack dipilih dengan mempertimbangkan performa, kemudahan pengembangan, keamanan, dan skalabilitas.

Kombinasi Next.js, Laravel, MySQL, Docker, dan Nginx memberikan fondasi yang kuat untuk membangun aplikasi Portfolio IT yang modern, mudah dipelihara, dan siap dikembangkan lebih lanjut.