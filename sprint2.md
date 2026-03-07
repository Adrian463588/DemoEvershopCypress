# 📋 Sprint 2 — Technical Requirements Document
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

Cypress default reporter hanya menghasilkan output CLI yang tidak visual dan tidak dapat di-share ke stakeholder. Allure Report menghasilkan HTML interaktif dengan timeline, steps breakdown, screenshot attachment, dan history trend. [talent500](https://talent500.com/blog/testing-workflows-with-allure/)

### Dependencies & Prerequisites

| Item | Versi | Keterangan |
|---|---|---|
| `allure-cypress` | Latest | Official adapter dari allurereport.org  [allurereport](https://allurereport.org/docs/cypress-configuration/) |
| `allure-js-commons` | Latest | Runtime API untuk metadata & steps |
| Java JDK | 11+ | Required untuk Allure CLI binary  [allurereport](https://allurereport.org/docs/cypress/) |
| Allure CLI | Latest | Generate & serve HTML report |
| Node.js | 18+ | Minimum requirement allure-cypress  [allurereport](https://allurereport.org/docs/cypress/) |

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

**2. Konfigurasi `cypress.config.js`** [allurereport](https://allurereport.org/docs/cypress-configuration/)
```js
import { allureCypress } from "allure-cypress/reporter";
import * as os from "node:os";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      allureCypress(on, config, {
        resultsDir: "allure-results",
        environmentInfo: {
          app_url:     "https://demo.evershop.io",
          os_platform: os.platform(),
          os_version:  os.version(),
          node_version: process.version,
        },
      });
      return config;
    },
  },
});
```

**3. Import di `cypress/support/e2e.js`** [allurereport](https://allurereport.org/docs/cypress/)
```js
import "allure-cypress";
```

**4. Metadata Annotation per Test** [allurereport](https://allurereport.org/docs/cypress/)
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
- Screenshot failure otomatis ter-attach tanpa konfigurasi manual [allurereport](https://allurereport.org/docs/cypress/)
- Report dapat diakses offline melalui `allure open`

***

## F-02 — CI/CD GitHub Actions

### Latar Belakang

GitHub Actions memungkinkan test suite berjalan otomatis setiap kali ada `push` atau `pull_request`, memberikan feedback langsung di level commit dan PR. [docs.cypress](https://docs.cypress.io/app/continuous-integration/github-actions)

### Acceptance Criteria

- [ ] Pipeline berjalan otomatis pada event: `push` ke branch `main`/`develop`, dan `pull_request`
- [ ] Allure Report ter-upload sebagai artifact yang dapat didownload dari halaman Actions
- [ ] Pipeline gagal (exit code non-0) jika ada test yang gagal
- [ ] Node modules ter-cache agar waktu eksekusi efisien
- [ ] Secrets (credentials) tidak terekspos dalam logs

### Spesifikasi Teknis

**Struktur file:**
```
.github/
└── workflows/
    ├── cypress-ci.yml        # Main pipeline
    └── cypress-nightly.yml   # Scheduled full regression
```

**File `.github/workflows/cypress-ci.yml`** [docs.cypress](https://docs.cypress.io/app/continuous-integration/github-actions)
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
  # ── Job 1: Install & Cache ──────────────────────────────
  install:
    name: Install Dependencies
    runs-on: ubuntu-24.04
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v6

      - name: Setup Node.js 20
        uses: actions/setup-java@v4
        with:
          java-version: '17'   # Required untuk Allure CLI

      - name: Cypress Install (no run)
        uses: cypress-io/github-action@v7
        with:
          runTests: false

      - name: Install Allure CLI
        run: npm install -g allure-commandline

      - name: Cache build artifacts
        uses: actions/upload-artifact@v6
        with:
          name: node-modules-cache
          path: node_modules
          if-no-files-found: error

  # ── Job 2: Run Tests ────────────────────────────────────
  cypress-run:
    name: Run Cypress Tests
    runs-on: ubuntu-24.04
    needs: install
    strategy:
      fail-fast: false
      matrix:
        # Parallelisasi 3 container
        containers: [1, 2, 3]

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v6

      - name: Setup Java (Allure requirement)
        uses: actions/setup-java@v4
        with:
          java-version: '17'

      - name: Download cached node_modules
        uses: actions/download-artifact@v7
        with:
          name: node-modules-cache
          path: node_modules

      - name: Run Cypress Tests
        uses: cypress-io/github-action@v7
        with:
          browser: chrome
          install: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          CYPRESS_BASE_URL: ${{ env.CYPRESS_BASE_URL }}

      - name: Upload Allure Results
        uses: actions/upload-artifact@v6
        if: always()   # Upload meskipun test gagal
        with:
          name: allure-results-${{ matrix.containers }}
          path: allure-results/

  # ── Job 3: Generate & Publish Report ───────────────────
  allure-report:
    name: Generate Allure Report
    runs-on: ubuntu-24.04
    needs: cypress-run
    if: always()

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v6

      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          java-version: '17'

      - name: Download all Allure Results
        uses: actions/download-artifact@v7
        with:
          pattern: allure-results-*
          merge-multiple: true
          path: allure-results/

      - name: Install Allure CLI
        run: npm install -g allure-commandline

      - name: Generate Allure Report
        run: allure generate allure-results -o allure-report --clean

      - name: Upload Allure HTML Report
        uses: actions/upload-artifact@v6
        with:
          name: allure-html-report
          path: allure-report/
          retention-days: 30
```

**File `.github/workflows/cypress-nightly.yml`** — Scheduled Full Regression
```yaml
name: Nightly Full Regression

on:
  schedule:
    - cron: '0 22 * * *'   # Setiap malam jam 22:00 UTC (05:00 WIB)
  workflow_dispatch:        # Manual trigger

jobs:
  full-regression:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v6
      - uses: cypress-io/github-action@v7
        with:
          browser: chrome
        env:
          CYPRESS_BASE_URL: https://demo.evershop.io
```

### GitHub Secrets yang Harus Dikonfigurasi

| Secret Name | Deskripsi | Required |
|---|---|---|
| `GITHUB_TOKEN` | Auto-generated oleh GitHub Actions  [docs.cypress](https://docs.cypress.io/app/continuous-integration/github-actions) | ✅ Auto |
| `CYPRESS_USERNAME` | Email login demo.evershop.io | ✅ Manual |
| `CYPRESS_PASSWORD` | Password login demo.evershop.io | ✅ Manual |

### Non-Functional Requirements
- Total pipeline duration ≤ 15 menit dengan 3 parallel containers
- Artifact report tersimpan selama 30 hari
- Re-run build tidak menghasilkan false positive [docs.cypress](https://docs.cypress.io/app/continuous-integration/github-actions)

***

## F-03 — CI/CD Jenkins Pipeline

### Latar Belakang

Jenkins digunakan untuk environment on-premise atau corporate network yang tidak dapat menggunakan GitHub Actions, serta untuk integrasi dengan sistem internal (Jira, Slack, email notifikasi). [blog.nashtechglobal](https://blog.nashtechglobal.com/building-a-ci-cd-pipeline-for-cypress-testing-on-windows-with-jenkins/)

### Prerequisites & Plugin Jenkins

Plugin yang wajib diinstall melalui **Manage Jenkins → Plugin Manager**: [blog.nashtechglobal](https://blog.nashtechglobal.com/building-a-ci-cd-pipeline-for-cypress-testing-on-windows-with-jenkins/)

| Plugin | Fungsi |
|---|---|
| **NodeJS Plugin** | Manage Node.js version pada agent |
| **Git Plugin** | SCM checkout dari repository |
| **Pipeline** | Declarative pipeline via Jenkinsfile |
| **HTML Publisher Plugin** | Publish Allure HTML report di Jenkins UI |
| **Allure Jenkins Plugin** | Native Allure report integration |
| **Blue Ocean** | Visual pipeline view (opsional) |

### Acceptance Criteria

- [ ] Jenkinsfile tersimpan di root repository (Pipeline as Code)
- [ ] Pipeline memiliki 5 stage: Checkout → Install → Test → Generate Report → Publish
- [ ] Allure Report dapat diakses langsung dari Jenkins job page
- [ ] Pipeline mengirim notifikasi email/Slack pada status: SUCCESS, FAILURE, UNSTABLE
- [ ] Build history tersimpan minimal 10 run terakhir
- [ ] Environment variables di-inject dari Jenkins Credentials (bukan hardcoded)

### Spesifikasi Teknis

**File `Jenkinsfile`** di root project:
```groovy
pipeline {
    agent any

    // ── Tool Versions ──────────────────────────────────────
    tools {
        nodejs 'NodeJS-20'   // Sesuaikan dengan nama di Global Tool Config
    }

    // ── Environment Variables ──────────────────────────────
    environment {
        CYPRESS_BASE_URL    = 'https://demo.evershop.io'
        ALLURE_RESULTS_DIR  = 'allure-results'
        ALLURE_REPORT_DIR   = 'allure-report'
        // Credentials dari Jenkins Credential Store
        CYPRESS_USERNAME    = credentials('evershop-username')
        CYPRESS_PASSWORD    = credentials('evershop-password')
    }

    // ── Build Options ──────────────────────────────────────
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        timestamps()
    }

    // ── Triggers ───────────────────────────────────────────
    triggers {
        // Nightly build setiap jam 23:00
        cron('0 23 * * *')
        // Webhook dari GitHub (opsional, requires GitHub plugin)
        githubPush()
    }

    stages {

        // ── Stage 1: Checkout ──────────────────────────────
        stage('Checkout SCM') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/your-org/cypress-evershop.git',
                    credentialsId: 'github-credentials'
                echo "✅ Repository checked out: ${env.GIT_COMMIT}"
            }
        }

        // ── Stage 2: Install Dependencies ─────────────────
        stage('Install Dependencies') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci'   // ci lebih deterministik daripada npm install
                sh 'npm install -g allure-commandline'
                echo "✅ Dependencies installed"
            }
        }

        // ── Stage 3: Clean Previous Results ───────────────
        stage('Clean Artifacts') {
            steps {
                sh '''
                    rm -rf ${ALLURE_RESULTS_DIR} || true
                    rm -rf ${ALLURE_REPORT_DIR}  || true
                    mkdir -p ${ALLURE_RESULTS_DIR}
                '''
                echo "✅ Previous artifacts cleaned"
            }
        }

        // ── Stage 4: Run Cypress Tests ─────────────────────
        stage('Run Cypress Tests') {
            steps {
                sh '''
                    npx cypress run \
                        --browser chrome \
                        --headless \
                        --reporter-options resultsDir=${ALLURE_RESULTS_DIR}
                '''
            }
            post {
                always {
                    // Archive screenshots & videos
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
                sh '''
                    allure generate ${ALLURE_RESULTS_DIR} \
                           -o ${ALLURE_REPORT_DIR} --clean
                '''
                echo "✅ Allure report generated"
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
                    results: [[path: 'allure-results']]
                ])

                // Fallback: Publish via HTML Publisher
                publishHTML(target: [
                    allowMissing:          false,
                    alwaysLinkToLastBuild: true,
                    keepAll:               true,
                    reportDir:            "${ALLURE_REPORT_DIR}",
                    reportFiles:          'index.html',
                    reportName:           'Allure E2E Report'
                ])

                echo "✅ Report published to Jenkins"
            }
        }
    }

    // ── Post Build Actions ─────────────────────────────────
    post {
        success {
            echo "🟢 BUILD SUCCESS — All tests passed"
            emailext(
                subject: "✅ [SUCCESS] Cypress E2E - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    Build berhasil!
                    Job     : ${env.JOB_NAME}
                    Build   : #${env.BUILD_NUMBER}
                    URL     : ${env.BUILD_URL}
                    Commit  : ${env.GIT_COMMIT}
                """,
                to: 'qa-team@yourcompany.com'
            )
        }
        failure {
            echo "🔴 BUILD FAILED — Test failures detected"
            emailext(
                subject: "❌ [FAILURE] Cypress E2E - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    Build GAGAL! Segera periksa laporan.
                    Job     : ${env.JOB_NAME}
                    Build   : #${env.BUILD_NUMBER}
                    URL     : ${env.BUILD_URL}
                    Report  : ${env.BUILD_URL}Allure_20E2E_20Report/
                """,
                to: 'qa-team@yourcompany.com'
            )
        }
        unstable {
            echo "🟡 BUILD UNSTABLE — Some tests failed"
        }
        always {
            cleanWs()   // Bersihkan workspace setelah setiap build
        }
    }
}
```

### Konfigurasi Jenkins Job

Langkah setup di Jenkins UI: [blog.nashtechglobal](https://blog.nashtechglobal.com/building-a-ci-cd-pipeline-for-cypress-testing-on-windows-with-jenkins/)

1. **New Item** → pilih **Pipeline** → beri nama `cypress-evershop-e2e`
2. **General**: centang *Discard old builds* → Max 10 builds
3. **Build Triggers**: centang *GitHub hook trigger* dan/atau *Build periodically*
4. **Pipeline**: pilih **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: URL repo GitHub
   - Script Path: `Jenkinsfile`
5. **Save → Build Now**

### Credential yang Harus Dikonfigurasi di Jenkins

Navigasi ke **Manage Jenkins → Credentials → Global**:

| ID Credential | Type | Value |
|---|---|---|
| `github-credentials` | Username/Password | GitHub access token |
| `evershop-username` | Secret Text | Email demo.evershop.io |
| `evershop-password` | Secret Text | Password demo.evershop.io |

***

## Struktur Project Akhir Sprint 2

```
cypress-evershop/
├── .github/
│   └── workflows/
│       ├── cypress-ci.yml
│       └── cypress-nightly.yml
├── cypress/
│   ├── e2e/
│   ├── support/
│   │   └── e2e.js           # import "allure-cypress"
│   └── fixtures/
├── allure-results/           # Gitignore
├── allure-report/            # Gitignore
├── cypress.config.js         # allureCypress setup
├── Jenkinsfile               # Pipeline as Code
├── package.json
└── .gitignore
```

***

## Definition of Done Sprint 2

| Kriteria | Verifikasi |
|---|---|
| Allure Report ter-generate lokal | `npm run test:report` menghasilkan HTML |
| Screenshot failure ter-attach | Cek di laporan Allure setelah test gagal |
| GitHub Actions berjalan di PR | Cek tab "Actions" setelah push ke branch |
| Artifact report dapat didownload | Download dari halaman GitHub Actions run |
| Jenkins pipeline 5 stage berhasil | Blue/Green indicator di Jenkins UI |
| Notifikasi email terkirim | Cek inbox setelah build SUCCESS/FAILURE |
| Tidak ada credentials hardcoded | Code review & grep scan pada codebase |

