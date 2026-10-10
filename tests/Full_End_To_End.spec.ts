import { test, expect } from '@fixtures/Fixtures';
import { LoginPage } from '@pages/LoginPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';

test.describe('End-to-End / Regression Suite', () => {
  test('TC-E2E-001: Full happy path purchase', async ({ productsPage }) => {
    // 1. Sort products by price low to high
    await productsPage.sortProductPriceLowToHigh();

    // 2. Add 2 distinct items to cart
    const item1 = 'Sauce Labs Onesie';
    const item2 = 'Sauce Labs Bike Light';
    await productsPage.addProductToCart(item1);
    await productsPage.addProductToCart(item2);
    await expect(productsPage.productCartBadge).toHaveText('2');

    // 3. Navigate to shopping cart
    await productsPage.clickCartLink();
    const cartPage = new CartPage(productsPage.page);
    await expect(cartPage.page).toHaveURL(cartPage.cartUrl);
    await expect(cartPage.getCartItem(item1)).toBeVisible();
    await expect(cartPage.getCartItem(item2)).toBeVisible();
    await expect(cartPage.cartBadge).toHaveText('2');

    // 4. Proceed to Checkout Step One
    await cartPage.clickcheckout();
    const checkoutPage = new CheckoutPage(cartPage.page);
    await expect(checkoutPage.page).toHaveURL(/.*checkout-step-one\.html/);

    // 5. Fill customer details and continue to Step Two Overview
    const firstName = process.env.TEST_FIRSTNAME || 'Zandro';
    const lastName = process.env.TEST_LASTNAME || 'Guinialope';
    const postalCode = process.env.TEST_POSTALCODE || '1860';
    await checkoutPage.fillCheckoutInfo(firstName, lastName, postalCode);
    await checkoutPage.clickContinueButton();
    await expect(checkoutPage.page).toHaveURL(checkoutPage.checkoutUrl);

    // 6. Verify items and price calculations on Step Two
    await expect(checkoutPage.productItemRow).toHaveCount(2);
    const subtotalText = await checkoutPage.productSubtotal.textContent();
    const taxText = await checkoutPage.tax.textContent();
    const totalText = await checkoutPage.productTotal.textContent();

    const subtotal = Number(subtotalText?.replace(/[^0-9.]/g, ''));
    const tax = Number(taxText?.replace(/[^0-9.]/g, ''));
    const total = Number(totalText?.replace(/[^0-9.]/g, ''));
    expect(Math.round((subtotal + tax) * 100) / 100).toBe(total);

    // 7. Complete order
    await checkoutPage.clickFinishOrderBtn();
    await expect(checkoutPage.page).toHaveURL(checkoutPage.finishedUrl);
    await expect(checkoutPage.completeHeaderText).toHaveText('Thank you for your order!');

    // 8. Verify cart is cleared after order completion
    await expect(checkoutPage.cartBadge).toHaveCount(0);

    // 9. Return back home
    await checkoutPage.clickBackHomeBtn();
    await expect(checkoutPage.page).toHaveURL(checkoutPage.productsUrl);
  });

  test('TC-E2E-002: Cannot check out with empty cart', async ({ productsPage }) => {
    await productsPage.clickCartLink();
    const cartPage = new CartPage(productsPage.page);
    await expect(cartPage.productItemRow).toHaveCount(0);
    await expect(cartPage.cartBadge).toHaveCount(0);

    // Attempt checkout with empty cart
    await cartPage.clickcheckout();
    // Documents actual SauceDemo behavior: navigates to checkout-step-one without blocking
    await expect(productsPage.page).toHaveURL(/.*checkout-step-one\.html/);
  });

  test('TC-E2E-003: Logout mid-shopping ends session correctly', async ({
    productsPage,
    loginPage,
  }) => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.clickCartLink();
    await loginPage.logout();

    // Verify redirected to login page
    await expect(loginPage.page).toHaveURL(loginPage.url);

    // Verify unauthenticated direct URL access to /inventory.html is blocked
    await loginPage.directNavigation();
    await expect(loginPage.errorMessage).toContainText(
      "Epic sadface: You can only access '/inventory.html' when you are logged in.",
    );
  });

  test('TC-E2E-004: Re-login behavior after logout', async ({ productsPage, loginPage }) => {
    // 1. Add item to cart
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await expect(productsPage.productCartBadge).toHaveText('1');

    // 2. Logout
    await loginPage.logout();
    await expect(loginPage.page).toHaveURL(loginPage.url);

    // 3. Log back in as standard_user
    await loginPage.validLogin(
      process.env.TEST_USERNAME || 'standard_user',
      process.env.TEST_PASSWORD || 'secret_sauce',
    );
    await expect(loginPage.productsTitle).toBeVisible();

    // 4. Documents actual cart-persistence behavior (persists across login session)
    await expect(productsPage.productCartBadge).toHaveText('1');
    await productsPage.clickCartLink();
    const cartPage = new CartPage(productsPage.page);
    await expect(cartPage.getCartItem('Sauce Labs Backpack')).toBeVisible();
  });

  test('TC-E2E-005: problem_user shows known broken image bug', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.validLogin('problem_user', process.env.TEST_PASSWORD || 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(loginPage.productsTitle).toBeVisible();

    // Check images on products page: problem_user renders the broken dog image (sl-404)
    const productImages = page.locator('.inventory_item_img img');
    await expect(productImages.first()).toBeVisible();

    const imageSources = await productImages.evaluateAll((imgs) =>
      imgs.map((img) => (img as HTMLImageElement).src),
    );

    // Verify at least one image has the known bug placeholder /sl-404
    const hasBrokenImage = imageSources.some((src) => src.includes('sl-404'));
    expect(hasBrokenImage).toBe(true);
  });

  test('TC-E2E-006: Cross-browser smoke: full purchase flow', async ({ productsPage }) => {
    // 1. Add 3 items
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.addProductToCart('Sauce Labs Bike Light');
    await productsPage.addProductToCart('Sauce Labs Bolt T-Shirt');
    await expect(productsPage.productCartBadge).toHaveText('3');

    // 2. Navigate to cart and remove 1 item mid-flow
    await productsPage.clickCartLink();
    const cartPage = new CartPage(productsPage.page);
    await expect(cartPage.productItemRow).toHaveCount(3);
    await cartPage.removeProductFromCart('Sauce Labs Bike Light');
    await expect(cartPage.productItemRow).toHaveCount(2);
    await expect(cartPage.cartBadge).toHaveText('2');

    // 3. Proceed to checkout
    await cartPage.clickcheckout();
    const checkoutPage = new CheckoutPage(cartPage.page);
    await checkoutPage.fillCheckoutInfo(
      process.env.TEST_FIRSTNAME || 'Zandro',
      process.env.TEST_LASTNAME || 'Guinialope',
      process.env.TEST_POSTALCODE || '1860',
    );
    await checkoutPage.clickContinueButton();

    // 4. Verify checkout overview has the remaining 2 items
    await expect(checkoutPage.productItemRow).toHaveCount(2);
    await expect(
      checkoutPage.productItemRow.filter({ hasText: 'Sauce Labs Backpack' }),
    ).toBeVisible();
    await expect(
      checkoutPage.productItemRow.filter({ hasText: 'Sauce Labs Bolt T-Shirt' }),
    ).toBeVisible();

    // 5. Complete order
    await checkoutPage.clickFinishOrderBtn();
    await expect(checkoutPage.completeHeaderText).toHaveText('Thank you for your order!');
    await expect(checkoutPage.cartBadge).toHaveCount(0);
  });
});
