

# 📋 Sprint 2 — Technical Requirements Document *(Revisi v1.1)*
**Project:** Cypress Automation Testing — demo.evershop.io
**Sprint Duration:** 2 Minggu
**Role Reviewer:** Senior SDET & System Analyst
**Sprint Goal:** Mengintegrasikan pelaporan Allure dan pipeline CI/CD agar hasil test otomatis terdistribusi, terlacak, dan dapat diaudit lintas environment.

***

## Gambaran Fitur Sprint 2

Sprint 2 terdiri dari 3 fitur utama dengan dependensi berurutan:

```
[Allure Report] ──► [GitHub Actions CI/CD] ──► [Jenkins CI/CD]
     (F-01)               (F-02)                    (F-03)
```

***

## F-01 — Allure Report Integration

### Latar Belakang

Cypress default reporter hanya menghasilkan output CLI yang tidak visual dan tidak dapat di-share ke stakeholder. Allure Report menghasilkan HTML interaktif dengan timeline, steps breakdown, screenshot attachment, dan history trend.

### Dependencies & Prerequisites

| Item | Versi | Keterangan |
|---|---|---|
| `allure-cypress` | Latest | Official adapter dari allurereport.org |
| `allure-js-commons` | Latest | Runtime API untuk metadata & steps |
| Java JDK | 11+ | Required untuk Allure CLI binary |
| Allure CLI | Latest | Generate & serve HTML report |
| Node.js | 18+ | Minimum requirement allure-cypress |

### Acceptance Criteria

- [ ] Laporan HTML ter-generate otomatis setelah `npx cypress run`
- [ ] Setiap test case menampilkan: status, durasi, steps, screenshot on failure
- [ ] Laporan ter-kategorikan berdasarkan **Epic → Feature → Story** sesuai modul PRD
- [ ] History trend minimal tersimpan 5 run terakhir
- [ ] Environment info (OS, Node version, Base URL) tercantum di halaman utama report

### Spesifikasi Teknis

**1. Instalasi**
```bash
npm install --save-dev allure-cypress allure-js-commons
npm install -g allure-commandline
```

**2. Konfigurasi `cypress.config.js`**
```js
import { allureCypress } from "allure-cypress/reporter";
import * as os from "node:os";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      allureCypress(on, config, {
        resultsDir: "allure-results",
        environmentInfo: {
          app_url:      "https://demo.evershop.io",
          os_platform:  os.platform(),
          os_version:   os.version(),
          node_version: process.version,
        },
      });
      return config;
    },
  },
});
```

**3. Import di `cypress/support/e2e.js`**
```js
import "allure-cypress";
```

**4. Metadata Annotation per Test**
```js
import * as allure from "allure-js-commons";

describe("Checkout Flow", () => {
  it("User dapat checkout dengan alamat valid", () => {
    allure.epic("E-Commerce Flow");
    allure.feature("Checkout");
    allure.story("Happy Path Checkout");
    allure.severity("critical");
    allure.owner("QA Team");
    // ... test steps
  });
});
```

**5. Step Division untuk Test yang Kompleks**
```js
it("End-to-end checkout dari product page", () => {
  allure.step("1. Navigate to product page", () => {
    cy.visit("/product/test-product");
  });
  allure.step("2. Add to cart", () => {
    cy.get('[data-testid="add-to-cart"]').click();
  });
  allure.step("3. Proceed to checkout", () => {
    cy.get('[data-testid="checkout-btn"]').click();
  });
});
```

**6. npm Scripts di `package.json`**
```json
{
  "scripts": {
    "allure:clean":    "rm -rf allure-results allure-report",
    "cy:run":          "cypress run --env allure=true",
    "allure:generate": "allure generate allure-results -o allure-report --clean",
    "allure:open":     "allure open allure-report",
    "test:report":     "npm run allure:clean && npm run cy:run && npm run allure:generate"
  }
}
```

### Struktur Output
```
project-root/
├── allure-results/      # Raw JSON results (per test run)
├── allure-report/       # HTML report output
│   ├── index.html
│   ├── data/
│   └── history/         # Trend history
```

### Non-Functional Requirements
- Report ter-generate dalam waktu < 30 detik setelah test selesai
- Screenshot failure otomatis ter-attach tanpa konfigurasi manual
- Report dapat diakses offline melalui `allure open`

***

## F-02 — CI/CD GitHub Actions *(1 Container — Revisi v1.1)*

