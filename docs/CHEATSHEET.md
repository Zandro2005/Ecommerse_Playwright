# ⚡ Playwright Quick Recall Cheat Sheet

> **Project:** `Ecommerce-Playwright` (SauceDemo) · **Format:** Ultra-dense memory-jogger for printing (~6–8 pages).

---

## 1. Installation & CLI Commands

```bash
# Setup
npm init playwright@latest                        # New project wizard
npm i -D @playwright/test                         # Add to existing project
npx playwright install --with-deps chromium       # Install Chromium + OS deps
npm i -D dotenv allure-playwright @azure/playwright @azure/identity  # Plugins

# Key CLI Flags
npx playwright test                               # Run all tests headless
npx playwright test --headed                      # Run headed
npx playwright test --ui                          # Interactive UI mode
npx playwright test -g "Valid Login"              # Run tests matching title
npx playwright test tests/CartPage.spec.ts        # Run single spec
npx playwright test --debug                       # Step-by-step inspector
npx playwright test --workers=1                   # Run serially
npx playwright test --config=playwright.service.config.ts # Azure service config
npx playwright show-trace test-results/trace.zip  # View failure trace
npx playwright codegen https://www.saucedemo.com  # Record locators
```

### NPM Shortcuts (`package.json`)

```bash
npm test              # Full test run          | npm run test:ui         # UI mode
npm run test:auth     # Login tests only       | npm run test:cart       # Cart tests
npm run test:checkout # Checkout tests only    | npm run test:regression # Full E2E
npm run report        # Open HTML report       | npm run allure:open     # Open Allure
```

---

## 2. Playwright Configurations (Recall)

### Minimal Base Config (`playwright.config.ts`)

```typescript
import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: 4,
  reporter: [
    ['html', { open: 'on-failure' }],
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
```

### Minimal Azure Service Config (`playwright.service.config.ts`)

```typescript
import { defineConfig } from '@playwright/test';
import { createAzurePlaywrightConfig, ServiceOS } from '@azure/playwright';
import { DefaultAzureCredential } from '@azure/identity';
import config from './playwright.config';

export default defineConfig(
  config,
  createAzurePlaywrightConfig(config, {
    os: ServiceOS.LINUX,
    credential: new DefaultAzureCredential(),
  }),
  { reporter: [['list'], ['@azure/playwright/reporter']] },
);
```

---

## 3. TypeScript & Path Aliases

### `tsconfig.json` Aliases

```json
{
  "compilerOptions": {
    "paths": {
      "@pages/*": ["./pages/*"],
      "@fixtures/*": ["./fixtures/*"],
      "@test-data/*": ["./test-data/*"]
    }
  }
}
```

### Syntax Shorthands

```typescript
import { LoginPage } from '@pages/LoginPage'; // Alias import
const pass = process.env.TEST_PASSWORD!; // ! = Non-null assertion
const text = (await el.textContent()) ?? ''; // ?? = Fallback on null/undefined
const user = process.env.USER || 'standard_user'; // || = Fallback on falsy
const copy = [...items].sort(); // ... = Shallow copy array
```

---

## 4. Locators & Filtering

### Locator Types

```typescript
page.getByRole('button', { name: 'Login' }); // ARIA role (preferred)
page.locator('[data-test="username"]'); // Test attribute (SauceDemo)
page.locator('button[data-test^="add-to-cart"]'); // ^= starts-with
page.getByText('Swag Labs'); // Text match
page.getByPlaceholder('Username'); // Input placeholder
page.getByLabel('Password'); // Form label
```

### Roles Quick Reference (`getByRole`)

| Role         | Matches HTML                        | Example                                         |
| ------------ | ----------------------------------- | ----------------------------------------------- |
| `'button'`   | `<button>`, `<input type="submit">` | `page.getByRole('button', { name: 'Submit' })`  |
| `'textbox'`  | `<input type="text">`, `<textarea>` | `page.getByRole('textbox', { name: 'User' })`   |
| `'link'`     | `<a href="...">`                    | `page.getByRole('link', { name: 'Cart' })`      |
| `'combobox'` | `<select>`                          | `page.getByRole('combobox')`                    |
| `'checkbox'` | `<input type="checkbox">`           | `page.getByRole('checkbox', { name: 'Agree' })` |

### Chaining & Filtering

