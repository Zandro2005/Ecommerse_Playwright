import { expect, test } from '@fixtures/Fixtures';

test('Valid checkout info proceeds', async ({ checkoutWithProduct }) => {
  await checkoutWithProduct.fillCheckoutInfo(
    process.env.TEST_FIRSTNAME!,
    process.env.TEST_LASTNAME!,
    process.env.TEST_POSTALCODE!,
  );
  await checkoutWithProduct.clickContinueButton();

  await expect(checkoutWithProduct.pageTitle).toHaveText('Checkout: Overview');
});

test('Missing first name blocked', async ({ checkoutWithProduct }) => {
  await checkoutWithProduct.fillCheckoutInfo(
    '',
    process.env.TEST_LASTNAME!,
    process.env.TEST_POSTALCODE!,
  );
  await checkoutWithProduct.clickContinueButton();
  await expect(checkoutWithProduct.errorMessage).toHaveText('Error: First Name is required');
});

test('Missing last name blocked', async ({ checkoutWithProduct }) => {
  await checkoutWithProduct.fillCheckoutInfo(
    process.env.TEST_FIRSTNAME!,
    '',
    process.env.TEST_POSTALCODE!,
  );
  await checkoutWithProduct.clickContinueButton();

  await expect(checkoutWithProduct.errorMessage).toHaveText('Error: Last Name is required');
});

test('Missing postal code blocked', async ({ checkoutWithProduct }) => {
  await checkoutWithProduct.fillCheckoutInfo(
    process.env.TEST_FIRSTNAME!,
    process.env.TEST_LASTNAME!,
    '',
  );
  await checkoutWithProduct.clickContinueButton();

  await expect(checkoutWithProduct.errorMessage).toHaveText('Error: Postal Code is required');
});

test('Special characters accepted', async ({ checkoutWithProduct }) => {
  await checkoutWithProduct.fillCheckoutInfo(
    'Zandro-14',
    process.env.TEST_LASTNAME!,
    process.env.TEST_POSTALCODE!,
  );
  await checkoutWithProduct.clickContinueButton();
  await expect(checkoutWithProduct.page).toHaveURL(checkoutWithProduct.checkoutUrl);
});

test('Long field values accepted', async ({ checkoutWithProduct }) => {
  await checkoutWithProduct.fillCheckoutInfo(
    'Zaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaandro',
    process.env.TEST_LASTNAME!,
    '111111111111111111111111111111111111111111111111111',
  );
  await checkoutWithProduct.clickContinueButton();

  await expect(checkoutWithProduct.page).toHaveURL(checkoutWithProduct.checkoutUrl);
});

test('Numeric values in name fields', async ({ checkoutWithProduct }) => {
  await checkoutWithProduct.fillCheckoutInfo('123456', '123456', process.env.TEST_POSTALCODE!);
  await checkoutWithProduct.clickContinueButton();

  await expect(checkoutWithProduct.page).toHaveURL(checkoutWithProduct.checkoutUrl);
});

test('Cancel on step one returns to cart', async ({ checkoutWithProduct }) => {
  await checkoutWithProduct.clickCancelCheckoutBtn();

  await expect(checkoutWithProduct.page).toHaveURL(checkoutWithProduct.cartUrl);
});

test('Overview lists all cart items', async ({ checkoutStepTwoWithThreeProducts }) => {
  const expectedProducts = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
  ];

  for (let i = 0; i < expectedProducts.length; i++) {
    await expect(checkoutStepTwoWithThreeProducts.productName.nth(i)).toHaveText(
      expectedProducts[i],
    );
  }
});

test('Subtotal equals sum of item price', async ({ checkoutStepTwoWithThreeProducts }) => {
  const price = await checkoutStepTwoWithThreeProducts.productPrice.allTextContents();

  let total = 0;
  for (let i = 0; i < price.length; i++) {
    total += Number(price[i].replace(/[^0-9.]/g, ''));
  }

  const subTotal = await checkoutStepTwoWithThreeProducts.productSubtotal.textContent();

  expect(Number(subTotal?.replace(/[^0-9.]/g, ''))).toBe(total);
});

test('Tax calculated correctly', async ({ checkoutStepTwoWithThreeProducts }) => {
  const subtotalText = await checkoutStepTwoWithThreeProducts.productSubtotal.textContent();

  const taxText = await checkoutStepTwoWithThreeProducts.tax.textContent();

  const subtotal = Number(subtotalText?.replace(/[^0-9.]/g, ''));
  const actualTax = Number(taxText?.replace(/[^0-9.]/g, ''));

  const expectedTax = Math.round(subtotal * 0.08 * 100) / 100;

  expect(actualTax).toBe(expectedTax);
});

test('Total equals subtotal + tax', async ({ checkoutStepTwoWithProduct }) => {
  const subtotalText = await checkoutStepTwoWithProduct.productSubtotal.textContent();
  const taxText = await checkoutStepTwoWithProduct.tax.textContent();
  const totalText = await checkoutStepTwoWithProduct.productTotal.textContent();

  const subtotal = Number(subtotalText?.replace(/[^0-9.]/g, ''));
  const tax = Number(taxText?.replace(/[^0-9.]/g, ''));
  const total = Number(totalText?.replace(/[^0-9.]/g, ''));

  const expectedTotal = Math.round((subtotal + tax) * 100) / 100;

  await expect(total).toBe(expectedTotal);
});

test('Cancel on step two returns to products', async ({ checkoutStepTwoWithProduct }) => {
  await checkoutStepTwoWithProduct.clickCancelCheckoutBtn();
  await expect(checkoutStepTwoWithProduct.page).toHaveURL(checkoutStepTwoWithProduct.productsUrl);
});

test('Finish completes the order', async ({ checkoutStepTwoWithProduct }) => {
  await checkoutStepTwoWithProduct.clickFinishOrderBtn();
  await expect(checkoutStepTwoWithProduct.page).toHaveURL(checkoutStepTwoWithProduct.finishedUrl);
});

test('Confirmation shows thank-you message', async ({ orderFinished }) => {
  await expect(orderFinished.completeHeaderText).toHaveText('Thank you for your order!');
});

test('Back Home returns to products', async ({ orderFinished }) => {
  await orderFinished.clickBackHomeBtn();
  await expect(orderFinished.page).toHaveURL(orderFinished.productsUrl);
});

test('Cart is empty after completed order', async ({ checkoutStepTwoWithProduct }) => {
  await expect(checkoutStepTwoWithProduct.cartBadge).toHaveText('1');

  await checkoutStepTwoWithProduct.clickFinishOrderBtn();
  await expect(checkoutStepTwoWithProduct.cartBadge).toHaveCount(0);
});

test('Whitespace-only fields behavior documented', async ({ checkoutWithProduct }) => {
  await checkoutWithProduct.fillCheckoutInfo('           ', '           ', '           ');
  await checkoutWithProduct.clickContinueButton();

  await expect(checkoutWithProduct.page).toHaveURL(checkoutWithProduct.checkoutUrl);
});

test('Alphanumeric postal code accepted', async ({ checkoutWithProduct }) => {
  await checkoutWithProduct.fillCheckoutInfo(
    process.env.TEST_FIRSTNAME!,
    process.env.TEST_LASTNAME!,
    'K1A 0B1',
  );
  await checkoutWithProduct.clickContinueButton();

  await expect(checkoutWithProduct.page).toHaveURL(checkoutWithProduct.checkoutUrl);
});
