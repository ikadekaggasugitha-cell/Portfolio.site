# Software Design Document (SDD)

# Chapter 9
# Activity Diagram

Version : 1.0

Project :

Portfolio IT

---

# 1. Overview

Bab ini menjelaskan alur aktivitas (Activity Flow) dari setiap proses bisnis utama pada aplikasi Portfolio IT.

Activity Diagram digunakan untuk menggambarkan:

- Urutan aktivitas
- Decision Point
- Parallel Process
- Validation
- Error Flow
- End Process

Diagram menggunakan notasi UML Activity Diagram berbasis Mermaid.

---

# 2. Objectives

Tujuan Activity Diagram adalah:

- Memvisualisasikan alur bisnis.
- Mempermudah implementasi.
- Menjadi referensi QA.
- Menjadi acuan Frontend dan Backend Developer.
- Mengidentifikasi kemungkinan error pada proses bisnis.

---

# 3. Business Process Overview

Aplikasi Portfolio IT memiliki proses bisnis utama sebagai berikut:

- Authentication
- Manage Profile
- Manage Skills
- Manage Experience
- Manage Projects
- Manage Certificates
- Contact Form
- Download CV

---

# 4. Login Activity

```mermaid
flowchart TD

A([Start])

B[Input Email & Password]

C{Validation}

D[Show Validation Error]

E[Authenticate User]

F{Credential Valid?}

G[Return JWT]

H[Display Dashboard]

I[Display Login Error]

J([End])

A --> B

B --> C

C -- Invalid --> D --> J

C -- Valid --> E

E --> F

F -- Yes --> G --> H --> J

F -- No --> I --> J
```

---

# 5. View Portfolio Activity

```mermaid
flowchart TD

A([Visitor])

B[Open Website]

C[Load Homepage]

D[Request Profile API]

E[Receive JSON]

F[Render Portfolio]

G([End])

A --> B

B --> C

C --> D

D --> E

E --> F

F --> G
```

---

# 6. Create Project Activity

```mermaid
flowchart TD

A([Start])

B[Open Dashboard]

C[Open Project Form]

D[Input Data]

E[Upload Image]

F{Validation}

G[Display Error]

H[Save Project]

I[Upload Image]

J[Store Database]

K[Display Success]

L([End])

A --> B

B --> C

C --> D

D --> E

E --> F

F -- Invalid --> G --> L

F -- Valid --> H

H --> I

I --> J

J --> K

K --> L
```

---

# 7. Update Project Activity

```mermaid
flowchart TD

A([Start])

B[Select Project]

C[Edit Data]

D[Submit]

E{Validation}

F[Show Error]

G[Update Database]

H[Success Notification]

I([End])

A --> B

B --> C

C --> D

D --> E

E -- Invalid --> F --> I

E -- Valid --> G

G --> H

H --> I
```

---

# 8. Delete Project Activity

```mermaid
flowchart TD

A([Start])

B[Select Project]

C[Click Delete]

D{Confirmation}

E[Cancel]

F[Delete Record]

G[Refresh List]

H([End])

A --> B

B --> C

C --> D

D -- No --> E --> H

D -- Yes --> F

F --> G

G --> H
```

---

# 9. Upload Certificate Activity

```mermaid
flowchart TD

A([Start])

B[Select Certificate File]

C[Input Certificate Information]

D{Validation}

E[Display Error]

F[Upload File]

G[Save Database]

H[Display Success]

I([End])

A --> B

B --> C

C --> D

D -- Invalid --> E --> I

D -- Valid --> F

F --> G

G --> H

H --> I
```

---

# 10. Contact Form Activity

```mermaid
flowchart TD

A([Visitor])

B[Open Contact Form]

C[Fill Form]

D[Submit]

E{Validation}

F[Display Error]

G[Save Message]

H[Send Email Notification]

I[Display Success]

J([End])

A --> B

B --> C

C --> D

D --> E

E -- Invalid --> F --> J

E -- Valid --> G

G --> H

H --> I

I --> J
```

---

# 11. Download CV Activity

```mermaid
flowchart TD

A([Visitor])

B[Click Download CV]

C[Request File]

D{File Exists?}

E[Download File]

F[Display Error]

G([End])

A --> B

B --> C

C --> D

D -- Yes --> E --> G

D -- No --> F --> G
```

---

# 12. Read Message Activity

```mermaid
flowchart TD

A([Admin])

B[Open Dashboard]

C[Open Messages]

D[Select Message]

E[Display Detail]

F[Mark As Read]

G([End])

A --> B

B --> C

C --> D

D --> E

E --> F

F --> G
```

---

# 13. Logout Activity

```mermaid
flowchart TD

A([Start])

B[Click Logout]

C[Remove JWT Token]

D[Redirect Login]

E([End])

A --> B

B --> C

C --> D

D --> E
```

---

# 14. Error Handling Activity

```mermaid
flowchart TD

A([Request])

B{Validation}

C[Validation Error]

D[Business Logic]

E{Exception?}

F[Return Error]

G[Success]

H([End])

A --> B

B -- Invalid --> C --> H

B -- Valid --> D

D --> E

E -- Yes --> F --> H

E -- No --> G --> H
```

---

# 15. Activity Matrix

| Activity | Actor | Output |
|----------|-------|--------|
| Login | Admin | JWT Token |
| View Portfolio | Visitor | Portfolio Page |
| Create Project | Admin | New Project |
| Update Project | Admin | Updated Project |
| Delete Project | Admin | Project Removed |
| Upload Certificate | Admin | Certificate Stored |
| Contact Form | Visitor | Message Saved |
| Download CV | Visitor | PDF Download |
| Read Message | Admin | Message Detail |
| Logout | Admin | Session Closed |

---

# 16. Swimlane Overview

Activity Diagram dapat dikembangkan menggunakan Swimlane.

Contoh Swimlane:

```text
Visitor

↓

Frontend

↓

Backend

↓

Database

↓

Storage

↓

SMTP
```

Swimlane membantu memperjelas tanggung jawab setiap komponen dalam proses bisnis.

---

# 17. Best Practices

- Setiap aktivitas dimulai dengan Initial Node dan diakhiri dengan Final Node.
- Gunakan Decision Node untuk validasi atau percabangan.
- Hindari aktivitas yang terlalu kompleks dalam satu diagram.
- Pisahkan diagram berdasarkan use case utama.
- Dokumentasikan exception flow untuk setiap proses penting.

---

# 18. Summary

Activity Diagram memberikan gambaran lengkap mengenai alur proses bisnis aplikasi Portfolio IT.

Diagram ini menjadi acuan implementasi, pengujian, serta dokumentasi proses bisnis. Dengan memisahkan setiap use case ke dalam diagram tersendiri, alur sistem menjadi lebih mudah dipahami, dipelihara, dan dikembangkan.