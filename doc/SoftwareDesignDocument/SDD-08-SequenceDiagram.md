# Software Design Document (SDD)

# Chapter 8
# Sequence Diagram

Version : 1.0

Project :

Portfolio IT

---

# 1. Overview

Bab ini menjelaskan alur komunikasi antar komponen sistem berdasarkan urutan waktu (time sequence).

Sequence Diagram digunakan untuk menggambarkan bagaimana objek saling berinteraksi dalam menyelesaikan suatu proses bisnis.

Diagram dibuat menggunakan Mermaid sehingga dapat dirender langsung pada GitHub, GitLab, Azure DevOps, Obsidian, dan editor Markdown yang mendukung Mermaid.

---

# 2. Tujuan

Sequence Diagram digunakan untuk:

- Menjelaskan alur proses bisnis.
- Memperlihatkan interaksi antar objek.
- Menjadi acuan implementasi backend.
- Menjadi acuan implementasi frontend.
- Menjadi referensi QA saat menyusun test case.

---

# 3. Participant

Pada diagram berikut digunakan participant:

- User
- Browser
- Frontend (Next.js)
- API (Laravel)
- Controller
- Service
- Repository
- Database
- External Service (jika diperlukan)

---

# 4. Login Sequence

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Frontend
    participant API
    participant AuthController
    participant AuthService
    participant UserRepository
    participant MySQL

    User->>Browser: Login
    Browser->>Frontend: Submit Form
    Frontend->>API: POST /auth/login
    API->>AuthController: Request
    AuthController->>AuthService: authenticate()
    AuthService->>UserRepository: findByEmail()
    UserRepository->>MySQL: SELECT user
    MySQL-->>UserRepository: User Data
    UserRepository-->>AuthService: User
    AuthService-->>AuthController: JWT Token
    AuthController-->>Frontend: JSON Response
    Frontend-->>Browser: Login Success
```

---

# 5. Get Portfolio Profile

```mermaid
sequenceDiagram
    actor Visitor
    participant Frontend
    participant API
    participant ProfileController
    participant ProfileService
    participant ProfileRepository
    participant MySQL

    Visitor->>Frontend: Open Home Page
    Frontend->>API: GET /profile
    API->>ProfileController: Request
    ProfileController->>ProfileService: getProfile()
    ProfileService->>ProfileRepository: find()
    ProfileRepository->>MySQL: SELECT profile
    MySQL-->>ProfileRepository: Profile
    ProfileRepository-->>ProfileService: Data
    ProfileService-->>ProfileController: Profile DTO
    ProfileController-->>Frontend: JSON
    Frontend-->>Visitor: Render Profile
```

---

# 6. Create Project

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend
    participant API
    participant ProjectController
    participant ProjectService
    participant ProjectRepository
    participant MySQL

    Admin->>Frontend: Submit Project Form
    Frontend->>API: POST /projects
    API->>ProjectController: store()
    ProjectController->>ProjectService: create()
    ProjectService->>ProjectRepository: save()
    ProjectRepository->>MySQL: INSERT Project
    MySQL-->>ProjectRepository: Success
    ProjectRepository-->>ProjectService: Project
    ProjectService-->>ProjectController: Success
    ProjectController-->>Frontend: 201 Created
```

---

# 7. Update Project

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend
    participant API
    participant ProjectController
    participant ProjectService
    participant ProjectRepository
    participant MySQL

    Admin->>Frontend: Update Project
    Frontend->>API: PUT /projects/{id}
    API->>ProjectController: update()
    ProjectController->>ProjectService: update()
    ProjectService->>ProjectRepository: update()
    ProjectRepository->>MySQL: UPDATE Project
    MySQL-->>ProjectRepository: Success
    ProjectRepository-->>ProjectService: Updated
    ProjectService-->>ProjectController: Success
    ProjectController-->>Frontend: JSON Response
