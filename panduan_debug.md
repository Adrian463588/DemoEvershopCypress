

## Setup Context Awal

Sebelum debugging, inject konteks PRD ke dalam workspace Antigravity:

```
Saya sedang mengerjakan project Cypress JS automation testing untuk website 
demo.evershop.io (e-commerce platform). Stack yang digunakan:
- Cypress 13+
- Page Object Model pattern
- cypress-xpath, @faker-js/faker, cypress-mochawesome-reporter
- Base URL: https://demo.evershop.io

Jadikan ini sebagai konteks utama untuk semua sesi debugging berikut.
```

***

## Commands Debugging per Kategori

### Analisis Error & Root Cause

```
Trace test terakhir yang gagal pada file [nama_file_spec.cy.js] dan bandingkan 
dengan run sebelumnya yang berhasil. Apa yang berubah? Tampilkan diff state 
dan timing-nya.
```

```
Jelaskan root cause paling mungkin dari error ini dalam satu paragraf, 
lalu berikan 3 evidence points dari log atau kode Cypress yang mendukung 
hipotesis tersebut.
```

```
Error ini terjadi di test case [nama_test]. Apakah ini flaky test atau 
genuine failure? Analisis pola kegagalan dari 10 run terakhir jika tersedia.
```

***

### Debugging Test Spesifik (Sesuai PRD)

**Untuk Login Flow:**
```
Test berikut gagal saat eksekusi login di demo.evershop.io:
[paste kode test]

Periksa: apakah selector yang digunakan masih valid? Apakah ada timing issue 
pada form submission? Apakah response dari /api/customer/login memiliki 
status yang tidak terduga?
```

**Untuk Cart & Checkout Flow:**
```
Test checkout flow gagal di step [nama step]. Trace network request ke 
endpoint /api/checkout dan verifikasi apakah payload yang dikirim Cypress 
sesuai dengan yang diharapkan demo.evershop.io. Berikan fix minimal beserta 
diff dan rollback plan-nya.
```

**Untuk Product Search:**
```
cy.get('[data-testid="search-input"]') tidak merespons dalam test product 
search. Apakah ada race condition antara page load dan DOM ready? Sarankan 
strategi cy.intercept() yang tepat untuk memastikan elemen tersedia.
```

***

### Debugging Flaky Tests

```
Test ini intermittently gagal (sekitar 1-3 dari 10 run):
[paste kode test]

Identifikasi apakah penyebabnya adalah: timing/async issue, state pollution 
antar test, atau dependency pada network condition. Propose fix dengan 
pendekatan paling minimal.
```

```
Tunjukkan hotspot: fungsi atau selector mana dalam test suite ini yang paling 
sering berkorelasi dengan kegagalan dalam 7 hari terakhir?
```

```
Apakah ada penggunaan cy.wait([angka]) hard-coded dalam kode ini? Jika ada, 
ganti dengan cy.intercept() alias atau cy.get().should() assertion yang lebih 
reliable. Tampilkan semua perubahannya sekaligus.
```

***

### Perbaikan Page Object Model

```
Review Page Object class berikut untuk halaman [nama halaman] di 
demo.evershop.io:
[paste kode POM]

Apakah ada selector yang fragile (menggunakan class CSS dinamis atau index)?
Sarankan refactor menggunakan data-testid atau cypress best practices. 
Sertakan contoh implementasi yang sudah diperbaiki.
```

```
Saya punya duplikasi logic di beberapa spec file untuk flow [nama flow].
Bantu saya ekstrak ke dalam custom Cypress command. Pastikan command 
tersebut reusable dan mendukung parameter dinamis.
```

***

### Network & API Assertion

```
Test saya tidak menangkap API error dari demo.evershop.io dengan benar.
Tunjukkan cara menggunakan cy.intercept() untuk:
1. Mock response 500 dari endpoint /api/cart
2. Validasi bahwa UI menampilkan pesan error yang tepat
3. Restore ke behavior asli setelah test selesai
```

```
Bantu saya debug kenapa cy.intercept() alias tidak ter-trigger di test ini:
[paste kode]
Apakah urutannya salah? Apakah endpoint pattern-nya tidak match?
```

***

### Sebelum Merge / Code Review

```
Sebelum fix ini di-merge, list semua unintended consequences yang mungkin 
timbul dari perubahan ini terhadap test suite lain dalam project Cypress ini.
```

```
Generate failing unit test yang mereproduksi bug ini agar bisa dijadikan 
regression test setelah fix diterapkan.
```

```
Review seluruh file spec ini dan identifikasi:
1. Test yang memiliki anti-pattern (hardcoded wait, tightly coupled assertions)
2. Missing negative test cases berdasarkan PRD demo.evershop.io
3. Coverage gap untuk flow: login, register, search, cart, checkout
```

***

### CI/CD & Reporting

```
Test suite Cypress saya berjalan lebih dari 15 menit di CI (target PRD < 15 
menit). Analisis spec file berikut dan sarankan test mana yang bisa 
diparalelkan, mana yang perlu dioptimasi, dan mana yang bisa dijadikan 
smoke test saja.
```

```
Reporter mochawesome tidak menghasilkan screenshot untuk test yang gagal.
Periksa konfigurasi cypress.config.js berikut dan identifikasi yang salah:
[paste config]
```

***

## Quick Cheat Sheet

| Situasi | Command Singkat |
|---|---|
| Test mendadak merah | `"Trace failing run vs passing run. What changed?"` |
| Selector tidak ditemukan | `"Is this selector still valid? Suggest data-testid alternative."` |
| Flaky test | `"Is this a timing issue, state pollution, or network dependency?"` |
| Sebelum push ke repo | `"List unintended consequences of this change."` |
| Coverage check | `"What negative test cases are missing based on this PRD flow?"` |
| Lambat di CI | `"Which tests can be parallelized or converted to smoke tests?"` |