### Latar Belakang

GitHub Actions memungkinkan test suite berjalan otomatis setiap kali ada `push` atau `pull_request`, memberikan feedback langsung di level commit dan PR. Revisi ini menyederhanakan pipeline menjadi **1 container tunggal** (tanpa matrix parallelization) agar lebih mudah di-maintain, hemat quota Actions minutes, dan cocok untuk tim kecil atau repository publik.

### Perubahan dari v1.0

| Aspek | v1.0 (Lama) | v1.1 (Revisi) |
|---|---|---|
| Container | 3 parallel (matrix) | **1 container tunggal** |
| Jumlah job | 3 job terpisah | **2 job** (install+run → report) |
| Artifact naming | `allure-results-1/2/3` | **`allure-results`** (tunggal) |
| Kompleksitas | Tinggi | **Sedang** |
| Actions minutes | ~45 menit total | **~15 menit total** |

### Acceptance Criteria

- [ ] Pipeline berjalan otomatis pada event: `push` ke branch `main`/`develop`, dan `pull_request`
- [ ] Seluruh test berjalan dalam **satu runner tunggal** tanpa matrix strategy
- [ ] Allure Report ter-upload sebagai artifact yang dapat didownload dari halaman Actions
- [ ] Pipeline gagal (exit code non-0) jika ada test yang gagal
- [ ] Node modules ter-cache agar waktu eksekusi efisien
- [ ] Secrets (credentials) tidak terekspos dalam logs

### Spesifikasi Teknis

**Struktur file:**
```
.github/
└── workflows/
    ├── cypress-ci.yml        # Main pipeline (push & PR)
    └── cypress-nightly.yml   # Scheduled full regression
```

**File `.github/workflows/cypress-ci.yml`** — *1 Container*
```yaml
name: Cypress E2E Tests — EverShop

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  CYPRESS_BASE_URL: https://demo.evershop.io

jobs:
  # ── Job 1: Install, Run Tests & Upload Results ──────────
  cypress-run:
    name: Run Cypress Tests (Single Container)
    runs-on: ubuntu-24.04

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'           # Cache node_modules otomatis

      - name: Setup Java 17 (Allure requirement)
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Install Dependencies
        run: npm ci

      - name: Install Allure CLI
        run: npm install -g allure-commandline

      - name: Clean Previous Allure Results
        run: rm -rf allure-results allure-report || true

      - name: Run Cypress Tests
        uses: cypress-io/github-action@v6
        with:
          browser: chrome
          install: false         # Sudah dihandle npm ci di atas
        env:
          GITHUB_TOKEN:       ${{ secrets.GITHUB_TOKEN }}
          CYPRESS_BASE_URL:   ${{ env.CYPRESS_BASE_URL }}
          CYPRESS_USERNAME:   ${{ secrets.CYPRESS_USERNAME }}
          CYPRESS_PASSWORD:   ${{ secrets.CYPRESS_PASSWORD }}

      - name: Upload Allure Results
        uses: actions/upload-artifact@v4
        if: always()             # Upload meskipun ada test yang gagal
        with:
          name: allure-results
          path: allure-results/
          if-no-files-found: warn
          retention-days: 7

      - name: Upload Screenshots (on failure)
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots/
          if-no-files-found: ignore
          retention-days: 7

      - name: Upload Videos
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: cypress-videos
          path: cypress/videos/
          if-no-files-found: ignore
          retention-days: 7

  # ── Job 2: Generate & Publish Allure Report ─────────────
  allure-report:
    name: Generate Allure Report
    runs-on: ubuntu-24.04
    needs: cypress-run
    if: always()                 # Tetap jalan meski Job 1 gagal

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Java 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Download Allure Results
        uses: actions/download-artifact@v4
        with:
          name: allure-results   # Nama tunggal, tanpa pattern matching
          path: allure-results/

      - name: Install Allure CLI
        run: npm install -g allure-commandline

      - name: Generate Allure HTML Report
        run: allure generate allure-results -o allure-report --clean

      - name: Upload Allure HTML Report
        uses: actions/upload-artifact@v4
        with:
          name: allure-html-report
          path: allure-report/
          retention-days: 30
```

