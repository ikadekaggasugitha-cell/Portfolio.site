# Software Design Document (SDD)

# Chapter 15
# Logging & Monitoring

Version : 1.0

Project :

Portfolio IT

---

# 1. Overview

Bab ini menjelaskan strategi Logging dan Monitoring pada aplikasi Portfolio IT.

Tujuan utama implementasi Logging & Monitoring adalah:

- Mempermudah troubleshooting.
- Memantau kesehatan aplikasi.
- Mengidentifikasi bottleneck performa.
- Mendeteksi error secara dini.
- Mendukung audit dan investigasi.
- Menyediakan observability terhadap sistem.

Monitoring dilakukan secara real-time, sedangkan logging digunakan sebagai sumber informasi historis.

---

# 2. Objectives

Implementasi Logging & Monitoring bertujuan untuk:

- Memantau performa aplikasi.
- Mendeteksi error.
- Mengumpulkan metrik sistem.
- Mendukung audit trail.
- Mempermudah proses debugging.
- Menghasilkan alert otomatis.

---

# 3. Observability Architecture

Observability terdiri dari tiga pilar utama:

- Logs
- Metrics
- Traces

Diagram:

```text
Application

│

├── Logs

├── Metrics

└── Traces

↓

Monitoring Platform

↓

Dashboard

↓

Alert

↓

Developer
```

---

# 4. Logging Architecture

```mermaid
flowchart TD

Application

-->

Logger

-->

Log Storage

-->

Dashboard

-->

Developer
```

Semua log berasal dari satu mekanisme logging yang terpusat.

---

# 5. Monitoring Architecture

```mermaid
flowchart LR

Application

-->

Metrics Collector

-->

Monitoring Server

-->

Dashboard

-->

Alert

-->

Administrator
```

---

# 6. Logging Categories

Log dibagi menjadi beberapa kategori.

| Category | Description |
|----------|-------------|
| Application Log | Aktivitas aplikasi |
| Access Log | HTTP Request |
| Error Log | Error aplikasi |
| Audit Log | Aktivitas pengguna |
| Security Log | Aktivitas keamanan |
| Performance Log | Performa aplikasi |
| Database Log | Aktivitas database |

---

# 7. Log Level Standard

| Level | Description |
|--------|-------------|
| DEBUG | Informasi debugging |
| INFO | Aktivitas normal |
| NOTICE | Informasi penting |
| WARNING | Potensi masalah |
| ERROR | Kesalahan aplikasi |
| CRITICAL | Gangguan serius |
| ALERT | Memerlukan tindakan segera |
| EMERGENCY | Sistem tidak dapat digunakan |

---

# 8. Structured Logging

Format log menggunakan JSON.

Contoh:

```json
{
  "timestamp": "2026-07-03T10:30:00Z",
  "level": "INFO",
  "service": "portfolio-api",
  "request_id": "REQ-874512",
  "user_id": 1,
  "module": "Project",
  "action": "Create Project",
  "message": "Project created successfully."
}
```

Keuntungan:

- Mudah diproses.
- Mudah dicari.
- Mudah diintegrasikan dengan sistem monitoring.

---

# 9. Request Correlation

Setiap request memiliki Request ID unik.

Alur:

```text
Client

↓

API Gateway

↓

Middleware

↓

Request ID

↓

Application

↓

Logger
```

Request ID digunakan untuk melacak satu transaksi end-to-end.

---

# 10. Audit Logging

Aktivitas berikut wajib dicatat:

- Login
- Logout
- Gagal Login
- Create Project
- Update Project
- Delete Project
- Upload Certificate
- Download CV (Opsional)
- Pengubahan Profil
- Penghapusan Data

Audit log tidak boleh dapat diubah oleh pengguna biasa.

---

# 11. Access Logging

Data yang dicatat:

- HTTP Method
- URL
- Response Time
- HTTP Status
- IP Address
- User Agent
- Request ID

Contoh:

```text
GET /api/projects
200
35ms
```

---

# 12. Error Logging

Error log minimal berisi:

- Timestamp
- Error Code
- Request ID
- Module
- Exception Type
- Stack Trace (Development)
- Message

Pada lingkungan production, stack trace tidak dikirim ke client tetapi tetap disimpan di log internal.

---

# 13. Security Logging

