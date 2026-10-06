import { expect, test } from '@fixtures/Fixtures';

test('Open Cart', async ({ cartWithProduct }) => {
  await expect(cartWithProduct.page).toHaveURL(cartWithProduct.cartUrl);
});

test('Cart shows added product', async ({ cartWithProduct }) => {
  await expect(cartWithProduct.productName).toBeVisible();
});

test('Cart item visible by name', async ({ cartWithProduct }) => {
  await expect(
    cartWithProduct.productItemRow.filter({ hasText: 'Sauce Labs Backpack' }),
  ).toBeVisible();
});

test('Cart price matches product price', async ({ productsPage, cartWithProduct }) => {
  const expectedPrice = await productsPage.getProductPrice('Sauce Labs Backpack');
  const actualPrice = await cartWithProduct.getCartItemPrice('Sauce Labs Backpack');

  expect(actualPrice).toBe(expectedPrice);
});

test('Default quantity is 1', async ({ cartWithProduct }) => {
  await expect(cartWithProduct.productQuantity).toHaveText('1');
});

test('Remove item from cart page', async ({ cartWithProduct }) => {
  await cartWithProduct.removeProductFromCart('Sauce Labs Backpack');
  await expect(cartWithProduct.productQuantity).toHaveCount(0);
});

test('Badge update after cart removal', async ({ cartWithProduct }) => {
  await expect(cartWithProduct.cartBadge).toHaveCount(1);

  await cartWithProduct.removeItemInCart();
  await expect(cartWithProduct.productItemRow).toHaveCount(0);
  await expect(cartWithProduct.cartBadge).toHaveCount(0);
});

test('Continue shopping returns to product', async ({ cartWithProduct }) => {
  await cartWithProduct.clickContinueShopping();
  await expect(cartWithProduct.pageTitle).toBeVisible();
});

test('Multiple products show correct count', async ({ cartWithThreeProducts }) => {
  await expect(cartWithThreeProducts.cartBadge).toHaveText('3');
  await expect(cartWithThreeProducts.productItemRow.first()).toBeVisible();

  const products = await cartWithThreeProducts.productItemRow.all();

  for (let i = 0; i < products.length; i++) {
    await expect(cartWithThreeProducts.productName.nth(i)).toBeVisible();
  }
});

test('Badge reflects total across adds', async ({ cartWithThreeProducts }) => {
  await expect(cartWithThreeProducts.cartBadge).toHaveText('3');
});

test('Cart persists across navigation', async ({ cartWithProduct }) => {
  await expect(cartWithProduct.cartBadge).toHaveText('1');
  await cartWithProduct.clickContinueShopping();
  await expect(cartWithProduct.cartBadge).toHaveText('1');
});

test('Empty cart shows no items/badge', async ({ cartWithProduct }) => {
  await cartWithProduct.removeItemInCart();
  await cartWithProduct.clickContinueShopping();
  await cartWithProduct.clickProductCartLink();

  await expect(cartWithProduct.cartBadge).toHaveCount(0);
  await expect(cartWithProduct.productItemRow).toHaveCount(0);
});

test('Checkout button visible with items', async ({ cartWithProduct }) => {
  await expect(cartWithProduct.checkoutBtn).toBeVisible();
});

test('Proceed to checkout from cart', async ({ cartWithProduct }) => {
  await cartWithProduct.clickcheckout();
  await expect(cartWithProduct.page).toHaveURL(cartWithProduct.checkoutUrl);
});

//zandro
