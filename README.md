# SauceDemo E2E Test Automation Framework

[![Playwright E2E Tests](https://github.com/Zandro2005/Ecommerse_Playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/Zandro2005/Ecommerse_Playwright/actions/workflows/playwright.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.47+-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white)
![Azure Playwright](https://img.shields.io/badge/Cloud-Azure_Playwright-0078D4?logo=microsoftazure&logoColor=white)
![Allure Report](https://img.shields.io/badge/Report-Allure_&_HTML-FF6C37)

End-to-End (E2E) test automation suite for [SauceDemo](https://www.saucedemo.com) built with **Playwright** and **TypeScript** (**Project 1** of a 3-part QA Engineering portfolio: _UI Fundamentals → API+UI Hybrid → Advanced CI/CD_).

## Highlights & Tech Stack

- **Architecture**: Strict **Page Object Model (POM)** (`pages/`) with TypeScript path aliases (`@pages/*`, `@fixtures/*`, `@test-data/*`, `@utils/*`).
- **Chained Custom Fixtures**: Dependency-injected states in `fixtures/Fixtures.ts` (`loginPage` → `productsPage` → `cartWithProduct` / `cartWithThreeProducts` → `checkoutWithProduct` → `checkoutStepTwoWithProduct` → `orderFinished`) eliminate `beforeEach` boilerplate.
- **Data-Driven Testing**: Parameterized test matrices (`test-data/LoginData.ts`) for positive, negative, and boundary scenarios.
- **Cross-Browser Matrix**: Parallel execution on **Chromium**, **Firefox**, **WebKit (Safari)**, and **Mobile Chrome (Pixel 5)**.
- **Reporting & Diagnostics**: **Playwright HTML**, **Allure Report**, **JSON**, and **List** reporters with automatic failure artifacts (`only-on-failure` screenshots, `retain-on-failure` videos & traces).
- **Cloud CI/CD & Quality Gates**: GitHub Actions + **Azure Playwright Testing** (`@azure/playwright`), enforced by **ESLint**, **Prettier**, **Husky**, and **lint-staged**.

## Test Coverage Matrix

Full traceability for all **87 test cases** is documented in [`test-case-list.md`](./test-case-list.md).

| Domain                      | Spec File                       | Cases | Key Scenarios Covered                                                                                       |
| :-------------------------- | :------------------------------ | :---: | :---------------------------------------------------------------------------------------------------------- |
| **Authentication**          | `tests/LoginPage.spec.ts`       |  15   | Valid/invalid login, locked-out user, empty fields, case sensitivity, error dismissal, logout, route guards |
| **Products & Catalog**      | `tests/ProductsPage.spec.ts`    |  23   | Catalog render, item details, add/remove toggles, A–Z / Z–A & price sorting, mobile responsiveness, a11y    |
| **Shopping Cart**           | `tests/CartPage.spec.ts`        |  18   | Badge counters, multi-item persistence across navigation & reload, read-only quantity assertions            |
| **Checkout**                | `tests/CheckoutPage.spec.ts`    |  25   | Form validation, boundary/whitespace inputs, dynamic math (`subtotal + tax = total`), back-button guard     |
| **End-to-End & Regression** | `tests/Full_End_To_End.spec.ts` |   6   | Full happy-path purchase, session termination, `problem_user` UI defect verification, cross-browser smoke   |

**Test Personas** (Password: `secret_sauce`): `standard_user` (happy path) · `locked_out_user` (auth lock) · `problem_user` (UI defects) · `performance_glitch_user` (latency resilience)

## Project Structure

```text
ecommerce-playwright/
├── .github/workflows/playwright.yml   # GitHub Actions CI + Azure Playwright Service
├── .husky/pre-commit                  # Pre-commit hook (lint-staged: ESLint + Prettier)
├── docs/                              # CHEATSHEET.md & UI_Testing_CheatSheet.pdf
├── fixtures/Fixtures.ts               # Composable state-seeding Playwright fixtures
├── pages/                             # POM classes (Login, Products, Cart, Checkout)
├── test-data/LoginData.ts             # Data-driven login test matrices
├── tests/                             # 5 E2E spec suites (87 automated scenarios)
├── playwright.config.ts               # Local browser, timeout & reporter config
├── playwright.service.config.ts       # Azure Playwright Testing cloud config
└── test-case-list.md                  # 87-case manual & automated traceability matrix
```

## Quick Start & Configuration

**Prerequisites**: Node.js `v20+`, npm, and _(optional)_ Java JRE 8+ for local Allure report viewing.

```bash
# 1. Install dependencies & browser binaries
npm ci
npx playwright install --with-deps

# 2. Configure environment variables (optional — falls back to standard_user defaults)
cp .env.example .env
```

**Environment Variables (`.env`)**: `BASE_URL` (`https://www.saucedemo.com`), `TEST_USERNAME`, `TEST_PASSWORD`, `TEST_FIRSTNAME`, `TEST_LASTNAME`, `TEST_POSTALCODE`.

## Running Tests & Code Quality

```bash
# Execution Modes
npm test                     # Run all suites headless across all 4 browsers
npm run test:headed          # Run with visible browser windows
npm run test:ui              # Launch interactive Playwright UI Mode

# By Browser Project
npm run test:chromium        # Desktop Chrome
npm run test:firefox         # Desktop Firefox
npm run test:webkit          # Desktop Safari
npm run test:mobile          # Mobile Chrome (Pixel 5)

# By Feature Suite
npm run test:auth            # LoginPage.spec.ts
npm run test:products        # ProductsPage.spec.ts
npm run test:cart            # CartPage.spec.ts
npm run test:checkout        # CheckoutPage.spec.ts
npm run test:regression      # Full_End_To_End.spec.ts (all projects)

# Code Quality
npm run lint                 # Run ESLint on TypeScript files
npm run format               # Format repository with Prettier
```

## Reporting & Debugging

```bash
npm run report               # Open Playwright HTML report
npm run allure:generate      # Generate Allure report from allure-results/
npm run allure:open          # Serve Allure report in browser
npx playwright show-trace test-results/<folder>/trace.zip   # Inspect failure trace
```

## CI/CD & Cloud Execution

`.github/workflows/playwright.yml` runs on every `push` and `pull_request` to `main` (plus `workflow_dispatch`), executing tests on **Azure Playwright Testing** (`playwright.service.config.ts`) and uploading `playwright-report/`, `test-results/`, and `allure-results/` artifacts.

**GitHub Actions Secrets & Variables**:

- **Required for Azure Cloud**: `secrets.AZURE_CREDENTIALS` (Service Principal JSON) & `vars.PLAYWRIGHT_SERVICE_URL`
- **Optional Test Overrides**: `TEST_USERNAME`, `TEST_PASSWORD`, `TEST_FIRSTNAME`, `TEST_LASTNAME`, `TEST_POSTALCODE`