```typescript
// Filter parent card by text, then click child button
await page
  .locator('[data-test="inventory-item"]')
  .filter({ hasText: 'Sauce Labs Backpack' })
  .getByRole('button', { name: 'Add to cart' })
  .click();

// Indexing & list iteration
await page.locator('.item').first().click();
await page.locator('.item').nth(2).click();

// --- Traditional Loop (Checking Multiple Items/Details) ---
// Pattern 1: Traditional loop over all cards to verify details inside each
const cards = await page.locator('[data-test="inventory-item"]').all();
for (let i = 0; i < cards.length; i++) {
  await expect(cards[i].locator('[data-test="inventory-item-name"]')).toBeVisible();
  await expect(cards[i].locator('[data-test="inventory-item-price"]')).toBeVisible();
}

// Pattern 2: Loop by index to verify list matches expected array
const expected = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];
for (let i = 0; i < expected.length; i++) {
  await expect(page.locator('[data-test="inventory-item-name"]').nth(i)).toHaveText(expected[i]);
}
```

---

## 5. Actions & Assertions

### Actions

```typescript
await page.goto('/cart.html');
await locator.fill('standard_user'); // Clear & type
await locator.pressSequentially('abc', { delay: 50 }); // Type like human
await locator.click();
await locator.selectOption('lohi'); // Dropdown by value
await locator.press('Enter');
const text = await locator.innerText();
const count = await locator.count();
```

### Assertions (Async vs Sync Rule)

```typescript
// Web-First (ASYNC -> MUST AWAIT -> Retries automatically)
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();
await expect(locator).toHaveText('Thank you!'); // Exact
await expect(locator).toContainText('Error'); // Substring
await expect(page).toHaveURL(/.*cart\.html/); // Regex URL
await expect(locator).toHaveCount(3);
await expect(locator).toBeEnabled();

// Generic (SYNC -> DO NOT AWAIT -> Instant check on values)
expect(actualTax).toBe(expectedTax);
expect(items).toEqual(['A', 'B']);
expect(list.length).toBeGreaterThan(0);
```

---

## 6. Page Object Model (POM)

### Minimal Page Class (`pages/LoginPage.ts`)

```typescript
import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.locator('[data-test="username"]');
    this.password = page.locator('[data-test="password"]');
    this.loginBtn = page.locator('[data-test="login-button"]');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/');
  }

  async login(user: string, pass: string): Promise<void> {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginBtn.click();
  }
}
```

### How to Use POM in a Spec File (`tests/LoginPage.spec.ts`)

```typescript
// 1. Import test runner, expect, and the Page Object
import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';

// Option A: Direct instantiation inside the test
test('Valid user can log in', async ({ page }) => {
  // Step 1: Instantiate the Page Object by passing Playwright's `page` fixture
  const loginPage = new LoginPage(page);

  // Step 2: Call navigation & action methods
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');

  // Step 3: Assert using POM locators or page URL
  await expect(page).toHaveURL(/.*inventory/);
  await expect(loginPage.productsTitle).toBeVisible();
});

// Option B: Using beforeEach hook (shares setup across tests in file)
test.describe('Login Scenarios', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate(); // Always navigate before each test
  });

  test('Invalid login shows error', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toContainText('locked out');
  });
});
```

---

## 7. Fixtures & Fixture Chaining

### Minimal Extended Fixture (`fixtures/Fixtures.ts`)

```typescript
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

export const test = base.extend<{
  loginPage: LoginPage;
  productsPage: ProductsPage;
}>({
  // Base authenticated fixture
  loginPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.login(
      process.env.TEST_USERNAME || 'standard_user',
      process.env.TEST_PASSWORD || 'secret_sauce',
    );
    await use(login); // Yields to test; code after is teardown
  },

  // Chained fixture (depends on loginPage)
  productsPage: async ({ loginPage }, use) => {
    await use(new ProductsPage(loginPage.page));
  },
});

export { expect };
```

### Consuming Fixture in Test

```typescript
import { test, expect } from '@fixtures/Fixtures';

// Automatically logged in before test body executes!
test('View products', async ({ productsPage }) => {
  await expect(productsPage.pageTitle).toBeVisible();
});
```

---

## 8. Data-Driven Testing (DDT)

### Data Array (`test-data/LoginData.ts`)

```typescript
export const loginCases = [
  {
    name: 'Locked user',
    user: 'locked_out_user',
    pass: 'secret_sauce',
    err: 'Sorry, this user has been locked out',
  },
  { name: 'Empty user', user: '', pass: 'secret_sauce', err: 'Username is required' },
];
```

### Parameterized Loop (`tests/LoginPage.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { loginCases } from '@test-data/LoginData';

