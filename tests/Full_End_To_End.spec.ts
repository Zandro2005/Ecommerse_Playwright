import { test, expect } from '@fixtures/Fixtures';

test('Products can be sorted by name', async ({ productsPage }) => {
  await productsPage.sortProductsByNameAscending();

  const productNames = await productsPage.productsName.allTextContents();
  const sortedProductNames = [...productNames].sort((first, second) => first.localeCompare(second));

  expect(productNames).toEqual(sortedProductNames);
});

test('Full happy path purchase', async ({ checkoutStepTwoWithProduct }) => {
  await checkoutStepTwoWithProduct.clickFinishOrderBtn();

  await expect(checkoutStepTwoWithProduct.completeHeaderText).toHaveText(
    'Thank you for your order!',
  );
});

test('Cannot check out with empty cart', async ({ productsPage }) => {
  await productsPage.clickCartLink();
  await productsPage.clickCheckoutBtn();
  await expect(productsPage.page).toHaveURL(/.*checkout-step-one\.html/);
});

test('Logout mid-shopping ends session correctly', async ({ productsPage, loginPage }) => {
  await productsPage.addProductToCart('Sauce Labs Backpack');
  await productsPage.clickCartLink();
  await loginPage.logout();

  await expect(loginPage.page).toHaveURL(loginPage.url);
});
