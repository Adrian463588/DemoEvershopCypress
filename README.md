# EverShop Automate Demo

This repository contains an end-to-end automated testing suite for the [EverShop Demo](https://demo.evershop.io/) e-commerce platform. It is built using **Cypress** and Javascript to ensure the robustness of critical user journeys.

## Project Structure
The test suite utilizes the Page Object Model (POM) pattern, custom commands, and Cypress fixtures:
- `cypress/e2e/auth/`: Contains authentication flows (Login, Registration, Logout, Forgot Password)
- `cypress/e2e/checkout/`: Contains checkout process tests for both Guest and Logged-in Users
- `cypress/e2e/product/`: Tests for product browsing and search functions

## Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

## Installation
Clone the repository and install the dependencies:
```bash
npm install
```

## Running Tests

To open the Cypress Test Runner (Interactive Mode):
```bash
npx cypress open
```

To run all tests in Headless Mode:
```bash
npx cypress run
```

To run a specific test suite in Headless Mode:
```bash
npx cypress run --spec "cypress/e2e/auth/login.cy.js"
```

## Reports
This project uses `mochawesome` to generate HTML test execution reports.
After running tests in headless mode, the generated reports can be found in the `cypress/reports/` directory.

## Features Covered
- **Authentication**: Valid login/registration, password validations, toast error handling.
- **Product Search**: Locating products via search bar and hitting enter keys.
- **Checkout Flows**: Single product, Multi-variant, and Category-page flow combinations.
- **Data Pre-filling**: Automating Logged-in profile data verifications across checkout forms.
- **Database Checking**: Verifying Order confirmation numbers generated within the user account profile.
