

# Sprint 3 Technical Requirements Document

**Project:** Cypress Automation Testing — `demo.evershop.io`
**Sprint Duration:** 2 Minggu
**Role Reviewer:** Senior SDET & System Analyst
**Sprint Goal:** Merefactor seluruh test suite ke arsitektur **Page Object Model (POM)**, mengintegrasikan **Gherkin/Cucumber**, menjalankan semua tes secara **headless** sebagai pre-push gate, tanpa menghapus kode sumber legacy, kemudian push ke branch baru.

***

## Gambaran Fitur Sprint 3

Sprint 3 terdiri dari 3 fitur utama dengan dependensi berurutan:

```
POM Refactor  →  Cucumber/Gherkin Integration  →  Headless Pre-Push Gate + Branch
   F-04                    F-05                           F-06
```

***

## F-04 — Page Object Model (POM) Refactoring

### Latar Belakang

Test suite Sprint 1 ditulis dalam gaya prosedural flat di dalam `cypress/e2e/` tanpa abstraksi. Ini menyebabkan duplikasi selector, sulit di-maintain saat UI berubah, dan tidak scalable untuk penambahan test case baru. POM memisahkan **lokasi elemen** dan **aksi halaman** dari **logika test assertion**.

### Prinsip Non-Destructif

> **Kode sumber lama TIDAK dihapus.** Seluruh file `.cy.js` legacy tetap berada di `cypress/e2e/legacy/`. POM baru dibuat di direktori terpisah `cypress/pages/`. Ini memungkinkan perbandingan dan rollback.

### Struktur Direktori POM

```
cypress/
├── e2e/
│   ├── legacy/                      ← Kode lama DIPINDAH ke sini (tidak dihapus)
│   │   ├── login.cy.js
│   │   ├── cart.cy.js
│   │   ├── checkout.cy.js
│   │   ├── search.cy.js
│   │   └── form-validation.cy.js
│   └── features/                    ← Cucumber .feature files (F-05)
│       ├── login.feature
│       ├── cart.feature
│       ├── checkout.feature
│       ├── search.feature
│       └── form-validation.feature
├── pages/                           ← NEW: POM Classes
│   ├── BasePage.js
│   ├── LoginPage.js
│   ├── HomePage.js
│   ├── ProductPage.js
│   ├── CartPage.js
│   ├── CheckoutPage.js
│   ├── SearchPage.js
│   └── AccountPage.js
├── step_definitions/                ← NEW: Cucumber step definitions
│   ├── login.steps.js
│   ├── cart.steps.js
│   ├── checkout.steps.js
│   ├── search.steps.js
│   └── form-validation.steps.js
├── support/
│   ├── e2e.js                       ← Tambah import cucumber preprocessor
│   └── commands.js
└── fixtures/
    ├── users.json
    └── products.json
```

### Spesifikasi Teknis — BasePage

```javascript
// cypress/pages/BasePage.js
export class BasePage {
  /**
   * Navigate ke URL relatif
   * @param {string} path
   */
  visit(path = '/') {
    cy.visit(path);
    this.waitForPageLoad();
  }

  waitForPageLoad() {
    cy.document().should('have.property', 'readyState', 'complete');
  }

  /**
   * Generic getter dengan fallback strategy:
   * Priority: data-cy > data-testid > id > class
   */
  getElement(selector) {
    return cy.get(selector);
  }

  getByDataCy(value) {
    return cy.get(`[data-cy="${value}"]`);
  }

  getByDataTestId(value) {
    return cy.get(`[data-testid="${value}"]`);
  }

  /**
   * Intercept API call dan beri alias
   */
  interceptApi(method, url, alias) {
    cy.intercept(method, url).as(alias);
  }

  waitForApi(alias) {
    cy.wait(`@${alias}`);
  }
}
```

### Spesifikasi Teknis — LoginPage

