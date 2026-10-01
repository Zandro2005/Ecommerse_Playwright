import { test, expect } from '@fixtures/Fixtures';
import { ProductsPage } from '@pages/ProductsPage';

test('Products page is visible after successful login', async ({ loginPage }) => {
  await expect(loginPage.productsTitle).toBeVisible();
});

test('All products displayed', async ({ loginPage }) => {
  const productsPage = new ProductsPage(loginPage.page);

  await expect(productsPage.products.first()).toBeVisible();

  const cards = await productsPage.products.all();
  await expect(cards.length).toBeGreaterThan(0);

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    await expect(card).toBeVisible();
    await expect(productsPage.productsName.nth(i)).toBeVisible();
    await expect(productsPage.productsPrice.nth(i)).toBeVisible();
    await expect(productsPage.productsDesc.nth(i)).toBeVisible();
    await expect(productsPage.productsImg.nth(i)).toBeVisible();
    await expect(productsPage.productsCartBtn.nth(i)).toBeVisible();
  }
});

test('Open product details', async ({ productsPage }) => {
  await productsPage.clickProductDetails();

  await expect(productsPage.page).toHaveURL(productsPage.productDetailsUrl);
});

test('Product name matches details page', async ({ productsPage }) => {
  const listProductName = await productsPage.productDetailLink.innerText();

  await productsPage.clickProductDetails();

  await expect(productsPage.productsName).toHaveText(listProductName);
});

test('Product price matches details page', async ({ productsPage }) => {
  const listProductPrice = await productsPage.productsPrice.first().innerText();

  await productsPage.clickProductDetails();

  await expect(productsPage.productsPrice).toHaveText(listProductPrice);
});

test('Product description visible', async ({ productsPage }) => {
  const cards = await productsPage.products.all();
  await expect(cards.length).toBeGreaterThan(0);

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    await expect(card).toBeVisible();
    await expect(productsPage.productsDesc.nth(i)).toBeVisible();
  }
});

test('Product image visible', async ({ productsPage }) => {
  await expect(productsPage.products.first()).toBeVisible();

  const cards = await productsPage.products.all();
  await expect(cards.length).toBeGreaterThan(0);

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    await expect(card).toBeVisible();
    await expect(productsPage.productsImg.nth(i)).toBeVisible();
  }
});

test('Back button returns to list', async ({ productsPage }) => {
  await productsPage.clickProductDetails();
  await expect(productsPage.productsName.first()).toBeVisible();

  await productsPage.clickBackToProductsBtn();
  await expect(productsPage.productsPageTitle).toBeVisible();
});

test('Add single product to cart', async ({ productsPage }) => {
  await productsPage.addProductToCart('Sauce Labs Backpack');
  await expect(productsPage.page.getByRole('button', { name: 'cart, 1' })).toBeVisible();
});

test('Add-to-cart button is keyboard accessible', async ({ productsPage }) => {
  const backpack = productsPage.products.filter({ hasText: 'Sauce Labs Backpack' });
  const addToCartButton = backpack.getByRole('button', { name: 'Add to cart' });

  await addToCartButton.focus();
  await expect(addToCartButton).toBeFocused();

  await addToCartButton.press('Enter');

  await expect(backpack.getByRole('button', { name: 'Remove' })).toBeVisible();
  await expect(productsPage.productCartBadge).toHaveText('1');
});

test('Add multiple products to cart', async ({ productsPage }) => {
  await productsPage.addProductToCart('Sauce Labs Backpack');
  await productsPage.addProductToCart('Sauce Labs Bike Light');
  await expect(productsPage.page.getByRole('button', { name: 'Cart, 2 items' })).toBeVisible();
});

test('Button toggles to Remove', async ({ productsPage }) => {
  const bikeLight = productsPage.products.filter({ hasText: 'Sauce Labs Bike Light' });
  await productsPage.addProductToCart('Sauce Labs Bike Light');
  await expect(bikeLight.getByRole('button', { name: 'Remove' })).toBeVisible();
});

