# Software Design Document (SDD)

# Chapter 17
# Scalability

Version : 1.0

Project :

Portfolio IT

---

# 1. Overview

Scalability adalah kemampuan sistem untuk menangani peningkatan jumlah pengguna, data, maupun beban kerja tanpa menurunkan kualitas layanan secara signifikan.

Dokumen ini menjelaskan strategi skalabilitas aplikasi Portfolio IT pada sisi:

- Frontend
- Backend
- Database
- Storage
- Network
- Infrastructure

Strategi dirancang agar aplikasi dapat berkembang dari single server menjadi arsitektur multi-server bahkan cloud-native.

---

# 2. Objectives

Tujuan implementasi scalability:

- Mendukung pertumbuhan pengguna.
- Menjaga performa aplikasi.
- Meminimalkan downtime.
- Mengoptimalkan penggunaan resource.
- Memudahkan ekspansi infrastruktur.

---

# 3. Scalability Architecture

```text
                    Internet
                        │
                        ▼
                 Load Balancer
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   App Server 1    App Server 2    App Server 3
        │               │               │
        └───────────────┬───────────────┘
                        ▼
                  Redis Cache
                        │
                        ▼
                 MySQL Primary
                        │
                        ▼
                Read Replica (Future)
                        │
                        ▼
                 Object Storage
```

---

# 4. Scalability Principles

Prinsip yang diterapkan:

- Stateless Application
- Horizontal Scaling
- Vertical Scaling
- Caching First
- Queue-Based Processing
- Loose Coupling
- High Availability
- Fault Tolerance

---

# 5. Vertical Scaling

Vertical Scaling dilakukan dengan meningkatkan kapasitas server.

Contoh:

- CPU 2 Core → 8 Core
- RAM 4 GB → 16 GB
- SSD 100 GB → 500 GB

Kelebihan:

- Implementasi sederhana.
- Tidak memerlukan perubahan aplikasi.

Kekurangan:

- Memiliki batas kapasitas.
- Biaya meningkat seiring spesifikasi server.

---

# 6. Horizontal Scaling

Horizontal Scaling dilakukan dengan menambah jumlah server.

```text
Load Balancer

├── Application Server 1

├── Application Server 2

├── Application Server 3

└── Application Server N
```

Keuntungan:

- Kapasitas bertambah secara bertahap.
- High Availability.
- Fault Tolerance lebih baik.

---

# 7. Stateless Application

Backend harus bersifat stateless.

Data berikut tidak disimpan di memori aplikasi:

- Session
- Cache lokal
- Temporary User State

Sebagai gantinya digunakan:

- JWT
- Redis
- Database
- Object Storage

---

# 8. Load Balancing

Load Balancer bertugas:

- Mendistribusikan request.
- Health Check.
- SSL Termination.
- Reverse Proxy.
- Failover.

Algoritma yang dapat digunakan:

- Round Robin
- Least Connection
- IP Hash

---

# 9. Database Scalability

Tahap awal:

```text
Application

↓

MySQL Primary
```

Tahap lanjutan:

```text
Application

↓

Primary Database

↓

Read Replica
```

Operasi:

- Write → Primary
- Read → Replica

---

# 10. Database Partitioning

Jika volume data meningkat, dapat diterapkan:

- Table Partitioning
- Database Sharding (Future)

Contoh partisi:

- Message
- Audit Log
- Activity Log

---

# 11. Caching Strategy

Redis digunakan untuk:

- API Cache
- Session Cache
- Configuration Cache
- Query Cache
- Rate Limiting

Keuntungan:

- Mengurangi beban database.
- Mempercepat respons aplikasi.

---

# 12. CDN Strategy

CDN digunakan untuk:

- Gambar
- CSS
- JavaScript
- Font
- Dokumen Publik

Manfaat:

- Mengurangi latency.
- Mempercepat akses global.
- Mengurangi trafik server utama.

---

# 13. Queue Scalability

Worker dapat ditambah sesuai kebutuhan.

```text
Queue

↓

Worker 1

Worker 2

Worker 3
```