```javascript
// cypress/pages/LoginPage.js
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // ── Selectors ───────────────────────────────────────────
  selectors = {
    emailInput:      '[name="email"], [data-testid="email-input"]',
    passwordInput:   '[name="password"], [data-testid="password-input"]',
    submitButton:    '[type="submit"], [data-testid="login-btn"]',
    errorMessage:    '[data-testid="error-msg"], .error-message',
    userNameHeader:  '[data-testid="user-name"], .header-user-name',
  };

  // ── Actions ─────────────────────────────────────────────
  navigateTo() {
    this.visit('/account/login');
  }

  fillEmail(email) {
    this.getElement(this.selectors.emailInput)
      .clear()
      .type(email);
  }

  fillPassword(password) {
    this.getElement(this.selectors.passwordInput)
      .clear()
      .type(password, { log: false }); // Sembunyikan password di log
  }

  submit() {
    this.getElement(this.selectors.submitButton).click();
  }

  login(email, password) {
    this.navigateTo();
    this.fillEmail(email);
    this.fillPassword(password);
    this.submit();
  }

  // ── Assertions ──────────────────────────────────────────
  assertLoginSuccess() {
    cy.url().should('include', '/account');
    this.getElement(this.selectors.userNameHeader).should('be.visible');
  }

  assertLoginFailed() {
    this.getElement(this.selectors.errorMessage)
      .should('be.visible')
      .and('not.be.empty');
  }

  assertOnLoginPage() {
    cy.url().should('include', '/account/login');
  }
}
```

### Spesifikasi Teknis — CartPage

```javascript
// cypress/pages/CartPage.js
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  selectors = {
    cartItems:       '[data-testid="cart-item"], .cart-item',
    quantityInput:   '[data-testid="qty-input"], input[name="qty"]',
    increaseBtn:     '[data-testid="qty-increase"], .qty-increase',
    decreaseBtn:     '[data-testid="qty-decrease"], .qty-decrease',
    removeBtn:       '[data-testid="remove-item"], .remove-from-cart',
    cartTotal:       '[data-testid="cart-total"], .cart-total',
    emptyCartMsg:    '[data-testid="empty-cart"], .empty-cart-message',
    checkoutBtn:     '[data-testid="checkout-btn"], .checkout-button',
    cartCount:       '[data-testid="cart-count"], .cart-item-count',
  };

  navigateTo() {
    this.visit('/cart');
  }

  increaseQuantity(itemIndex = 0) {
    this.getElement(this.selectors.increaseBtn).eq(itemIndex).click();
  }

  decreaseQuantity(itemIndex = 0) {
    this.getElement(this.selectors.decreaseBtn).eq(itemIndex).click();
  }

  removeItem(itemIndex = 0) {
    this.getElement(this.selectors.removeBtn).eq(itemIndex).click();
  }

  proceedToCheckout() {
    this.getElement(this.selectors.checkoutBtn).click();
  }

  // ── Assertions ──────────────────────────────────────────
  assertItemCount(expectedCount) {
    this.getElement(this.selectors.cartItems)
      .should('have.length', expectedCount);
  }

  assertQuantity(itemIndex, expectedQty) {
    this.getElement(this.selectors.quantityInput)
      .eq(itemIndex)
      .should('have.value', String(expectedQty));
  }

  assertCartEmpty() {
    this.getElement(this.selectors.emptyCartMsg).should('be.visible');
  }

  assertTotalUpdated(expectedTotal) {
    this.getElement(this.selectors.cartTotal)
      .should('contain.text', expectedTotal);
  }
}
```

### POM Classes yang Harus Dibuat

| Page Class | Halaman Target | TC yang di-cover |
|---|---|---|
| `LoginPage.js` | `/account/login` | TC-001 |
| `HomePage.js` | `/` | TC-004 |
| `ProductPage.js` | `/product/:slug` | TC-002 |
| `CartPage.js` | `/cart` | TC-002, TC-005, TC-006 |
| `CheckoutPage.js` | `/checkout` | TC-003 |
| `SearchPage.js` | `/search?q=` | TC-004 |
| `AccountPage.js` | `/account` | TC-001 |
| `FormValidationPage.js` | Multi-page | TC-007 |

### Acceptance Criteria F-04

- [ ] Semua POM class `extends BasePage`
- [ ] Tidak ada selector string yang duplikat antar file — semua ada di property `selectors` masing-masing page class
- [ ] File legacy tidak dihapus, hanya dipindah ke `cypress/e2e/legacy/`
- [ ] POM method tidak mengandung assertion langsung — assertion berada di method `assert*()` tersendiri
- [ ] Minimal 80% selector menggunakan `data-testid` atau `data-cy`

***

## F-05 — Cucumber / Gherkin Integration

### Latar Belakang

