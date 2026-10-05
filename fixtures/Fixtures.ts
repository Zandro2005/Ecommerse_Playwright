import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

export const test = base.extend<{
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartWithProduct: CartPage;
  cartWithThreeProducts: CartPage;
  checkoutWithProduct: CheckoutPage;
  checkoutWithThreeProducts: CheckoutPage;
  checkoutStepTwoWithProduct: CheckoutPage;
  checkoutStepTwoWithThreeProducts: CheckoutPage;
  orderFinished: CheckoutPage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    const username = process.env.TEST_USERNAME || 'standard_user';
    const password = process.env.TEST_PASSWORD || 'secret_sauce';

    await loginPage.navigate();
    await loginPage.validLogin(username, password);

    await use(loginPage);
  },

  productsPage: async ({ loginPage }, use) => {
    await use(new ProductsPage(loginPage.page));
  },

  cartWithProduct: async ({ productsPage }, use) => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.clickCartLink();

    await use(new CartPage(productsPage.page));
  },

  cartWithThreeProducts: async ({ productsPage }, use) => {
    const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];

    for (const product of products) {
      await productsPage.addProductToCart(product);
    }

    await productsPage.clickCartLink();

    await use(new CartPage(productsPage.page));
  },

  checkoutWithProduct: async ({ cartWithProduct }, use) => {
    await cartWithProduct.clickcheckout();
    await use(new CheckoutPage(cartWithProduct.page));
  },

  checkoutWithThreeProducts: async ({ cartWithThreeProducts }, use) => {
    await cartWithThreeProducts.clickcheckout();
    await use(new CheckoutPage(cartWithThreeProducts.page));
  },

  checkoutStepTwoWithProduct: async ({ checkoutWithProduct }, use) => {
    await checkoutWithProduct.page.locator('[data-test="firstName"]').fill('Test');
    await checkoutWithProduct.page.locator('[data-test="lastName"]').fill('User');
    await checkoutWithProduct.page.locator('[data-test="postalCode"]').fill('12345');
    await checkoutWithProduct.page.locator('[data-test="continue"]').click();

    await use(checkoutWithProduct);
  },

  checkoutStepTwoWithThreeProducts: async ({ checkoutWithThreeProducts }, use) => {
    await checkoutWithThreeProducts.page.locator('[data-test="firstName"]').fill('Test');
    await checkoutWithThreeProducts.page.locator('[data-test="lastName"]').fill('User');
    await checkoutWithThreeProducts.page.locator('[data-test="postalCode"]').fill('12345');
    await checkoutWithThreeProducts.page.locator('[data-test="continue"]').click();

    await use(checkoutWithThreeProducts);
  },

  orderFinished: async ({ checkoutStepTwoWithProduct }, use) => {
    await checkoutStepTwoWithProduct.clickFinishOrderBtn();

    await use(checkoutStepTwoWithProduct);
  },
});

export { expect };