Digunakan untuk:

- Email
- Thumbnail
- Image Processing
- Notification

---

# 14. Storage Scalability

Tahapan penyimpanan:

Development:

```text
Local Storage
```

Production:

```text
Object Storage
```

Keuntungan:

- Skalabilitas tinggi.
- Durabilitas lebih baik.
- Mendukung distribusi melalui CDN.

---

# 15. Container Scalability

Setiap komponen berjalan dalam container terpisah.

```text
Nginx

Next.js

Laravel

Redis

MySQL

Worker

Scheduler
```

Container dapat direplikasi sesuai kebutuhan.

---

# 16. Orchestration (Future)

Jika aplikasi berkembang, container dapat dikelola menggunakan platform orkestrasi.

Contoh kemampuan:

- Auto Scaling
- Rolling Update
- Self-Healing
- Service Discovery
- Automatic Restart

---

# 17. Auto Scaling Strategy

Auto Scaling dipicu oleh metrik tertentu.

Contoh:

| Metric | Threshold |
|---------|-----------|
| CPU Usage | > 70% |
| Memory Usage | > 80% |
| Request Per Second | > 100 |
| Queue Length | > 500 |

Ketika ambang batas tercapai, sistem dapat menambahkan instance aplikasi secara otomatis.

---

# 18. High Availability

Strategi High Availability:

- Multiple Application Server
- Database Backup
- Health Check
- Load Balancer
- Failover
- Redundant Storage

Target:

Availability ≥ 99.9%

---

# 19. Disaster Recovery

Komponen yang harus memiliki backup:

- Database
- Uploaded File
- Environment Configuration
- Application Configuration

Recovery meliputi:

- Database Restore
- File Restore
- Rollback Deployment
- Health Verification

---

# 20. Scalability Roadmap

## Phase 1

- Single VPS
- Docker Compose
- MySQL
- Redis

## Phase 2

- Reverse Proxy
- CDN
- Queue Worker
- Monitoring

## Phase 3

- Load Balancer
- Multi App Server
- Read Replica
- Object Storage

## Phase 4

- Container Orchestration
- Auto Scaling
- Distributed Cache
- Multi Region Deployment

---

# 21. Scalability Metrics

| Metric | Target |
|----------|---------|
| Concurrent Users | ≥ 500 |
| Requests Per Second | ≥ 100 |
| Average Response Time | ≤ 500 ms |
| Database Connection | < 80% Utilization |
| CPU Usage | < 70% |
| Memory Usage | < 80% |
| Queue Processing | ≤ 5 detik |

---

# 22. Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Database Bottleneck | Redis Cache, Read Replica |
| Traffic Spike | Load Balancer, Auto Scaling |
| File Storage Full | Object Storage |
| Single Point of Failure | Redundansi Server |
| Queue Backlog | Tambah Worker |

---

# 23. Best Practices

- Bangun aplikasi yang stateless.
- Gunakan cache untuk data yang sering diakses.
- Terapkan pagination pada data besar.
- Pisahkan proses berat ke queue.
- Gunakan object storage untuk file.
- Lakukan load testing secara berkala.
- Pantau metrik kapasitas sebelum bottleneck terjadi.
- Dokumentasikan perubahan infrastruktur.

---

# 24. Future Enhancement

Pengembangan berikut dapat dipertimbangkan:

- Multi Region Deployment.
- Database Sharding.
- Event-Driven Architecture.
- Microservices.
- Service Mesh.
- Distributed Tracing.
- Global CDN.
- Multi Cloud Deployment.

---

# 25. Summary

Strategi scalability pada aplikasi Portfolio IT dirancang agar sistem dapat berkembang secara bertahap tanpa memerlukan perubahan arsitektur yang drastis.

Dengan penerapan aplikasi stateless, load balancing, caching, queue processing, database replication, serta infrastruktur yang dapat diskalakan secara horizontal maupun vertikal, aplikasi siap mendukung peningkatan jumlah pengguna dan volume data sekaligus menjaga performa, ketersediaan, dan keandalan layanan.