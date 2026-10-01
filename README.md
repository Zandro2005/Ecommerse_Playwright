# ecommerce-playwright

Playwright E2E automation suite for [SauceDemo](https://www.saucedemo.com) — **Project 1** of a 3-project Playwright QA portfolio (UI fundamentals → API+UI hybrid → advanced/CI-CD).

## Scope

Covers four application areas with a Page Object Model architecture:

- **Authentication** — valid/invalid login, locked-out user, empty fields, logout, session access control
- **Products** — listing, details, add/remove to cart, sorting (name & price, both directions)
- **Shopping Cart** — item management, quantities, persistence, navigation
- **Checkout** — multi-step form validation, subtotal/tax/total math, order completion

## Test Suite Stats

- **15** login tests, plus product, cart, checkout, and end-to-end coverage
- **1** configured browser project: Chromium
- Runs with tracing, screenshots, and video capture on failure
- HTML + JSON reporting

## Project Structure

```
ecommerce-playwright/
├── tests/
│   ├── LoginPage.spec.ts
│   ├── ProductsPage.spec.ts
│   ├── CartPage.spec.ts
│   ├── CheckoutPage.spec.ts
│   └── Full_End_To_End.spec.ts
├── pages/                   # Page Object Model
│   ├── LoginPage.ts
│   ├── ProductsPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── fixtures/
│   └── Fixtures.ts           # Custom authenticated and cart fixtures
├── test-data/
│   └── LoginData.ts         # Data-driven login cases
├── .github/workflows/
│   └── playwright.yml       # CI pipeline (GitHub Actions)
├── test-case-list.md        # Manual test case document (87 cases)
├── playwright.config.ts
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
npm test                  # run everything, all browsers
npm run test:headed       # watch it run in a real browser window
npm run test:ui           # interactive UI mode (great for debugging)

npm run test:chromium     # single browser
npm run test:auth         # single suite
npm run test:products
npm run test:cart
npm run test:checkout
npm run test:regression

npm run report            # open the last HTML report
```

## Debugging Failures

On failure, Playwright automatically captures:

- Screenshot (`only-on-failure`)
- Video (`retain-on-failure`)
- Trace (`retain-on-failure`) — open with `npx playwright show-trace <trace.zip>`

## Test Accounts (SauceDemo)

| Username                | Password     | Notes                         |
| ----------------------- | ------------ | ----------------------------- |
| standard_user           | secret_sauce | Default happy-path user       |
| locked_out_user         | secret_sauce | Login always blocked          |
| problem_user            | secret_sauce | Known UI bugs (broken images) |
| performance_glitch_user | secret_sauce | Intentional login delay       |

## CI/CD

`.github/workflows/playwright.yml` runs the full Chromium suite on every push/PR to `main` and uploads the HTML report plus failure artifacts.

## Next Steps (Portfolio Progression)

- **Project 2 — ParaBank**: adds API testing (`request` context) and hybrid API+UI workflows (e.g., seed data via API, verify via UI).
- **Project 3 — OrangeHRM**: adds visual regression (`toHaveScreenshot()`), accessibility testing, and more advanced CI/CD reporting.
