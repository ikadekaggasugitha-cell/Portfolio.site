# Software Design Document (SDD)

# Chapter 13
# Security Architecture

Version : 1.0

Project :

Portfolio IT

---

# 1. Overview

Bab ini menjelaskan arsitektur keamanan (Security Architecture) yang diterapkan pada aplikasi Portfolio IT.

Tujuan utama Security Architecture adalah:

- Melindungi data pengguna.
- Melindungi data administrator.
- Mengamankan komunikasi antar komponen.
- Mencegah serangan umum pada aplikasi web.
- Menjamin kerahasiaan, integritas, dan ketersediaan sistem (CIA Triad).

Dokumen ini mengikuti praktik terbaik dari OWASP dan NIST.

---

# 2. Security Objectives

Target keamanan aplikasi:

- Confidentiality
- Integrity
- Availability
- Authentication
- Authorization
- Accountability
- Non-Repudiation

---

# 3. Security Principles

Arsitektur keamanan menerapkan prinsip berikut:

- Least Privilege
- Defense in Depth
- Zero Trust
- Secure by Default
- Fail Secure
- Separation of Duties
- Principle of Least Knowledge

---

# 4. High Level Security Architecture

```text
                     Internet
                         │
                         ▼
                  HTTPS / TLS
                         │
                         ▼
                  Reverse Proxy
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
      Next.js                     Laravel API
          │                             │
          ▼                             ▼
 Authentication                 Authorization
          │                             │
          └──────────────┬──────────────┘
                         ▼
                      MySQL
                         │
                         ▼
                 Encrypted Storage
```

---

# 5. Security Layers

```text
User

↓

HTTPS

↓

Firewall

↓

Reverse Proxy

↓

Application

↓

Authentication

↓

Authorization

↓

Business Logic

↓

Database

↓

Encrypted Storage
```

Keamanan diterapkan pada setiap lapisan sistem.

---

# 6. Authentication

Metode autentikasi:

- Email & Password
- JWT Access Token
- Refresh Token (Opsional)
- Secure Session Management

### Password Policy

Minimal:

- 8 karakter
- Huruf besar
- Huruf kecil
- Angka
- Karakter khusus (disarankan)

Password tidak pernah disimpan dalam bentuk plaintext.

---

# 7. Password Hashing

Password menggunakan algoritma:

```
bcrypt
```

atau

```
Argon2id
```

Laravel menggunakan hashing bawaan (`Hash::make()`), sehingga password tidak dapat dikembalikan ke bentuk aslinya.

---

# 8. Authorization

Menggunakan Role-Based Access Control (RBAC).

### Roles

| Role | Access |
|------|--------|
| Visitor | Read Public Portfolio |
| Admin | Full CRUD |
| Super Admin (Future) | System Management |

Semua endpoint privat wajib melalui middleware autentikasi.

---

# 9. JWT Security

JWT digunakan untuk autentikasi API.

Best practice:

- Access Token memiliki masa berlaku terbatas.
- Token dikirim melalui header `Authorization: Bearer <token>`.
- Token dicabut saat logout.
- Gunakan HTTPS agar token tidak dapat disadap.

---

# 10. Secure Communication

Seluruh komunikasi menggunakan:

```
HTTPS
TLS 1.2+
```

HTTP akan diarahkan (redirect) ke HTTPS.

Header keamanan yang direkomendasikan:

- Strict-Transport-Security (HSTS)
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Permissions-Policy

---

# 11. Input Validation

Semua input divalidasi di Backend.

Contoh validasi:

- Required Field
- Maximum Length
- Email Format
- URL Format
- MIME Type File
- File Size
- Allowed Extension

Frontend hanya melakukan validasi untuk meningkatkan pengalaman pengguna (UX), bukan sebagai pengganti validasi server.

---

# 12. SQL Injection Protection

Proteksi dilakukan dengan:

- Laravel Eloquent ORM
- Query Builder
- Parameter Binding
- Tidak menggunakan query mentah (raw query) tanpa parameter

Contoh:

```php
User::where('email', $email)->first();
```

---

# 13. Cross Site Scripting (XSS)

Proteksi:

- Output Encoding
- Escaping HTML
- Sanitasi Input
- React Auto Escaping
- Hindari penggunaan `dangerouslySetInnerHTML` kecuali benar-benar diperlukan.

---

# 14. Cross Site Request Forgery (CSRF)

Untuk aplikasi berbasis session:

- Gunakan CSRF Token.

Untuk REST API berbasis JWT:

- Gunakan Authorization Header.
- Nonaktifkan endpoint yang tidak digunakan.
- Terapkan CORS yang ketat.

---

# 15. File Upload Security

Semua file diperiksa sebelum disimpan.

Validasi meliputi:

- MIME Type
- Extension
- Maximum Size
- Virus Scan (Future)
- Rename File
- Random File Name

File disimpan di luar direktori publik apabila memungkinkan.

---

# 16. Access Control

Setiap endpoint memiliki aturan akses.

Contoh:

| Endpoint | Visitor | Admin |
|----------|----------|--------|
| GET /projects | ✅ | ✅ |
| POST /projects | ❌ | ✅ |
| PUT /projects | ❌ | ✅ |
| DELETE /projects | ❌ | ✅ |
| POST /messages | ✅ | ✅ |
| GET /messages | ❌ | ✅ |

---

# 17. Rate Limiting

Rate limiting diterapkan untuk mencegah penyalahgunaan API.

Contoh:

- Login : 5 request/menit
- Contact Form : 10 request/menit
- Public API : 60 request/menit

---

# 18. Secure Headers

Header HTTP yang direkomendasikan:

| Header | Purpose |
|---------|---------|
| HSTS | Memaksa HTTPS |
| X-Frame-Options | Mencegah Clickjacking |
| X-Content-Type-Options | Mencegah MIME Sniffing |
| Referrer-Policy | Mengontrol informasi referrer |
| Content-Security-Policy | Membatasi sumber konten |

---

# 19. Secrets Management

Rahasia aplikasi tidak boleh disimpan di source code.

Contoh:

- Database Password
- JWT Secret
- SMTP Password
- API Key

Gunakan:

- `.env`
- Secret Manager (Future)
- CI/CD Secret

---

# 20. Logging & Audit Trail

Semua aktivitas penting dicatat.

Contoh:

- Login
- Logout
- Gagal Login
- Create Project
- Update Project
- Delete Project
- Upload File

Audit log sebaiknya tidak dapat dimodifikasi oleh pengguna biasa.

---

# 21. Backup Security

Backup harus:

- Dienkripsi.
- Disimpan di lokasi terpisah.
- Memiliki kebijakan retensi.
- Diuji proses pemulihannya secara berkala.

---

# 22. OWASP Top 10 Mitigation

| Risk | Mitigation |
|------|------------|
| Broken Access Control | RBAC, Middleware |
| Cryptographic Failures | HTTPS, bcrypt/Argon2id |
| Injection | ORM, Parameter Binding |
| Insecure Design | Code Review, SDD |
| Security Misconfiguration | Environment Configuration |
| Vulnerable Components | Dependency Update |
| Identification & Authentication Failures | JWT, Password Policy |
| Software Integrity Failures | CI/CD Verification |
| Logging & Monitoring Failures | Audit Log |
| SSRF | Validasi URL dan pembatasan akses keluar |

---

# 23. Security Checklist

## Development

- [ ] Input Validation
- [ ] Output Encoding
- [ ] Secure Password Hashing
- [ ] No Hardcoded Secret
- [ ] Unit Test

## Staging

- [ ] HTTPS
- [ ] Firewall
- [ ] Vulnerability Scan
- [ ] Penetration Test
- [ ] Backup Test

## Production

- [ ] SSL Certificate
- [ ] Monitoring
- [ ] Logging
- [ ] Rate Limiting
- [ ] Secret Rotation
- [ ] Backup Automation

---

# 24. Future Security Enhancement

Untuk pengembangan selanjutnya dapat ditambahkan:

- Multi-Factor Authentication (MFA)
- OAuth2 / OpenID Connect
- Web Application Firewall (WAF)
- Intrusion Detection System (IDS)
- Intrusion Prevention System (IPS)
- Security Information and Event Management (SIEM)
- Malware Scanning untuk File Upload
- Security Event Notification
- Single Sign-On (SSO)

---

# 25. Summary

Security Architecture menjadi pedoman implementasi keamanan pada aplikasi Portfolio IT.

Dengan menerapkan autentikasi yang aman, otorisasi berbasis peran, komunikasi terenkripsi, validasi input, pengelolaan rahasia yang benar, serta mitigasi terhadap risiko OWASP Top 10, aplikasi memiliki fondasi keamanan yang kuat dan siap dikembangkan untuk kebutuhan produksi.