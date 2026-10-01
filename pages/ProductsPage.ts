import { Locator, Page } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly productDetailsUrl = '/inventory-item.html?id=4';
  readonly cartUrl = '/cart.html';
  readonly productsPageTitle: Locator;
  readonly products: Locator;
  readonly productsName: Locator;
  readonly productsPrice: Locator;
  readonly productsDesc: Locator;
  readonly productsImg: Locator;
  readonly productsCartBtn: Locator;
  readonly productDetailLink: Locator;
  readonly productBackBtn: Locator;
  readonly productRemove: Locator;
  readonly productCartBadge: Locator;
  readonly detailsRemove: Locator;
  readonly productCartLink: Locator;
  readonly productSort: Locator;
  readonly checkoutBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsPageTitle = page.locator('[data-test="title"]');
    this.products = page.locator('[data-test="inventory-item"]');
    this.productsName = page.locator('[data-test="inventory-item-name"]');
    this.productsPrice = page.locator('[data-test="inventory-item-price"]');
    this.productsDesc = page.locator('[data-test="inventory-item-desc"]');
    this.productsImg = page.locator('.inventory_item_img');
    this.productsCartBtn = page.locator('button[data-test^="add-to-cart"]');
    this.productDetailLink = page.locator('[data-test="item-4-title-link"]');
    this.productBackBtn = page.locator('[data-test="back-to-products"]');
    this.productRemove = page.locator('[data-test="remove-sauce-labs-backpack"]');
    this.productCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.productCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.detailsRemove = page.locator('[data-test="remove"]');
    this.productSort = page.locator('[data-test="product-sort-container"]');
    this.checkoutBtn = page.locator('[data-test="checkout"]');
  }

  async clickProductDetails(): Promise<void> {
    await this.productDetailLink.click();
  }

  async clickBackToProductsBtn(): Promise<void> {
    await this.productBackBtn.click();
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.products
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  async clickCartBadge(): Promise<void> {
    await this.productCartBadge.click();
  }

  async clickCartLink(): Promise<void> {
    await this.productCartLink.click();
  }

  async sortProductsByNameAscending(): Promise<void> {
    await this.productSort.selectOption('az');
  }

  async sortProductNameDescending(): Promise<void> {
    await this.productSort.selectOption('za');
  }

  async sortProductPriceLowToHigh(): Promise<void> {
    await this.productSort.selectOption('lohi');
  }

  async sortProductPriceHighToLow(): Promise<void> {
    await this.productSort.selectOption('hilo');
  }

  async removeProduct(productName: string): Promise<void> {
    await this.page
      .locator('[data-test="inventory-item"]')
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  getProductCard(productName: string): Locator {
    return this.page.locator('[data-test="inventory-item"]').filter({ hasText: productName });
  }

  async getProductPrice(productName: string): Promise<string> {
    return (
      (await this.getProductCard(productName)
        .locator('[data-test="inventory-item-price"]')
        .textContent()) ?? ''
    );
  }

  async addToCart(productName: string): Promise<void> {
    await this.getProductCard(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async clickCheckoutBtn(): Promise<void> {
    await this.checkoutBtn.click();
  }

  getPageTitle(): Locator {
    return this.productsPageTitle;
  }
}
