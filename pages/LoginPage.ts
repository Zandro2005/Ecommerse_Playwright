import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly url = '/';
  readonly directUrl = '/inventory.html';
  readonly username: Locator;
  readonly password: Locator;
  readonly loginBtn: Locator;
  readonly productsTitle: Locator;
  readonly productImages: Locator;
  readonly errorMessage: Locator;
  readonly errorBtn: Locator;
  readonly openMenu: Locator;
  readonly logoutBtn: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.locator('[data-test="username"]');
    this.password = page.locator('[data-test="password"]');
    this.loginBtn = page.locator('[data-test="login-button"]');
    this.productsTitle = page.locator('[data-test="title"]');
    this.productImages = page.locator('[data-test="inventory-item"] img');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorBtn = page.locator('[data-test="error-button"]');
    this.openMenu = page.getByRole('button', { name: 'Open Menu' });
    this.logoutBtn = page.locator('[data-test="logout-sidebar-link"]');
    this.logo = page.getByText('Swag Labs');
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
  }

  async validLogin(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginBtn.click();
  }

  async invalidLogin(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginBtn.click();
  }

  async closeErrorBanner(): Promise<void> {
    await this.errorBtn.click();
  }

  async logout(): Promise<void> {
    await this.openMenu.click();
    await this.logoutBtn.click();
  }

  async directNavigation(): Promise<void> {
    await this.page.goto(this.directUrl);
  }
}
