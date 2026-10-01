import { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly productsUrl = '/inventory.html';
  readonly cartUrl = '/cart.html';
  readonly checkoutUrl = '/checkout-step-two.html';
  readonly finishedUrl = '/checkout-complete.html';
  readonly pageTitle: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueBtn: Locator;
  readonly errorMessage: Locator;
  readonly cancelCheckoutBtn: Locator;
  readonly productItemRow: Locator;
  readonly productName: Locator;
  readonly tax: Locator;
  readonly productPrice: Locator;
  readonly productSubtotal: Locator;
  readonly productTotal: Locator;
  readonly finishOrderBtn: Locator;
  readonly completeHeaderText: Locator;
  readonly backHomeBtn: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.continueBtn = page.locator('[data-test="continue"]');
    this.pageTitle = page.locator('[data-test="title"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.cancelCheckoutBtn = page.locator('[data-test="cancel"]');
    this.productItemRow = page.locator('[data-test="inventory-item"]');
    this.productName = page.locator('[data-test="inventory-item-name"]');
    this.tax = page.locator('[data-test="tax-label"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    this.productSubtotal = page.locator('[data-test="subtotal-label"]');
    this.productTotal = page.locator('[data-test="total-label"]');
    this.finishOrderBtn = page.locator('[data-test="finish"]');
    this.completeHeaderText = page.locator('[data-test="complete-header"]');
    this.backHomeBtn = page.locator('[data-test="back-to-products"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postalCode.fill(postalCode);
  }

  async clickContinueButton(): Promise<void> {
    await this.continueBtn.click();
  }

  async clickCancelCheckoutBtn(): Promise<void> {
    await this.cancelCheckoutBtn.click();
  }

  async clickFinishOrderBtn(): Promise<void> {
    await this.finishOrderBtn.click();
  }

  async clickBackHomeBtn(): Promise<void> {
    await this.backHomeBtn.click();
  }
}