Gherkin Cucumber memungkinkan test scenario ditulis dalam bahasa bisnis yang dapat dibaca oleh non-technical stakeholder, sekaligus tetap executable. Sprint 3 mengkonversi seluruh TC-001 hingga TC-007 menjadi `.feature` files.

### Dependencies Prerequisites

```bash
# Install cypress-cucumber-preprocessor
npm install --save-dev @badeball/cypress-cucumber-preprocessor
npm install --save-dev @bahmutov/cypress-esbuild-preprocessor
npm install --save-dev esbuild
```

### Konfigurasi `cypress.config.js` (Update)

```javascript
// cypress.config.js
import { defineConfig } from 'cypress';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import allureCypress from 'allure-cypress/reporter';
import * as os from 'node:os';

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/features/**/*.feature',  // Pindah ke .feature
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on('file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      allureCypress(on, config, {
        resultsDir: 'allure-results',
        environmentInfo: {
          app_url: 'https://demo.evershop.io',
          os_platform: os.platform(),
          node_version: process.version,
        },
      });
      return config;
    },
    baseUrl: 'https://demo.evershop.io',
  },
});
```

### Konfigurasi `package.json` (Tambahan)

```json
{
  "cypress-cucumber-preprocessor": {
    "nonGlobalStepDefinitions": true,
    "stepDefinitions": "cypress/step_definitions/**/*.steps.{js,ts}"
  }
}
```

### Feature Files (Gherkin)

**TC-001 — Login**

```gherkin
# cypress/e2e/features/login.feature
@smoke @p0
Feature: User Authentication
  Sebagai pengguna terdaftar
  Saya ingin dapat login ke akun saya
  Sehingga saya bisa mengakses fitur member

  Background:
    Given User sudah terdaftar di sistem

  @happy-path
  Scenario: Login dengan kredensial valid
    Given User berada di halaman login
    When User memasukkan email "test@evershop.io"
    And User memasukkan password yang valid
    And User mengklik tombol Login
    Then User diarahkan ke halaman dashboard
    And Nama user tampil di header

  @negative
  Scenario: Login dengan password salah
    Given User berada di halaman login
    When User memasukkan email "test@evershop.io"
    And User memasukkan password yang salah
    And User mengklik tombol Login
    Then Pesan error ditampilkan
    And User tetap berada di halaman login

  @negative
  Scenario Outline: Login dengan data tidak valid
    Given User berada di halaman login
    When User memasukkan email "<email>"
    And User memasukkan password "<password>"
    And User mengklik tombol Login
    Then Pesan error ditampilkan

    Examples:
      | email               | password    |
      | invalid-email       | Test123!    |
      | test@evershop.io    | wrongpass   |
      |                     | Test123!    |
```

**TC-002 — Add to Cart**

```gherkin
# cypress/e2e/features/cart.feature
@smoke @p0
Feature: Cart Management
  Sebagai shopper
  Saya ingin mengelola item di cart
  Sehingga saya bisa berbelanja dengan nyaman

  Background:
    Given User berada di halaman product detail

  Scenario: Menambahkan produk ke cart
    When User memilih varian produk jika tersedia
    And User mengatur quantity menjadi 1
    And User mengklik tombol Add to Cart
    Then Notifikasi sukses ditampilkan
    And Icon cart menampilkan jumlah yang updated
    And Product tersimpan di cart dengan detail yang benar

  Scenario: Update quantity di cart
    Given User memiliki minimal 1 produk di cart
    And User navigasi ke halaman cart
    When User menaikkan quantity produk
    Then Quantity terupdate
    And Total harga terupdate secara akurat

  Scenario: Menghapus produk dari cart
    Given User memiliki minimal 1 produk di cart
    And User navigasi ke halaman cart
    When User mengklik tombol hapus pada produk
    Then Produk dihapus dari cart
    And Total cart terupdate
```

**TC-003 — Guest Checkout**

```gherkin
# cypress/e2e/features/checkout.feature
@smoke @p0
Feature: Guest Checkout Flow
  Sebagai guest user
  Saya ingin dapat checkout tanpa registrasi
  Sehingga saya bisa membeli produk dengan cepat

  Background:
    Given User memiliki minimal 1 produk di cart

  Scenario: Guest checkout end-to-end
    Given User navigasi ke halaman cart
    When User mengklik tombol Proceed to Checkout
    And User mengisi informasi pengiriman yang valid
      | field     | value              |
      | firstName | John               |
      | lastName  | Doe                |
      | email     | guest@example.com  |
      | phone     | 08123456789        |
      | address   | Jl. Sudirman No.1  |
      | city      | Jakarta            |
      | zipCode   | 12190              |
    And User memilih metode pengiriman
    And User mengisi informasi pembayaran mock
    And User mengkonfirmasi order
    Then Halaman konfirmasi order ditampilkan
    And Nomor order ter-generate
```

