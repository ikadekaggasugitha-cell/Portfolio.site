# User Acceptance Testing (UAT)

Version : 1.0

Project :

Portfolio IT

---

# 1. Overview

User Acceptance Testing (UAT) adalah proses pengujian yang dilakukan oleh pengguna atau perwakilan bisnis untuk memastikan bahwa aplikasi Portfolio IT telah memenuhi kebutuhan bisnis dan siap digunakan pada lingkungan produksi.

Tujuan UAT:

- Memastikan seluruh kebutuhan bisnis telah terpenuhi.
- Memastikan fitur berjalan sesuai PRD.
- Memastikan aplikasi siap digunakan pengguna.
- Mengidentifikasi masalah sebelum Go-Live.

---

# 2. Scope

Fitur yang diuji:

- Authentication
- Dashboard
- Profile
- Project
- Skills
- Experience
- Education
- Certificate
- Contact Form
- Responsive Layout

---

# 3. UAT Environment

| Item | Value |
|------|-------|
| Environment | Staging |
| Frontend | Next.js |
| Backend | Laravel |
| Database | MySQL |
| Browser | Chrome, Firefox, Edge, Safari |
| Device | Desktop, Tablet, Mobile |

---

# 4. Entry Criteria

UAT dapat dimulai apabila:

- Seluruh fitur selesai dikembangkan.
- Unit Test lulus.
- Integration Test lulus.
- API Test lulus.
- Bug kritis telah diperbaiki.
- Dokumentasi tersedia.

---

# 5. Exit Criteria

UAT dinyatakan selesai apabila:

- Seluruh test case Mandatory berstatus **Pass**.
- Tidak ada bug Critical atau High yang terbuka.
- Product Owner memberikan persetujuan.
- Dokumen hasil UAT ditandatangani.

---

# 6. Roles & Responsibilities

| Role | Responsibility |
|------|----------------|
| Product Owner | Menyetujui hasil UAT |
| Business Analyst | Menyiapkan test case |
| QA Engineer | Mendampingi pengujian |
| Developer | Memperbaiki bug |
| End User | Melakukan pengujian |

---

# 7. Test Data

Contoh data:

## User

Email

```
admin@example.com
```

Password

```
Password123!
```

## Project

Title

```
Portfolio Website
```

Category

```
Web Development
```

---

# 8. Test Case Format

| Field | Description |
|------|-------------|
| Test Case ID | Nomor test case |
| Module | Modul |
| Scenario | Skenario |
| Pre-condition | Kondisi awal |
| Steps | Langkah pengujian |
| Expected Result | Hasil yang diharapkan |
| Actual Result | Hasil aktual |
| Status | Pass / Fail |
| Tester | Nama penguji |
| Date | Tanggal |

---

# 9. Authentication Test Cases

### UAT-AUTH-001

Scenario

Login dengan akun valid.

Expected Result

- Berhasil login.
- Dashboard tampil.
- Token tersimpan.

Status

```
Pass
```

---

### UAT-AUTH-002

Scenario

Login menggunakan password salah.

Expected Result

Pesan:

```
Invalid credentials.
```

---

### UAT-AUTH-003

Scenario

Logout.

Expected Result

- Session berakhir.
- Kembali ke halaman login.

---

# 10. Profile Test Cases

### UAT-PROFILE-001

Scenario

Melihat profil.

Expected Result

Data profil tampil lengkap.

---

### UAT-PROFILE-002

Scenario

Mengubah profil.

Expected Result

Perubahan berhasil disimpan.

---

### UAT-PROFILE-003

Scenario

Upload foto profil.

Expected Result

Foto berhasil diperbarui.

---

# 11. Project Test Cases

### UAT-PROJECT-001

Tambah Project.

Expected Result

Project berhasil dibuat.

---

### UAT-PROJECT-002

Edit Project.

Expected Result

Perubahan tersimpan.

---

### UAT-PROJECT-003

Hapus Project.

Expected Result

Project berhasil dihapus.

---

# 12. Skill Test Cases

