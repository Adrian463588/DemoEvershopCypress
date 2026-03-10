# EverShop Cypress Automation Framework

![Cypress](https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white) ![Jenkins](https://img.shields.io/badge/jenkins-%232C5263.svg?style=for-the-badge&logo=jenkins&logoColor=white) 

This repository contains a robust, end-to-end automated testing suite for the [EverShop Demo](https://demo.evershop.io/) e-commerce platform. Built with **Cypress** utilizing the Page Object Model (POM), it guarantees stability across authentication, checkout pipelines, and core user journeys.

## 🏗️ Project Architecture & Tooling
- **Core Engine:** Cypress (v13.x) & Javascript
- **Design Pattern:** Page Object Model (POM) + Custom Cypress Commands
- **Reporting:** Allure Reporter (Primary) + Mochawesome (Secondary)
- **CI/CD Orchestration:** Jenkins (Cron/Webhooks) & GitHub Actions

### Directory Structure Focus
- `.husky/`: Pre-commit git hooks enforcing code quality before pushes.
- `cypress/e2e/auth/`: Authentication flows (Login, Registration, Logout, Form Validations).
- `cypress/e2e/checkout/`: Checkout processing flows (Guest, Auth User, Multi-variant baskets).
- `cypress/e2e/product/`: Search workflows and product selections.
- `cypress/support/`: POM objects, Custom Commands, and overriding handlers.

## ⚙️ Prerequisites & Installation
1. Ensure you have **Node.js** (v18+ recommended) and `npm` installed.
2. Clone the repository to your local machine:
```bash
git clone https://github.com/Adrian463588/DemoEvershopCypress.git
cd DemoEvershopCypress
```
3. Install all necessary dependencies:
```bash
npm ci
```
*(Note: We use `npm ci` over `npm install` for strict, clean, reproducible dependency graphs).*

## 🚀 Execution Commands

We provide native custom `package.json` scripts for simplified execution:

| Command | Description |
|---------|-------------|
| `npm run test` | Standard headless Cypress run (`npx cypress run`) |
| `npm run cy:run` | Headless run injecting the Allure environment configuration (`allure=true`) |
| `npm run allure:clean` | Wipes previous `allure-results` and `allure-report` artifact directories |
| `npm run allure:generate` | Processes results and builds the Allure HTML dashboard into `allure-report/` |
| `npm run allure:open` | Starts a transient local webserver to view the rendered Allure dashboard |
| `npm run test:report` | **Full Suite:** Cleans artifacts -> Runs Tests -> Generates Allure HTML Dashboard |

**Interactive Development Mode:**
To open the Cypress Test Runner locally:
```bash
npx cypress open
```

## 📊 CI/CD Pipelines

This repository operates on a high-availability dual-pipeline infrastructure, providing instant feedback and robust scheduled reports.

### 1. GitHub Actions (`cypress-ci.yml`)
- **Triggers:** Automatically on `push` or `pull_request` to `main` and `develop`.
- **Workflow:** Installs dependencies, runs the entire E2E suite, generates native Allure Reports, and archives Mochawesome/Cypress Artifacts (Screenshots + Videos on failure).
- **Deployment:** Automatically pushes up-to-date `.html` Allure Histories natively to the [GitHub Pages (gh-pages) branch](https://adrian463588.github.io/DemoEvershopCypress/).

### 2. Jenkins (`Jenkinsfile`)
- **Triggers:** Webhook on GitHub Push + Nightly Cron Job (`0 23 * * * Asia/Jakarta`).
- **Workflow:** Cleans workspaces, runs Headless Cypress, publishes Mochawesome artifacts, and utilizes the official **Jenkins Allure Plugin** to render interactive reports over the restrictive Jenkins CSP UI.
- **Alerting:** Pushes graphical summary Webhooks directly to a centralized **Discord** channel (Successful, Unstable, and Failed build alerting).

## 📚 Supplementary Documentation
For deep-dives into framework constraints or architectural decisions, please refer to:
- `PRDAutomate.md`: Product Requirements Document / Architecture specifications.
- `sprint2.md`: Detailed ticket breakdowns.
- `panduan_debug.md`: Localized debugging guidelines.