**TC-004 — Search**

```gherkin
# cypress/e2e/features/search.feature
@regression @p1
Feature: Product Search
  Sebagai shopper
  Saya ingin mencari produk berdasarkan keyword
  Sehingga saya bisa menemukan produk yang diinginkan

  Scenario Outline: Search dengan berbagai keyword
    Given User berada di homepage
    When User mengetik "<keyword>" di search box
    And User menekan Enter atau mengklik Search
    Then Halaman search results ditampilkan
    And Results mengandung produk yang relevan dengan "<keyword>"

    Examples:
      | keyword   |
      | shoes     |
      | shirt     |
      | running   |

  Scenario: Search dengan keyword tidak valid
    Given User berada di homepage
    When User mengetik "xyznotexistproduct123" di search box
    And User menekan Enter atau mengklik Search
    Then Pesan "No results found" ditampilkan
```

**TC-007 — Form Validation**

```gherkin
# cypress/e2e/features/form-validation.feature
@regression @p1
Feature: Form Validation
  Sebagai sistem
  Saya ingin memvalidasi input form
  Sehingga data yang tidak valid ditolak dengan pesan error yang jelas

  Scenario: Submit form dengan required field kosong
    Given User berada di halaman checkout
    When User tidak mengisi required field
    And User mencoba submit form
    Then Error message ditampilkan untuk setiap required field kosong

  Scenario: Submit dengan format email tidak valid
    Given User berada di halaman form registrasi
    When User memasukkan email "bukan-email-valid"
    And User mencoba submit form
    Then Validasi email error ditampilkan

  Scenario: Password tidak cocok saat registrasi
    Given User berada di halaman registrasi
    When User memasukkan password "Test123!"
    And User memasukkan confirm password "BedaPassword!"
    And User mencoba submit form
    Then Error password mismatch ditampilkan
```

### Step Definitions — Login

```javascript
// cypress/step_definitions/login.steps.js
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { LoginPage } from '../pages/LoginPage';
import * as allure from 'allure-js-commons';

const loginPage = new LoginPage();

Given('User sudah terdaftar di sistem', () => {
  // Precondition documented — user data dari fixtures
  cy.fixture('users').as('users');
});

Given('User berada di halaman login', () => {
  allure.step('Navigate ke halaman login', () => {
    loginPage.navigateTo();
    loginPage.assertOnLoginPage();
  });
});

When('User memasukkan email {string}', (email) => {
  loginPage.fillEmail(email);
});

When('User memasukkan password yang valid', function () {
  loginPage.fillPassword(this.users.validUser.password);
});

When('User memasukkan password yang salah', () => {
  loginPage.fillPassword('wrongpassword123');
});

When('User memasukkan password {string}', (password) => {
  loginPage.fillPassword(password);
});

When('User mengklik tombol Login', () => {
  loginPage.submit();
});

Then('User diarahkan ke halaman dashboard', () => {
  loginPage.assertLoginSuccess();
});

Then('Nama user tampil di header', () => {
  loginPage.assertUserNameVisible();
});

Then('Pesan error ditampilkan', () => {
  loginPage.assertLoginFailed();
});

Then('User tetap berada di halaman login', () => {
  loginPage.assertOnLoginPage();
});
```

### Acceptance Criteria F-05

- [ ] Semua 7 TC (TC-001 s/d TC-007) memiliki `.feature` file Gherkin yang valid
- [ ] Setiap `.feature` file memiliki minimal satu Scenario happy path dan satu Scenario negative
- [ ] Step definitions menggunakan POM class (tidak ada selector langsung di step definitions)
- [ ] Scenario Outline digunakan untuk data-driven test (minimal di TC-001 dan TC-004)
- [ ] Tag `@smoke`, `@regression`, `@p0`, `@p1` konsisten digunakan
- [ ] Allure annotation (`allure.epic`, `allure.feature`, `allure.story`, `allure.severity`) ada di setiap step definition

