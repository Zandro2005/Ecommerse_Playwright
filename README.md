# SauceDemo E2E Test Automation Framework

[![Playwright E2E Tests](https://github.com/Zandro2005/Ecommerse_Playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/Zandro2005/Ecommerse_Playwright/actions/workflows/playwright.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.47+-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white)
![Azure Playwright Testing](https://img.shields.io/badge/Cloud-Azure_Playwright-0078D4?logo=microsoftazure&logoColor=white)
![Allure Report](https://img.shields.io/badge/Report-Allure_&_HTML-FF6C37)

A production-grade End-to-End (E2E) test automation framework for [SauceDemo](https://www.saucedemo.com), built with **Playwright** and **TypeScript**. Designed for scalability, maintainability, and CI/CD cloud execution, this repository serves as **Project 1** of a 3-part QA Automation Engineering portfolio (_UI Fundamentals → API + UI Hybrid → Advanced CI/CD Architecture_).

---

## Table of Contents

- [Key Engineering Highlights](#key-engineering-highlights)
- [Technology Stack](#technology-stack)
- [Architecture & Fixture Design](#architecture--fixture-design)
- [Test Coverage & Traceability Matrix](#test-coverage--traceability-matrix)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
- [Running Tests](#running-tests)
- [Reporting & Failure Diagnostics](#reporting--failure-diagnostics)
- [CI/CD & Cloud Execution](#cicd--cloud-execution)
- [Code Quality & Developer Workflow](#code-quality--developer-workflow)
- [Documentation & Resources](#documentation--resources)

---

## Key Engineering Highlights

- **Strict Page Object Model (POM)**: Encapsulates UI locators, page interactions, and component states inside dedicated page classes (`pages/`), keeping spec files declarative and assertion-focused.
- **Composable Fixture Dependency Graph**: Custom Playwright fixtures (`fixtures/Fixtures.ts`) chain application states automatically (`loginPage` → `productsPage` → `cartWithProduct` → `checkoutWithProduct` → `orderFinished`), eliminating repetitive `beforeEach` setup boilerplate.
- **Data-Driven Testing (DDT)**: Parameterized test data matrices (`test-data/LoginData.ts`) drive positive, negative, boundary, and security/access-control scenarios.
- **Cross-Browser & Mobile Viewport Matrix**: Parallel execution across **Desktop Chromium**, **Desktop Firefox**, **Desktop WebKit (Safari)**, and **Mobile Chrome (Pixel 5)**.
- **Enterprise Observability**: Dual reporting pipeline combining **Playwright HTML Reports**, **JSON results**, and **Allure Reports**, backed by automatic trace archives, screenshots, and video recordings on failure.
- **Cloud-Scale CI/CD Pipeline**: GitHub Actions workflow integrated with **Microsoft Azure Playwright Testing** (`playwright.service.config.ts`) for distributed cloud browser execution.
- **Shift-Left Code Quality Gates**: Enforced TypeScript strict mode, ESLint static analysis, Prettier formatting, and automated Husky + `lint-staged` pre-commit hooks.

---

## Technology Stack

| Layer                      | Technology                                      | Purpose                                                       |
| :------------------------- | :---------------------------------------------- | :------------------------------------------------------------ |
| **Automation Engine**      | `@playwright/test` (`^1.47.0`)                  | Multi-browser E2E automation, assertions, and test runner     |
| **Language**               | `TypeScript` (`^5.5.0`)                         | Type-safe page objects, custom fixtures, and test data        |
| **Cloud Execution Grid**   | `@azure/playwright`, `@azure/identity`          | Parallel cloud browser execution via Azure Playwright Service |
| **Reporting & Analytics**  | `allure-playwright`, `allure-commandline`, HTML | Executive test dashboards, step breakdowns, and failure logs  |
| **Environment Management** | `dotenv`                                        | Secure environment variable loading for local & CI runs       |
| **Code Quality & Hooks**   | `ESLint`, `Prettier`, `Husky`, `lint-staged`    | Automated linting and formatting on staged Git commits        |

---

## Architecture & Fixture Design

Instead of repeating login and cart setup steps across dozens of test files, this framework uses **chained custom fixtures** (`fixtures/Fixtures.ts`) to inject pre-configured page states directly into any test:

```text
page (Playwright Base)
 └── loginPage (Authenticated session via env credentials)
      └── productsPage (Inventory catalog loaded)
           ├── cartWithProduct (1 item seeded in cart)
           │    └── checkoutWithProduct (Checkout Step 1)
           │         └── checkoutStepTwoWithProduct (Checkout Step 2 Overview)
           │              └── orderFinished (Order Confirmation state)
           └── cartWithThreeProducts (3 items seeded in cart)
                └── checkoutWithThreeProducts (Checkout Step 1)
                     └── checkoutStepTwoWithThreeProducts (Checkout Step 2 Overview)
```

### Available Custom Fixtures

| Fixture Name                       | Injected Page Type | Pre-seeded Application State                                        |
| :--------------------------------- | :----------------- | :------------------------------------------------------------------ |
| `loginPage`                        | `LoginPage`        | Navigates to base URL and authenticates with valid credentials      |
| `productsPage`                     | `ProductsPage`     | Authenticated user landed on `/inventory.html`                      |
| `cartWithProduct`                  | `CartPage`         | Adds _Sauce Labs Backpack_ and opens the shopping cart              |
| `cartWithThreeProducts`            | `CartPage`         | Adds 3 distinct products and opens the shopping cart                |
| `checkoutWithProduct`              | `CheckoutPage`     | Proceeds to Checkout Step 1 (`/checkout-step-one.html`) with 1 item |
| `checkoutWithThreeProducts`        | `CheckoutPage`     | Proceeds to Checkout Step 1 with 3 items                            |
| `checkoutStepTwoWithProduct`       | `CheckoutPage`     | Completes customer form and lands on Checkout Step 2 Overview       |
| `checkoutStepTwoWithThreeProducts` | `CheckoutPage`     | Completes customer form with 3 items on Checkout Step 2 Overview    |
| `orderFinished`                    | `CheckoutPage`     | Submits the order and lands on `/checkout-complete.html`            |

---

## Test Coverage & Traceability Matrix

All **87 test cases** are formally documented with IDs, preconditions, steps, priority, and automation status in [`test-case-list.md`](./test-case-list.md).

| Domain                      | Spec File                       | Documented Cases | Automated Specs | Key Validation Areas                                                                                                       |
| :-------------------------- | :------------------------------ | :--------------: | :-------------: | :------------------------------------------------------------------------------------------------------------------------- |
| **Authentication**          | `tests/LoginPage.spec.ts`       |        15        |       15        | Valid/invalid login, locked-out user, empty inputs, case sensitivity, error dismissal, logout, unauthenticated URL guard   |
| **Products & Catalog**      | `tests/ProductsPage.spec.ts`    |        22        |       23        | Catalog rendering, product details routing, add/remove toggles, A–Z / Z–A & price sorting, mobile viewport, keyboard a11y  |
| **Shopping Cart**           | `tests/CartPage.spec.ts`        |        18        |       18        | Badge counters, multi-item persistence across navigation & page reload, read-only quantity checks, item removal            |
| **Checkout**                | `tests/CheckoutPage.spec.ts`    |        25        |       25        | Step 1 form validation, whitespace/boundary inputs, dynamic subtotal + tax = total calculation, back-navigation protection |
| **End-to-End & Regression** | `tests/Full_End_To_End.spec.ts` |        7         |  6 (+ CI run)   | Full happy-path purchase journey, session termination, `problem_user` UI defect verification, cross-browser smoke suite    |
| **Total**                   | **5 Test Suites**               |      **87**      |     **87**      | **Full E2E functional, negative, boundary, and cross-browser coverage**                                                    |

### Target Application Test Personas

| Username                  | Password       | Test Objective                                                          |
| :------------------------ | :------------- | :---------------------------------------------------------------------- |
| `standard_user`           | `secret_sauce` | Primary happy-path functional and end-to-end validation                 |
| `locked_out_user`         | `secret_sauce` | Negative authentication and account lock error verification             |
| `problem_user`            | `secret_sauce` | Known UI defect detection (broken product images, miswired form inputs) |
| `performance_glitch_user` | `secret_sauce` | Latency resilience and timeout threshold validation                     |

---

## Project Structure

```text
ecommerce-playwright/
├── .github/
│   └── workflows/
│       └── playwright.yml               # GitHub Actions CI/CD pipeline (Azure Playwright Service)
├── .husky/
│   └── pre-commit                       # Git pre-commit hook running lint-staged
├── docs/
│   ├── CHEATSHEET.md                    # Playwright CLI & POM architecture quick reference
│   └── UI_Testing_CheatSheet.pdf        # Printable UI testing & test case reference guide
├── fixtures/
│   └── Fixtures.ts                      # Composable custom Playwright test fixtures
├── pages/
│   ├── LoginPage.ts                     # Authentication page object
│   ├── ProductsPage.ts                  # Inventory & sorting page object
│   ├── CartPage.ts                      # Shopping cart page object
│   └── CheckoutPage.ts                  # Multi-step checkout & order confirmation page object
├── test-data/
│   └── LoginData.ts                     # Data-driven authentication test matrices
├── tests/
│   ├── LoginPage.spec.ts                # Authentication test suite
│   ├── ProductsPage.spec.ts             # Products, sorting & responsive UI suite
│   ├── CartPage.spec.ts                 # Shopping cart state & persistence suite
│   ├── CheckoutPage.spec.ts             # Checkout validation & price calculation suite
│   └── Full_End_To_End.spec.ts          # End-to-end user journeys & regression smoke suite
├── utils/                               # Shared helper utilities
├── .env.example                         # Template for local environment variables
├── .eslintrc.cjs                        # ESLint TypeScript configuration
├── .lintstagedrc                        # Pre-commit file linting & formatting rules
├── .prettierrc                          # Prettier code formatting configuration
├── playwright.config.ts                 # Local multi-browser & reporter configuration
├── playwright.service.config.ts         # Azure Playwright Testing cloud configuration
├── test-case-list.md                    # 87-case traceability matrix & manual test documentation
├── tsconfig.json                        # TypeScript compiler & path alias configuration
└── package.json                         # Scripts and project dependencies
```

---

## Getting Started

### Prerequisites

- **Node.js**: `v20.x` or higher ([Download](https://nodejs.org/))
- **npm**: `v10.x` or higher (bundled with Node.js)
- **Java Runtime Environment (JRE 8+)**: _Optional_ — required locally only if generating or viewing **Allure Reports** via `allure-commandline`.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Zandro2005/Ecommerse_Playwright.git
   cd Ecommerce-Playwright
   ```

2. **Install project dependencies:**

   ```bash
   npm ci
   ```

3. **Install Playwright browser binaries and system dependencies:**
   ```bash
   npx playwright install --with-deps
   ```

### Environment Configuration

Create a local `.env` file from the provided template:

```bash
cp .env.example .env
```

Configure the environment variables in `.env` as needed (defaults fall back to standard SauceDemo credentials if omitted):

| Variable          | Default Value               | Description                                           |
| :---------------- | :-------------------------- | :---------------------------------------------------- |
| `BASE_URL`        | `https://www.saucedemo.com` | Target application base URL                           |
| `TEST_USERNAME`   | `standard_user`             | Default username injected into authenticated fixtures |
| `TEST_PASSWORD`   | `secret_sauce`              | Default password injected into authenticated fixtures |
| `TEST_FIRSTNAME`  | `Zandro` / `Test`           | First name used in checkout form steps                |
| `TEST_LASTNAME`   | `Guinialope` / `User`       | Last name used in checkout form steps                 |
| `TEST_POSTALCODE` | `1860` / `12345`            | Postal/ZIP code used in checkout form steps           |

---

## Running Tests

### Standard & Interactive Execution

```bash
# Run all test suites headless across all 4 browser projects
npm test

# Run tests with visible browser windows
npm run test:headed

# Launch interactive Playwright UI Mode (time-travel debugging & watch mode)
npm run test:ui
```

### Run by Browser / Device Project

```bash
npm run test:chromium        # Desktop Chrome (Chromium)
npm run test:firefox         # Desktop Firefox
npm run test:webkit          # Desktop Safari (WebKit)
npm run test:mobile          # Mobile Chrome (Pixel 5 emulation)
```

### Run by Feature Domain Suite

```bash
npm run test:auth            # Authentication suite (tests/LoginPage.spec.ts)
npm run test:products        # Products & catalog suite (tests/ProductsPage.spec.ts)
npm run test:cart            # Shopping cart suite (tests/CartPage.spec.ts)
npm run test:checkout        # Checkout validation suite (tests/CheckoutPage.spec.ts)
npm run test:regression      # End-to-End regression suite (tests/Full_End_To_End.spec.ts)
npm run test:cross-browser   # Cross-browser E2E smoke suite across all projects
```

### Advanced Playwright CLI Commands

```bash
# Run a single test by title match
npx playwright test -g "Valid login"

# Run a specific file on Chromium only with 1 worker
npx playwright test tests/CheckoutPage.spec.ts --project=chromium --workers=1

# Debug a test step-by-step using Playwright Inspector
npx playwright test tests/LoginPage.spec.ts --debug
```

---

## Reporting & Failure Diagnostics

This framework is configured with four concurrent reporters in `playwright.config.ts`:

1. **List Reporter**: Real-time terminal progress output.
2. **JSON Reporter**: Machine-readable summary written to `test-results/results.json`.
3. **Playwright HTML Report**: Interactive web report (`playwright-report/`).
4. **Allure Report**: Rich historical & behavior-driven test dashboard (`allure-results/` → `allure-report/`).

### Viewing Reports

```bash
# Open the built-in Playwright HTML Report
npm run report

# Generate and open the Allure Report (requires Java installed)
npm run allure:generate
npm run allure:open
```

### Automated Failure Artifacts

To optimize execution speed while preserving full root-cause visibility, diagnostic artifacts are captured automatically on test failure:

- **Screenshots** (`only-on-failure`): Attached to HTML/Allure reports and saved in `test-results/`.
- **Video Recordings** (`retain-on-failure`): Full browser session video saved per failed test.
- **Playwright Trace Archive** (`retain-on-failure`): Full DOM snapshots, network waterfall, console logs, and action timeline. Inspect any trace file locally using:
  ```bash
  npx playwright show-trace test-results/<test-folder>/trace.zip
  ```

---

## CI/CD & Cloud Execution

The GitHub Actions workflow (`.github/workflows/playwright.yml`) runs automatically on:

- Every `push` to `main`
- Every `pull_request` targeting `main`
- Manual trigger via `workflow_dispatch`

### Pipeline Architecture

1. **Environment Provisioning**: Checks out code and provisions Node.js `20` on `ubuntu-latest` with deterministic dependency installation (`npm ci`).
2. **Azure Cloud Authentication**: Authenticates via `azure/login@v3` using `DefaultAzureCredential`.
3. **Distributed Cloud Test Execution**: Executes the test suite against **Azure Playwright Testing** (`playwright.service.config.ts`) across remote Linux browser workers.
4. **Artifact Archival**: Always uploads `playwright-report/`, `test-results/`, and `allure-results/` as downloadable GitHub Actions artifacts.

### Required GitHub Repository Secrets & Variables

To enable the Azure cloud pipeline in your fork or organization repository, configure the following under **Settings → Secrets and variables → Actions**:

| Type         | Name                     | Description                                                            |
| :----------- | :----------------------- | :--------------------------------------------------------------------- |
| **Secret**   | `AZURE_CREDENTIALS`      | Azure Service Principal JSON credentials (`azure/login@v3` compatible) |
| **Variable** | `PLAYWRIGHT_SERVICE_URL` | Regional endpoint URL for your Azure Playwright Testing workspace      |
| **Secret**   | `TEST_USERNAME`          | _(Optional)_ Override username (defaults to `standard_user`)           |
| **Secret**   | `TEST_PASSWORD`          | _(Optional)_ Override password (defaults to `secret_sauce`)            |
| **Secret**   | `TEST_FIRSTNAME`         | _(Optional)_ Override checkout first name                              |
| **Secret**   | `TEST_LASTNAME`          | _(Optional)_ Override checkout last name                               |
| **Secret**   | `TEST_POSTALCODE`        | _(Optional)_ Override checkout postal code                             |

---

## Code Quality & Developer Workflow

Code consistency is enforced automatically before every commit via **Husky** (`.husky/pre-commit`) and **lint-staged** (`.lintstagedrc`), which run ESLint auto-fixes and Prettier formatting on all staged `.ts` files.

```bash
# Run ESLint across all TypeScript files
npm run lint

# Format the entire repository with Prettier
npm run format
```

### Path Aliases

`tsconfig.json` includes clean module path aliases for scalable imports:

- `@pages/*` → `./pages/*`
- `@fixtures/*` → `./fixtures/*`
- `@test-data/*` → `./test-data/*`
- `@utils/*` → `./utils/*`

---

## Documentation & Resources

- [**Full Test Case Matrix (`test-case-list.md`)**](./test-case-list.md) — 87 detailed manual & automated test cases mapped by ID (`TC-AUTH-*`, `TC-PROD-*`, `TC-CART-*`, `TC-CHK-*`, `TC-E2E-*`).
- [**Playwright & POM Cheatsheet (`docs/CHEATSHEET.md`)**](./docs/CHEATSHEET.md) — Quick reference for CLI flags, locator strategies, and framework conventions.
- [**Printable Testing Reference (`docs/UI_Testing_CheatSheet.pdf`)**](./docs/UI_Testing_CheatSheet.pdf) — PDF companion guide.
