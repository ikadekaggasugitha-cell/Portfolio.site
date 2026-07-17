# Software Design Document (SDD)

# Chapter 16
# Performance & Optimization

Version : 1.0

Project :

Portfolio IT

---

# 1. Overview

Bab ini menjelaskan strategi optimasi performa aplikasi Portfolio IT.

Performance menjadi salah satu Non-Functional Requirement (NFR) yang penting karena memengaruhi:

- User Experience
- Server Cost
- SEO
- Scalability
- Availability

Seluruh optimasi dilakukan pada Frontend, Backend, Database, Network, Storage, dan Infrastructure.

---

# 2. Objectives

Tujuan optimasi performa:

- Mempercepat waktu loading halaman.
- Mengurangi penggunaan resource server.
- Mengoptimalkan query database.
- Mengurangi latency API.
- Meningkatkan throughput sistem.
- Menjaga performa ketika jumlah pengguna bertambah.

---

# 3. Performance Architecture

```text
Client Browser

↓

CDN

↓

Nginx Reverse Proxy

↓

Next.js

↓

Laravel API

↓

Redis Cache

↓

MySQL

↓

Storage
```

Strategi optimasi diterapkan pada setiap lapisan arsitektur.

---

# 4. Performance Targets

| Metric | Target |
|---------|---------|
| Homepage Load Time | ≤ 2 detik |
| API Response Time (Average) | ≤ 500 ms |
| Database Query | ≤ 100 ms |
| Largest Contentful Paint (LCP) | ≤ 2.5 detik |
| First Contentful Paint (FCP) | ≤ 1.8 detik |
| Time to Interactive (TTI) | ≤ 3 detik |
| Cumulative Layout Shift (CLS) | ≤ 0.1 |
| API Error Rate | < 1% |
| Availability | ≥ 99.9% |

---

# 5. Frontend Optimization

Optimasi pada Next.js meliputi:

- Server Side Rendering (SSR) sesuai kebutuhan.
- Static Site Generation (SSG) untuk halaman statis.
- Incremental Static Regeneration (ISR) jika data berubah secara berkala.
- Dynamic Import.
- Code Splitting.
- Tree Shaking.
- Lazy Loading.
- Prefetching Route.
- Font Optimization.
- Image Optimization.

---

# 6. Image Optimization

Semua gambar harus:

- Menggunakan format modern (WebP atau AVIF jika memungkinkan).
- Dikompresi sebelum diunggah.
- Memiliki ukuran yang sesuai.
- Menggunakan responsive image.
- Menggunakan lazy loading.

Contoh ukuran maksimum:

| Asset | Maximum Size |
|---------|--------------|
| Profile Image | 500 KB |
| Project Image | 1 MB |
| Certificate | 2 MB |

---

# 7. Static Asset Optimization

Aset statis meliputi:

- CSS
- JavaScript
- Font
- Icon
- Image

Strategi:

- Minification
- Compression (Gzip/Brotli)
- Cache-Control Header
- CDN Delivery

---

# 8. Backend Optimization

Laravel dioptimalkan dengan:

- Route Cache
- Config Cache
- View Cache
- OPcache
- Queue Worker
- Asynchronous Processing
- Dependency Injection
- Efficient Service Layer

Perintah deployment:

```bash
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

# 9. API Performance

Strategi optimasi API:

- Pagination.
- Filtering.
- Sorting.
- Selective Field.
- Compression.
- Cache Response.
- Hindari N+1 Query.
- Gunakan eager loading.

Contoh:

```php
Project::with('images')->paginate(10);
```

---

# 10. Database Optimization

Optimasi database meliputi:

- Index pada kolom pencarian.
- Foreign Key.
- Query Optimization.
- Normalisasi hingga 3NF.
- Eager Loading.
- Pagination.
- Connection Pooling (jika tersedia).

Kolom yang direkomendasikan untuk indeks:

- email
- slug
- created_at
- project_id
- category_id

---

# 11. Caching Strategy

Jenis cache yang digunakan:

| Cache | Description |
|--------|-------------|
| Configuration Cache | Konfigurasi aplikasi |
| Route Cache | Routing Laravel |
| Query Cache | Data yang sering diakses |
| Response Cache | Respons API publik |
| Session Cache | Data sesi pengguna |

Redis direkomendasikan sebagai cache server.

---

# 12. Queue Optimization

Proses berikut dijalankan secara asynchronous:

- Pengiriman Email
- Optimasi Gambar
- Pembuatan Thumbnail
- Pengiriman Notifikasi

Manfaat:

- Respons API lebih cepat.
- Beban server lebih stabil.

---

# 13. File Storage Optimization

Strategi:

- Simpan file di Object Storage untuk produksi.
- Gunakan URL bertanda tangan (signed URL) jika diperlukan.
- Hindari penyimpanan file besar di database.
- Gunakan CDN untuk distribusi file publik.

---

# 14. Network Optimization

Optimasi jaringan:

- HTTPS
- HTTP/2 atau HTTP/3 (jika tersedia)
- Keep-Alive Connection
- Gzip/Brotli Compression
- CDN
- DNS Caching

---

# 15. Memory Optimization

Praktik yang diterapkan:

- Hindari memuat data dalam jumlah besar ke memori.
- Gunakan pagination.
- Lepaskan resource setelah digunakan.
- Hindari objek yang tidak diperlukan.
- Optimalkan proses batch.

---

# 16. Query Optimization

Contoh query yang kurang efisien:

```php
Project::all();
```

Optimasi:

```php
Project::select('id', 'title', 'slug')
    ->latest()
    ->paginate(10);
```

Prinsip:

- Ambil hanya kolom yang diperlukan.
- Gunakan limit atau pagination.
- Hindari query berulang.

---

# 17. Performance Monitoring

Metrik yang dipantau:

- API Response Time
- Slow Query
- Cache Hit Ratio
- CPU Usage
- Memory Usage
- Queue Processing Time
- Database Connection
- Disk I/O

---

# 18. Load Testing

Skenario pengujian:

| Scenario | Target |
|----------|---------|
| Concurrent Users | 100 |
| Requests per Second | ≥ 50 |
| Average Response Time | ≤ 500 ms |
| Error Rate | < 1% |

Tools yang direkomendasikan:

- k6
- Apache JMeter
- Locust

---

# 19. Performance Budget

| Component | Target |
|-----------|--------|
| HTML | ≤ 100 KB |
| CSS | ≤ 200 KB |
| JavaScript | ≤ 500 KB |
| Image (Homepage) | ≤ 1 MB |
| API Response | ≤ 100 KB |

Performance budget membantu menjaga ukuran aset agar tidak terus bertambah tanpa kontrol.

---

# 20. Performance Testing Flow

```mermaid
flowchart LR

Developer

-->

Performance Test

-->

Analysis

-->

Optimization

-->

Retest

-->

Deployment
```

---

# 21. Key Performance Indicators (KPI)

| KPI | Target |
|-----|---------|
| Availability | ≥ 99.9% |
| API Latency | ≤ 500 ms |
| Page Load | ≤ 2 detik |
| Error Rate | < 1% |
| Cache Hit Ratio | ≥ 80% |
| Database Query | ≤ 100 ms |

---

# 22. Best Practices

- Gunakan pagination untuk data besar.
- Hindari query N+1.
- Terapkan caching pada data yang sering diakses.
- Gunakan lazy loading untuk gambar dan komponen.
- Minify aset sebelum deployment.
- Optimalkan ukuran gambar.
- Pantau performa secara berkala.
- Lakukan load testing sebelum rilis.

---

# 23. Future Enhancement

Peningkatan yang dapat dipertimbangkan:

- Full Page Cache.
- Edge Caching.
- CDN Global.
- Database Read Replica.
- Horizontal Auto Scaling.
- Distributed Cache.
- Background Job Prioritization.
- Real User Monitoring (RUM).
- Application Performance Monitoring (APM).

---

# 24. Summary

Performance & Optimization memastikan aplikasi Portfolio IT tetap cepat, efisien, dan responsif pada berbagai kondisi penggunaan.

Dengan menerapkan optimasi pada frontend, backend, database, jaringan, caching, dan penyimpanan, aplikasi mampu memberikan pengalaman pengguna yang baik sekaligus mengurangi beban infrastruktur. Seluruh strategi ini harus didukung oleh monitoring, load testing, dan evaluasi berkala agar performa tetap terjaga seiring pertumbuhan aplikasi.