test('Remove product from list view', async ({ productsPage }) => {
  await productsPage.addProductToCart('Sauce Labs Backpack');
  await productsPage.addProductToCart('Sauce Labs Bike Light');
  await expect(productsPage.productCartBadge).toHaveText('2');

  await productsPage.clickCartBadge();
  await productsPage.removeProduct('Sauce Labs Backpack');
  await expect(productsPage.productCartBadge).toHaveText('1');
});

test('Add to cart from details page', async ({ productsPage }) => {
  await productsPage.clickProductDetails();
  await productsPage.addProductToCart('Sauce Labs Backpack');

  await expect(productsPage.productCartBadge).toHaveText('1');
  await expect(productsPage.detailsRemove).toBeVisible();
});

test('No badge when cart empty', async ({ productsPage }) => {
  await productsPage.clickCartLink();
  await expect(productsPage.products).toHaveCount(0);
  await expect(productsPage.productCartBadge).toHaveCount(0);
});

test('Sort A→Z', async ({ productsPage }) => {
  await productsPage.sortProductsByNameAscending();

  const productNames = await productsPage.productsName.allTextContents();
  const sortedProductNames = [...productNames].sort((firstName, secondName) =>
    firstName.localeCompare(secondName),
  );

  await expect(productNames).toEqual(sortedProductNames);
});

test('Sort Z→A', async ({ productsPage }) => {
  await productsPage.sortProductNameDescending();

  const productNames = await productsPage.productsName.allTextContents();
  const sortedProductNames = [...productNames].sort((firstName, secondName) =>
    secondName.localeCompare(firstName),
  );

  await expect(productNames).toEqual(sortedProductNames);
});

test('Sort price low→high', async ({ productsPage }) => {
  await productsPage.sortProductPriceLowToHigh();

  const productPrices = (await productsPage.productsPrice.allTextContents()).map((price) =>
    Number.parseFloat(price.replace('$', '')),
  );
  const sortProductPrice = [...productPrices].sort(
    (firstPrice, secondPrice) => firstPrice - secondPrice,
  );

  await expect(productPrices).toEqual(sortProductPrice);
});

test('Sort price high→low', async ({ productsPage }) => {
  await productsPage.sortProductPriceHighToLow();

  const productPrices = (await productsPage.productsPrice.allTextContents()).map((price) =>
    Number.parseFloat(price.replace('$', '')),
  );
  const sortProductPrice = [...productPrices].sort(
    (firstPrice, secondPrice) => secondPrice - firstPrice,
  );

  await expect(productPrices).toEqual(sortProductPrice);
});

test('Sorting does not drop items', async ({ productsPage }) => {
  await productsPage.sortProductsByNameAscending();

  await expect(productsPage.products).toHaveCount(6);
});

test('Cart badge persists through sorting', async ({ productsPage }) => {
  await productsPage.addProductToCart('Sauce Labs Backpack');
  await productsPage.sortProductNameDescending();

  await expect(productsPage.productCartBadge).toHaveText('1');
});

test('Price format validation', async ({ productsPage }) => {
  await expect(productsPage.products.first()).toBeVisible();

  const cards = await productsPage.products.all();
  await expect(cards.length).toBeGreaterThan(0);

  const pricePattern = /^\$\d+\.\d{2}$/;

  for (let i = 0; i < cards.length; i++) {
    const price = await productsPage.productsPrice.nth(i).innerText();

    await expect(productsPage.productsPrice.nth(i)).toBeVisible();
    expect(price.trim()).toMatch(pricePattern);
  }
});

test.describe('Mobile inventory layout', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('Product grid renders correctly on mobile', async ({ productsPage }) => {
    await expect(productsPage.productsPageTitle).toBeVisible();
    await expect(productsPage.products).toHaveCount(6);
    await expect(productsPage.products.first()).toBeInViewport();
    await expect(productsPage.productSort).toBeVisible();
    await expect(productsPage.productCartLink).toBeVisible();

    const hasHorizontalOverflow = await productsPage.page
      .locator('body')
      .evaluate((body) => body.scrollWidth > body.clientWidth);

    expect(hasHorizontalOverflow).toBe(false);
  });
});