for (const data of loginCases) {
  test(`Login: ${data.name}`, async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
    await login.login(data.user, data.pass);
    await expect(login.page.locator('[data-test="error"]')).toContainText(data.err);
  });
}
```

---

## 9. Environment Variables (`process.env`)

### `.env` File (Local Only - Do Not Commit)

```ini
BASE_URL=https://www.saucedemo.com
TEST_USERNAME=standard_user
TEST_PASSWORD=secret_sauce
TEST_FIRSTNAME=Zandro
TEST_LASTNAME=Guinialope
TEST_POSTALCODE=1860
```

### Loaded once in `playwright.config.ts`:

```typescript
import 'dotenv/config'; // Auto-populates process.env for all tests and POMs
```

### How to Use `process.env` in a Test File (`tests/CheckoutPage.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';

test('Using env variables in test', async ({ page }) => {
  const login = new LoginPage(page);
  await login.navigate();

  // Pattern 1: Non-null assertion (!) if guaranteed to exist
  await login.login(process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!);

  // Pattern 2: Fallback (||) to prevent undefined errors
  const firstName = process.env.TEST_FIRSTNAME || 'DefaultFirst';
  const lastName = process.env.TEST_LASTNAME || 'DefaultLast';
  const postal = process.env.TEST_POSTALCODE || '12345';

  await page.locator('[data-test="firstName"]').fill(firstName);
  await page.locator('[data-test="lastName"]').fill(lastName);
  await page.locator('[data-test="postalCode"]').fill(postal);
});
```

---

## 10. CI/CD & Azure Workspaces Setup (Exact Steps)

### A. Azure Playwright Testing / Workspaces Setup (Portal Steps)

1. **Install Service Package:**
   ```bash
   npm init @azure/playwright@latest
   ```
2. **Set up Authentication:**
   ```bash
   az login
   # If multiple tenants: az login --tenant <TenantID>
   ```
3. **Add Browser Endpoint (`PLAYWRIGHT_SERVICE_URL`):**
   - **Bash:** `export PLAYWRIGHT_SERVICE_URL="wss://<region>.api.playwright.microsoft.com/playwrightworkspaces/<id>/browsers"`
   - **PowerShell:** `$env:PLAYWRIGHT_SERVICE_URL="wss://<region>.api.playwright.microsoft.com/playwrightworkspaces/<id>/browsers"`
4. **[Optional] Enable Diagnostics & Storage Reporting:**
   - **4.1 Storage Link:** Azure Portal -> Playwright Workspace -> **Storage configuration** tab -> Toggle Reporting to **Enabled** -> Select/create storage account -> **Save**.
   - **4.2 RBAC Permission:** Open Storage Account -> **Access Control (IAM)** -> **Add role assignment** -> Select **Storage Blob Data Contributor** -> Assign to your account / pipeline service principal.
   - **4.3 Allow Public Trace Viewer (CORS):** Storage Account -> **Settings** -> **Resource sharing (CORS)** -> Under **Blob service**, add record:
     - Allowed origins: `https://trace.playwright.dev`
     - Allowed methods: `GET, OPTIONS`
     - Max age: `3600` (or up to `2147483647`) -> Click **Save**.
   - **4.4 Add Reporter to Config (`playwright.service.config.ts`):**
     `reporter: [["html"], ["@azure/playwright/reporter"]]`
5. **Run High-Scale Tests:**
   ```bash
   npx playwright test --config=playwright.service.config.ts --workers=20
   ```

---

### B. Azure DevOps Setup Steps

1. **Create Service Connection:**
   - Azure DevOps -> **Project Settings** -> **Service connections** -> **New service connection**.
   - Select **Azure Resource Manager** -> Service Principal (automatic) -> Select your Azure Subscription and Resource Group containing the Playwright Workspace.
2. **Configure Variable Group:**
   - **Pipelines** -> **Library** -> **+ Variable group** (e.g. `playwright-workspace-vars`).
   - Add `PLAYWRIGHT_SERVICE_URL` (paste your `wss://...` endpoint).
   - Add secret credentials (`TEST_USERNAME`, `TEST_PASSWORD`) and click the Lock icon.
3. **Pipeline Tasks to Add:**
   - **Task 1: NodeTool@0** -> Set `versionSpec: '20.x'`.
   - **Task 2: Command Line** -> `npm ci`.
   - **Task 3: Azure CLI Task (`AzureCLI@2`)**:
     - Connect to Azure Service Connection created in Step 1.
     - Script type: `bash` (or `pscore`).
     - Script: `npx playwright test --config=playwright.service.config.ts --workers=20`
     - Map environment variables from Variable Group.
   - **Task 4: Publish Test Results** -> Publish JUnit or Playwright HTML artifacts.