**File `.github/workflows/cypress-nightly.yml`** — Scheduled Full Regression
```yaml
name: Nightly Full Regression — EverShop

on:
  schedule:
    - cron: '0 22 * * *'    # Setiap malam jam 22:00 UTC (05:00 WIB)
  workflow_dispatch:         # Tombol trigger manual dari GitHub UI

jobs:
  nightly-regression:
    name: Full Regression (Single Container)
    runs-on: ubuntu-24.04

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Setup Java 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Install Dependencies
        run: npm ci

      - name: Install Allure CLI
        run: npm install -g allure-commandline

      - name: Run Full Cypress Suite
        uses: cypress-io/github-action@v6
        with:
          browser: chrome
          install: false
        env:
          CYPRESS_BASE_URL:  https://demo.evershop.io
          CYPRESS_USERNAME:  ${{ secrets.CYPRESS_USERNAME }}
          CYPRESS_PASSWORD:  ${{ secrets.CYPRESS_PASSWORD }}

      - name: Generate Allure Report
        if: always()
        run: allure generate allure-results -o allure-report --clean

      - name: Upload Nightly Allure Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: nightly-allure-report-${{ github.run_number }}
          path: allure-report/
          retention-days: 30
```

### Alur Pipeline Visual

```
push / pull_request
       │
       ▼
┌──────────────────────────────────────┐
│  Job: cypress-run (ubuntu-24.04)     │
│  1. Checkout                         │
│  2. Setup Node 20 + Java 17          │
│  3. npm ci (+ cache)                 │
│  4. Install Allure CLI               │
│  5. Clean old results                │
│  6. npx cypress run (1 container)    │
│  7. Upload allure-results artifact   │
│  8. Upload screenshots / videos      │
└──────────────┬───────────────────────┘
               │ needs: cypress-run
               ▼
┌──────────────────────────────────────┐
│  Job: allure-report (ubuntu-24.04)   │
│  1. Download allure-results          │
│  2. allure generate                  │
│  3. Upload allure-html-report        │
└──────────────────────────────────────┘
```

### GitHub Secrets yang Harus Dikonfigurasi

| Secret Name | Deskripsi | Required |
|---|---|---|
| `GITHUB_TOKEN` | Auto-generated oleh GitHub Actions | ✅ Auto |
| `CYPRESS_USERNAME` | Email login demo.evershop.io | ✅ Manual |
| `CYPRESS_PASSWORD` | Password login demo.evershop.io | ✅ Manual |

### Non-Functional Requirements
- Total pipeline duration ≤ **20 menit** dalam 1 container tunggal
- Artifact report tersimpan selama **30 hari**
- Re-run build tidak menghasilkan false positive
- Tidak ada duplikasi artifact (karena tidak ada matrix naming)

***

## F-03 — CI/CD Jenkins Pipeline *(1 Container — Revisi v1.1)*

### Latar Belakang

Jenkins digunakan untuk environment on-premise atau corporate network. Revisi ini memastikan pipeline berjalan pada **1 agent tunggal** tanpa distribusi ke node lain, menyederhanakan konfigurasi dan menghindari shared state antar executor.

### Prerequisites & Plugin Jenkins

Plugin wajib via **Manage Jenkins → Plugin Manager**:

| Plugin | Fungsi |
|---|---|
| **NodeJS Plugin** | Manage Node.js version pada agent |
| **Git Plugin** | SCM checkout dari repository |
| **Pipeline** | Declarative pipeline via Jenkinsfile |
| **HTML Publisher Plugin** | Publish Allure HTML report di Jenkins UI |
| **Allure Jenkins Plugin** | Native Allure report integration |
| **Email Extension Plugin** | Notifikasi email SUCCESS/FAILURE |
| **Blue Ocean** | Visual pipeline view (opsional) |

### Acceptance Criteria

- [ ] Jenkinsfile tersimpan di root repository (Pipeline as Code)
- [ ] Pipeline berjalan pada **1 agent tunggal** (`agent any`, tanpa `node` labeling khusus)
- [ ] Pipeline memiliki 6 stage: Checkout → Install → Clean → Test → Generate Report → Publish
- [ ] Allure Report dapat diakses langsung dari Jenkins job page
- [ ] Pipeline mengirim notifikasi email pada status: SUCCESS, FAILURE, UNSTABLE
- [ ] Build history tersimpan minimal 10 run terakhir
- [ ] Environment variables di-inject dari Jenkins Credentials (bukan hardcoded)

### Spesifikasi Teknis

