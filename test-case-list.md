# Manual & Automated Test Case Document (SauceDemo)

Playwright E2E automation test case matrix for [SauceDemo](https://www.saucedemo.com) — **Project 1** of QA Portfolio.

## Test Summary

| Category                    | Total Test Cases | Automated |   Backlog / Manual    | Spec File                       |
| :-------------------------- | :--------------: | :-------: | :-------------------: | :------------------------------ |
| **Authentication**          |        15        |    15     |           0           | `tests/LoginPage.spec.ts`       |
| **Products & Catalog**      |        22        |    22     |           0           | `tests/ProductsPage.spec.ts`    |
| **Shopping Cart**           |        18        |    18     |           0           | `tests/CartPage.spec.ts`        |
| **Checkout**                |        25        |    25     |           0           | `tests/CheckoutPage.spec.ts`    |
| **End-to-End & Regression** |        7         |     6     | 1 (CI project matrix) | `tests/Full_End_To_End.spec.ts` |
| **Total**                   |      **87**      |  **86**   |         **1**         | **All 5 Suites**                |

---

## 1. Authentication Tests

| Test Case ID    | Scenario / Title                                     | Pre-conditions   | Test Steps                                          | Expected Result                                                                            | Priority | Type |    Status    |
| :-------------- | :--------------------------------------------------- | :--------------- | :-------------------------------------------------- | :----------------------------------------------------------------------------------------- | :------: | :--: | :----------: |
| **TC-AUTH-001** | Valid login with standard_user                       | On login page    | Enter `standard_user` / `secret_sauce`, click Login | Redirected to `/inventory.html`, "Products" title shown                                    |   High   | POS  | ✅ Automated |
| **TC-AUTH-002** | Invalid username                                     | On login page    | Enter unknown username, valid password              | Error: "Username and password do not match"                                                |   High   | NEG  | ✅ Automated |
| **TC-AUTH-003** | Invalid password                                     | On login page    | Enter valid username, wrong password                | Error: "Username and password do not match"                                                |   High   | NEG  | ✅ Automated |
| **TC-AUTH-004** | Locked-out user                                      | On login page    | Enter `locked_out_user` / `secret_sauce`            | Error: "Sorry, this user has been locked out"                                              |   High   | NEG  | ✅ Automated |
| **TC-AUTH-005** | Empty username                                       | On login page    | Leave username blank, fill password                 | Error: "Username is required"                                                              |  Medium  | NEG  | ✅ Automated |
| **TC-AUTH-006** | Empty password                                       | On login page    | Fill username, leave password blank                 | Error: "Password is required"                                                              |  Medium  | NEG  | ✅ Automated |
| **TC-AUTH-007** | Empty username and password                          | On login page    | Submit with both fields blank                       | Error: "Username is required" (shown first)                                                |  Medium  | NEG  | ✅ Automated |
| **TC-AUTH-008** | Dismiss error banner                                 | Error is showing | Click the "X" on the error banner                   | Error banner closes / is hidden                                                            |   Low    | POS  | ✅ Automated |
| **TC-AUTH-009** | Logout                                               | Logged in        | Open burger menu, click Logout                      | Returned to login page (`/`)                                                               |   High   | POS  | ✅ Automated |
| **TC-AUTH-010** | Direct URL access when unauthenticated               | Not logged in    | Navigate directly to `/inventory.html`              | Blocked with access error: "You can only access '/inventory.html' when you are logged in." |   High   | NEG  | ✅ Automated |
| **TC-AUTH-011** | problem_user can log in                              | On login page    | Enter `problem_user` / `secret_sauce`               | Redirected to inventory (site has known UI bugs)                                           |  Medium  | POS  | ✅ Automated |
| **TC-AUTH-012** | performance_glitch_user login succeeds despite delay | On login page    | Enter `performance_glitch_user` / `secret_sauce`    | Redirected to inventory within extended timeout                                            |   Low    | POS  | ✅ Automated |
| **TC-AUTH-013** | Username is case-sensitive                           | On login page    | Enter `STANDARD_USER` (capitalized)                 | Login rejected: "Username and password do not match"                                       |  Medium  | NEG  | ✅ Automated |
| **TC-AUTH-014** | Logo visible on login page                           | On login page    | Observe page                                        | SauceDemo logo ("Swag Labs") is visible                                                    |   Low    | POS  | ✅ Automated |
| **TC-AUTH-015** | Password field masks input                           | On login page    | Type into password field                            | Characters are masked (`type="password"`)                                                  |   Low    | POS  | ✅ Automated |

---

## 2. Products & Catalog Tests

| Test Case ID    | Scenario / Title                                  | Pre-conditions                       | Test Steps                            | Expected Result                                                    | Priority | Type |    Status    |
| :-------------- | :------------------------------------------------ | :----------------------------------- | :------------------------------------ | :----------------------------------------------------------------- | :------: | :--: | :----------: |
| **TC-PROD-001** | All products displayed                            | Logged in                            | Load inventory page                   | All 6 products displayed with title, price, desc, image, button    |   High   | POS  | ✅ Automated |
| **TC-PROD-002** | Open product details                              | Logged in                            | Click a product name link             | Details page opens for that product (`/inventory-item.html?id=4`)  |   High   | POS  | ✅ Automated |
| **TC-PROD-003** | Product name matches list vs details              | Logged in                            | Compare name on list vs details page  | Product names are identical                                        |  Medium  | POS  | ✅ Automated |
| **TC-PROD-004** | Product price matches list vs details             | Logged in                            | Compare price on list vs details page | Product prices are identical                                       |  Medium  | POS  | ✅ Automated |
| **TC-PROD-005** | Product description visible                       | On product details                   | Observe page                          | Description text is present and non-empty for all cards            |  Medium  | POS  | ✅ Automated |
| **TC-PROD-006** | Product image visible                             | On product details                   | Observe page                          | Image elements are rendered and visible                            |   Low    | POS  | ✅ Automated |
| **TC-PROD-007** | Back button returns to list                       | On product details                   | Click "Back to products"              | Returned to `/inventory.html`                                      |  Medium  | POS  | ✅ Automated |
| **TC-PROD-008** | Add single product to cart                        | Logged in                            | Click "Add to cart"                   | Cart badge shows 1                                                 |   High   | POS  | ✅ Automated |
| **TC-PROD-009** | Add multiple products to cart                     | Logged in                            | Add 2 different products              | Cart badge shows 2                                                 |   High   | POS  | ✅ Automated |
| **TC-PROD-010** | Button toggles to Remove                          | Product added                        | Observe button state                  | Button label changes to "Remove"                                   |  Medium  | POS  | ✅ Automated |
| **TC-PROD-011** | Remove product from list view                     | Product in cart                      | Click "Remove" on list item           | Cart badge decreases accordingly                                   |   High   | POS  | ✅ Automated |
| **TC-PROD-012** | Add to cart from details page                     | On product details                   | Click "Add to cart"                   | Button toggles to Remove, badge updates                            |  Medium  | POS  | ✅ Automated |
| **TC-PROD-013** | No badge when cart empty                          | Cart is empty                        | Observe cart icon                     | No badge element rendered                                          |   Low    | POS  | ✅ Automated |
| **TC-PROD-014** | Sort A→Z                                          | Logged in                            | Select "Name (A to Z)"                | Product names sorted ascending                                     |  Medium  | POS  | ✅ Automated |
| **TC-PROD-015** | Sort Z→A                                          | Logged in                            | Select "Name (Z to A)"                | Product names sorted descending                                    |  Medium  | POS  | ✅ Automated |
| **TC-PROD-016** | Sort price low→high                               | Logged in                            | Select "Price (low to high)"          | Prices sorted ascending                                            |  Medium  | POS  | ✅ Automated |
| **TC-PROD-017** | Sort price high→low                               | Logged in                            | Select "Price (high to low)"          | Prices sorted descending                                           |  Medium  | POS  | ✅ Automated |
| **TC-PROD-018** | Sorting doesn't drop items                        | Logged in                            | Apply any sort                        | Still 6 products shown                                             |   Low    | POS  | ✅ Automated |
| **TC-PROD-019** | Cart badge persists through sorting               | Product in cart                      | Change sort order                     | Badge count unchanged                                              |   Low    | POS  | ✅ Automated |
| **TC-PROD-020** | Price format validation                           | Logged in                            | Inspect all prices                    | All match `$X.XX` format pattern                                   |   Low    | POS  | ✅ Automated |
| **TC-PROD-021** | Product grid renders correctly at mobile viewport | Logged in, mobile viewport (390x844) | Load inventory page                   | Layout remains usable, all 6 items visible, no horizontal overflow |  Medium  | POS  | ✅ Automated |
| **TC-PROD-022** | Add-to-cart button is keyboard accessible         | Logged in                            | Tab to button, press Enter            | Button receives focus, product added to cart                       |   Low    | POS  | ✅ Automated |

---

## 3. Shopping Cart Tests

| Test Case ID    | Scenario / Title                                                       | Pre-conditions              | Test Steps                       | Expected Result                                        | Priority | Type |    Status    |
| :-------------- | :--------------------------------------------------------------------- | :-------------------------- | :------------------------------- | :----------------------------------------------------- | :------: | :--: | :----------: |
| **TC-CART-001** | Open cart                                                              | Product in cart             | Click cart icon                  | Navigates to `/cart.html`                              |   High   | POS  | ✅ Automated |
| **TC-CART-002** | Cart shows added product                                               | Product in cart             | Open cart                        | Product name present in list                           |   High   | POS  | ✅ Automated |
| **TC-CART-003** | Cart item visible by name                                              | Product in cart             | Open cart                        | Item row is visible                                    |  Medium  | POS  | ✅ Automated |
| **TC-CART-004** | Cart price matches list price                                          | Product in cart             | Compare cart price to list price | Prices match                                           |  Medium  | POS  | ✅ Automated |
| **TC-CART-005** | Default quantity is 1                                                  | Product added once          | Open cart                        | Quantity shown as 1                                    |  Medium  | POS  | ✅ Automated |
| **TC-CART-006** | Remove item from cart page                                             | Product in cart             | Click Remove in cart             | Item count decreases to 0                              |   High   | POS  | ✅ Automated |
| **TC-CART-007** | Badge updates after cart-page removal                                  | Item removed in cart        | Continue shopping                | Badge reflects updated count                           |  Medium  | POS  | ✅ Automated |
| **TC-CART-008** | Continue shopping returns to products                                  | On cart page                | Click "Continue Shopping"        | Returned to `/inventory.html`                          |  Medium  | POS  | ✅ Automated |
| **TC-CART-009** | Multiple products show correct count                                   | 3 products added            | Open cart                        | 3 items listed                                         |   High   | POS  | ✅ Automated |
| **TC-CART-010** | Badge reflects total across adds                                       | 3 products added            | Observe badge                    | Badge shows 3                                          |  Medium  | POS  | ✅ Automated |
| **TC-CART-011** | Cart persists across navigation                                        | Product added               | Visit details page and return    | Cart still has 1 item                                  |  Medium  | POS  | ✅ Automated |
| **TC-CART-012** | Empty cart shows no items/badge                                        | All items removed           | Open cart                        | 0 items, no badge                                      |  Medium  | POS  | ✅ Automated |
| **TC-CART-013** | Checkout button visible with items                                     | Cart has items              | Open cart                        | "Checkout" button visible                              |   High   | POS  | ✅ Automated |
| **TC-CART-014** | Proceed to checkout from cart                                          | Cart has 1 item             | Click "Checkout"                 | Navigates to `checkout-step-one.html`                  |   High   | POS  | ✅ Automated |
| **TC-CART-015** | Quantity field is not editable in-cart                                 | Product in cart             | Inspect quantity element         | Quantity is static non-input element (site limitation) |   Low    | NEG  | ✅ Automated |
| **TC-CART-016** | Cart total item count matches badge exactly after removals mid-session | Multiple add/remove actions | Add 3, remove 1, add 1           | Badge and cart list stay in sync (3 items)             |  Medium  | POS  | ✅ Automated |
| **TC-CART-017** | Cart state after browser refresh                                       | Product in cart             | Refresh page                     | Cart contents persist in session/localStorage          |   Low    | POS  | ✅ Automated |
| **TC-CART-018** | Cart icon accessible label                                             | Logged in                   | Inspect cart icon                | Cart link has valid accessible name / test id          |   Low    | POS  | ✅ Automated |

---

## 4. Checkout Tests

| Test Case ID   | Scenario / Title                                     | Pre-conditions          | Test Steps                             | Expected Result                                     | Priority | Type |    Status    |
| :------------- | :--------------------------------------------------- | :---------------------- | :------------------------------------- | :-------------------------------------------------- | :------: | :--: | :----------: |
| **TC-CHK-001** | Valid checkout info proceeds                         | On checkout step one    | Fill valid first/last/postal, Continue | Navigates to step two (overview)                    |   High   | POS  | ✅ Automated |
| **TC-CHK-002** | Missing first name blocked                           | On checkout step one    | Leave first name blank, Continue       | Error: "First Name is required"                     |   High   | NEG  | ✅ Automated |
| **TC-CHK-003** | Missing last name blocked                            | On checkout step one    | Leave last name blank, Continue        | Error: "Last Name is required"                      |   High   | NEG  | ✅ Automated |
| **TC-CHK-004** | Missing postal code blocked                          | On checkout step one    | Leave postal code blank, Continue      | Error: "Postal Code is required"                    |   High   | NEG  | ✅ Automated |
| **TC-CHK-005** | All fields empty shows first error                   | On checkout step one    | Submit with everything blank           | Error: "First Name is required"                     |  Medium  | NEG  | ✅ Automated |
| **TC-CHK-006** | Special characters accepted                          | On checkout step one    | Enter names with hyphen/apostrophe     | Proceeds to overview                                |   Low    | POS  | ✅ Automated |
| **TC-CHK-007** | Long field values accepted                           | On checkout step one    | Enter very long name/postal values     | Proceeds to overview (no client-side max length)    |   Low    | POS  | ✅ Automated |
| **TC-CHK-008** | Numeric values in name fields                        | On checkout step one    | Enter digits as first/last name        | Proceeds to overview (no format validation)         |   Low    | POS  | ✅ Automated |
| **TC-CHK-009** | Cancel on step one returns to cart                   | On checkout step one    | Click Cancel                           | Returns to `/cart.html`                             |  Medium  | POS  | ✅ Automated |
| **TC-CHK-010** | Overview lists all cart items                        | Step two reached        | Observe item list                      | All items carried from cart are shown               |   High   | POS  | ✅ Automated |
| **TC-CHK-011** | Subtotal equals sum of item prices                   | Step two reached        | Sum item prices vs displayed subtotal  | Subtotal matches sum exactly                        |   High   | POS  | ✅ Automated |
| **TC-CHK-012** | Tax calculated correctly                             | Step two reached        | Compare displayed tax to subtotal × 8% | Tax matches expected calculation                    |   High   | POS  | ✅ Automated |
| **TC-CHK-013** | Total equals subtotal + tax                          | Step two reached        | Compare displayed total                | Total = subtotal + tax                              |   High   | POS  | ✅ Automated |
| **TC-CHK-014** | Cancel on step two returns to products               | Step two reached        | Click Cancel                           | Returns to `/inventory.html`                        |  Medium  | POS  | ✅ Automated |
| **TC-CHK-015** | Finish completes the order                           | Step two reached        | Click Finish                           | Navigates to `checkout-complete.html`               |   High   | POS  | ✅ Automated |
| **TC-CHK-016** | Confirmation shows thank-you message                 | Order finished          | Observe confirmation page              | "Thank you for your order!" header shown            |   High   | POS  | ✅ Automated |
| **TC-CHK-017** | Back Home returns to products                        | Order finished          | Click "Back Home"                      | Returns to `/inventory.html`                        |  Medium  | POS  | ✅ Automated |
| **TC-CHK-018** | Cart is empty after completed order                  | Order finished          | Observe cart badge                     | No badge / cart cleared                             |   High   | POS  | ✅ Automated |
| **TC-CHK-019** | Whitespace-only fields behavior documented           | On checkout step one    | Enter spaces only in all fields        | Documented actual behavior (known site quirk)       |   Low    | NEG  | ✅ Automated |
| **TC-CHK-020** | Alphanumeric postal code accepted                    | On checkout step one    | Enter Canadian-style postal code       | Proceeds to overview                                |   Low    | POS  | ✅ Automated |
| **TC-CHK-021** | Checkout unreachable with empty cart via direct URL  | Cart is empty           | Navigate directly to checkout URL      | Overview shows 0 items / documented actual behavior |  Medium  | NEG  | ✅ Automated |
| **TC-CHK-022** | Item quantity reflected correctly in overview totals | Multiple distinct items | Reach overview with 3+ items           | Subtotal accounts for all items                     |  Medium  | POS  | ✅ Automated |
| **TC-CHK-023** | Currency values never show negative or NaN           | Any checkout flow       | Observe all price labels               | No negative values, no NaN rendered                 |   Low    | NEG  | ✅ Automated |
| **TC-CHK-024** | Browser back button after finishing order            | Order finished          | Press browser Back                     | App does not allow re-submitting the same order     |  Medium  | NEG  | ✅ Automated |
| **TC-CHK-025** | Field-level trimming of leading/trailing spaces      | On checkout step one    | Enter " John " with padding spaces     | Documented actual behavior                          |   Low    | NEG  | ✅ Automated |

---

## 5. End-to-End & Regression Tests

| Test Case ID   | Scenario / Title                                                 | Pre-conditions               | Test Steps                                            | Expected Result                                             | Priority | Type |         Status          |
| :------------- | :--------------------------------------------------------------- | :--------------------------- | :---------------------------------------------------- | :---------------------------------------------------------- | :------: | :--: | :---------------------: |
| **TC-E2E-001** | Full happy path purchase                                         | Logged in                    | Sort → add 2 items → cart → checkout → confirm        | Order completes, cart clears, confirmation shown            |   High   | POS  |      ✅ Automated       |
| **TC-E2E-002** | Cannot check out with empty cart                                 | Logged in, empty cart        | Attempt checkout flow                                 | No items to process; graceful handling documented           |  Medium  | NEG  |      ✅ Automated       |
| **TC-E2E-003** | Logout mid-shopping ends session correctly                       | Item in cart                 | Logout, then try direct inventory URL                 | Blocked; must log in again                                  |   High   | NEG  |      ✅ Automated       |
| **TC-E2E-004** | Re-login behavior after logout                                   | Previously had items in cart | Logout then log back in                               | Documents actual cart-persistence behavior                  |  Medium  | POS  |      ✅ Automated       |
| **TC-E2E-005** | problem_user shows known broken image bug                        | Logged in as `problem_user`  | Inspect product images                                | At least one image fails to load (`sl-404` bug)             |   Low    | NEG  |      ✅ Automated       |
| **TC-E2E-006** | Cross-browser smoke: full purchase flow                          | Logged in                    | Run full purchase flow per configured browser project | Order completes on Chromium, Firefox, WebKit, Mobile Chrome |   High   | POS  |      ✅ Automated       |
| **TC-E2E-007** | Full regression suite passes across all 4 browser projects in CI | CI pipeline                  | Run `npx playwright test` in GitHub Actions           | All specs pass on all projects; HTML report uploaded        |   High   | POS  | ⚙️ CI Pipeline / Config |