***

## F-06 — Headless Pre-Push Gate & Branch Strategy

### Latar Belakang

Sebelum kode di-push ke branch baru, seluruh test suite harus lulus secara headless sebagai gatekeeper lokal menggunakan **Git Hooks via Husky**. Ini mencegah broken tests masuk ke remote repository.

### Dependencies

```bash
npm install --save-dev husky
npx husky init
```

### Setup Husky Pre-Push Hook

```bash
# .husky/pre-push
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🚀 Running headless Cypress tests before push..."

npm run test:headless

EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "❌ Cypress tests failed. Push dibatalkan."
  echo "   Jalankan: npm run cy:open untuk debug"
  exit 1
fi

echo "✅ Semua tests passed. Melanjutkan push..."
exit 0
```

### npm Scripts (Update `package.json`)

```json
{
  "scripts": {
    "cy:open":            "cypress open",
    "cy:run":             "cypress run --browser chrome",
    "cy:headless":        "cypress run --headless --browser chrome",
    "cy:smoke":           "cypress run --headless --env tags=@smoke",
    "cy:regression":      "cypress run --headless --env tags=@regression",
    "cy:legacy":          "cypress run --spec 'cypress/e2e/legacy/**/*.cy.js' --headless",
    "test:headless":      "npm run cy:smoke",
    "test:full":          "npm run cy:headless",
    "allure:clean":       "rm -rf allure-results allure-report",
    "allure:generate":    "allure generate allure-results -o allure-report --clean",
    "allure:open":        "allure open allure-report",
    "test:report":        "npm run allure:clean && npm run test:full && npm run allure:generate",
    "prepare":            "husky"
  }
}
```

### Tag Filtering untuk Headless

File `cypress.config.js` — tambahkan konfigurasi tag:

```javascript
// Tambahkan ke e2e config
env: {
  tags: process.env.CYPRESS_TAGS || '',
  allure: true,
},
```

File `cypress/support/e2e.js`:

```javascript
import './commands';
import 'allure-cypress';
import '@badeball/cypress-cucumber-preprocessor/support';
```

### Branch Strategy Sprint 3

```
main (protected)
  └── develop
        └── feature/sprint-3-pom-cucumber   ← Branch target Sprint 3
              ├── feat/pom-base-page
              ├── feat/pom-login-cart-pages
              ├── feat/pom-checkout-search-pages
              ├── feat/cucumber-feature-files
              ├── feat/cucumber-step-definitions
              └── feat/husky-pre-push-gate
```

**Langkah Push ke Branch Baru:**

```bash
# 1. Buat branch dari develop
git checkout develop
git pull origin develop
git checkout -b feature/sprint-3-pom-cucumber

# 2. Implementasi POM + Cucumber (F-04, F-05)

# 3. Setup Husky (F-06)
npx husky init
# Edit .husky/pre-push sesuai spesifikasi

# 4. Commit
git add .
git commit -m "feat: refactor to POM + Cucumber Gherkin integration"

# 5. Saat push, Husky akan trigger headless test otomatis
git push origin feature/sprint-3-pom-cucumber

# 6. Buat Pull Request ke develop
```

### GitHub Actions Update (Sprint 3)

Tambahkan job untuk menjalankan Cucumber feature secara terpisah dari legacy:

```yaml
# .github/workflows/cypress-ci.yml — tambahkan job baru
jobs:
  cypress-legacy:
    name: Run Legacy Tests (Preservation Check)
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - name: Run Legacy Cypress Tests
        run: npm run cy:legacy
        continue-on-error: true          # Legacy boleh fail, tidak block

  cypress-cucumber:
    name: Run Cucumber POM Tests
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: 17 }
      - run: npm ci
      - run: npm install -g allure-commandline
      - name: Run Cucumber Smoke Tests (Headless)
        run: npm run cy:smoke
      - name: Upload Allure Results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: allure-results
          path: allure-results
```

### Acceptance Criteria F-06

- [ ] `husky` ter-install dan `.husky/pre-push` berfungsi
- [ ] Push dibatalkan jika `@smoke` test gagal
- [ ] Branch `feature/sprint-3-pom-cucumber` dibuat dari `develop`
- [ ] File legacy di `cypress/e2e/legacy/` masih ada dan dapat dijalankan via `npm run cy:legacy`
- [ ] GitHub Actions memiliki 2 job terpisah: legacy (non-blocking) dan cucumber (blocking)

