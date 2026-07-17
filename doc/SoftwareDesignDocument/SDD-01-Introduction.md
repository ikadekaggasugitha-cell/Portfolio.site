# Software Design Document (SDD)

# Chapter 1
# Introduction

Version : 1.0

Project :

Portfolio IT

Author :

I Kadek Agga Sugitha

---

# Revision History

| Version | Date | Author | Description |
|----------|------------|------------|--------------------|
|1.0|03 July 2026|I Kadek Agga Sugitha|Initial Document|

---

# 1. Purpose

Dokumen Software Design Document (SDD) menjelaskan rancangan teknis aplikasi Portfolio IT.

Dokumen ini digunakan sebagai acuan bagi:

- Product Owner
- UI Designer
- Frontend Developer
- Backend Developer
- DevOps Engineer
- QA Engineer

SDD menjadi referensi utama selama proses pengembangan perangkat lunak agar seluruh anggota tim memiliki pemahaman yang sama mengenai struktur aplikasi.

---

# 2. Objective

Tujuan utama dokumen ini adalah:

- Menjelaskan arsitektur sistem.
- Menjelaskan struktur project.
- Menjelaskan hubungan antar komponen.
- Menjelaskan komunikasi antar service.
- Menjelaskan standar implementasi.
- Mengurangi risiko kesalahan implementasi.
- Menjadi dokumentasi resmi proyek.

---

# 3. Scope

Dokumen ini mencakup:

- Software Architecture
- Layer Architecture
- Database Design
- API Design
- Deployment
- Security
- Performance
- Coding Guideline
- Error Handling
- Logging
- Scalability

Tidak mencakup:

- Business Requirement
- UI Design Detail
- User Manual

Dokumen tersebut dijelaskan pada BRD, PRD dan Wireframe.

---

# 4. Audience

| Role | Responsibility |
|--------|----------------------|
|Product Owner|Business Decision|
|System Analyst|Requirement Analysis|
|UI Designer|Design Interface|
|Frontend Developer|Frontend Development|
|Backend Developer|REST API Development|
|Database Engineer|Database Design|
|QA Engineer|Testing|
|DevOps|Deployment|

---

# 5. References

Dokumen ini disusun berdasarkan:

- BRD
- PRD
- Wireframe
- User Flow
- Use Case Diagram
- ERD
- Database Schema
- API Specification

---

# 6. Definitions

| Term | Description |
|-----------|------------------------|
|REST API|Application Programming Interface menggunakan HTTP|
|JWT|JSON Web Token|
|CRUD|Create Read Update Delete|
|MVC|Model View Controller|
|ORM|Object Relational Mapping|

---

# 7. Software Overview

Portfolio IT merupakan aplikasi berbasis web yang digunakan untuk menampilkan profil profesional seorang Software Engineer.

Aplikasi terdiri dari dua bagian:

Public Website

Digunakan recruiter untuk melihat:

- Profile
- Skills
- Experience
- Projects
- Certificates
- Contact

Admin Dashboard

Digunakan administrator untuk:

- Login
- Mengelola Profile
- Mengelola Skills
- Mengelola Experience
- Mengelola Projects
- Mengelola Certificates
- Membaca pesan visitor

---

# 8. Functional Overview

Fitur utama aplikasi:

Authentication

Profile

Experience

Projects

Certificates

Skills

Messages

Download CV

---

# 9. Non Functional Overview

Availability

99%

Authentication

JWT

Security

HTTPS

Database

MySQL

API

REST

Deployment

Docker

---

# 10. Assumptions

Dokumen ini mengasumsikan bahwa:

Frontend menggunakan React atau Next.js.

Backend menggunakan Laravel.

Database menggunakan MySQL.

Server menggunakan Linux.

Deployment menggunakan Docker.

---

# 11. Constraints

Semua API menggunakan HTTPS.

Semua endpoint private menggunakan JWT.

Semua upload file menggunakan validasi MIME Type.

Ukuran file maksimum 5 MB.

---

# 12. Acronyms

API

Application Programming Interface

JWT

JSON Web Token

ORM

Object Relational Mapping

MVC

Model View Controller

CI/CD

Continuous Integration Continuous Deployment

---

# 13. Conclusion

Dokumen SDD menjadi dasar teknis seluruh implementasi aplikasi Portfolio IT.

Bab berikutnya akan menjelaskan arsitektur sistem secara detail.