---

### C. GitHub Actions Setup Steps

1. **Create Azure Service Principal (Terminal):**
   ```bash
   az ad sp create-for-rbac --name "gh-playwright" --role "Contributor" --scopes /subscriptions/<sub-id>/resourceGroups/<rg> --sdk-auth
   ```
2. **Add GitHub Secrets & Variables:**
   - Repo **Settings** -> **Secrets and variables** -> **Actions**.
   - **Repository Secret:** `AZURE_CREDENTIALS` (paste JSON output from Step 1).
   - **Repository Variable:** `PLAYWRIGHT_SERVICE_URL` (paste `wss://...` endpoint).
   - **Repository Secrets:** `TEST_USERNAME`, `TEST_PASSWORD`.
3. **Workflow Steps:**
   - `actions/checkout@v4` -> `actions/setup-node@v4` -> `npm ci`
   - `azure/login@v3` with `creds: ${{ secrets.AZURE_CREDENTIALS }}`
   - Run: `npx playwright test --config=playwright.service.config.ts --workers=20`

---

## 11. Allure Reporting & Debugging

### Allure Commands & Steps

```bash
npx allure generate allure-results --clean -o allure-report  # Build report
npx allure open allure-report                               # Open report
```

```typescript
// Nested steps in Allure:
test('Checkout', async ({ page }) => {
  await test.step('1. Add item to cart', async () => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  });
});
```

### Debugging Commands

```typescript
await page.pause(); // Hardcoded breakpoint (opens Inspector)
```

```bash
npx playwright test --debug        # Launch debugger
npx playwright test --ui           # Launch UI mode
npx playwright show-trace trace.zip# Inspect captured trace
```

---

## 12. Gotchas & Anti-Patterns (Recall)

1. **No `await` on Generic Assertions:**
   - ❌ `await expect(total).toBe(10);`
   - ✅ `expect(total).toBe(10);` (`.toBe()` is synchronous).
2. **Reuse POM Actions in Fixtures:**
   - ❌ Don't raw-fill `page.locator('[data-test="firstName"]').fill(...)` inside fixtures.
   - ✅ Call page object method: `await checkout.fillCheckoutInfo('A', 'B', '123')`.
3. **Always use Web-First assertions for DOM checks:**
   - ❌ `expect(await locator.isVisible()).toBe(true);` (Does not retry!)
   - ✅ `await expect(locator).toBeVisible();` (Auto-retries up to 5s).

---

## 13. Industry Best Practices (QA Automation Standards)

1. **Prioritize Accessible Locators:**
   - Prefer user-facing roles (`getByRole`, `getByText`, `getByLabel`), then resilient attributes (`[data-test]`).
   - ❌ Avoid fragile DOM hierarchy or CSS classes (`.btn-primary`, `div > div:nth-child(2) > span`).
2. **Never Use Arbitrary Sleep / Delays:**
   - ❌ `await page.waitForTimeout(5000);` (Flaky, slows down pipeline).
   - ✅ Playwright auto-waits for actionability (visible, stable, enabled). For state changes, use web-first assertions: `await expect(locator).toBeVisible();`.
3. **Strict Test Isolation:**
   - Every test must be completely independent and runnable in any order, or in parallel (`fullyParallel: true`).
   - Never rely on data or state created by a preceding test.
4. **Assertion Responsibility:**
   - Keep Page Objects assertion-free (POM models structure and actions only).
   - Test files (`*.spec.ts`) own assertions and validation logic.
5. **Scale with Authentication State (`storageState`):**
   - For large suites, avoid UI logins before every test. Save auth state to a JSON file via `storageState` and inject cookies directly.
6. **Capture Artifacts Only on Failure:**
   - Configure `trace: 'retain-on-failure'`, `screenshot: 'only-on-failure'`, and `video: 'retain-on-failure'` to keep CI runs fast and lightweight.
7. **Use `test.step` for Living Documentation:**
   - Structure tests into logical blocks using `test.step('Step name', async () => { ... })` so HTML and Allure reports reflect test case management steps.
8. **Enforce Static Code Quality Gates:**
   - Use `eslint-plugin-playwright`, `husky`, and `lint-staged` to catch unawaited assertions and invalid syntax before committing to Git.
