# Deployment Architecture

Version : 1.0

Project :

Portfolio IT

---

# 1. Overview

Dokumen ini menjelaskan arsitektur deployment aplikasi Portfolio IT pada lingkungan Development, Staging, dan Production.

Tujuan dokumen:

- Menjelaskan arsitektur deployment.
- Menjelaskan infrastruktur server.
- Menjelaskan containerization.
- Menjelaskan pipeline deployment.
- Menjelaskan monitoring.
- Menjelaskan backup.
- Menjelaskan disaster recovery.

---

# 2. Deployment Objectives

Deployment harus memenuhi kebutuhan berikut:

- High Availability
- Security
- Scalability
- Maintainability
- Observability
- Automation

---

# 3. Deployment Architecture

```text
                    Internet
                        │
                        ▼
                 Cloudflare CDN
                        │
                        ▼
                  Nginx Reverse Proxy
                        │
        ┌───────────────┼───────────────┐
        ▼                               ▼
 Next.js Frontend               Laravel REST API
                                        │
                       ┌────────────────┼──────────────┐
                       ▼                ▼              ▼
                    Redis           MySQL 8       Object Storage
```

---

# 4. Environment

Terdapat tiga environment.

| Environment | Purpose |
|------------|---------|
| Development | Pengembangan |
| Staging | Pengujian sebelum production |
| Production | Aplikasi yang digunakan pengguna |

---

# 5. Development Environment

Komponen:

- Docker Desktop
- Docker Compose
- Laravel
- Next.js
- MySQL
- Redis
- Mailpit

Diagram:

```text
Developer

↓

Docker Desktop

↓

Docker Compose

↓

Laravel

Next.js

MySQL

Redis

Mailpit
```

---

# 6. Staging Environment

Digunakan untuk:

- QA
- UAT
- Demo

Memiliki konfigurasi hampir sama dengan production.

---

# 7. Production Environment

Komponen:

```text
Internet

↓

Cloudflare

↓

Nginx

↓

Next.js

↓

Laravel API

↓

Redis

↓

MySQL

↓

Object Storage
```

---

# 8. Server Specification

Development

| Component | Specification |
|-----------|--------------|
| CPU | 4 Core |
| RAM | 8 GB |
| Storage | 100 GB SSD |

Production (Minimum)

| Component | Specification |
|-----------|--------------|
| CPU | 8 Core |
| RAM | 16 GB |
| Storage | 250 GB SSD |

---

# 9. Container Architecture

Container:

```text
portfolio-nginx

portfolio-next

portfolio-api

portfolio-mysql

portfolio-redis

portfolio-worker

portfolio-scheduler
```

---

# 10. Docker Network

```text
frontend-network

backend-network

database-network
```

---

# 11. Volume Mapping

Persistent Volume:

```text
mysql-data

redis-data

storage

logs
```

---

# 12. Reverse Proxy

Nginx bertugas:

- Reverse Proxy
- SSL Termination
- Static File
- Compression
- Cache Header
- Load Balancing (Future)

---

# 13. SSL Configuration

Seluruh traffic menggunakan HTTPS.

Protocol:

```
TLS 1.2
TLS 1.3
```

Redirect:

```
HTTP → HTTPS
```

---

# 14. CI/CD Pipeline

```mermaid
flowchart LR

Developer

-->

Git Repository

-->

Build

-->

Test

-->

Docker Image

-->

Deployment

-->

Production
```

Tahapan:

- Code Push
- Build
- Test
- Static Analysis
- Docker Build
- Deploy

---

# 15. Deployment Strategy

Strategi:

Development

```
Docker Compose
```

Production

```
Rolling Update
```

Future

```
Blue Green Deployment

Canary Deployment
```

---

# 16. Database Deployment

Tahapan:

- Backup
- Migration
- Verification
- Release

Migration dilakukan menggunakan:

```bash
php artisan migrate --force
```

---

# 17. Queue Deployment

Queue Worker:

```
php artisan queue:work
```

Scheduler:

```
php artisan schedule:work
```

---

# 18. Cache Deployment

Deployment harus menjalankan:

```bash
php artisan optimize

php artisan config:cache

php artisan route:cache

php artisan view:cache
```

---

# 19. Monitoring

Monitoring meliputi:

- CPU
- RAM
- Storage
- API
- Database
- Queue
- Response Time

---

# 20. Logging

Log yang disimpan:

- Application
- Access
- Error
- Audit
- Security

Retensi mengikuti dokumen Logging & Monitoring.

---

# 21. Backup Strategy

Backup dilakukan terhadap:

- Database
- Uploaded Files
- Environment Configuration
- Docker Volume

Jadwal:

| Item | Schedule |
|------|----------|
| Database | Harian |
| Storage | Harian |
| Full Backup | Mingguan |

---

# 22. Disaster Recovery

Recovery meliputi:

- Restore Database
- Restore Storage
- Redeploy Application
- Health Check
- Verification

Target:

| Metric | Target |
|---------|--------|
| RTO | ≤ 2 Jam |
| RPO | ≤ 24 Jam |

---

# 23. Security

Deployment harus memenuhi:

- HTTPS Only
- Firewall
- Rate Limiting
- Secret Management
- Environment Variable
- Security Header
- Regular Update

---

# 24. Health Check

Endpoint:

```
GET /health
```

Response:

```json
{
  "status":"UP",
  "database":"UP",
  "cache":"UP",
  "storage":"UP"
}
```

---

# 25. Scaling Strategy

Tahap awal:

Single VPS

↓

Docker Compose

↓

Nginx

↓

Laravel

↓

Next.js

↓

MySQL

↓

Redis

Tahap berikutnya:

Load Balancer

↓

Multiple App Server

↓

Redis

↓

Primary Database

↓

Read Replica

---

# 26. Deployment Checklist

Sebelum deployment:

- [ ] Unit Test
- [ ] Integration Test
- [ ] Build Success
- [ ] Migration Ready
- [ ] Backup Database
- [ ] Backup Storage
- [ ] Environment Variable
- [ ] SSL Certificate
- [ ] Monitoring Ready

Setelah deployment:

- [ ] Health Check
- [ ] API Test
- [ ] Login Test
- [ ] Upload Test
- [ ] Monitoring Verification
- [ ] Log Verification

---

# 27. Best Practices

- Gunakan Infrastructure as Code jika memungkinkan.
- Jangan menyimpan secret di repository.
- Selalu lakukan backup sebelum deployment.
- Gunakan Docker Image Versioning.
- Terapkan deployment otomatis melalui CI/CD.
- Pantau aplikasi setelah deployment.
- Lakukan rollback jika terjadi kegagalan.

---

# 28. Future Enhancement

Roadmap deployment:

- Kubernetes
- Auto Scaling
- Multi Region
- Read Replica
- Distributed Cache
- Service Mesh
- GitOps
- Infrastructure as Code (Terraform)

---

# 29. Summary

Deployment Architecture Portfolio IT dirancang menggunakan pendekatan containerized dengan Docker, Reverse Proxy menggunakan Nginx, Backend Laravel, Frontend Next.js, Redis sebagai cache, dan MySQL sebagai database utama.

Arsitektur ini mendukung deployment yang aman, konsisten, mudah dipelihara, serta siap dikembangkan menuju lingkungan production berskala enterprise melalui implementasi CI/CD, monitoring, backup, dan strategi skalabilitas yang terdokumentasi.