Peristiwa keamanan yang dicatat:

- Login gagal berulang.
- Percobaan akses tanpa izin.
- Perubahan hak akses.
- Token tidak valid.
- Permintaan yang terkena rate limiting.

---

# 14. Performance Logging

Metrik yang dicatat:

- Response Time
- Query Time
- Memory Usage
- CPU Usage
- Cache Hit Ratio
- Queue Processing Time

---

# 15. Monitoring Metrics

Metrik utama yang dipantau:

| Metric | Description |
|---------|-------------|
| CPU Usage | Penggunaan CPU |
| Memory Usage | Penggunaan RAM |
| Disk Usage | Penggunaan Penyimpanan |
| Response Time | Waktu respons API |
| Request Per Minute | Trafik aplikasi |
| Error Rate | Rasio error |
| Active Users | Pengguna aktif |
| Queue Length | Jumlah antrean |
| Database Connections | Koneksi database |

---

# 16. Health Check

Endpoint kesehatan sistem:

```text
GET /health
```

Contoh respons:

```json
{
  "status": "UP",
  "database": "UP",
  "storage": "UP",
  "cache": "UP",
  "version": "1.0.0"
}
```

Status yang mungkin:

- UP
- DEGRADED
- DOWN

---

# 17. Alert Strategy

Alert dikirim apabila:

- CPU > 80%
- Memory > 85%
- Disk > 90%
- Error Rate > 5%
- Response Time > 2 detik
- Database Down
- Queue Failure
- SSL akan kedaluwarsa

---

# 18. Dashboard Monitoring

Dashboard menampilkan:

- Response Time
- API Requests
- Active Users
- Error Rate
- CPU Usage
- Memory Usage
- Disk Usage
- Queue Status
- Database Health
- Storage Usage

---

# 19. Log Retention Policy

| Log Type | Retention |
|----------|-----------|
| Access Log | 30 Hari |
| Error Log | 90 Hari |
| Audit Log | 1 Tahun |
| Security Log | 1 Tahun |
| Performance Log | 90 Hari |

Retensi dapat disesuaikan dengan kebutuhan organisasi dan regulasi yang berlaku.

---

# 20. Monitoring Flow

```mermaid
flowchart LR

Application

-->

Logger

-->

Log Storage

-->

Monitoring

-->

Dashboard

-->

Alert

-->

Developer
```

---

# 21. Incident Response

Langkah penanganan insiden:

1. Alert diterima.
2. Verifikasi insiden.
3. Analisis log.
4. Identifikasi akar masalah.
5. Perbaikan.
6. Verifikasi.
7. Dokumentasi insiden.
8. Post-Incident Review.

---

# 22. SLA, SLI, dan SLO

## Service Level Indicator (SLI)

- Availability
- Response Time
- Error Rate

## Service Level Objective (SLO)

| Indicator | Target |
|-----------|---------|
| Availability | ≥ 99.9% |
| Response Time | ≤ 500 ms (rata-rata) |
| Error Rate | < 1% |

## Service Level Agreement (SLA)

SLA dapat ditetapkan sesuai kebutuhan organisasi atau pelanggan apabila aplikasi digunakan secara komersial.

---

# 23. Best Practices

- Gunakan structured logging.
- Hindari menyimpan password atau token pada log.
- Gunakan Request ID untuk tracing.
- Terapkan monitoring real-time.
- Gunakan alert otomatis.
- Pisahkan log berdasarkan kategori.
- Rotasi log secara berkala.
- Uji endpoint health check secara berkala.

---

# 24. Future Enhancement

Pengembangan berikut dapat dipertimbangkan:

- OpenTelemetry
- Distributed Tracing
- Centralized Log Management
- Application Performance Monitoring (APM)
- Real-Time Notification
- Anomaly Detection
- Dashboard khusus Business Metrics

---

# 25. Summary

Logging & Monitoring merupakan bagian penting dari operasional aplikasi Portfolio IT.

Dengan penerapan structured logging, monitoring metrik, health check, audit logging, serta strategi alert yang jelas, sistem menjadi lebih mudah dipantau, dianalisis, dan dipelihara. Pendekatan observability juga membantu tim pengembang mengidentifikasi serta menyelesaikan masalah secara lebih cepat dan konsisten.