**File `Jenkinsfile`** di root project:
```groovy
pipeline {
    // ── 1 Agent Tunggal ────────────────────────────────────
    agent any   // Jalankan di satu agent, tidak ada matrix/parallel node

    // ── Tool Versions ──────────────────────────────────────
    tools {
        nodejs 'NodeJS-20'   // Sesuaikan dengan nama di Global Tool Config
    }

    // ── Environment Variables ──────────────────────────────
    environment {
        CYPRESS_BASE_URL   = 'https://demo.evershop.io'
        ALLURE_RESULTS_DIR = 'allure-results'
        ALLURE_REPORT_DIR  = 'allure-report'
        // Credentials dari Jenkins Credential Store (tidak hardcoded)
        CYPRESS_USERNAME   = credentials('evershop-username')
        CYPRESS_PASSWORD   = credentials('evershop-password')
    }

    // ── Build Options ──────────────────────────────────────
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()   // Mencegah 2 build jalan bersamaan
        timestamps()
    }

    // ── Triggers ───────────────────────────────────────────
    triggers {
        cron('0 23 * * *')   // Nightly build jam 23:00 server time
        githubPush()          // Webhook dari GitHub
    }

    stages {

        // ── Stage 1: Checkout ──────────────────────────────
        stage('Checkout SCM') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/your-org/cypress-evershop.git',
                    credentialsId: 'github-credentials'
                echo "✅ Checked out commit: ${env.GIT_COMMIT}"
            }
        }

        // ── Stage 2: Install Dependencies ─────────────────
        stage('Install Dependencies') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci'                          // Deterministik
                sh 'npm install -g allure-commandline'
                sh 'allure --version'
                echo "✅ Dependencies installed"
            }
        }

        // ── Stage 3: Clean Previous Artifacts ─────────────
        stage('Clean Artifacts') {
            steps {
                sh """
                    rm -rf ${ALLURE_RESULTS_DIR} || true
                    rm -rf ${ALLURE_REPORT_DIR}  || true
                    mkdir -p ${ALLURE_RESULTS_DIR}
                    echo "✅ Artifacts cleaned, results dir ready"
                """
            }
        }

        // ── Stage 4: Run Cypress Tests (1 Container) ──────
        stage('Run Cypress Tests') {
            steps {
                sh """
                    npx cypress run \\
                        --browser chrome \\
                        --headless \\
                        --env allure=true,allureResultsPath=${ALLURE_RESULTS_DIR}
                """
                echo "✅ Cypress test execution complete"
            }
            post {
                always {
                    // Archive screenshot & video dari single run
                    archiveArtifacts artifacts: 'cypress/screenshots/**',
                                     allowEmptyArchive: true
                    archiveArtifacts artifacts: 'cypress/videos/**',
                                     allowEmptyArchive: true
                }
            }
        }

        // ── Stage 5: Generate Allure Report ───────────────
        stage('Generate Allure Report') {
            steps {
                sh """
                    allure generate ${ALLURE_RESULTS_DIR} \\
                           -o ${ALLURE_REPORT_DIR} --clean
                    echo "✅ Report generated at ${ALLURE_REPORT_DIR}/index.html"
                """
            }
        }

        // ── Stage 6: Publish Report ────────────────────────
        stage('Publish Report') {
            steps {
                // Publish via Allure Jenkins Plugin
                allure([
                    includeProperties: true,
                    jdk: '',
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: "${ALLURE_RESULTS_DIR}"]]
                ])

                // Fallback: HTML Publisher
                publishHTML(target: [
                    allowMissing:          false,
                    alwaysLinkToLastBuild: true,
                    keepAll:               true,
                    reportDir:            "${ALLURE_REPORT_DIR}",
                    reportFiles:          'index.html',
                    reportName:           'Allure E2E Report — EverShop'
                ])

                echo "✅ Report published to Jenkins UI"
            }
        }
    }

    // ── Post Build Actions ─────────────────────────────────
    post {
        success {
            echo "🟢 BUILD SUCCESS"
            emailext(
                subject: "✅ [SUCCESS] Cypress E2E — ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <h3>Build Berhasil ✅</h3>
                    <p><b>Job:</b>    ${env.JOB_NAME}</p>
                    <p><b>Build:</b>  #${env.BUILD_NUMBER}</p>
                    <p><b>Commit:</b> ${env.GIT_COMMIT}</p>
                    <p><b>Report:</b> <a href="${env.BUILD_URL}Allure_20E2E_20Report/">
                                      Lihat Allure Report</a></p>
                """,
                mimeType: 'text/html',
                to: 'qa-team@yourcompany.com'
            )
        }
        failure {
            echo "🔴 BUILD FAILED"
            emailext(
                subject: "❌ [FAILURE] Cypress E2E — ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <h3>Build GAGAL ❌</h3>
                    <p><b>Job:</b>    ${env.JOB_NAME}</p>
                    <p><b>Build:</b>  #${env.BUILD_NUMBER}</p>
                    <p><b>Commit:</b> ${env.GIT_COMMIT}</p>
                    <p><b>Log:</b>    <a href="${env.BUILD_URL}console">Console Output</a></p>
                    <p><b>Report:</b> <a href="${env.BUILD_URL}Allure_20E2E_20Report/">
                                      Lihat Allure Report</a></p>
                """,
                mimeType: 'text/html',
                to: 'qa-team@yourcompany.com'
            )
        }
        unstable {
            echo "🟡 BUILD UNSTABLE — Ada test yang gagal"
        }
        always {
            cleanWs()   // Bersihkan workspace setelah setiap build
        }
    }
}
```

