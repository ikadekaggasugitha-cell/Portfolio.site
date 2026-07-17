# Software Design Document (SDD)

# Chapter 20
# Appendix

Version : 1.0

Project :

Portfolio IT

---

# 1. Overview

Appendix berisi informasi tambahan yang mendukung keseluruhan Software Design Document (SDD). Dokumen ini menjadi referensi untuk istilah, standar, daftar diagram, ringkasan teknologi, hingga checklist implementasi.

---

# 2. Glossary

| Term | Description |
|------|-------------|
| API | Application Programming Interface |
| CRUD | Create, Read, Update, Delete |
| DTO | Data Transfer Object |
| ORM | Object Relational Mapping |
| JWT | JSON Web Token |
| CDN | Content Delivery Network |
| CI/CD | Continuous Integration / Continuous Deployment |
| SSR | Server Side Rendering |
| SSG | Static Site Generation |
| ISR | Incremental Static Regeneration |
| REST | Representational State Transfer |
| JSON | JavaScript Object Notation |
| NFR | Non-Functional Requirement |
| RBAC | Role-Based Access Control |
| SLA | Service Level Agreement |
| SLI | Service Level Indicator |
| SLO | Service Level Objective |

---

# 3. Acronyms

| Acronym | Meaning |
|----------|---------|
| BRD | Business Requirement Document |
| PRD | Product Requirement Document |
| SDD | Software Design Document |
| ERD | Entity Relationship Diagram |
| UML | Unified Modeling Language |
| UI | User Interface |
| UX | User Experience |
| QA | Quality Assurance |
| UAT | User Acceptance Testing |
| SQL | Structured Query Language |

---

# 4. Technology Stack Summary

| Layer | Technology |
|--------|------------|
| Frontend | Next.js 15 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | Laravel 12 |
| Language | PHP 8.4 |
| Database | MySQL 8 |
| Cache | Redis |
| Authentication | JWT |
| Container | Docker |
| Reverse Proxy | Nginx |
| Version Control | Git |
| API | RESTful JSON |

---

# 5. Software Architecture Summary

```text
Browser

↓

Next.js

↓

REST API

↓

Laravel

↓

Redis

↓

MySQL

↓

Storage
```

---

# 6. Document Structure

```text
BRD

↓

PRD

↓

Wireframe

↓

User Flow

↓

Use Case Diagram

↓

ERD

↓

Database Schema

↓

API Specification

↓

Software Design Document

↓

Deployment

↓

Coding Standard

↓

UAT
```

---

# 7. Software Design Chapters

| Chapter | Status |
|----------|--------|
| SDD-01 Introduction | Completed |
| SDD-02 System Architecture | Completed |
| SDD-03 Technology Stack | Completed |
| SDD-04 Project Structure | Completed |
| SDD-05 Layer Architecture | Completed |
| SDD-06 Component Diagram | Completed |
| SDD-07 Class Diagram | Completed |
| SDD-08 Sequence Diagram | Completed |
| SDD-09 Activity Diagram | Completed |
| SDD-10 State Diagram | Completed |
| SDD-11 Package Diagram | Completed |
| SDD-12 Deployment Diagram | Completed |
| SDD-13 Security Architecture | Completed |
| SDD-14 Error Handling | Completed |
| SDD-15 Logging & Monitoring | Completed |
| SDD-16 Performance & Optimization | Completed |
| SDD-17 Scalability | Completed |
| SDD-18 Coding Guideline | Completed |
| SDD-19 Design Pattern | Completed |
| SDD-20 Appendix | Completed |

---

# 8. Diagram Index

Diagram yang tersedia pada dokumentasi:

- System Architecture
- Layer Architecture
- Component Diagram
- Class Diagram
- Sequence Diagram
- Activity Diagram
- State Diagram
- Package Diagram
- Deployment Diagram
- Security Architecture
- Logging Flow
- Monitoring Flow
- Performance Flow
- Scalability Architecture

---

# 9. API Modules

Modul API utama:

- Authentication
- Profile
- Project
- Skill
- Experience
- Education
- Certificate
- Contact
- Dashboard

