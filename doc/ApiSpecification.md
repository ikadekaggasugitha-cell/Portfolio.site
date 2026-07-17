# ApiSpecification.md

# Portfolio IT - REST API Specification

**Version:** 1.0  
**Tanggal:** 03 Juli 2026

---

# 1. Overview

Dokumen ini menjelaskan spesifikasi REST API untuk aplikasi Portfolio IT.

Base URL

```
https://api.portfolio.com/api/v1
```

Content Type

```
application/json
```

Authentication

```
Bearer Token (JWT)
```

---

# 2. HTTP Status Code

| Code | Keterangan |
|-------|------------|
|200|Success|
|201|Created|
|204|No Content|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|422|Validation Error|
|500|Internal Server Error|

---

# 3. Authentication

## Login

POST

```
/auth/login
```

Request

```json
{
    "email":"admin@email.com",
    "password":"password"
}
```

Response

```json
{
    "success": true,
    "message":"Login Success",
    "token":"JWT_TOKEN",
    "expires_in":3600
}
```

---

## Logout

POST

```
/auth/logout
```

Header

```
Authorization: Bearer TOKEN
```

Response

```json
{
    "success":true
}
```

---

# 4. Profile

## Get Profile

GET

```
/profile
```

Response

```json
{
    "id":1,
    "name":"I Kadek Agga Sugitha",
    "title":"Fullstack Software Engineer",
    "github":"https://github.com/username",
    "linkedin":"https://linkedin.com/in/username"
}
```

---

## Update Profile

PUT

```
/profile
```

Request

```json
{
    "name":"I Kadek Agga Sugitha",
    "title":"Software Engineer",
    "description":"..."
}
```

---

# 5. Skills

## Get Skills

GET

```
/skills
```

---

## Create Skill

POST

```
/skills
```

Request

```json
{
    "skill_name":"Laravel",
    "level":5
}
```

---

## Update Skill

PUT

```
/skills/{id}
```

---

## Delete Skill

DELETE

```
/skills/{id}
```

---

# 6. Experiences

## List Experience

GET

```
/experiences
```

---

## Detail Experience

GET

```
/experiences/{id}
```

---

## Create Experience

POST

```
/experiences
```

Request

```json
{
    "company":"PT ABC",
    "position":"Software Engineer",
    "start_date":"2025-01-01",
    "end_date":null,
    "description":"..."
}
```

---

## Update Experience

PUT

```
/experiences/{id}
```

---

## Delete Experience

DELETE

```
/experiences/{id}
```

---

# 7. Projects

## List Project

GET

```
/projects
```

Query Parameter

|Parameter|Type|
|----------|----|
|page|integer|
|search|string|
|technology|string|

---

## Detail Project

GET

```
/projects/{id}
```

---

## Create Project

POST

```
/projects
```

Request

```json
{
    "title":"HRIS System",
    "description":"Project Description",
    "github_url":"https://github.com/",
    "demo_url":"https://demo.com"
}
```

---

## Update Project

PUT

```
/projects/{id}
```

---

## Delete Project

DELETE

```
/projects/{id}
```

---

# 8. Upload Project Image

POST

```
/projects/{id}/images
```

Content Type

```
multipart/form-data
```

Field

|Field|Type|
|------|----|
|image|File|

---

## Delete Image

DELETE

```
/projects/images/{id}
```

---

# 9. Certificates

## Get Certificates

GET

```
/certificates
```

---

## Create Certificate

POST

```
/certificates
```

Content Type

```
multipart/form-data
```

---

## Update Certificate

PUT

```
/certificates/{id}
```

---

## Delete Certificate

DELETE

```
/certificates/{id}
```

---

# 10. Messages

## Send Message

POST

```
/messages
```

Request

```json
{
    "name":"John",
    "email":"john@email.com",
    "subject":"Hiring",
    "message":"Hello..."
}
```

---

## Get Messages

GET

```
/messages
```

Authorization

```
Bearer Token
```

---

## Read Message

GET

```
/messages/{id}
```

---

## Delete Message

DELETE

```
/messages/{id}
```

---

# 11. Response Format

Success

```json
{
    "success":true,
    "message":"Success",
    "data":{}
}
```

Validation Error

```json
{
    "success":false,
    "message":"Validation Error",
    "errors":{
        "email":[
            "Email is required."
        ]
    }
}
```

Server Error

```json
{
    "success":false,
    "message":"Internal Server Error"
}
```

---

# 12. Authentication Flow

```
Login

↓

JWT Token

↓

Frontend menyimpan Token

↓

Authorization Header

↓

Backend Validation

↓

API Response
```

---

# 13. API Security

- JWT Authentication
- HTTPS Only
- Rate Limiting
- Input Validation
- SQL Injection Protection
- XSS Protection
- File Upload Validation
- MIME Type Validation

---

# 14. Endpoint Summary

| Module | Endpoint |
|---------|----------|
| Authentication | 2 |
| Profile | 2 |
| Skills | 4 |
| Experience | 5 |
| Projects | 6 |
| Certificates | 4 |
| Messages | 4 |

Total Endpoint

**27 Endpoint**

---

# 15. Future Enhancement

- OpenAPI 3.1
- Swagger UI
- OAuth2 Login
- Refresh Token
- API Versioning
- Webhook Notification