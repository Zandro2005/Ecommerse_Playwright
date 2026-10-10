# ecommerce-playwright

Playwright E2E automation suite for [SauceDemo](https://www.saucedemo.com) — **Project 1** of a 3-project Playwright QA portfolio (UI fundamentals → API+UI hybrid → advanced/CI-CD).

## Scope

Covers five application domains with a Page Object Model (POM) architecture and custom fixture lifecycle management:

- **Authentication** — valid/invalid credentials, locked-out user, empty fields, error dismissal, logout, session access control, performance delay handling
- **Products & Catalog** — listing render, details navigation, add/remove toggles, price and name sorting (both directions), mobile viewport responsiveness, keyboard accessibility
- **Shopping Cart** — item badges, persistence across navigation & browser refresh, read-only quantity assertions, multiple item count consistency
- **Checkout** — multi-step form validation, special character/boundary handling, real-time math calculation (subtotal + tax = total), order finalization
- **End-to-End & Regression** — full happy-path purchase journeys, direct URL protection, post-logout state persistence, problem user defect reproduction, and cross-browser regression smoke

## Test Suite Stats

- **87** total test cases documented in [`test-case-list.md`](./test-case-list.md)
- **86+** automated tests across 5 test suites:
  - `tests/LoginPage.spec.ts` (15 tests)
  - `tests/ProductsPage.spec.ts` (23 tests)
  - `tests/CartPage.spec.ts` (18 tests)
  - `tests/CheckoutPage.spec.ts` (25 tests)
  - `tests/Full_End_To_End.spec.ts` (6 tests)
- **4** configured browser projects: Chromium, Firefox, WebKit, and Mobile Chrome (Pixel 5)
- Automated tracing (`retain-on-failure`), screenshots (`only-on-failure`), and video recording (`retain-on-failure`)
- Dual enterprise reporting: Playwright HTML Report + Allure Report

## Project Structure

```
ecommerce-playwright/
├── tests/
│   ├── LoginPage.spec.ts            # Authentication tests (15 cases)
│   ├── ProductsPage.spec.ts         # Catalog, sorting & responsiveness (23 cases)
│   ├── CartPage.spec.ts             # Cart management & persistence (18 cases)
│   ├── CheckoutPage.spec.ts         # Checkout steps 1 & 2 validation (25 cases)
│   └── Full_End_To_End.spec.ts      # Complete E2E purchase & regression (6 cases)
├── pages/                           # Page Object Model classes
│   ├── LoginPage.ts
│   ├── ProductsPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── fixtures/
│   └── Fixtures.ts                  # Custom fixtures for authenticated states & cart seeding
├── test-data/
│   └── LoginData.ts                 # Data-driven test matrices
├── docs/
│   ├── CHEATSHEET.md                # Playwright CLI & POM recall guide
│   └── CHEATSHEET.pdf               # Comprehensive printed test case document
├── .github/workflows/
│   └── playwright.yml               # CI/CD pipeline (GitHub Actions + Azure Playwright Service)
├── test-case-list.md                # 87-case manual/automated traceability matrix
├── playwright.config.ts             # Multi-browser & timeout configuration
├── package.json
└── tsconfig.json
```

## Setup

```bash
npm install
npx playwright install --with-deps
```

## Running Tests

```bash
# Run all tests across configured browsers
npm test

# Run interactive modes
npm run test:headed       # Run with visible browser window
npm run test:ui           # Launch Playwright UI mode (time-travel debugging)

# Run by browser engine
npm run test:chromium     # Desktop Chromium
npm run test:firefox      # Desktop Firefox
npm run test:webkit       # Desktop WebKit (Safari engine)
npm run test:mobile       # Mobile Chrome (Pixel 5 emulation)

# Run single test suites
npm run test:auth         # Authentication suite
npm run test:products     # Products & sorting suite
npm run test:cart         # Shopping cart suite
npm run test:checkout     # Checkout suite
npm run test:regression   # End-to-end full purchase regression suite
npm run test:cross-browser# Cross-browser regression across all 4 browser projects

# Reporting
npm run report            # Open Playwright HTML report
npm run allure:generate   # Generate Allure report
npm run allure:open       # Serve Allure report in browser
```

## Debugging Failures

On test failure, Playwright automatically records diagnostic artifacts:

- **Screenshot**: `only-on-failure`
- **Video**: `retain-on-failure`
- **Trace Archive**: `retain-on-failure` — inspect with:
  ```bash
  npx playwright show-trace test-results/<folder>/trace.zip
  ```

## Test Accounts (SauceDemo)

| Username                  | Password       | Purpose                                                  |
| :------------------------ | :------------- | :------------------------------------------------------- |
| `standard_user`           | `secret_sauce` | Primary happy-path user                                  |
| `locked_out_user`         | `secret_sauce` | Negative authentication testing                          |
| `problem_user`            | `secret_sauce` | Known UI defect reproduction (broken images, bad inputs) |
| `performance_glitch_user` | `secret_sauce` | Timeout and latency resiliency testing                   |

## CI/CD Integration

`.github/workflows/playwright.yml` automatically triggers on push and pull requests to `main`, integrating with Azure Playwright Testing Service for cloud execution and uploading artifact reports upon completion.
