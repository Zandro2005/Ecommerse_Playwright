import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly productCartLink: Locator;
  readonly cartUrl = '/cart.html';
  readonly checkoutUrl = '/checkout-step-one.html';
  readonly continueShoppingBtn: Locator;
  readonly removeInCart: Locator;
  readonly productName: Locator;
  readonly productItemRow: Locator;
  readonly productPrice: Locator;
  readonly productQuantity: Locator;
  readonly pageTitle: Locator;
  readonly cartBadge: Locator;
  readonly checkoutBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.productName = page.locator('[data-test="inventory-item-name"]');
    this.productItemRow = page.locator('[data-test="inventory-item"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    this.continueShoppingBtn = page.locator('[data-test="continue-shopping"]');
    this.productQuantity = page.locator('[data-test="item-quantity"]');
    this.removeInCart = page.locator('[data-test="remove-sauce-labs-backpack"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.pageTitle = page.locator('[data-test="title"]');
    this.checkoutBtn = page.locator('[data-test="checkout"]');
  }

  getCartItem(productName: string): Locator {
    return this.page.locator('[data-test="inventory-item"]').filter({ hasText: productName });
  }

  async getCartItemPrice(productName: string): Promise<string> {
    return (
      (await this.getCartItem(productName)
        .locator('[data-test="inventory-item-price"]')
        .textContent()) ?? ''
    );
  }

  async removeProductFromCart(productName: string): Promise<void> {
    await this.page
      .locator('[data-test="inventory-item"]')
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async clickProductCartLink(): Promise<void> {
    await this.productCartLink.click();
  }

  async clickContinueShopping(): Promise<void> {
    await this.continueShoppingBtn.click();
  }

  async removeItemInCart(): Promise<void> {
    await this.removeInCart.click();
  }

  async removeItemInCartByName(productName: string): Promise<void> {
    await this.removeProductFromCart(productName);
  }

  async clickcheckout(): Promise<void> {
    await this.checkoutBtn.click();
  }
}