---

# 10. Database Modules

Tabel utama:

- users
- profiles
- projects
- project_images
- skills
- experiences
- educations
- certificates
- contacts

---

# 11. Source Code Structure

Backend:

```text
app/
bootstrap/
config/
database/
routes/
storage/
tests/
```

Frontend:

```text
src/
app/
components/
hooks/
services/
types/
utils/
```

---

# 12. Requirement Traceability Matrix (RTM)

| Requirement | Design | API | Database | Status |
|-------------|--------|-----|----------|--------|
| Authentication | ✔ | ✔ | ✔ | Complete |
| Portfolio | ✔ | ✔ | ✔ | Complete |
| Skills | ✔ | ✔ | ✔ | Complete |
| Experience | ✔ | ✔ | ✔ | Complete |
| Certificate | ✔ | ✔ | ✔ | Complete |
| Contact | ✔ | ✔ | ✔ | Complete |

---

# 13. Assumptions

Asumsi yang digunakan:

- Pengguna menggunakan browser modern.
- Koneksi internet tersedia.
- Server menggunakan Linux.
- Database MySQL tersedia.
- Docker digunakan untuk deployment.
- HTTPS tersedia pada production.

---

# 14. Constraints

Batasan sistem:

- Maksimum ukuran upload mengikuti konfigurasi server.
- API menggunakan format JSON.
- Browser lama mungkin tidak mendukung seluruh fitur modern.
- Sistem bergantung pada layanan cache dan database.

---

# 15. Risk Register (Summary)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Database Failure | High | Backup & Recovery |
| Server Down | High | Monitoring & Failover |
| High Traffic | Medium | Caching & Load Balancer |
| Security Attack | High | OWASP Best Practices |
| Human Error | Medium | Code Review & Testing |

---

# 16. Standards Reference

Dokumen ini mengacu pada standar berikut:

- IEEE 1016 – Software Design Description
- ISO/IEC/IEEE 42010 – Architecture Description
- UML 2.5
- REST Architectural Style
- JSON Specification
- OWASP ASVS
- OWASP Top 10
- PSR-12 Coding Style
- PSR-4 Autoloading

---

# 17. Version History

| Version | Date | Description |
|----------|------|-------------|
| 0.1 | Draft | Initial Document |
| 0.5 | Review | Internal Review |
| 1.0 | Release | Final Documentation |

---

# 18. Change Log

Perubahan utama:

- Penambahan BRD.
- Penambahan PRD.
- Penyusunan Wireframe.
- Penyusunan User Flow.
- Penyusunan UML.
- Penyusunan Database Schema.
- Penyusunan API Specification.
- Penyusunan SDD lengkap.

---

# 19. Implementation Checklist

## Documentation

- [x] BRD
- [x] PRD
- [x] Wireframe
- [x] User Flow
- [x] Use Case Diagram
- [x] ERD
- [x] Database Schema
- [x] API Specification
- [x] SDD

## Development

- [ ] Frontend Development
- [ ] Backend Development
- [ ] Unit Testing
- [ ] Integration Testing
- [ ] UAT
- [ ] Deployment

---

# 20. Future Roadmap

Rencana pengembangan berikutnya:

- Admin Dashboard
- Blog CMS
- Visitor Analytics
- GitHub Integration
- Resume Generator
- Dark Mode
- Multi Language
- Notification System
- Mobile Application
- AI Portfolio Assistant

---

# 21. Conclusion

Dokumentasi Software Design Document (SDD) ini telah mencakup seluruh aspek utama perancangan aplikasi Portfolio IT, mulai dari arsitektur sistem, desain database, spesifikasi API, keamanan, performa, skalabilitas, hingga pedoman implementasi.

Dokumen ini menjadi acuan utama dalam proses pengembangan, pengujian, deployment, dan pemeliharaan aplikasi. Dengan mengikuti standar dan pedoman yang telah ditetapkan, diharapkan pengembangan dapat berlangsung secara konsisten, terdokumentasi dengan baik, dan mudah dikembangkan di masa mendatang.

---

# End of Document