### Alur Pipeline Visual

```
Trigger (push / cron / manual)
        │
        ▼
┌─────────────────────────────────┐
│      agent any (1 executor)     │
│                                 │
│  Stage 1 │ Checkout SCM         │
│     ↓    │                      │
│  Stage 2 │ Install Dependencies │
│     ↓    │                      │
│  Stage 3 │ Clean Artifacts      │
│     ↓    │                      │
│  Stage 4 │ Run Cypress Tests    │──► archive screenshots/videos
│     ↓    │                      │
│  Stage 5 │ Generate Allure      │
│     ↓    │                      │
│  Stage 6 │ Publish Report       │──► Jenkins UI (Allure + HTML)
└──────────┼──────────────────────┘
           │
    post: success → email ✅
    post: failure  → email ❌
    post: always   → cleanWs()
```

### Konfigurasi Jenkins Job

| Langkah | Konfigurasi |
|---|---|
| New Item | Pilih **Pipeline**, beri nama `cypress-evershop-e2e` |
| General | Centang *Discard old builds* → max 10 builds |
| Build Triggers | *GitHub hook trigger* + *Build periodically* |
| Pipeline Definition | **Pipeline script from SCM** |
| SCM | Git → masukkan URL repo + `github-credentials` |
| Script Path | `Jenkinsfile` |

### Credential yang Dikonfigurasi di Jenkins

Navigasi **Manage Jenkins → Credentials → Global → Add Credentials**:

| ID | Type | Value |
|---|---|---|
| `github-credentials` | Username with Password | GitHub PAT token |
| `evershop-username` | Secret Text | Email demo.evershop.io |
| `evershop-password` | Secret Text | Password demo.evershop.io |

***

## Struktur Project Akhir Sprint 2

```
cypress-evershop/
├── .github/
│   └── workflows/
│       ├── cypress-ci.yml          # Main pipeline — 1 container
│       └── cypress-nightly.yml     # Nightly regression — 1 container
├── cypress/
│   ├── e2e/
│   ├── support/
│   │   └── e2e.js                  # import "allure-cypress"
│   └── fixtures/
├── allure-results/                  # .gitignore
├── allure-report/                   # .gitignore
├── cypress.config.js                # allureCypress setup
├── Jenkinsfile                      # Pipeline as Code
├── package.json
└── .gitignore
```

***

## Definition of Done Sprint 2

| Kriteria | Verifikasi |
|---|---|
| Allure Report ter-generate lokal | `npm run test:report` menghasilkan HTML |
| Screenshot failure ter-attach | Cek Allure setelah test gagal |
| GitHub Actions 2 job berhasil | Cek tab "Actions" setelah push ke branch |
| Artifact report dapat didownload | Download dari halaman GitHub Actions run |
| Tidak ada matrix/parallel job | Konfirmasi tidak ada `strategy.matrix` di YAML |
| Jenkins pipeline 6 stage berhasil | Blue/Green indicator di Jenkins UI |
| 1 agent tunggal pada Jenkins | Konfirmasi `agent any` tanpa node labeling |
| Notifikasi email terkirim | Cek inbox setelah build SUCCESS/FAILURE |
| Tidak ada credentials hardcoded | Code review + `grep -r "password"` scan |