***

## Struktur Project Akhir Sprint 3

```
cypress-evershop/
├── .github/
│   └── workflows/
│       ├── cypress-ci.yml          ← Updated: 2 jobs (legacy + cucumber)
│       └── cypress-nightly.yml     ← Unchanged dari Sprint 2
├── .husky/
│   └── pre-push                    ← NEW: Headless gate
├── cypress/
│   ├── e2e/
│   │   ├── legacy/                 ← MOVED: Kode lama (tidak dihapus)
│   │   │   ├── login.cy.js
│   │   │   ├── cart.cy.js
│   │   │   └── ...
│   │   └── features/               ← NEW: Gherkin .feature files
│   │       ├── login.feature
│   │       ├── cart.feature
│   │       ├── checkout.feature
│   │       ├── search.feature
│   │       └── form-validation.feature
│   ├── pages/                      ← NEW: POM Classes
│   │   ├── BasePage.js
│   │   ├── LoginPage.js
│   │   ├── HomePage.js
│   │   ├── ProductPage.js
│   │   ├── CartPage.js
│   │   ├── CheckoutPage.js
│   │   ├── SearchPage.js
│   │   └── AccountPage.js
│   ├── step_definitions/           ← NEW: Cucumber step definitions
│   │   ├── login.steps.js
│   │   ├── cart.steps.js
│   │   ├── checkout.steps.js
│   │   ├── search.steps.js
│   │   └── form-validation.steps.js
│   ├── support/
│   │   ├── e2e.js                  ← Updated: tambah cucumber import
│   │   └── commands.js             ← Unchanged
│   └── fixtures/
│       ├── users.json              ← Unchanged
│       └── products.json           ← Unchanged
├── Jenkinsfile                     ← Unchanged dari Sprint 2
├── cypress.config.js               ← Updated: specPattern + cucumber setup
└── package.json                    ← Updated: new scripts + dependencies
```

***

## Dependencies Sprint 3

| Package | Versi | Keterangan |
|---|---|---|
| `@badeball/cypress-cucumber-preprocessor` | Latest | Cucumber preprocessor resmi untuk Cypress |
| `@bahmutov/cypress-esbuild-preprocessor` | Latest | Bundler untuk .feature files |
| `esbuild` | Latest | Build tool dependency |
| `husky` | v9+ | Git hooks management |
| `allure-cypress` | Latest | Carry-over Sprint 2 |
| `allure-js-commons` | Latest | Carry-over Sprint 2 |

***

## Definition of Done Sprint 3

| Kriteria | Verifikasi |
|---|---|
| Semua POM class tersedia | `ls cypress/pages/*.js` menampilkan 8 file |
| Kode legacy tidak hilang | `ls cypress/e2e/legacy/*.cy.js` menampilkan 5+ file |
| Feature files valid Gherkin | `npx cucumber-js --dry-run` tidak error |
| Step definitions complete | 0 undefined steps saat dry run |
| Headless smoke pass lokal | `npm run cy:smoke` exit code 0 |
| Husky pre-push berfungsi | Push gagal jika test fail, sukses jika test pass |
| Branch terbuat dan ter-push | `git branch -r` menampilkan `origin/feature/sprint-3-pom-cucumber` |
| CI pipeline hijau | GitHub Actions tab menampilkan ✅ pada job `cypress-cucumber` |
| Allure report ter-generate | `npm run test:report` menghasilkan `allure-report/index.html` |
| Selector strategy | Minimal 80% selector pakai `data-testid`/`data-cy` |

***

## Risiko & Mitigasi Sprint 3

| Risiko | Dampak | Probabilitas | Mitigasi |
|---|---|---|---|
| Selector `demo.evershop.io` tidak pakai `data-testid` | Tinggi | Tinggi | Gunakan fallback selector chain di BasePage, dokumentasikan workaround |
| Cucumber step conflict antar feature | Sedang | Sedang | Aktifkan `nonGlobalStepDefinitions: true` di konfigurasi |
| Husky slow down developer workflow | Rendah | Sedang | Jalankan hanya `@smoke` tag (subset cepat), bukan full suite |
| Legacy test brittle setelah dipindah | Sedang | Rendah | Legacy berjalan `continue-on-error: true` di CI, tidak block pipeline |

***