### UAT-SKILL-001

Tambah Skill.

Expected Result

Skill berhasil ditambahkan.

---

### UAT-SKILL-002

Edit Skill.

Expected Result

Skill berhasil diperbarui.

---

### UAT-SKILL-003

Hapus Skill.

Expected Result

Skill berhasil dihapus.

---

# 13. Experience Test Cases

Scenario:

- Tambah Experience
- Edit Experience
- Delete Experience

Expected Result

CRUD berhasil.

---

# 14. Education Test Cases

Scenario

CRUD Education.

Expected Result

Seluruh proses berhasil.

---

# 15. Certificate Test Cases

Scenario

Upload Certificate.

Expected Result

File berhasil diunggah.

---

Scenario

Delete Certificate.

Expected Result

File berhasil dihapus.

---

# 16. Contact Form Test Cases

Scenario

Mengirim pesan.

Expected Result

Pesan berhasil terkirim.

---

Scenario

Input tidak valid.

Expected Result

Muncul validasi pada field yang sesuai.

---

# 17. Responsive Testing

Perangkat yang diuji:

| Device | Resolution |
|---------|------------|
| Mobile | 375×667 |
| Tablet | 768×1024 |
| Laptop | 1366×768 |
| Desktop | 1920×1080 |

Expected Result

Layout tetap responsif dan dapat digunakan dengan baik.

---

# 18. Browser Compatibility

Browser yang diuji:

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

Expected Result

Fitur berjalan konsisten pada seluruh browser yang didukung.

---

# 19. Non-Functional Testing

Pengujian meliputi:

- Performance
- Security
- Usability
- Compatibility
- Accessibility

Target:

| Metric | Target |
|---------|--------|
| Homepage Load Time | ≤ 2 detik |
| API Response | ≤ 500 ms |
| Availability | ≥ 99.9% |

---

# 20. Defect Severity

| Severity | Description |
|----------|-------------|
| Critical | Sistem tidak dapat digunakan |
| High | Fitur utama gagal |
| Medium | Sebagian fungsi terganggu |
| Low | Masalah minor atau kosmetik |

---

# 21. Defect Report Template

| Field | Description |
|------|-------------|
| Defect ID | Nomor bug |
| Module | Modul terkait |
| Description | Deskripsi masalah |
| Severity | Tingkat keparahan |
| Priority | Prioritas |
| Status | Open / Fixed / Closed |
| Assigned To | Developer |
| Reported By | Tester |

---

# 22. UAT Summary Report

| Module | Total TC | Pass | Fail |
|---------|----------|------|------|
| Authentication | 3 | | |
| Profile | 3 | | |
| Project | 3 | | |
| Skills | 3 | | |
| Experience | 3 | | |
| Education | 3 | | |
| Certificate | 2 | | |
| Contact | 2 | | |

Diisi setelah seluruh pengujian selesai.

---

# 23. Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Business Analyst | | | |
| QA Engineer | | | |
| Project Manager | | | |

Dokumen dianggap sah setelah seluruh pihak terkait memberikan persetujuan.

---

# 24. Go-Live Checklist

Sebelum produksi:

- [ ] Seluruh test case Mandatory berstatus Pass.
- [ ] Tidak ada bug Critical.
- [ ] Backup database tersedia.
- [ ] Monitoring aktif.
- [ ] SSL aktif.
- [ ] Dokumentasi lengkap.
- [ ] Deployment berhasil.
- [ ] Product Owner menyetujui.

---

# 25. Conclusion

Berdasarkan hasil User Acceptance Testing, aplikasi Portfolio IT dinyatakan siap digunakan apabila seluruh test case wajib berhasil, tidak terdapat defect dengan tingkat Critical maupun High, serta telah memperoleh persetujuan dari Product Owner dan stakeholder terkait.

Dokumen UAT ini menjadi bukti bahwa aplikasi telah memenuhi kebutuhan bisnis sebagaimana didefinisikan dalam BRD dan PRD, serta layak untuk dipublikasikan ke lingkungan produksi.

---

# End of Document