```

---

# 8. Delete Project

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend
    participant API
    participant ProjectController
    participant ProjectService
    participant ProjectRepository
    participant MySQL

    Admin->>Frontend: Delete Project
    Frontend->>API: DELETE /projects/{id}
    API->>ProjectController: destroy()
    ProjectController->>ProjectService: delete()
    ProjectService->>ProjectRepository: delete()
    ProjectRepository->>MySQL: DELETE Project
    MySQL-->>ProjectRepository: Success
    ProjectRepository-->>ProjectService: Success
    ProjectService-->>ProjectController: Success
    ProjectController-->>Frontend: 204 No Content
```

---

# 9. Upload Project Image

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend
    participant API
    participant ProjectController
    participant Storage
    participant MySQL

    Admin->>Frontend: Upload Image
    Frontend->>API: POST /projects/{id}/images
    API->>ProjectController: uploadImage()
    ProjectController->>Storage: Save File
    Storage-->>ProjectController: File Path
    ProjectController->>MySQL: Save Metadata
    MySQL-->>ProjectController: Success
    ProjectController-->>Frontend: Image Uploaded
```

---

# 10. Send Contact Message

```mermaid
sequenceDiagram
    actor Visitor
    participant Frontend
    participant API
    participant MessageController
    participant MessageService
    participant MessageRepository
    participant SMTP
    participant MySQL

    Visitor->>Frontend: Submit Contact Form
    Frontend->>API: POST /messages
    API->>MessageController: store()
    MessageController->>MessageService: send()
    MessageService->>MessageRepository: save()
    MessageRepository->>MySQL: INSERT Message
    MySQL-->>MessageRepository: Success
    MessageService->>SMTP: Send Notification
    SMTP-->>MessageService: Sent
    MessageService-->>MessageController: Success
    MessageController-->>Frontend: Success Response
```

---

# 11. Download CV

```mermaid
sequenceDiagram
    actor Visitor
    participant Frontend
    participant API
    participant ProfileController
    participant Storage

    Visitor->>Frontend: Click Download CV
    Frontend->>API: GET /profile/cv
    API->>ProfileController: downloadCV()
    ProfileController->>Storage: Read File
    Storage-->>ProfileController: File Stream
    ProfileController-->>Frontend: PDF Response
    Frontend-->>Visitor: Download Started
```

---

# 12. Read Message (Admin)

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend
    participant API
    participant MessageController
    participant MessageService
    participant MessageRepository
    participant MySQL

    Admin->>Frontend: Open Message
    Frontend->>API: GET /messages/{id}
    API->>MessageController: show()
    MessageController->>MessageService: findById()
    MessageService->>MessageRepository: find()
    MessageRepository->>MySQL: SELECT Message
    MySQL-->>MessageRepository: Message
    MessageRepository-->>MessageService: Data
    MessageService-->>MessageController: Message
    MessageController-->>Frontend: JSON Response
```

---

# 13. Error Handling Sequence

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant API
    participant Validation
    participant ExceptionHandler

    User->>Frontend: Submit Invalid Data
    Frontend->>API: POST Request
    API->>Validation: Validate Input
    Validation-->>ExceptionHandler: Validation Failed
    ExceptionHandler-->>Frontend: 422 Validation Error
    Frontend-->>User: Display Error Message
```

---

# 14. Authentication Flow

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend
    participant Middleware
    participant API

    Admin->>Frontend: Request Protected Page
    Frontend->>Middleware: Check JWT
    Middleware->>API: Validate Token
    API-->>Middleware: Valid
    Middleware-->>Frontend: Allow Access
```

---

# 15. Best Practices

- Setiap request melewati proses validasi.
- Business logic hanya berada pada Service Layer.
- Repository hanya menangani akses data.
- Controller tidak mengakses database secara langsung.
- Gunakan transaksi database untuk operasi yang melibatkan banyak tabel.
- Gunakan asynchronous process (Queue) untuk proses berat seperti pengiriman email.

---

# 16. Summary

Sequence Diagram mendokumentasikan urutan interaksi antar komponen pada setiap fitur utama aplikasi Portfolio IT.

Dokumen ini menjadi acuan implementasi backend, frontend, integrasi API, serta penyusunan skenario pengujian oleh QA Engineer. Dengan pemisahan diagram per use case, alur sistem menjadi lebih mudah dipahami, dipelihara, dan dikembangkan.